# Project Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Browser]
        UI[Next.js 15 App Router]
        
        subgraph "Pages"
            Home[Home Page]
            Login[Login Page]
            Signup[Signup Page]
            Dashboard[Dashboard Page]
        end
        
        subgraph "Components"
            SummaryCards[Summary Cards]
            PostsTable[Posts Table]
            EngagementChart[Engagement Chart - Visx]
            PostModal[Post Detail Modal]
        end
        
        subgraph "State Management"
            Zustand[Zustand Store<br/>UI State]
            TanStackQuery[TanStack Query<br/>Server State]
        end
    end
    
    subgraph "API Layer"
        APIRoutes[Next.js API Routes]
        EdgeFunction[Edge Function<br/>Daily Metrics]
        SummaryAPI[Analytics Summary API]
        DailyMetricsAPI[Daily Metrics API]
        
        RateLimit[Rate Limiting<br/>Redis/Upstash]
        Logger[Request Logger]
    end
    
    subgraph "Backend Services"
        Supabase[Supabase]
        
        subgraph "Supabase Services"
            Auth[Authentication]
            Postgres[(PostgreSQL Database)]
            RLS[Row Level Security]
        end
        
        Redis[Redis/Upstash<br/>Rate Limiting]
    end
    
    subgraph "Database Schema"
        PostsTableDB[(Posts Table)]
        DailyMetricsTableDB[(Daily Metrics Table)]
        RLS[RLS Policies]
    end
    
    subgraph "External Services"
        Vercel[Vercel Deployment]
        GitHub[GitHub Actions CI/CD]
    end
    
    Browser --> UI
    UI --> Home
    UI --> Login
    UI --> Signup
    UI --> Dashboard
    
    Dashboard --> SummaryCards
    Dashboard --> PostsTable
    Dashboard --> EngagementChart
    Dashboard --> PostModal
    
    SummaryCards --> TanStackQuery
    PostsTable --> TanStackQuery
    EngagementChart --> TanStackQuery
    PostModal --> TanStackQuery
    
    TanStackQuery --> APIRoutes
    Zustand --> UI
    
    APIRoutes --> SummaryAPI
    APIRoutes --> DailyMetricsAPI
    EdgeFunction --> DailyMetricsAPI
    
    SummaryAPI --> RateLimit
    DailyMetricsAPI --> RateLimit
    SummaryAPI --> Logger
    DailyMetricsAPI --> Logger
    
    SummaryAPI --> Supabase
    DailyMetricsAPI --> Supabase
    
    Supabase --> Auth
    Supabase --> Postgres
    Postgres --> PostsTableDB
    Postgres --> DailyMetricsTableDB
    Postgres --> RLS
    
    RateLimit --> Redis
    
    UI --> Vercel
    Vercel --> GitHub
```

## Technology Stack Diagram

```mermaid
graph LR
    subgraph "Frontend Stack"
        NextJS[Next.js 15<br/>App Router]
        TypeScript[TypeScript<br/>Strict Mode]
        TailwindCSS[Tailwind CSS]
        ShadcnUI[shadcn/ui<br/>Radix UI]
        LucideIcons[Lucide React<br/>Icons]
    end
    
    subgraph "State Management"
        ZustandState[Zustand<br/>UI State]
        TanStackQueryState[TanStack Query<br/>Server State]
    end
    
    subgraph "Data Layer"
        TanStackTable[TanStack Table<br/>Data Tables]
        VisxCharts[Visx<br/>D3-based Charts]
        FramerMotion[Framer Motion<br/>Animations]
    end
    
    subgraph "Backend Stack"
        SupabaseBackend[Supabase<br/>PostgreSQL + Auth]
        NextJSAPIs[Next.js API Routes]
        EdgeRuntime[Edge Runtime]
    end
    
    subgraph "Infrastructure"
        RedisInfra[Redis/Upstash<br/>Rate Limiting]
        VercelInfra[Vercel<br/>Hosting]
        GitHubActions[GitHub Actions<br/>CI/CD]
    end
    
    subgraph "Testing"
        Vitest[Vitest<br/>Unit Tests]
        Cypress[Cypress<br/>E2E Tests]
    end
    
    NextJS --> TypeScript
    NextJS --> TailwindCSS
    NextJS --> ShadcnUI
    ShadcnUI --> LucideIcons
    
    NextJS --> ZustandState
    NextJS --> TanStackQueryState
    
    NextJS --> TanStackTable
    NextJS --> VisxCharts
    NextJS --> FramerMotion
    
    NextJS --> NextJSAPIs
    NextJSAPIs --> SupabaseBackend
    NextJSAPIs --> EdgeRuntime
    NextJSAPIs --> RedisInfra
    
    NextJS --> VercelInfra
    VercelInfra --> GitHubActions
    
    NextJS --> Vitest
    NextJS --> Cypress
