# NOVEN Google Play Submission Checklist

## Current Android App Identity

- App name: `Noven`
- Android package name: `com.ahmedss7.noven`
- Expo project owner: `ahmedss7`
- EAS project ID: `498bc6ee-754f-4cf5-ace1-8b6bd7f91897`
- Premium access level: `premium`
- Adapty placements: `onboarding`, `settings`
- Store products:
  - Monthly: `com.ahmedss7.noven.premium.monthly`
  - Annual: `com.ahmedss7.noven.premium.annual`
- Recommended Google Play base plan IDs:
  - Monthly: `monthly-base`
  - Annual: `annual-base`

## Before Google Play Console

- Run `bun run typecheck`.
- Run `bunx expo export --platform android --clear --output-dir /tmp/noven-android-export-check`.
- Confirm `app.json` has `expo.android.package` set to `com.ahmedss7.noven`.
- Confirm `EXPO_PUBLIC_ADAPTY_SDK_KEY` is available to EAS builds, preferably through EAS environment variables rather than a committed `.env` file.
- Build and test an Android development build on a real device:

```bash
bunx eas build --platform android --profile development
```

- Test onboarding, habit creation, habit completion, reflection, settings edits, notification permission, prompt export, reset local data, and the paywall.
- Test Premium through a Google Play internal testing track. Expo Go only supports the mock subscription flow.

## Google Play Console

- Create a Google Play app record for `Noven`.
- Use package name `com.ahmedss7.noven`. This cannot be changed after the first upload.
- Complete app access, ads, content rating, target audience, data safety, privacy policy, and store listing sections.
- Create subscription products:
  - Product ID: `com.ahmedss7.noven.premium.monthly`
  - Base plan ID: `monthly-base`
  - Billing period: monthly
  - Product ID: `com.ahmedss7.noven.premium.annual`
  - Base plan ID: `annual-base`
  - Billing period: annual
- Add product names and descriptions that match the app paywall:
  - `Noven Premium Monthly`
  - `Noven Premium Annual`
  - Mention unlimited habits beyond the free two-habit limit, prompt export, and advanced monthly pattern details.
- Create an internal testing release first.

## Adapty Google Play Setup

- In Adapty, confirm the app includes Android package name `com.ahmedss7.noven`.
- Configure Google Play credentials in Adapty:
  - Package name: `com.ahmedss7.noven`
  - Google service account JSON key
  - Google Play RTDN topic name
- Configure products in Adapty with the same Google Play product IDs and base plan IDs:
  - `com.ahmedss7.noven.premium.monthly` / `monthly-base`
  - `com.ahmedss7.noven.premium.annual` / `annual-base`
- Confirm both products grant access level `premium`.
- Confirm paywall products are attached to placements `onboarding` and `settings`.
- Configure Google Play Real-time Developer Notifications using the Pub/Sub topic from Adapty.

## EAS Build And Submit

- Create a production Android App Bundle:

```bash
bunx eas build --platform android --profile production
```

- For the first Google Play upload, upload the `.aab` manually in Play Console if EAS Submit is not accepted for the initial release.
- After the first manual upload and Play Console setup, configure EAS Submit with a Google service account key outside git, then submit:

```bash
bunx eas submit --platform android --profile production
```

## Release Risk Check

- Do not upload a first Android build until the package name is final.
- Do not submit real subscription UI until Google Play products, Adapty products, and code product IDs all match.
- Do not commit Google service account JSON keys.
- Keep the Play Console data safety form and privacy policy aligned with the actual build.
- If Firebase Auth, Firestore sync, crash reporting, analytics changes, server AI, Google sign-in, or another payment provider is added, update privacy disclosures before release.
