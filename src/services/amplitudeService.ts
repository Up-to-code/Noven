import * as amplitude from "@amplitude/analytics-react-native";
import { SessionReplayPlugin } from "@amplitude/plugin-session-replay-react-native";

const AMPLITUDE_API_KEY = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;

let initializationPromise: Promise<void> | null = null;

export function initializeAmplitude() {
  if (!AMPLITUDE_API_KEY) {
    console.warn("Amplitude API key is not configured");
    return Promise.resolve();
  }

  if (!initializationPromise) {
    initializationPromise = amplitude
      .init(AMPLITUDE_API_KEY)
      .promise.then(() => amplitude.add(new SessionReplayPlugin()).promise)
      .then(() => {
        amplitude.track("App Opened");
      })
      .catch((error) => {
        initializationPromise = null;
        console.error("Amplitude initialization failed", error);
      });
  }

  return initializationPromise;
}

export function trackEvent(eventName: string, eventProperties?: Record<string, unknown>) {
  return amplitude.track(eventName, eventProperties);
}
