# Score database without a login screen

Configured in your existing Supabase project on 2026-11-25. The migration and anonymous-session setting are already applied. Database tests passed for all three answer keys, duplicate retries, answer validation, direct-write protection, and visitor isolation. An anonymous Auth session and its table access were also checked successfully. The steps below document how to reproduce the setup; start at step 5 to use it locally.

The app opens directly. When a learner finishes an exercise and clicks ดูผลคะแนน, it starts or reuses a Supabase anonymous session and submits their answers. No name, email, password, or login form is required. Supabase calculates the score and stores the attempt. Retrying a failed save uses the same attempt ID, so it cannot duplicate a result.

## Setup steps

1. Open your Supabase project: https://supabase.com/dashboard/project/thycwxsposoblcrdugcr
2. Under **SQL Editor → New query**, paste `supabase/migrations/202611250001_quiz_scores.sql` and click **Run** once. Do not rerun after the table is created. The old learning_accounts migration is not needed for scores.
3. Under **Authentication → Sign In / Providers**, enable **Allow anonymous sign-ins** and save. Leave row-level security enabled.
4. In `.env.local`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Your existing local values already point to this project. Never use a service-role/secret key in browser code.
5. In VS Code's terminal, run `npm install`, then `npm run dev`. Restart Vite after environment changes.
6. Open **แบบฝึกหัด**, finish a chapter, and click **ดูผลคะแนน**. Wait for **บันทึกคะแนนแล้ว**. If saving fails, click **ลองบันทึกอีกครั้ง** before leaving or restarting. Pending attempts are held in memory, not an offline queue.

## View scores

In Supabase, open **Table Editor → quiz_attempts**. Each row contains `visitor_id`, `chapter_id`, `answers`, `score`, `total`, and `created_at`. IDs identify browser sessions, not named students. Chapter IDs: `thai-preservation` = chapter 1 (8 questions), `thai-consonants` = chapter 2 (7), `thai-history` = chapter 3 (10).

Run this in SQL Editor to see each visitor's best result per chapter:

```sql
select visitor_id, chapter_id, max(score) as best_score,
       max(total) as total, count(*) as attempts
from public.quiz_attempts
group by visitor_id, chapter_id
order by visitor_id, chapter_id;
```

Run this for completion counts and average percentages:

```sql
select chapter_id, count(*) as attempts,
       count(distinct visitor_id) as visitors,
       round(avg(100.0 * score / total), 1) as average_percent
from public.quiz_attempts
group by chapter_id;
```

## Limits and verification

Clearing browser data or using another browser creates a new visitor. The old scores remain in the database but cannot be linked back automatically. Multiple people using the same browser share one visitor ID. The app is for practice: learners can see answer keys and repeat attempts.

The database permits visitors to read only their own attempts. Clients cannot directly insert, update, or delete scores; the submission function calculates them. Supabase project owners can view all scores through the dashboard.

For public deployment, use HTTPS and configure Supabase CAPTCHA protection with a matching frontend challenge before enabling it. Supabase recommends CAPTCHA to reduce anonymous-account abuse; this local version does not include a CAPTCHA widget.

Run `supabase/tests/quiz_scores.sql` in SQL Editor to verify grading, retries, invalid answers, and visitor isolation. Test rows are rolled back. Run `npm run build` and the existing Node tests for the frontend.

Reference: https://supabase.com/docs/guides/auth/auth-anonymous
