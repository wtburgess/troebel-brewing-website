-- Fix order-email webhook auth.
--
-- The Edge Function was rejecting trigger calls with 401 because the trigger
-- did not send an Authorization or shared-secret header. We now:
--   1. Disable JWT verification on the function (done via Management API).
--   2. Send an `x-webhook-secret` header from the trigger, which the function
--      compares against its WEBHOOK_SECRET env var.
--
-- The secret value is stored in Supabase Vault under the name `webhook_secret`
-- (loaded out-of-band — never committed) and read at trigger time from
-- vault.decrypted_secrets.

create or replace function public.notify_send_order_email()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  payload jsonb;
  secret  text;
begin
  select decrypted_secret into secret
    from vault.decrypted_secrets
    where name = 'webhook_secret'
    limit 1;

  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'orders',
    'schema', 'public',
    'record', row_to_json(NEW)::jsonb,
    'old_record', null
  );

  perform net.http_post(
    url := 'https://wkbhgadmkucxjwidzsig.supabase.co/functions/v1/send-order-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', coalesce(secret, '')
    ),
    body := payload,
    timeout_milliseconds := 5000
  );

  return NEW;
end;
$$;
