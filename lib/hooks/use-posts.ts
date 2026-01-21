"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { queryKeys } from "./query-keys"

export type Post = {
  id: string
  user_id: string
  platform: "instagram" | "tiktok"
  caption: string | null
  thumbnail_url: string | null
  media_type: "image" | "video" | "carousel"
  posted_at: string
  likes: number
  comments: number
  shares: number
  saves: number
  reach: number
  impressions: number
  engagement_rate: number | null
  permalink: string | null
  created_at: string
}

type UsePostsOptions = {
  platform?: "all" | "instagram" | "tiktok"
  enabled?: boolean
}

export function usePosts(options: UsePostsOptions = {}) {
  const { platform = "all", enabled = true } = options

  return useQuery({
    queryKey: queryKeys.posts.list(platform !== "all" ? { platform } : undefined),
    queryFn: async () => {
      const supabase = createClient()

      let query = supabase
        .from("posts")
        .select("*")
        .order("posted_at", { ascending: false })

      if (platform !== "all") {
        query = query.eq("platform", platform)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Failed to fetch posts: ${error.message}`)
      }

      return (data || []) as Post[]
    },
    enabled,
  })
}

export function usePost(id: string | null) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id || ""),
    queryFn: async () => {
      if (!id) return null

      const supabase = createClient()
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        throw new Error(`Failed to fetch post: ${error.message}`)
      }

      return data as Post
    },
    enabled: !!id,
  })
}
