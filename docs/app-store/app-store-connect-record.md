# NOVEN App Store Connect Record

Use this as the first App Store Connect draft for NOVEN.

## App Information

- App name: Noven
- Bundle ID: com.ahmedss7.noven
- SKU: noven-ios-001
- Primary language: English (U.S.)
- Primary category: Productivity
- Secondary category: Health & Fitness
- Content rights: The app does not contain, show, or access third-party content.
- Age rating target: 4+

## Pricing

- Price: Free
- In-app purchases: Auto-renewable subscriptions
- Subscriptions:
  - Monthly: `com.ahmedss7.noven.premium.monthly`
  - Annual: `com.ahmedss7.noven.premium.annual`

## App Privacy

Set App Privacy to match the final Adapty/App Store Connect configuration before submission.

Use this only while the app remains local-first:

- No account creation
- No cloud sync
- Subscription SDK used for purchase status only
- No advertising SDK
- No third-party tracking
- No habit, reflection, MBTI, focus, or reminder content transmitted to NOVEN servers
- Purchase status and store identifiers may be processed by Apple and Adapty for subscription functionality
- Habits, reflections, MBTI, focus, and reminder preferences stay in local SQLite storage on the user's device
- The export prompt is user-initiated with the native iOS share sheet

If Firebase, analytics, crash reporting, sign-in, or server AI is added later, update App Privacy before submitting a new build.

## App Description

Noven is a calm habit system built around personality, focus, and reflection.

Choose your MBTI type, set a focus area, create habits, log completions, and reflect on what helped or got in the way. Noven keeps the experience quiet and local: your habit data stays on your device.

Noven Premium is an optional auto-renewable subscription. Premium unlocks unlimited habit creation beyond the free two-habit limit, Markdown prompt export from your local habit history and reflections, and advanced monthly pattern details for habit progress.

Designed for people who want a minimal routine tool without noisy streak pressure, ads, accounts, or social features.

The app includes in-app Terms and Privacy Policy screens. Habit and reflection content stays local; Premium purchase status is handled by Apple and Adapty.

Terms of Use (EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/

Subscription Terms: Payment is charged to your Apple ID at confirmation of purchase. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. You can manage or cancel your subscription in your App Store account settings.

## Promotional Text

A minimal, local-first habit system for personality, focus, and reflection.

## Subtitle

Personality-based habits

## Keywords

habits, routine, focus, reflection, MBTI, personality, productivity, journal, tracker, reminders

## What's New

Initial NOVEN release with onboarding, local habit tracking, reflections, reminders, pattern view, settings, and user-controlled prompt export.

## Support URL

Required before submission. Use a real public page, for example:

https://your-domain.example/noven/support

## Privacy Policy URL

Required before submission. Publish the privacy policy in this folder and use the public URL:

https://your-domain.example/noven/privacy

## Terms of Use (EULA)

Use Apple's standard EULA unless a custom EULA is added in App Store Connect:

https://www.apple.com/legal/internet-services/itunes/dev/stdeula/

## In-App Purchase Metadata

Submit both auto-renewable subscriptions with the new app version. Do not leave either product in a developer-action-needed or ready-to-submit state.

### Monthly Subscription

- Reference name: Noven Premium Monthly
- Product ID: `com.ahmedss7.noven.premium.monthly`
- Display name: Noven Premium Monthly
- Description: Monthly access to Noven Premium: create unlimited habits beyond the free two-habit limit, export a Markdown prompt from local habit history and reflections, and view advanced monthly pattern details.
- Duration: 1 month
- Review screenshot: use `screenshots/subscription-review/monthly-review-paywall-clean.png` or a fresh TestFlight screenshot showing the paywall with price, duration, benefits, Terms, Privacy, and Restore Purchases.

### Annual Subscription

- Reference name: Noven Premium Annual
- Product ID: `com.ahmedss7.noven.premium.annual`
- Display name: Noven Premium Annual
- Description: Annual access to Noven Premium: create unlimited habits beyond the free two-habit limit, export a Markdown prompt from local habit history and reflections, and view advanced monthly pattern details.
- Duration: 1 year
- Review screenshot: use a fresh TestFlight screenshot showing the annual option selected with price, duration, benefits, Terms, Privacy, and Restore Purchases.

## Review Contact

- First name: Ahmed
- Last name: Mansour
- Email: add a real support email
- Phone: add a reachable phone number with country code

## Demo Account

Not required. NOVEN has no account login in this build.

## Build Notes

Use the notes in `docs/app-store/app-review-notes.md`.
