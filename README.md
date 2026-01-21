# Social Media Analytics Dashboard

A Next.js 15 application for tracking and analyzing social media engagement metrics.

## Project Setup

This project uses:
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **State Management**: Zustand (UI state) + TanStack Query (server state)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Table**: TanStack Table

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Redis (Upstash) for rate limiting
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

### 3. Set Up Redis (Upstash)

1. Create a free Upstash Redis database at https://upstash.com
2. Copy your REST URL and REST Token from the Upstash dashboard
3. Add them to your `.env.local` file

**Note**: Rate limiting will fall back to allowing requests if Redis is unavailable (fail-open strategy).

### 4. Set Up Supabase Database

1. Create a Supabase project at https://supabase.com
2. Run the migration script in SQL Editor: `supabase/migrations/001_initial_schema.sql`
3. Create test users in Authentication > Users
4. Update `supabase/seed.sql` with actual user UUIDs
5. Run the seed script in SQL Editor: `supabase/seed.sql`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout with QueryProvider
│   ├── page.tsx         # Home page (redirects)
│   ├── api/             # API routes
│   │   ├── analytics/   # /api/analytics/summary
│   │   └── metrics/     # /api/metrics/daily (Edge)
│   ├── auth/            # Authentication pages
│   │   ├── login/       # Login page
│   │   └── signup/      # Signup page
│   └── dashboard/       # Protected dashboard route
├── components/          # React components
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard-specific components
│   │   ├── summary-cards.tsx
│   │   ├── posts-table.tsx
│   │   ├── engagement-chart.tsx
│   │   └── post-detail-modal.tsx
│   └── providers/       # Context providers (Query, etc.)
├── lib/                 # Utility functions
│   ├── supabase/        # Supabase clients
│   │   ├── client.ts    # Browser client
│   │   ├── server.ts    # Server client
│   │   └── middleware.ts # Auth middleware
│   ├── stores/          # Zustand stores
│   │   └── ui-store.ts  # UI state management
│   └── hooks/           # TanStack Query hooks
│       ├── query-keys.ts
│       ├── use-posts.ts
│       ├── use-daily-metrics.ts
│       └── use-analytics-summary.ts
└── supabase/            # Supabase migrations and seeds
    ├── migrations/      # SQL migrations
    └── seed.sql         # Sample data
