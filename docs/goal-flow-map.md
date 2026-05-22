# NOVEN Goal Flow Map

This map tracks the local SQLite app flow. Every screen must have one job, one clear action, and a route out.

| Route | Purpose | Required UI | Primary action | Exit path | Status |
| --- | --- | --- | --- | --- | --- |
| `/` | Boot route after SQLite hydration. | Redirect only. | Auto-route from stored profile. | `/(tabs)` or `/onboarding/welcome`. | Pass |
| `/onboarding/welcome` | Introduce NOVEN. | Headline, subtitle, full-width art, continue button. | Continue. | `/onboarding/name`. | Pass |
| `/onboarding/name` | Capture local profile name. | Back button, title, helper, name input, full-width art, continue button. | Continue with valid name. | `/onboarding/mbti`. | Pass |
| `/onboarding/mbti` | Capture MBTI or unknown state. | Back button, title, helper, MBTI chips, skip option, continue button. | Continue after selection. | `/onboarding/focus`. | Pass |
| `/onboarding/focus` | Capture focus goal. | Back button, title, helper, focus chips, custom option, continue button. | Continue after selection. | `/onboarding/about`. | Pass |
| `/onboarding/custom-focus` | Capture custom focus goal. | Back button, title, helper, input, continue button. | Continue with valid text. | `/onboarding/about`. | Pass |
| `/onboarding/about` | Explain the system in one calm step. | Back button, short intro, feature points, continue button. | Continue. | `/onboarding/future`. | Pass |
| `/onboarding/future` | Confirm personalized system. | Back button, personalized headline, supporting line, art, CTA. | Let's Begin. | `/(tabs)`. | Pass |
| `/(tabs)` Home | Daily overview and next actions. | Smaller greeting, next incomplete habit, four-block today progress, quiet prompt export row, active habits, compact add-habit glyph when empty. | Open habit, prompt export, or add habit. | `/habits/[id]`, `/mbti-insights`, `/habits/create`, `/habits/discovery`. | Pass |
| `/(tabs)/habits` | Manage active habits from SQLite. | Header, create/discover actions when habits exist, active habit list, compact add-habit glyph when empty. | Create or open habit. | `/habits/create`, `/habits/discovery`, `/habits/[id]`. | Pass |
| `/(tabs)/patterns` | Show selectable habit rhythm from real start date. | Header, page-level Show all/Collapse, one GitHub-style contribution card per habit, legends, expandable month cards, compact stats. | Expand one habit, expand all, or switch tab. | Same screen, tabs/settings. | Pass |
| `/(tabs)/profile` | Show local profile and habit context. | Tappable local avatar, name, MBTI-derived traits, focus, habit completion fact. | Open avatar picker or settings. | `/profile/avatar` or `/settings`. | Pass |
| `/profile/avatar` | Pick a local monochrome profile avatar. | Back button, short intro, avatar grid, custom local avatar option. | Select avatar. | `/(tabs)/profile`. | Pass |
| `/habits/discovery` | Add recommended habits. | Back button, functional category chips, filtered recommendation rows. | Add habit or create custom. | `/habits/setup-complete` or `/habits/create`. | Pass |
| `/habits/create` | Create a local habit through a short journey. | Back button, compact step bar, one focused step at a time, animated transitions, save button on final step. | Continue through steps, then Save Habit. | `/habits/setup-complete`. | Pass |
| `/habits/setup-complete` | Confirm habit creation. | Confirmation copy, primary and secondary buttons. | Start Today or Add Another. | `/(tabs)/habits` or `/habits/create`. | Pass |
| `/habits/[id]` | View, complete, adjust, or delete one habit. | Back button, title, real streak/rate, log-based heatmap, reminder, weekly completions, complete, adjust, and delete actions. | Complete Today writes a habit log. | `/habits/[id]/reflection`, `/habits/[id]/adjust`, or `/(tabs)/habits`. | Pass |
| `/habits/[id]/reflection` | Save daily reflection. | Back button, reflection chips, notes, save button. | Save Reflection. | `/habits/[id]/milestone`. | Pass |
| `/habits/[id]/milestone` | Reinforce completion. | Streak from habit logs, view progress, continue. | View Progress. | `/(tabs)/patterns` or `/habits/[id]`. | Pass |
| `/habits/[id]/adjust` | Apply one habit adjustment. | Back button, selectable adjustment options, done button. | Done saves the selected change. | `/habits/[id]`. | Pass |
| `/mbti-insights` | Export local data as a markdown prompt for any LLM. | Back button, range chips, markdown extract from profile, habits, completions, and reflections, share/copy button. | Share / Copy Prompt. | Native share sheet, then same screen. | Pass |
| `/settings` | Manage core local app settings in one compact screen. | Back button, compact identity rows, real habit notification permission/schedule toggle, reminder entry, analytics range, local data/privacy summary, export prompt, reset action. | Toggle settings, edit profile fields, change analytics range, export prompt, or reset local data. | `/settings/name`, `/settings/mbti`, `/settings/focus`, `/(tabs)/habits`, `/mbti-insights`, iOS notification permission, or `/onboarding/welcome`. | Pass |
| `/settings/name` | Edit profile name without re-entering onboarding. | Back button, title, name input, save button. | Save Name. | `/settings`. | Pass |
| `/settings/mbti` | Edit MBTI type without re-entering onboarding. | Back button, title, MBTI chips, unknown option. | Select type or unknown. | `/settings`. | Pass |
| `/settings/focus` | Edit custom focus without re-entering onboarding. | Back button, title, focus input, save button. | Save Focus. | `/settings`. | Pass |
| `/settings/[id]` | Legacy settings detail route. | Redirect only. | Auto-return to settings. | `/settings`. | Pass |
| `/loading` | Minimal loading state. | Spinner and loading text. | Passive. | Caller-controlled. | Pass |
| `/errors/network` | Generic local retry screen. | Back button, error copy, retry action. | Try Again. | Previous screen. | Pass |

