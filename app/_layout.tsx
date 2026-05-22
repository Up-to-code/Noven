import "react-native-gesture-handler";

import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { colors } from "@/design/colors";
import { registerNotificationHandler } from "@/services/notificationService";
import { loadAppData } from "@/services/database";
import { useHabitStore } from "@/store/habitStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { usePreferenceStore } from "@/store/preferenceStore";
import { useReflectionStore } from "@/store/reflectionStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
registerNotificationHandler();

export default function RootLayout() {
  const [databaseReady, setDatabaseReady] = useState(false);
  const [loaded, error] = useFonts({
    "Playfair Display": PlayfairDisplay_400Regular,
    "Playfair Display SemiBold": PlayfairDisplay_600SemiBold,
    "Playfair Display Bold": PlayfairDisplay_700Bold,
    Inter: Inter_400Regular,
    "Inter SemiBold": Inter_600SemiBold,
    "Inter Bold": Inter_700Bold,
  });

  useEffect(() => {
    let isMounted = true;

    loadAppData()
      .then(({ habitLogs, habits, preferences, profile, reflections }) => {
        useOnboardingStore.getState().hydrate(profile);
        useHabitStore.getState().hydrate(habits, habitLogs);
        useReflectionStore.getState().hydrate(reflections);
        usePreferenceStore.getState().hydrate(preferences);
        useSubscriptionStore.getState().initialize().catch(console.error);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) {
          setDatabaseReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if ((loaded || error) && databaseReady) {
      SplashScreen.hideAsync();
    }
  }, [databaseReady, loaded, error]);

  if ((!loaded && !error) || !databaseReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </SafeAreaProvider>
  );
}