```

## Feature Breakdown Diagram

```mermaid
graph TB
    Root[Social Media Analytics Dashboard]
    
    subgraph "Core Features"
        Auth[Authentication]
        PostsTable[Posts Table]
        Chart[Engagement Chart]
        Summary[Summary Cards]
        Modal[Post Detail Modal]
        
        Auth --> Auth1[Email/Password Login]
        Auth --> Auth2[Sign Up]
        Auth --> Auth3[Session Management]
        Auth --> Auth4[Protected Routes]
        
        PostsTable --> PT1[Sortable Columns]
        PostsTable --> PT2[Platform Filtering]
        PostsTable --> PT3[Loading States]
        PostsTable --> PT4[Empty States]
        PostsTable --> PT5[Responsive Design]
        
        Chart --> Ch1[Line Chart View]
        Chart --> Ch2[Area Chart View]
        Chart --> Ch3[Interactive Tooltips]
        Chart --> Ch4[Last 30 Days Data]
        Chart --> Ch5[Responsive Sizing]
        
        Summary --> Sum1[Total Engagement]
        Summary --> Sum2[Average Engagement Rate]
        Summary --> Sum3[Top Performing Post]
        Summary --> Sum4[7-Day Trend Indicator]
        
        Modal --> Mod1[Large Image Display]
        Modal --> Mod2[All Metrics]
        Modal --> Mod3[External Link]
        Modal --> Mod4[Keyboard Navigation]
        Modal --> Mod5[Focus Trap]
    end
    
    subgraph "Bonus Features"
        AdvancedCharts[Advanced Charts - Visx]
        Animations[Animations - Framer Motion]
        Security[Security Features]
        Testing[Testing Framework]
        DevOps[DevOps & CI/CD]
        Database[Database Optimizations]
        
        AdvancedCharts --> AC1[Visx Implementation]
        AdvancedCharts --> AC2[Custom Styling]
        AdvancedCharts --> AC3[Interactive Features]
        
        Animations --> Anim1[Framer Motion]
        Animations --> Anim2[Entrance/Exit Animations]
        Animations --> Anim3[Staggered Animations]
        
        Security --> Sec1[Rate Limiting]
        Security --> Sec2[Redis/Upstash]
        Security --> Sec3[Request Logging]
        Security --> Sec4[Security Headers]
        
        Testing --> Test1[Unit Tests - Vitest]
        Testing --> Test2[E2E Tests - Cypress]
        Testing --> Test3[Test Coverage]
        
        DevOps --> Dev1[CI/CD Pipeline]
        DevOps --> Dev2[GitHub Actions]
        DevOps --> Dev3[Automated Testing]
        DevOps --> Dev4[Type Checking]
        DevOps --> Dev5[Linting]
        
        Database --> DB1[Helper Functions]
        Database --> DB2[Summary Function]
        Database --> DB3[Optimized Queries]
    end
    
    Root --> Auth
    Root --> PostsTable
    Root --> Chart
    Root --> Summary
    Root --> Modal
    Root --> AdvancedCharts
    Root --> Animations
    Root --> Security
    Root --> Testing
    Root --> DevOps
    Root --> Database
    
    style Root fill:#4f46e5,stroke:#312e81,stroke-width:3px,color:#fff
    style Auth fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    style PostsTable fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    style Chart fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    style Summary fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    style Modal fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    style AdvancedCharts fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    style Animations fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    style Security fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    style Testing fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    style DevOps fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    style Database fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant TanStackQuery
    participant API
    participant RateLimit
    participant Supabase
    participant PostgreSQL
    participant Redis
    
    User->>Dashboard: Access Dashboard
    Dashboard->>TanStackQuery: Request Data
    
    TanStackQuery->>API: GET /api/analytics/summary
    API->>RateLimit: Check Rate Limit
    RateLimit->>Redis: Check Counter
    Redis-->>RateLimit: Counter Status
    RateLimit-->>API: Allowed/Denied
    
    API->>Supabase: Authenticate User
    Supabase-->>API: User Session
    
    API->>Supabase: Query Posts (RLS Applied)
    Supabase->>PostgreSQL: SELECT posts WHERE user_id = ?
    PostgreSQL-->>Supabase: User's Posts Only
    Supabase-->>API: Filtered Posts
    
    API->>API: Aggregate Metrics
    API-->>TanStackQuery: Summary Data
    TanStackQuery-->>Dashboard: Display Summary Cards
    
    Dashboard->>TanStackQuery: Request Daily Metrics
    TanStackQuery->>API: GET /api/metrics/daily (Edge)
    API->>RateLimit: Check Rate Limit
    API->>Supabase: Query Daily Metrics (RLS Applied)
    Supabase->>PostgreSQL: SELECT daily_metrics WHERE user_id = ?
    PostgreSQL-->>Supabase: User's Metrics Only
    Supabase-->>API: Filtered Metrics
    API-->>TanStackQuery: Daily Metrics
    TanStackQuery-->>Dashboard: Display Chart
