"use client"

import { usePost } from "@/lib/hooks/use-posts"
import { useUIStore } from "@/lib/stores/ui-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExternalLink, Heart, MessageSquare, Share2, Bookmark, Eye, BarChart3, TrendingUp } from "lucide-react"
import Image from "next/image"

export function PostDetailModal() {
  const selectedPostId = useUIStore((state) => state.selectedPostId)
  const isModalOpen = useUIStore((state) => state.isModalOpen)
  const closeModal = useUIStore((state) => state.closeModal)

  const { data: post, isLoading, error } = usePost(selectedPostId)

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  const engagement = post
    ? post.likes + post.comments + post.shares
    : 0

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Details</DialogTitle>
          <DialogDescription>
            View detailed analytics for this post
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-destructive">Failed to load post details</p>
          </div>
        ) : !post ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No post selected</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="space-y-6"
          >
            {/* Post Image */}
            {post.thumbnail_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted"
              >
                <Image
                  src={post.thumbnail_url}
                  alt={post.caption || "Post image"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </motion.div>
            )}

            {/* Post Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Caption</h3>
                <p className="text-sm">{post.caption || "No caption"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Platform</h3>
                  <p className="text-sm capitalize">{post.platform}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Media Type</h3>
                  <p className="text-sm capitalize">{post.media_type}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Posted At</h3>
                <p className="text-sm">{formatDate(post.posted_at)}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                className="p-4 rounded-lg border bg-muted/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Likes</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(post.likes)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
                className="p-4 rounded-lg border bg-muted/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Comments</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(post.comments)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.2 }}
                className="p-4 rounded-lg border bg-muted/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Shares</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(post.shares)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.2 }}
                className="p-4 rounded-lg border bg-muted/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bookmark className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Saves</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(post.saves)}</p>
              </motion.div>
            </motion.div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Total Engagement</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(engagement)}</p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Engagement Rate</span>
                </div>
                <p className="text-2xl font-bold">
                  {post.engagement_rate ? `${post.engagement_rate.toFixed(1)}%` : "N/A"}
                </p>
              </div>
            </div>

            {/* Reach & Impressions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Reach</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(post.reach)}</p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Impressions</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(post.impressions)}</p>
              </div>
            </div>

              {/* External Link */}
              {post.permalink && (
                <div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(post.permalink || "", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Platform
                  </Button>
                </div>
              )}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
