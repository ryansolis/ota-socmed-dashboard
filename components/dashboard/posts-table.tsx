"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table"
import { usePosts } from "@/lib/hooks/use-posts"
import { useUIStore } from "@/lib/stores/ui-store"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Image from "next/image"
import type { Post } from "@/lib/hooks/use-posts"

type PlatformFilter = "all" | "instagram" | "tiktok"

export function PostsTable() {
  const platformFilter = useUIStore((state) => state.platformFilter)
  const setPlatformFilter = useUIStore((state) => state.setPlatformFilter)
  const openModal = useUIStore((state) => state.openModal)

  const { data: posts, isLoading, error } = usePosts({
    platform: platformFilter === "all" ? undefined : platformFilter,
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const truncateCaption = (caption: string | null, maxLength: number = 50): string => {
    if (!caption) return "No caption"
    return caption.length > maxLength
      ? caption.substring(0, maxLength) + "..."
      : caption
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "thumbnail_url",
      header: "Thumbnail",
      cell: ({ row }) => {
        const url = row.original.thumbnail_url
        return (
          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
            {url ? (
              <Image
                src={url}
                alt="Post thumbnail"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "caption",
      header: "Caption",
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          {truncateCaption(row.original.caption)}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "platform",
      header: "Platform",
      cell: ({ row }) => {
        const platform = row.original.platform
        return (
          <span className="capitalize">
            {platform === "instagram" ? "Instagram" : "TikTok"}
          </span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "likes",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Likes
            {column.getIsSorted() === false ? (
              <ArrowUpDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </button>
        )
      },
      cell: ({ row }) => row.original.likes.toLocaleString(),
    },
    {
      accessorKey: "comments",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Comments
            {column.getIsSorted() === false ? (
              <ArrowUpDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </button>
        )
      },
      cell: ({ row }) => row.original.comments.toLocaleString(),
    },
    {
      accessorKey: "shares",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Shares
            {column.getIsSorted() === false ? (
              <ArrowUpDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </button>
        )
      },
      cell: ({ row }) => row.original.shares.toLocaleString(),
    },
    {
      accessorKey: "engagement_rate",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Engagement Rate
            {column.getIsSorted() === false ? (
              <ArrowUpDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </button>
        )
      },
      cell: ({ row }) => {
        const rate = row.original.engagement_rate
        return rate ? `${rate.toFixed(1)}%` : "N/A"
      },
    },
    {
      accessorKey: "posted_at",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Posted Date
            {column.getIsSorted() === false ? (
              <ArrowUpDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </button>
        )
      },
      cell: ({ row }) => formatDate(row.original.posted_at),
    },
  ]

  const table = useReactTable({
    data: posts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load posts</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Posts</h2>
        <Select
          value={platformFilter}
          onValueChange={(value) => setPlatformFilter(value as PlatformFilter)}
        >
          <SelectTrigger className="w-[180px]" data-testid="platform-filter">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openModal(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Import Card components that are missing
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
