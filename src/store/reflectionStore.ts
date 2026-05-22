import { create } from "zustand";

import { saveReflection } from "@/services/database";
import type { Reflection, ReflectionOption } from "@/types";

type ReflectionState = {
  reflections: Reflection[];
  hydrate: (reflections: Reflection[]) => void;
  addReflection: (reflection: Omit<Reflection, "id" | "createdAt">) => void;
  clearForHabit: (habitId: string) => void;
  toggleOption: (option: ReflectionOption) => void;
  draftOptions: ReflectionOption[];
  draftNotes: string;
  setDraftNotes: (draftNotes: string) => void;
  resetDraft: () => void;
};

export const useReflectionStore = create<ReflectionState>((set) => ({
  reflections: [],
  hydrate: (reflections) => set({ reflections }),
  draftOptions: [],
  draftNotes: "",
  addReflection: (reflection) => {
    const savedReflection = {
      ...reflection,
      id: `reflection-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      reflections: [savedReflection, ...state.reflections],
      draftOptions: [],
      draftNotes: "",
    }));
    saveReflection(savedReflection).catch(console.error);
  },
  clearForHabit: (habitId) =>
    set((state) => ({
      reflections: state.reflections.filter((reflection) => reflection.habitId !== habitId),
    })),
  toggleOption: (option) =>
    set((state) => ({
      draftOptions: state.draftOptions.includes(option)
        ? state.draftOptions.filter((item) => item !== option)
        : [...state.draftOptions, option],
    })),
  setDraftNotes: (draftNotes) => set({ draftNotes }),
  resetDraft: () => set({ draftOptions: [], draftNotes: "" }),
}));
