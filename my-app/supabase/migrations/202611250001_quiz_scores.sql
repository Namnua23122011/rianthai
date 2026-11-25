begin;

create table public.quiz_attempts (
  id uuid primary key,
  visitor_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null,
  answers integer[] not null,
  score integer not null check (score >= 0 and score <= total),
  total integer not null check (total > 0),
  created_at timestamptz not null default now()
);
create index quiz_attempts_visitor_date on public.quiz_attempts(visitor_id, created_at desc);
alter table public.quiz_attempts enable row level security;
revoke all on public.quiz_attempts from anon, authenticated;
grant select on public.quiz_attempts to authenticated;
create policy "Visitors read own attempts" on public.quiz_attempts
for select to authenticated using ((select auth.uid()) = visitor_id);

-- Only this function writes scores. The client submits answers, never a score.
create function public.submit_quiz_attempt(p_id uuid, p_chapter_id text, p_answers integer[])
returns public.quiz_attempts
language plpgsql security definer set search_path = '' as $$
declare
  visitor uuid := auth.uid();
  answer_key integer[];
  earned integer := 0;
  result public.quiz_attempts;
begin
  if visitor is null then raise exception 'Session required' using errcode = '42501'; end if;
  answer_key := case p_chapter_id
    when 'thai-preservation' then array[1,2,0,3,0,1,2,3]
    when 'thai-consonants' then array[1,0,2,1,1,3,1]
    when 'thai-history' then array[1,2,2,1,3,2,1,1,2,1]
    else null end;
  if p_id is null or answer_key is null or p_answers is null
    or array_ndims(p_answers) is distinct from 1
    or array_lower(p_answers, 1) is distinct from 1
    or cardinality(p_answers) <> cardinality(answer_key)
    or array_position(p_answers, null) is not null
    or not (p_answers <@ array[0,1,2,3]) then
    raise exception 'Invalid answers' using errcode = '22023';
  end if;
  for i in 1..cardinality(answer_key) loop
    if p_answers[i] = answer_key[i] then earned := earned + 1; end if;
  end loop;
  insert into public.quiz_attempts(id, visitor_id, chapter_id, answers, score, total)
  values (p_id, visitor, p_chapter_id, p_answers, earned, cardinality(answer_key))
  on conflict (id) do nothing;
  select * into result from public.quiz_attempts where id = p_id and visitor_id = visitor;
  if not found then raise exception 'Attempt unavailable' using errcode = '42501'; end if;
  if result.chapter_id <> p_chapter_id or result.answers <> p_answers then
    raise exception 'Attempt already submitted' using errcode = '22023';
  end if;
  return result;
end;
$$;
revoke all on function public.submit_quiz_attempt(uuid, text, integer[]) from public, anon;
grant execute on function public.submit_quiz_attempt(uuid, text, integer[]) to authenticated;

commit;
