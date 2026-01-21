import { create } from "zustand"

type PlatformFilter = "all" | "instagram" | "tiktok"
type ChartViewType = "line" | "area"

interface UIState {
  // Posts table state
  platformFilter: PlatformFilter
  setPlatformFilter: (filter: PlatformFilter) => void

  // Chart view state
  chartViewType: ChartViewType
  setChartViewType: (type: ChartViewType) => void

  // Modal state
  selectedPostId: string | null
  isModalOpen: boolean
  openModal: (postId: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // Posts table state
  platformFilter: "all",
  setPlatformFilter: (filter) => set({ platformFilter: filter }),

  // Chart view state
  chartViewType: "line",
  setChartViewType: (type) => set({ chartViewType: type }),

  // Modal state
  selectedPostId: null,
  isModalOpen: false,
  openModal: (postId) => set({ selectedPostId: postId, isModalOpen: true }),
  closeModal: () => set({ selectedPostId: null, isModalOpen: false }),
}))
