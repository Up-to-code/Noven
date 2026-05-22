import { create } from "zustand";

import { resetLocalProfile, saveLocalProfile } from "@/services/database";

type OnboardingState = {
  avatarId?: string;
  name: string;
  selectedMbti?: string;
  selectedFocus?: string;
  hasHydrated: boolean;
  hydrate: (profile: { avatarId?: string; name: string; selectedFocus?: string; selectedMbti?: string }) => void;
  setAvatar: (avatarId: string) => void;
  setName: (name: string) => void;
  setMbti: (mbti: string) => void;
  setFocus: (focus: string) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>()((set, get) => ({
  name: "",
  avatarId: undefined,
  selectedMbti: undefined,
  selectedFocus: undefined,
  hasHydrated: false,
  hydrate: (profile) => set({ ...profile, hasHydrated: true }),
  setAvatar: (avatarId) => {
    set({ avatarId });
    saveLocalProfile(get()).catch(console.error);
  },
  setName: (name) => {
    set({ name });
    saveLocalProfile(get()).catch(console.error);
  },
  setMbti: (selectedMbti) => {
    set({ selectedMbti });
    saveLocalProfile(get()).catch(console.error);
  },
  setFocus: (selectedFocus) => {
    set({ selectedFocus });
    saveLocalProfile(get()).catch(console.error);
  },
  reset: () => {
    set({ avatarId: undefined, name: "", selectedMbti: undefined, selectedFocus: undefined });
    resetLocalProfile().catch(console.error);
  },
}));
