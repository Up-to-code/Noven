import { router } from "expo-router";

import { useHabitStore } from "@/store/habitStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export function useHabitCreationGate(returnTo = "/(tabs)/habits") {
  const habitCount = useHabitStore((state) => state.habits.length);
  const isPremium = useSubscriptionStore((state) => state.isPremium);

  return () => {
    if (!isPremium && habitCount >= 2) {
      router.push({
        pathname: "/paywall",
        params: {
          placement: "settings",
          returnTo,
        },
      });
      return false;
    }

    router.push("/habits/create");
    return true;
  };
}

export function useCanCreateHabit() {
  const habitCount = useHabitStore((state) => state.habits.length);
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  return isPremium || habitCount < 2;
}
