begin;

create table public.learning_records (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress integer[] not null default array[0,0,0],
  topics text[] not null default array['','',''],
  updated_at timestamptz not null default now(),
  constraint valid_progress check (
    array_ndims(progress) = 1 and array_lower(progress, 1) = 1 and
    cardinality(progress) = 3 and progress <@ array[0,1] and
    array_position(progress, null) is null
  ),
  constraint valid_topics check (
    array_ndims(topics) = 1 and array_lower(topics, 1) = 1 and
    cardinality(topics) = 3 and array_position(topics, null) is null and
    char_length(topics[1]) <= 80 and char_length(topics[2]) <= 80 and char_length(topics[3]) <= 80
  )
);

alter table public.learning_records enable row level security;
revoke all on public.learning_records from anon, authenticated;
grant select, insert, update on public.learning_records to authenticated;

create policy "Read own learning record" on public.learning_records
for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own learning record" on public.learning_records
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own learning record" on public.learning_records
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create function public.touch_learning_record() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.touch_learning_record() from public;
create trigger touch_learning_record before update on public.learning_records
for each row execute function public.touch_learning_record();

commit;
