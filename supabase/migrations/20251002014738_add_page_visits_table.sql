create table page_visits (
  id uuid default gen_random_uuid() primary key,
  visitor_id text not null,
  path text not null,
  referrer text,
  device_type text,
  duration integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index page_visits_visitor_id_idx on page_visits(visitor_id);
create index page_visits_created_at_idx on page_visits(created_at);

-- Add RLS policies
alter table page_visits enable row level security;

create policy "Enable read access for all users" on page_visits
  for select using (true);

create policy "Enable insert for web client" on page_visits
  for insert with check (true);

-- Create view for summary statistics
create view visit_stats as
select
  count(distinct visitor_id) as unique_visitors,
  count(*) as total_visits,
  avg(duration) as avg_duration,
  count(case when duration < 10 then 1 end)::float / count(*) * 100 as bounce_rate,
  count(case when duration > 30 then 1 end)::float / count(*) * 100 as engagement_rate
from page_visits
where created_at > current_date - interval '30 days';