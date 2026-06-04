# Deploy to Vercel

## 1. Push to GitHub

Commit and push this repo to GitHub (or GitLab / Bitbucket).

## 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the repository
3. Framework Preset: **Other** (build uses `vercel.json`)
4. Root Directory: `.` (project root)

## 3. Environment variables

In **Project → Settings → Environment Variables**, add:

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | Yes | `postgresql://...` (use a **pooled** URL for serverless, e.g. Prisma Postgres, Neon, Supabase pooler) |
| `JWT_SECRET` | Yes | long random string |
| `JWT_EXPIRES_IN` | No | `7d` |
| `LANGUAGETOOL_API_URL` | No | `https://api.languagetool.org/v2/check` |

Apply to **Production**, **Preview**, and **Build** (build runs `prisma migrate deploy` and needs `DATABASE_URL`).

## 4. Deploy

Click **Deploy**. Build steps:

- `pnpm install`
- `prisma generate`
- `prisma migrate deploy`
- `nest build`

## 5. URLs

- API base: `https://<your-project>.vercel.app`
- Swagger UI: `https://<your-project>.vercel.app/api`
- Health: `https://<your-project>.vercel.app/`

## CLI (optional)

```bash
pnpm add -g vercel
vercel login
vercel link
vercel env pull   # after setting vars in dashboard
vercel --prod
```

## Notes

- Use a **connection-pooled** `DATABASE_URL` on serverless (direct Postgres can exhaust connections).
- Cold starts: first request after idle may be slower (~few seconds).
- Hobby plan: function `maxDuration` is capped at 10s; upgrade or lower in `vercel.json` if deploy fails.
