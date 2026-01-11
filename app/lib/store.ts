import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  completedItems: Record<string, boolean>;
  toggleItem: (id: string) => void;
  isCompleted: (id: string) => boolean;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedItems: {},
      toggleItem: (id: string) => {
        set((state) => ({
          completedItems: {
            ...state.completedItems,
            [id]: !state.completedItems[id],
          },
        }));
      },
      isCompleted: (id: string) => !!get().completedItems[id],
    }),
    {
      name: "cornerstones-progress", // unique name
    }
  )
);
