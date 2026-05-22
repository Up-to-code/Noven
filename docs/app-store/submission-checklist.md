# NOVEN Apple Submission Checklist

## Before Upload

- Confirm `app.json` version and iOS build number are correct.
- Confirm bundle ID is `com.ahmedss7.noven` in both `app.json` and `ios/Noven.xcodeproj/project.pbxproj`.
- Confirm the native iOS build is iPhone portrait only unless you intentionally want Universal iPad support.
- Run `bun run typecheck`. Last checked: pass on 2026-05-21.
- Run `bunx expo export --platform ios --clear --output-dir /tmp/noven-export-check`. Last checked: pass on 2026-05-21.
- Make a real production build for App Store Connect.
- Test onboarding, habit creation, completion, reflection, settings edits, notification permission, prompt export, and reset local data.
- Test Premium with a development build or TestFlight build. Expo Go only supports mock subscription flow.
- Test the in-app Terms and Privacy Policy links from the welcome screen.
- Test the in-app Terms and Privacy Policy rows from Settings.

## App Store Connect

- Create app record.
- Add name: Noven.
- Add SKU: noven-ios-001.
- Add category: Productivity.
- Add support URL.
- Add privacy policy URL.
- Replace every `your-domain.example`, `support@example.com`, and placeholder review contact value before submission.
- Confirm the public privacy policy URL matches the in-app privacy screen.
- Create App Store Connect auto-renewable subscriptions:
  - `com.ahmedss7.noven.premium.monthly`
  - `com.ahmedss7.noven.premium.annual`
- Configure Adapty with access level `premium` and placements `onboarding` and `settings`.
- Add screenshots for required iPhone sizes.
- Add app description, subtitle, keywords, and promotional text from `app-store-connect-record.md`.
- Add review notes from `app-review-notes.md`.
- Set App Privacy to reflect local app data plus Apple/Adapty subscription purchase handling.

## App Review Risk Check

- Do not claim AI is built in. The current app exports a prompt only.
- Do not claim cloud backup or sync. The current app is local-only.
- Do not include fake settings or fake account screens.
- Do not submit real subscription UI until App Store Connect products and Adapty products match the IDs above.
- Do not enable notifications by default.
- Do not request notification permission without a clear user action.
- Keep privacy policy consistent with the actual build.

## Future Changes That Require Privacy Updates

Update App Privacy and the privacy policy before shipping if any of these are added:

- Firebase Auth
- Firestore sync
- Crash reporting
- Analytics
- Server AI
- OpenRouter or other LLM APIs
- Sign in with Apple
- New subscription/payment providers beyond Apple and Adapty