## Completion Criteria

- SQLite is the source for profile, habits, reflections, and preferences.
- The app starts from empty local data after reset; it does not seed demo habits, mock profile values, or default recommendations.
- Existing installs purge legacy demo habits named `Deep Work`, `Reflection`, and `Morning Reset` before hydration.
- `habit_logs` is the source for completion history, streaks, completion rate, heatmaps, best day, weekly progress, and milestone copy.
- Home uses today-specific habit completion for its four-block progress indicator.
- Patterns starts from the user's real first activity date within the selected analytics range; settings stores 30, 90, or 180 day range preference.
- Empty habit states use a compact icon-led add action instead of large explanatory cards.
- Profile avatar selection is local-only and stored on `user_profile.avatar_id`.
- Patterns renders a separate contribution card for each habit; Show all expands every card's monthly detail.
- Form screens avoid the keyboard and keep input text vertically centered.
- The onboarding flow does not include Apple, Google, Firebase, OpenRouter, or Apple Intelligence.
- The prompt screen exports local data as markdown and does not perform AI/network calls.
- Settings is a single compact focused page: profile edit routes, two notification toggles, reminder routing, privacy/data summary, prompt export, and local reset.
- Settings identity edits use dedicated settings screens and return to settings instead of continuing onboarding.
- Habit reminders use real `expo-notifications` local scheduling and cancel/resync when reminders are disabled or habits change. The system permission prompt is shown only after the user sees a clear local-reminder rationale.
- Habit detail can delete a habit and its reflections.
- Habit adjustment saves the selected change to SQLite.
- Habit discovery category chips filter real recommendations.
- Create habit saves title, category, reminder time, daily count, and reminder gap.
- Each route has a primary action or a clear passive purpose.
- No route is intentionally blocked by a missing provider, credential, or unavailable native AI module.

## Validation

- `bun run typecheck`: pass.
- `bunx expo export --platform ios --clear --output-dir /tmp/noven-export-check`: pass.
- Native iOS metadata: pass; `app.json` and `ios/Noven.xcodeproj/project.pbxproj` both use bundle ID `com.ahmedss7.noven`, `ios/Noven/Info.plist` parses cleanly, and the build is configured as an iPhone portrait app.
- `pod install` in `ios/`: pass; removed old Apple/Auth/native-AI pods and installed `ExpoSQLite`.
- Real-data pass: pass; removed fixed streak/rate/best-day/heatmap/progress values from app screens and replaced them with SQLite-backed habit logs.
- Mock-data cleanup: pass; removed seeded/default habits, default recommendations, and placeholder profile/focus fallbacks from runtime app code.
- Legacy-data cleanup: pass; startup migration deletes old demo habit rows and their logs/reflections from SQLite.
- Settings redesign: pass; reduced settings to compact native-style rows with only identity, reminders, local data/privacy, export, and reset.
- Settings edit routes: pass; name, MBTI, and focus save locally and return to Settings without onboarding continuation.
- Notifications pass: real Expo local notification permission, pre-permission rationale, daily habit reminder scheduling, cancelation, and habit-store resync are wired.
- Product design pass: pass; Home visual hierarchy reduced, prompt export row shortened, Create Habit split into a four-step journey, and Patterns gained selectable range analytics from real habit start dates.
- Interaction polish pass: pass; Add, next, select, and save actions use differentiated haptic feedback; Patterns details expand from the contribution card.
- Avatar pass: pass; added local monochrome avatar pack, profile picker route, and SQLite-backed avatar persistence.
