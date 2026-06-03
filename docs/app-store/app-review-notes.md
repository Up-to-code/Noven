# NOVEN App Review Notes

Paste this into App Review Notes.

## Overview

Noven is a local-first iOS habit and reflection app. It does not require an account, external AI service, or network connection for the core habit experience. Noven Premium is an optional auto-renewable subscription for unlimited habit creation beyond the free two-habit limit, prompt export, and advanced monthly pattern details.

## How to Test

1. Launch the app.
2. On the welcome screen, the app shows Terms and Privacy Policy links under the Continue button.
3. Complete onboarding:
   - Enter a name.
   - Select an MBTI type, or choose the unknown option if visible.
   - Select or enter a focus.
4. Open the main tabs:
   - Home: shows the current focus, habit list, and navigation.
   - Habits: create and manage local habits.
   - Patterns: shows local habit history.
   - Profile: shows the local profile and habit context.
5. Create a habit:
   - Add a habit name.
   - Choose reminder time if desired.
   - Save the habit.
6. Complete a habit and add a reflection.
7. Open Settings:
   - Edit name, MBTI, and focus.
   - Enable habit reminders. The app shows a pre-permission explanation before requesting iOS notification permission.
   - Open Privacy Policy and Terms from the App Info section.
   - Open the Premium screen from Settings.
   - Export a Markdown prompt using the native iOS share sheet after Premium is active.
   - Reset local data if needed.

## Notifications

Noven only uses local notifications for habit reminders chosen by the user.

- Notifications are off by default.
- The app displays an in-app explanation before asking for iOS notification permission.
- Scheduled reminders are based on the habit reminder times the user sets.
- Users can disable reminders from Settings.
- No promotional or marketing notifications are sent.

## Data Handling

Noven stores app data locally on the device using SQLite.

Stored local data may include:

- Name
- MBTI type
- Focus selection
- Habits
- Habit completion logs
- Reflections
- Notification preferences

This build does not send habit, reflection, MBTI, focus, or reminder content to a Noven server, advertising service, or third-party AI provider.

Noven uses Adapty and Apple's purchase system only for subscription product loading, purchase processing, restore purchases, and Premium entitlement status.

The export prompt screen creates Markdown from local app data and uses the native iOS share sheet only when the user taps the export action.

The in-app Privacy Policy and Terms screens are available from the welcome screen and Settings.

## Login

No login is required.

## Purchases

Noven includes optional auto-renewable subscriptions:

- Monthly: `com.ahmedss7.noven.premium.monthly`
- Annual: `com.ahmedss7.noven.premium.annual`

Premium unlocks unlimited habit creation beyond the free two-habit limit, prompt export, and advanced monthly pattern details. Core habit creation remains usable without Premium. Restore Purchases is available on the Premium screen.

Required subscription metadata is present in the app and App Store Connect:

- Monthly and Annual subscription titles
- Subscription duration and localized price loaded from Apple
- Clear Premium benefits
- Functional Terms and Privacy links on the Premium screen
- Privacy Policy URL in App Store Connect
- Apple standard EULA link in the App Description

The Monthly and Annual in-app purchase products are submitted for review with this app version and include App Review screenshots.

## Network

The core app flow is local and should work without network access.

## Privacy Policy

The privacy policy for this build is included in `docs/app-store/privacy-policy.md` and should be published at the URL entered in App Store Connect before submission.
