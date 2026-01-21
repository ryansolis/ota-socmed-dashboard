/**
 * Query key factory for TanStack Query
 * Centralizes all query keys for consistent cache management
 */

export const queryKeys = {
  // Posts queries
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters?: { platform?: string }) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },

  // Daily metrics queries
  dailyMetrics: {
    all: ["daily-metrics"] as const,
    lists: () => [...queryKeys.dailyMetrics.all, "list"] as const,
    list: (days?: number) =>
      [...queryKeys.dailyMetrics.lists(), days] as const,
  },

  // Analytics summary queries
  analytics: {
    all: ["analytics"] as const,
    summary: () => [...queryKeys.analytics.all, "summary"] as const,
  },
}