```

## Architecture Decisions

### 1. Where should engagement metrics be aggregated?

**Decision: API Route (`/api/analytics/summary`)**

All engagement metric aggregation happens server-side in the `/api/analytics/summary` API route. This includes:
- Total engagement (sum of likes + comments + shares across all posts)
- Average engagement rate
- Top performing post
- Engagement trend (last 7 days vs previous 7 days)

**Reasoning:**
- **Performance**: Server-side aggregation reduces data transfer to the client. We only send the aggregated result (~1KB) instead of all post data (potentially many KBs).
- **Security**: Calculations happen on the server where we have authenticated user context, ensuring RLS policies are respected.
- **Caching**: TanStack Query can cache the aggregated result, avoiding redundant calculations.
- **Scalability**: As the number of posts grows (e.g., 10,000 posts), client-side aggregation would become slow. Server-side aggregation can leverage database indexes and aggregations.

**Trade-offs:**
- **Complexity**: More code in API routes vs. simpler client-side calculations.
- **Flexibility**: Client can't customize aggregations without API changes (but this is acceptable for our use case).
- **Network dependency**: Requires API call, but with caching this is minimal.

**Alternative considered**: Database functions/views could provide even better performance, but API routes offer more flexibility for future business logic changes without database migrations.

---

### 2. State Management: Zustand vs. TanStack Query vs. URL State

**State Management Map:**

| State | Location | Reasoning |
|-------|----------|-----------|
| **Platform filter** (All/Instagram/TikTok) | Zustand | UI preference, not shareable. User expects it to persist during session but not across page reloads. |
| **Sort column and direction** | React component state (`useState`) | Ephemeral UI state specific to the table. No need for global state or persistence. |
| **Selected post (for modal)** | Zustand | Modal state needs to be accessible across components but doesn't need URL persistence. |
| **Chart view type** (line/area) | Zustand | UI preference, similar to platform filter. |
| **Posts data from Supabase** | TanStack Query | Server state - needs caching, refetching, error handling. |
| **Daily metrics data** | TanStack Query | Server state - same reasoning as posts. |
| **Analytics summary** | TanStack Query | Server state - aggregated data from API route. |

**Reasoning:**
- **Zustand for UI state**: Perfect for ephemeral UI preferences that don't need URL persistence but should persist during navigation within the app. Lightweight and simple.
- **TanStack Query for server state**: Handles all data fetching, caching, refetching, and error states automatically. Reduces boilerplate significantly.
- **Component state for table sorting**: Local to the table component, doesn't need to be shared.
- **No URL state**: Platform filter and chart view are personal preferences, not shareable states. Table sorting resets on page reload which is expected UX.

**Why not URL state?**
- Platform filter and chart view are personal preferences that don't need to be shareable via URL.
- Table sorting is ephemeral and expected to reset on page reload.

---

### 3. Empty State Handling

**Strategy:**

When a new user signs up with zero posts and zero daily metrics:

1. **API Routes:**
   - `/api/analytics/summary`: Returns a valid summary object with all zeros:
     ```json
     {
       "totalEngagement": 0,
       "averageEngagementRate": 0,
       "topPerformingPost": null,
       "engagementTrend": { "current": 0, "previous": 0, "percentageChange": 0 }
     }
     ```
   - `/api/metrics/daily`: Returns empty array `[]`
   - Posts query returns empty array `[]`

2. **Summary Cards:**
   - Display zeros or "N/A" appropriately
   - Total Engagement: Shows "0"
   - Average Engagement Rate: Shows "0%"
   - Top Post: Shows "N/A" with subtitle "No posts yet"
   - 7-Day Trend: Shows "0%"

3. **Posts Table:**
   - Shows empty state message: "No posts found."
   - Table headers remain visible for clarity
   - Platform filter still works (just returns empty results)

4. **Engagement Chart:**
   - Shows empty state with icon and message: "No data available"
   - Chart container still renders (prevents layout shift)
   - Toggle buttons remain visible

5. **Post Detail Modal:**
   - Never opens for empty state (no posts to click)
   - If somehow triggered, shows error message

**Engagement Rate Edge Case:**
- When there are no posts: `averageEngagementRate` is `0` (not null, not "N/A")
- When posts exist but none have `engagement_rate`: We filter out nulls and calculate average from posts with rates. If all are null, average is `0`.

**Rationale:**
- Consistent zero values are easier to work with than nulls
- Users understand "0" better than "N/A" in most contexts
- Empty states are informative and guide users (e.g., "No posts yet" suggests they need to add posts)

---

### 4. Trend Percentage Calculation

**Decision: Last 7 days vs. Previous 7 days**

The 7-Day Trend compares engagement from the last 7 days against the previous 7 days (days 8-14).

**Reasoning:**
- **Meaningful comparison**: 7 days is long enough to smooth out daily fluctuations but short enough to be actionable. Weekly comparisons are common in analytics dashboards.
- **Data availability**: Users typically have recent data, making 7-day comparisons more reliable than monthly comparisons for new users.
- **UX clarity**: "vs previous 7 days" is immediately understandable.

**Calculation Logic:**
1. Current period: Posts posted in the last 7 days (from now)
2. Previous period: Posts posted 8-14 days ago
3. Percentage change: `((current - previous) / previous) * 100`
4. Edge cases:
   - If previous = 0 and current > 0: Returns 100% (new engagement)
   - If previous = 0 and current = 0: Returns 0% (no change)

**Why not 30 days?**
- 30-day comparisons are less actionable (harder to identify what caused changes)
- New users may not have 30 days of data
- Weekly trends are more responsive to recent changes

**Why not monthly?**
- Calendar months are inconsistent (28-31 days)
- Less precise for identifying recent changes
- More complex date calculations

---

## Security Considerations

### Row Level Security (RLS)
- All RLS policies use `auth.uid() = user_id` to ensure complete data isolation
- Users can only SELECT, INSERT, UPDATE, DELETE their own data
- Policies are tested and verified - User A cannot see User B's data

### API Routes
- All API routes verify authentication via Supabase session
- Input validation on query parameters (e.g., days must be 1-365)
- Proper HTTP status codes (401 for unauthorized, 400 for bad input, 500 for server errors)

### Environment Variables
- `SUPABASE_SERVICE_ROLE_KEY` is only used server-side in API routes
- Never exposed to client bundle
- `.env.local` is gitignored
- `.env.example` documents required variables without values

---

## Deployment

### Vercel Deployment

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Deploy

The application is ready for production deployment with proper environment variable configuration.

---

## Testing

This project includes both unit tests and E2E tests:

### Unit Tests (Vitest)

Unit tests are written using Vitest and React Testing Library.

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

Test files are located alongside source files with `.test.ts` or `.test.tsx` extensions.

### E2E Tests (Cypress)

E2E tests verify critical user flows end-to-end.

```bash
# Open Cypress Test Runner (interactive)
npm run cypress:open

# Run E2E tests headlessly
npm run cypress:run
```

E2E tests are located in `cypress/e2e/`.

**Note**: For E2E tests that require authentication, set these environment variables:
```env
CYPRESS_TEST_EMAIL=test@example.com
CYPRESS_TEST_PASSWORD=test-password
```

Or add them as GitHub Secrets (`CYPRESS_TEST_EMAIL`, `CYPRESS_TEST_PASSWORD`) for CI/CD.

## What I'd Improve with More Time

1. **Type Safety**: Generate TypeScript types from Supabase schema using `supabase gen types`
2. **Error Handling**: Add more granular error messages and user-friendly error boundaries
3. **Performance**: Add pagination to posts table for users with many posts
4. **Accessibility**: Improve keyboard navigation and ARIA labels
5. **Real-time Updates**: Add Supabase Realtime subscriptions for live dashboard updates
6. **Caching Strategy**: Implement more sophisticated cache invalidation strategies
7. **Monitoring**: Add request logging and error tracking (e.g., Sentry)
8. **More Test Coverage**: Add tests for React components and API route integrations

---

## Time Spent

- **Setup & Configuration**: ~1 hour
- **Supabase Schema & RLS**: ~1 hour
- **Authentication**: ~1 hour
- **API Routes & Hooks**: ~1.5 hours
- **Dashboard Components**: ~2 hours
- **Documentation**: ~0.5 hours

**Total**: ~6-7 hours

---

## License

MIT