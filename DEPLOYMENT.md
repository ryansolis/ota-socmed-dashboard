# Deployment Guide

## Vercel Deployment

### Prerequisites

- GitHub repository with your code
- Vercel account (free tier is sufficient)
- Supabase project configured
- Upstash Redis database created

### Step-by-Step Deployment

#### 1. Connect GitHub Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js 15

#### 2. Configure Environment Variables

**Navigate to: Settings → Environment Variables**

Add the following environment variables:

##### Required Variables

| Variable Name | Description | Where to Find |
|--------------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Supabase Dashboard → Settings → API → Service Role Key |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint | Upstash Dashboard → Your Database → REST API → REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token | Upstash Dashboard → Your Database → REST API → REST Token |

##### Adding Variables in Vercel

For each variable:
1. Click **"Add New"**
2. Enter the **Key** (variable name)
3. Enter the **Value** (variable value)
4. Select environments:
   - ✅ **Production** (for production deployments)
   - ✅ **Preview** (for PR preview deployments)
5. Click **"Save"**

**Important:**
- Variables are case-sensitive
- No quotes needed around values
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Other variables are server-side only (more secure)

#### 3. Configure Build Settings

Vercel auto-detects Next.js, but verify:

**Framework Preset:** Next.js  
**Build Command:** `npm run build` (default)  
**Output Directory:** `.next` (default)  
**Install Command:** `npm install` (default)

#### 4. Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (~2-3 minutes)
3. Check deployment logs for any errors

#### 5. Post-Deployment Verification

1. **Check Deployment Status**
   - All checks should be green ✅
   - No build errors in logs

2. **Test the Application**
   - Visit your deployment URL
   - Test authentication (login/signup)
   - Verify dashboard loads correctly
   - Check API routes are working

3. **Verify Environment Variables**
   - If you see errors, double-check environment variables are set correctly
   - Redeploy after adding/changing variables

### Updating Environment Variables

To update environment variables:

1. Go to **Settings** → **Environment Variables**
2. Click on the variable you want to update
3. Modify the value
4. Click **"Save"**
5. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click **"..."** → **"Redeploy"**

### Environment-Specific Configuration

You can set different values for different environments:

**Production:**
- Use production Supabase project
- Use production Redis instance
- Set to production environment

**Preview (PR Deployments):**
- Can use the same or separate Supabase project
- Can use the same or separate Redis instance
- Useful for testing PRs without affecting production data

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL
  Production: https://production-project.supabase.co
  Preview: https://staging-project.supabase.co
```

### Troubleshooting

#### Build Fails

**Error: Missing environment variables**
- Ensure all required variables are added
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

**Error: TypeScript errors**
- These should be caught locally before deploying
- Run `npm run type-check` before pushing

#### Runtime Errors

**Error: "Supabase client not initialized"**
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify values are correct (no extra spaces)

**Error: "Redis connection failed"**
- Check `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Verify Upstash database is active
- Rate limiting will fall back to allowing requests if Redis fails

**Error: "Unauthorized" on API routes**
- Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify it's the service role key, not anon key

### Security Best Practices

1. **Never commit `.env.local`** to git (already in `.gitignore`)
2. **Use Vercel Environment Variables** for all secrets
3. **Rotate keys periodically** (especially service role keys)
4. **Use different keys** for production and staging if possible
5. **Limit access** to Vercel project settings to authorized team members

### Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificates are automatically provisioned

### Continuous Deployment

Vercel automatically deploys:
- **Production:** Every push to your default branch (usually `main`)
- **Preview:** Every pull request creates a preview deployment
- **Manual:** You can trigger deployments from the dashboard

### Monitoring

- **Deployment Logs:** Available in Vercel dashboard
- **Function Logs:** View serverless function execution logs
- **Analytics:** Enable in Vercel dashboard (optional)
- **Error Tracking:** Consider integrating Sentry or similar

---

## Quick Reference

**Vercel Dashboard:** https://vercel.com/dashboard  
**Supabase Dashboard:** https://supabase.com/dashboard  
**Upstash Dashboard:** https://console.upstash.com/

**Deployment URL Format:** `https://your-project.vercel.app`

