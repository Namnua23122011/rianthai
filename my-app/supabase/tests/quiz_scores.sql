-- Run in the SQL Editor. All test data is rolled back.
begin;
insert into auth.users(id) values ('00000000-0000-4000-8000-000000002501'), ('00000000-0000-4000-8000-000000002502');
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000002501', true);
set local role authenticated;
do $$
declare r public.quiz_attempts;
begin
  r := public.submit_quiz_attempt('00000000-0000-4000-8000-000000002511', 'thai-preservation', array[1,2,0,3,0,1,2,3]);
  assert r.score = 8 and r.total = 8, 'Chapter one grading';
  r := public.submit_quiz_attempt('00000000-0000-4000-8000-000000002512', 'thai-consonants', array[1,0,2,1,1,3,1]);
  assert r.score = 7 and r.total = 7, 'Chapter two grading';
  r := public.submit_quiz_attempt('00000000-0000-4000-8000-000000002513', 'thai-history', array[1,2,2,1,3,2,1,1,2,1]);
  assert r.score = 10 and r.total = 10, 'Chapter three grading';
  r := public.submit_quiz_attempt('00000000-0000-4000-8000-000000002513', 'thai-history', array[1,2,2,1,3,2,1,1,2,1]);
  assert (select count(*) from public.quiz_attempts) = 3, 'Duplicate retry';
  begin
    perform public.submit_quiz_attempt(gen_random_uuid(), 'thai-history', array[1]);
    raise exception 'Invalid answers accepted';
  exception when invalid_parameter_value then null; end;
  begin
    insert into public.quiz_attempts(id, visitor_id, chapter_id, answers, score, total)
    values(gen_random_uuid(), auth.uid(), 'thai-history', array[1], 10, 10);
    raise exception 'Direct score insertion accepted';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000002502', true);
set local role authenticated;
do $$ begin
  assert (select count(*) from public.quiz_attempts) = 0, 'Other visitor records exposed';
  begin
    perform public.submit_quiz_attempt('00000000-0000-4000-8000-000000002513', 'thai-history', array[1,2,2,1,3,2,1,1,2,1]);
    raise exception 'Other visitor attempt exposed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: grading, duplicate retries, validation, write protection, visitor isolation' as result;
