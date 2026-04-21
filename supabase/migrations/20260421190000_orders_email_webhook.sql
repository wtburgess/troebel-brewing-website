-- Order-email webhook: on every new order, POST the row to the
-- `send-order-email` edge function, which sends the confirmation +
-- brewery alert via Gmail SMTP. Uses pg_net directly (async HTTP).

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_send_order_email()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payload jsonb;
begin
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'orders',
    'schema', 'public',
    'record', row_to_json(NEW)::jsonb,
    'old_record', null
  );

  perform net.http_post(
    url := 'https://wkbhgadmkucxjwidzsig.supabase.co/functions/v1/send-order-email',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := payload,
    timeout_milliseconds := 5000
  );

  return NEW;
end;
$$;

drop trigger if exists tr_order_created_send_email on public.orders;

create trigger tr_order_created_send_email
  after insert on public.orders
  for each row
  execute function public.notify_send_order_email();
