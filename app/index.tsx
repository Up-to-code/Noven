import { Redirect } from "expo-router";

import { useOnboardingStore } from "@/store/onboardingStore";

export default function IndexRoute() {
  const { name, selectedFocus, selectedMbti } = useOnboardingStore();
  const hasCompletedOnboarding = Boolean(name.trim() && selectedFocus && selectedMbti);

  return <Redirect href={hasCompletedOnboarding ? "/(tabs)" : "/onboarding/welcome"} />;
}
