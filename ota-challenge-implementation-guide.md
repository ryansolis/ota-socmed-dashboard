# Frontend Engineer Coding Challenge
## Overview
Welcome to our frontend engineering challenge! This exercise evaluates your ability to build a
production-quality feature using our stack. You'll work with a **provided database schema** (like you
would in a real team), implement **Row Level Security policies**, build **API routes**, and create
**interactive UI components**.
We're looking for frontend engineers who are comfortable working with Supabase, understand security
fundamentals, and can make thoughtful decisions about state management and data flow.
**Time Estimate**: 5-6 hours (with AI-assisted development)
**Submission Deadline**: 2-3 days from receipt
> **■ We encourage the use of AI coding assistants** (Cursor, GitHub Copilot, Claude, ChatGPT, etc.).
Modern engineering is about leveraging tools effectively. However, we'll ask you to explain your decisions
and extend your solution in the follow-up interview – so make sure you understand what you're building.
---
## The Challenge
Build a **Social Media Analytics Dashboard** that displays engagement metrics for a creator's posts.
You'll set up a Supabase backend with Row Level Security (RLS), fetch data using our preferred state
management patterns, and create an interactive visualization.
### What You'll Build
1. **Supabase Backend**: Database schema with RLS policies for multi-user data isolation
2. **Posts Table**: A sortable, filterable table showing recent posts with engagement metrics
3. **Engagement Chart**: A line/area chart visualizing engagement trends over time
4. **Summary Cards**: Key metric cards showing totals and percentage changes
5. **Post Detail Modal**: A modal showing detailed analytics when clicking a post
6. **State Management**: Proper separation of UI state (Zustand) and server state (TanStack Query)
7. **API Routes & Edge Functions**: Server-side endpoints for data aggregation
8. **Security & Deployment**: Environment configuration and production deployment to Vercel
---
## Requirements
### Technical Stack (Required)
We want to see how you work with our actual stack:
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS
- **Global State**: Zustand
- **Server State**: TanStack Query (React Query)
- **Table**: TanStack Table
- **Charts**: Any charting library (Recharts, Chart.js, Visx, etc.)
- **Icons**: Lucide React
**Optional (Bonus)**:
- **Charts with Visx**: We use Visx internally – using it is a bonus but not required
- **Animations**: Framer Motion for modal/UI animations
### Functional Requirements
#### 1. Supabase Setup with Row Level Security (RLS)
Set up a Supabase project using the **provided schema** (see Supabase Schema section):
- [ ] Create the `posts` and `daily_metrics` tables using the provided SQL
- [ ] **Write RLS policies** for both tables (SELECT, INSERT, UPDATE, DELETE)
- [ ] Set up Supabase Auth (email/password is sufficient)
- [ ] Seed the database with sample data for at least 2 different users
- [ ] **Test data isolation**: Verify User A cannot see User B's data
- [ ] Create Supabase clients for both server and client components
**Why this matters**: We use RLS extensively to ensure data isolation between workspaces. You'll work
with existing schemas but need to understand and implement security policies.
#### 2. Posts Table
Create a table component that:
- [ ] Displays posts with columns: Thumbnail, Caption (truncated), Platform, Likes, Comments, Shares,
Engagement Rate, Posted Date
- [ ] Supports **sorting** by any numeric column (ascending/descending)
- [ ] Supports **filtering** by platform (Instagram, TikTok, All)
- [ ] Shows a **loading skeleton** while data is being fetched
- [ ] Handles **empty states** gracefully
- [ ] Is **responsive** (stacks appropriately on mobile)
#### 3. Engagement Chart
Create a chart component using **any charting library** (Recharts, Chart.js, Visx, etc.):
- [ ] Visualizes engagement (likes + comments + shares) over the last 30 days
- [ ] Allows toggling between **line chart** and **area chart** views
- [ ] Shows a **tooltip** on hover with exact values
- [ ] Includes axis labels and a legend
- [ ] Implements responsive sizing
**Bonus**: Using **Visx** (our internal choice) demonstrates comfort with lower-level, D3-based libraries.
#### 4. Summary Cards
Create metric cards showing:
- [ ] **Total Engagement**: Sum of all interactions
- [ ] **Average Engagement Rate**: Percentage across all posts
- [ ] **Top Performing Post**: Highest engagement post
- [ ] **Trend Indicator**: Percentage change vs. previous period (up/down arrow)
#### 5. Post Detail Modal (Radix Dialog)
When clicking a post row:
- [ ] Open a **modal/dialog** using `@radix-ui/react-dialog` (via shadcn/ui)
- [ ] Show the post image/thumbnail larger
- [ ] Display all metrics with formatted numbers
- [ ] Include a "View on Platform" external link (can be placeholder)
- [ ] Support **keyboard navigation** (Escape to close)
- [ ] Trap focus within the modal for accessibility
**Bonus**: Add entrance/exit animations with **Framer Motion**.
#### 6. State Management Architecture
Demonstrate proper state separation:
- [ ] **Zustand store** for UI state (selected filters, modal open state, chart view type)
- [ ] **TanStack Query** for all Supabase data fetching with:
- Proper query keys factory pattern
- Loading and error states
- Cache invalidation after mutations
- [ ] **No prop drilling** – use stores and queries appropriately
#### 7. API Routes & Edge Functions
Build server-side logic with Next.js:
- [ ] Create a **Next.js API route** (`/api/analytics/summary`) that:
- Validates the authenticated user via Supabase session
- Aggregates engagement metrics server-side
- Returns computed summary data (total engagement, averages, trends)
- Handles errors gracefully with appropriate HTTP status codes
- [ ] Create a **Vercel Edge Function** or **Next.js Edge Route** (`/api/metrics/daily`) that:
- Runs at the edge for low latency
- Fetches and returns daily metrics for the chart
- Demonstrates understanding of edge runtime limitations
- [ ] Implement proper **request validation** (check auth, validate query params)
- [ ] Use **appropriate HTTP methods** (GET for reads, POST for mutations)
**Why this matters**: Our frontend engineers regularly build API routes and work with Edge Functions.
You should be comfortable with server-side logic, not just client-side UI.
#### 8. Security & Environment Configuration
Demonstrate security awareness:
- [ ] **Environment variables**: Store all secrets in `.env.local` (never commit to git)
- [ ] **Provide `.env.example`**: Document required env vars without actual values
- [ ] **Vercel deployment**: Deploy to Vercel with environment variables configured via Vercel dashboard
- [ ] **Secure API routes**: Verify authentication before returning data (no unauthenticated access to user
data)
- [ ] **No exposed secrets**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is never exposed client-side
- [ ] **Input validation**: Sanitize/validate all user inputs and query parameters
- [ ] **CORS considerations**: Understand when CORS headers are needed
**Why this matters**: Security is non-negotiable. We need engineers who think about data protection,
secret management, and secure deployments from day one.
### Non-Functional Requirements
- [ ] **Type Safety**: All components and functions should be properly typed (no `any`)
- [ ] **Security First**: No secrets in client bundle, authenticated routes protected, input validated
- [ ] **Error Handling**: Display user-friendly error messages; log errors appropriately server-side
- [ ] **Loading States**: Show appropriate loading indicators
- [ ] **Code Quality**: Clean, readable code with consistent formatting
- [ ] **Component Structure**: Logical separation of concerns
- [ ] **Production Deployment**: Deployed to Vercel with proper environment variable configuration
**Note on UI**: We value functional, usable interfaces over pixel-perfect designs. Use shadcn/ui defaults –
don't spend time on custom styling. Focus your energy on architecture, security, and functionality.
---
## Design Decisions (Required)
AI can generate code, but **you** must make the architectural decisions. For each decision below, choose
an approach, implement it, and **document your reasoning in your README**. There are no "right"
answers – we want to see your thought process.
### 1. Where should engagement metrics be aggregated?
The Summary Cards need totals (total engagement, average engagement rate, trend %). Where does this
computation happen?
**Options to consider:**
- Client-side: Fetch raw posts, compute in React
- API Route: Compute in `/api/analytics/summary`, return aggregated data
- Database: Use a Postgres function or view
- Hybrid: Some combination
**Document**: Which did you choose and why? What are the trade-offs (performance, caching,
complexity)?
### 2. What data should live in Zustand vs. TanStack Query vs. URL state?
You have three state management options. Decide where each piece of state belongs:
- Current platform filter (All / Instagram / TikTok)
- Current sort column and direction
- Selected post (for modal)
- Chart view type (line / area)
- Posts data from Supabase
- Daily metrics data from Supabase
**Document**: Your state management map and the reasoning behind each choice. Consider:
persistence, shareability, cache invalidation.
### 3. How do you handle the case where a user has no data?
A new user signs up and has zero posts and zero daily metrics. What happens?
**Consider:**
- Empty state UI for table, chart, summary cards
- What do the API routes return?
- Does the chart crash with no data points?
- What's the engagement rate when there are no posts? (0%? null? "N/A"?)
**Document**: Your empty state strategy across all components and edge cases.
### 4. How should the "trend" percentage be calculated?
The Summary Cards show "engagement change vs. previous period." But what's the "previous period"?
**Options:**
- Last 7 days vs. prior 7 days
- Last 30 days vs. prior 30 days
- This month vs. last month
**Document**: Your chosen approach and why. Consider: data availability, meaningful comparisons, UX
clarity.
---
## Supabase Schema
We provide the database schema below (as a lead engineer would). **Your task is to:**
1. Create these tables in your Supabase project
2. **Write the RLS policies** (this is your responsibility)
3. Create seed data for at least 2 different test users
4. Generate TypeScript types from the schema
### Provided Schema
```sql
-- Posts table
CREATE TABLE posts (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
caption TEXT,
thumbnail_url TEXT,
media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'carousel')),
posted_at TIMESTAMPTZ NOT NULL,
likes INTEGER DEFAULT 0,
comments INTEGER DEFAULT 0,
shares INTEGER DEFAULT 0,
saves INTEGER DEFAULT 0,
reach INTEGER DEFAULT 0,
impressions INTEGER DEFAULT 0,
engagement_rate DECIMAL(5,2),
permalink TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Daily metrics table
CREATE TABLE daily_metrics (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
date DATE NOT NULL,
engagement INTEGER DEFAULT 0,
reach INTEGER DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(user_id, date)
);
-- Enable RLS (YOU MUST WRITE THE POLICIES)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
-- TODO: Write RLS policies for both tables
-- Requirements:
-- - Users can only SELECT their own data
-- - Users can only INSERT data where user_id matches their auth.uid()
-- - Users can only UPDATE their own data
-- - Users can only DELETE their own data
```
### Your RLS Task
Write policies that ensure complete data isolation between users. Test by:
1. Logging in as User A  should only see User A's posts
2. Logging in as User B  should only see User B's posts
3. Attempting to access User B's data as User A  should return empty/fail
**This is critical.** Broken RLS = data leak between users.
### Sample Data
Here's example data to help you understand the expected structure. Your database schema should store
metrics as individual columns (not nested objects):
```json
{
"posts": [
{
"id": "post_001",
"user_id": "user-uuid-here",
"platform": "instagram",
"caption": "Excited to share our latest product launch! ■ What do you think? #startup #launch",
"thumbnail_url": "https://picsum.photos/seed/post1/400/400",
"media_type": "image",
"posted_at": "2024-01-15T14:30:00Z",
"likes": 1243,
"comments": 89,
"shares": 45,
"saves": 156,
"reach": 15420,
"impressions": 18650,
"engagement_rate": 8.2,
"permalink": "https://instagram.com/p/example1"
},
{
"id": "post_002",
"user_id": "user-uuid-here",
"platform": "tiktok",
"caption": "Behind the scenes of our creative process ■ #bts #creative",
"thumbnail_url": "https://picsum.photos/seed/post2/400/400",
"media_type": "video",
"posted_at": "2024-01-14T10:00:00Z",
"likes": 5621,
"comments": 234,
"shares": 189,
"saves": 423,
"reach": 45000,
"impressions": 52000,
"engagement_rate": 12.5,
"permalink": "https://tiktok.com/@example/video/123"
},
{
"id": "post_003",
"user_id": "user-uuid-here",
"platform": "instagram",
"caption": "Monday motivation! ■ How are you starting your week?",
"thumbnail_url": "https://picsum.photos/seed/post3/400/400",
"media_type": "carousel",
"posted_at": "2024-01-13T08:00:00Z",
"likes": 876,
"comments": 56,
"shares": 23,
"saves": 89,
"reach": 9800,
"impressions": 11200,
"engagement_rate": 6.8,
"permalink": "https://instagram.com/p/example3"
}
],
"daily_metrics": [
{ "date": "2024-01-01", "user_id": "user-uuid-here", "engagement": 450, "reach": 5200 },
{ "date": "2024-01-02", "user_id": "user-uuid-here", "engagement": 520, "reach": 6100 },
{ "date": "2024-01-03", "user_id": "user-uuid-here", "engagement": 380, "reach": 4800 }
]
}
```
Generate additional sample data to make the dashboard feel realistic (15-20 posts, 30 days of daily
metrics, data for at least 2 different users).
---
## Evaluation Criteria
We'll evaluate your submission on:
| Criteria | Weight | What We're Looking For |
|----------|--------|------------------------|
| **Design Decisions & Reasoning** | 25% | Thoughtful choices on the 4 required decisions, clear
documentation of trade-offs |
| **Supabase & RLS** | 20% | Working RLS policies, proper client setup, data isolation verified |
| **Security & Deployment** | 20% | Env var handling, Vercel deployment, no exposed secrets, auth
checks |
| **API Routes & Edge Functions** | 15% | Working endpoints, proper validation, edge runtime usage |
| **Code Quality & Architecture** | 15% | Clean structure, TypeScript usage, state management patterns |
| **Functionality** | 5% | Features work, handles edge cases – but decisions matter more than polish |
**Note**: UI/UX polish is NOT a weighted criterion. Use shadcn/ui defaults and focus on what matters:
security, architecture, and your reasoning.
### What Makes a Strong Submission
- **RLS Policies**: Correct, tested, and you can explain why they work
- **Design Decisions**: You made clear choices, documented trade-offs, and can defend your reasoning
- **README**: Comprehensive documentation of your decisions, not just setup instructions
- **Security Awareness**: You thought about auth, secrets, and data isolation proactively
- **Edge Cases**: You handled empty states, errors, and unauthorized access thoughtfully
### What We'll Ask in the Follow-Up Interview
If you advance, we'll discuss:
- "Walk me through your RLS policies – how do they prevent User A from seeing User B's data?"
- "Why did you choose to aggregate data in [location]? What would change if we had 10,000 posts?"
- "Show me how you'd add a 'team' concept where multiple users share the same data"
- "What happens if this RLS policy was missing? Walk me through the exploit"
Be prepared to explain and extend your solution.
### Bonus Points (Not Required)
- **Visx for charts** – demonstrates comfort with low-level D3-based libraries
- **Framer Motion animations** – polished modal/UI transitions
- Unit tests for API routes and utility functions (Jest, Vitest)
- E2E tests with Cypress
- Rate limiting on API routes
- Request logging/monitoring setup
- Database helper functions (e.g., `get_user_summary()` in Postgres)
- Supabase Realtime subscriptions for live updates
- GitHub Actions CI/CD pipeline
- Preview deployments per PR
- Security headers configuration
---
## Submission Guidelines
### What to Submit
1. **GitHub Repository**: Public or private (invite our hiring team – we'll provide the username)
2. **README.md** with:
- Setup instructions
- Architecture decisions and trade-offs
- What you'd improve with more time
- Time spent on the challenge
3. **Live Demo** (optional but appreciated): Vercel, Netlify, etc.
### Repository Structure
```
■■■ README.md
■■■ package.json
■■■ .env.example # Example env vars (DO NOT commit real keys)
■■■ app/ # Next.js App Router
■ ■■■ layout.tsx
■ ■■■ page.tsx
■ ■■■ api/ # API routes
■ ■ ■■■ analytics/ # /api/analytics/summary
■ ■ ■■■ metrics/ # /api/metrics/daily (Edge)
■ ■■■ auth/ # Auth pages (login, signup)
■ ■■■ dashboard/ # Protected dashboard route
■■■ components/
■ ■■■ ui/ # shadcn/ui components
■ ■■■ posts/ # Post-related components
■ ■■■ charts/ # Visx chart components
■ ■■■ providers/ # Context providers (Query, etc.)
■■■ lib/
■ ■■■ supabase/
■ ■ ■■■ client.ts # Browser Supabase client
■ ■ ■■■ server.ts # Server Supabase client
■ ■ ■■■ middleware.ts # Auth middleware
■ ■■■ stores/ # Zustand stores
■ ■■■ hooks/ # TanStack Query hooks
■ ■■■ database.types.ts # Auto-generated Supabase types
■■■ supabase/
■■■ migrations/ # SQL migrations
■■■ seed.sql # Sample data for 2+ users
```
---
## Getting Started
### 1. Create Next.js Project
```bash
# Create a new Next.js 15 project
npx create-next-app@latest analytics-challenge --typescript --tailwind --app
cd analytics-challenge
```
### 2. Install Required Dependencies
```bash
# Supabase
npm install @supabase/supabase-js @supabase/ssr
# State Management
npm install zustand @tanstack/react-query
# UI Components (shadcn/ui)
npx shadcn@latest init
npx shadcn@latest add button card dialog table select skeleton
# Data Table
npm install @tanstack/react-table
# Charts (pick one)
npm install recharts
# OR: npm install chart.js react-chartjs-2
# Icons
npm install lucide-react
# Dev tools (optional but recommended)
npm install -D @tanstack/react-query-devtools
```
### Optional Dependencies (Bonus)
```bash
# If using Visx for charts (bonus)
npm install @visx/axis @visx/curve @visx/event @visx/grid @visx/group \
@visx/responsive @visx/scale @visx/shape @visx/tooltip
# If adding animations (bonus)
npm install framer-motion
```
### 3. Set Up Supabase
```bash
# Create a free Supabase project at https://supabase.com
# Get your project URL and anon key from Settings > API
# Add to .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
### 4. Start Development
```bash
npm run dev
```
### Required Libraries
| Library | Purpose | Documentation |
|---------|---------|---------------|
| `@supabase/supabase-js` | Database & Auth | [docs](https://supabase.com/docs) |
| `@supabase/ssr` | Server-side Supabase | [docs](https://supabase.com/docs/guides/auth/server-side) |
| `zustand` | Global state | [docs](https://zustand-demo.pmnd.rs/) |
| `@tanstack/react-query` | Server state | [docs](https://tanstack.com/query) |
| `@tanstack/react-table` | Data tables | [docs](https://tanstack.com/table) |
| `shadcn/ui` | UI components | [docs](https://ui.shadcn.com/) |
| `lucide-react` | Icons | [docs](https://lucide.dev/) |
| Any charting library | Charts | Recharts, Chart.js, or similar |
### Optional Libraries (Bonus)
| Library | Purpose | Documentation |
|---------|---------|---------------|
| `@visx/*` | Advanced charts | [docs](https://airbnb.io/visx/) |
| `framer-motion` | Animations | [docs](https://www.framer.com/motion/) |
---
## Tips for Success
### AI-Assisted Development (Encouraged!)
We **actively encourage** using AI tools. This reflects how we work. Here's how to get the most out of
them:
1. **Supabase MCP Server** (Highly Recommended)
- Install the [Supabase MCP Server](https://supabase.com/docs/guides/getting-started/mcp) in your AI
assistant
- It can query your actual database schema, help write SQL migrations, debug RLS policies, and generate
type-safe queries
- Commands like "create an RLS policy for posts where users can only see their own data" become
one-shot operations
- Use it to validate your RLS policies: "Can user A access user B's posts with this policy?"
2. **AI Coding Assistants**
- **Cursor / Copilot / Claude**: Great for scaffolding components, writing TanStack Query hooks, and Visx
charts
- **Prompt tip**: Paste the relevant docs (TanStack Query, Visx) into context for better results
- **Review everything**: AI makes mistakes. You're responsible for the output – especially security-related
code
- **RLS is critical**: Double-check AI-generated RLS policies by testing as multiple users
3. **What We're Evaluating**
- Your ability to **direct AI effectively** (good prompts, iterative refinement)
- Your **judgment** in reviewing AI output (catching bugs, security issues)
- Your **understanding** of the code (you should be able to explain any line)
- The **final quality** of the solution, regardless of how you got there
4. **Context7 / Library Docs MCP**
- Tools like Context7 can fetch up-to-date docs for libraries – useful for Visx, TanStack, Supabase
- Providing accurate docs to your AI assistant dramatically improves output quality
### Technical Tips
5. **Start with Supabase**: Set up your schema and RLS policies first – everything depends on this
6. **Generate TypeScript types**: Use `npx supabase gen types typescript --project-id your-project-id >
lib/database.types.ts` to auto-generate types from your schema – don't write them manually!
7. **Test RLS thoroughly**: Log in as different users and verify data isolation – try to access another user's
data and confirm it fails
8. **Set up TanStack Query early**: Configure the QueryClient and create your query hooks with proper
query key factories
9. **Use shadcn/ui**: Don't build UI primitives from scratch – leverage the component library
10. **Visx has a learning curve**: This is where AI assistance really helps – but understand the code it
generates
11. **Show your thinking**: Comments explaining "why" are more valuable than "what"
12. **Test edge cases**: Empty states, loading, errors, long text, unauthorized access
13. **Deploy early**: Set up Vercel deployment early so you can test in a production-like environment
### Useful Commands
```bash
# Generate TypeScript types from your Supabase schema
npx supabase gen types typescript --project-id <project-id> > lib/database.types.ts
# Or if using local Supabase
npx supabase gen types typescript --local > lib/database.types.ts
# Link your local project to Supabase
npx supabase link --project-ref <project-id>
# Push local migrations to remote
npx supabase db push
```
---
## Questions?
If you have questions about the requirements, reach out to your recruiting contact. We're evaluating your
problem-solving approach, so reasonable assumptions are fine – just document them in your README.
---
## What Happens Next
1. **Submit** your repository link within the deadline
2. **Review** takes 2-3 business days
3. **Feedback** provided regardless of outcome
4. **Next round** (if successful): Live session where we discuss your solution and extend it together
---
Good luck! We're excited to see what you build. ■