```

## Component Hierarchy

```mermaid
graph TD
    App[App Layout]
    QueryProvider[Query Provider]
    
    App --> QueryProvider
    QueryProvider --> Pages
    
    subgraph Pages
        HomePage[Home Page]
        LoginPage[Login Page]
        SignupPage[Signup Page]
        DashboardPage[Dashboard Page]
    end
    
    DashboardPage --> DashboardLayout[Dashboard Layout]
    DashboardLayout --> DashboardContent
    
    subgraph DashboardContent
        SummaryCards[Summary Cards Component]
        EngagementChart[Engagement Chart Component]
        PostsTable[Posts Table Component]
        PostModal[Post Detail Modal Component]
    end
    
    subgraph UI Components
        Button[Button]
        Card[Card]
        Table[Table]
        Dialog[Dialog]
        Select[Select]
        Skeleton[Skeleton]
    end
    
    SummaryCards --> Card
    SummaryCards --> Skeleton
    EngagementChart --> Card
    EngagementChart --> Button
    PostsTable --> Card
    PostsTable --> Table
    PostsTable --> Select
    PostsTable --> Skeleton
    PostModal --> Dialog
    PostModal --> Card
    PostModal --> Button
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        ClientSide[Client-Side]
        APILayer[API Layer]
        DatabaseLayer[Database Layer]
        InfrastructureLayer[Infrastructure Layer]
    end
    
    subgraph ClientSide
        ProtectedRoutes[Protected Routes]
        AuthCheck[Auth Check Middleware]
        NoSecrets[No Secrets in Client]
    end
    
    subgraph APILayer
        SessionValidation[Session Validation]
        RateLimiting[Rate Limiting]
        RequestLogging[Request Logging]
        InputValidation[Input Validation]
        CORS[CORS Headers]
    end
    
    subgraph DatabaseLayer
        RLS[Row Level Security]
        UserIsolation[User Data Isolation]
        PolicyEnforcement[Policy Enforcement]
    end
    
    subgraph InfrastructureLayer
        EnvVars[Environment Variables]
        SecurityHeaders[Security Headers]
        HTTPS[HTTPS Only]
        NoExposedKeys[No Exposed Keys]
    end
    
    ClientSide --> APILayer
    APILayer --> DatabaseLayer
    DatabaseLayer --> InfrastructureLayer
```

## Testing Architecture

```mermaid
graph LR
    subgraph "Testing Strategy"
        UnitTests[Unit Tests<br/>Vitest]
        E2ETests[E2E Tests<br/>Cypress]
        TypeCheck[Type Checking<br/>TypeScript]
        Linting[Linting<br/>ESLint]
    end
    
    subgraph "Unit Test Coverage"
        Utils[Utility Functions]
        Middleware[Middleware Functions]
        Logger[Logger]
    end
    
    subgraph "E2E Test Coverage"
        AuthFlow[Authentication Flow]
        DashboardFlow[Dashboard Flow]
        UserInteractions[User Interactions]
    end
    
    subgraph "CI/CD Pipeline"
        GitHubActions[GitHub Actions]
        RunTests[Run Tests]
        RunLint[Run Lint]
        RunTypeCheck[Run Type Check]
        Build[Build Application]
        Deploy[Deploy to Vercel]
    end
    
    UnitTests --> Utils
    UnitTests --> Middleware
    UnitTests --> Logger
    
    E2ETests --> AuthFlow
    E2ETests --> DashboardFlow
    E2ETests --> UserInteractions
    
    GitHubActions --> RunTests
    GitHubActions --> RunLint
    GitHubActions --> RunTypeCheck
    GitHubActions --> Build
    Build --> Deploy
```

## Technology Stack Summary

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

### State Management
- **UI State**: Zustand
- **Server State**: TanStack Query (React Query)
- **Table**: TanStack Table

### Charts & Animations
- **Charts**: Visx (D3-based) - Bonus
- **Animations**: Framer Motion - Bonus

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Security**: Row Level Security (RLS)
- **API**: Next.js API Routes
- **Edge Runtime**: Vercel Edge Functions

### Infrastructure
- **Hosting**: Vercel
- **Rate Limiting**: Redis/Upstash - Bonus
- **CI/CD**: GitHub Actions - Bonus
- **Security**: Security Headers - Bonus
- **Logging**: Request Logger - Bonus

### Testing
- **Unit Tests**: Vitest - Bonus
- **E2E Tests**: Cypress - Bonus
- **Type Checking**: TypeScript
- **Linting**: ESLint

---

## Key Features Implemented

### Core Features ✅
1. ✅ Supabase Backend with RLS
2. ✅ Posts Table (sortable, filterable)
3. ✅ Engagement Chart (line/area toggle)
4. ✅ Summary Cards (metrics & trends)
5. ✅ Post Detail Modal (with animations)
6. ✅ State Management (Zustand + TanStack Query)
7. ✅ API Routes & Edge Functions
8. ✅ Security & Environment Configuration

### Bonus Features ✅
1. ✅ Visx for Advanced Charts
2. ✅ Framer Motion Animations
3. ✅ Unit Tests (Vitest)
4. ✅ E2E Tests (Cypress)
5. ✅ Rate Limiting (Redis/Upstash)
6. ✅ Request Logging
7. ✅ Database Helper Functions
8. ✅ GitHub Actions CI/CD Pipeline
9. ✅ Security Headers Configuration

