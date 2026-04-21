create table if not exists page_views (
  id         bigserial primary key,
  path       text not null,
  created_at timestamptz default now()
);
create index if not exists page_views_created_at_idx on page_views (created_at desc);
alter table page_views enable row level security;
create policy "Anon insert page_views" on page_views for insert with check (true);
create policy "Anon select page_views" on page_views for select using (true);
