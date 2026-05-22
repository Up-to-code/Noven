import { create } from "zustand";

import type { UserProfile } from "@/types";

type UserState = {
  profile?: UserProfile;
  setProfile: (profile?: UserProfile) => void;
};

export const useUserStore = create<UserState>((set) => ({
  profile: undefined,
  setProfile: (profile) => set({ profile }),
}));
