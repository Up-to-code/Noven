# NOVEN Screen Goals And Audit

## Audit Method

Xcode MCP is not available in this Codex session, so this audit uses the Expo Router route tree, live Metro logs, TypeScript, and iOS export validation. Expo Go remains the runtime target.

## Screen Goal Map

| Screen | Purpose | Required UI | Primary Action | Exit Path | Status |
| --- | --- | --- | --- | --- | --- |
| `/onboarding/welcome` | Introduce NOVEN and begin onboarding | Headline, subtitle, full-opacity hero art | Continue | `/onboarding/name` | Pass |
| `/onboarding/name` | Capture user's name | Back, title, helper, input | Continue | `/onboarding/mbti` | Pass |
| `/onboarding/mbti` | Capture MBTI or unknown state | Back, type chips, secondary option | Continue | `/onboarding/focus` | Pass |
| `/onboarding/focus` | Capture current focus goal | Back, focus chips | Continue | `/onboarding/about` | Pass |
| `/onboarding/about` | Explain system value | Back, three calm feature rows | Continue | `/onboarding/future` | Pass |
| `/onboarding/future` | Close onboarding story | Back, hero art, promise | Let's Begin | `/(tabs)` | Pass |
| `/(tabs)/index` | Daily home summary | Greeting, focus statement, focus card, habit rows | Habit row | `/habits/[id]` | Pass |
| `/(tabs)/habits` | Manage habits | Header, create/discover, active list or empty state | Create / Discover / Habit row | Habit flow routes | Pass |
| `/(tabs)/patterns` | Show progress patterns | Consistency, native chart, stat blocks | Tab navigation | Other tabs | Pass |
| `/(tabs)/profile` | Show profile system | Name, MBTI, personality chips, focus | Settings icon | `/settings` | Pass |
| `/habits/discovery` | Add recommended habit | Categories, recommendations | Add Habit | `/habits/setup-complete` | Pass |
| `/habits/create` | Create custom habit | Inputs, category chips | Save Habit | `/habits/setup-complete` | Pass |
| `/habits/setup-complete` | Confirm habit creation | Confirmation, ambient art | Start Today | `/(tabs)/habits` | Pass |
| `/habits/[id]` | View and complete habit | Detail, stats, reminder, progress | Complete Today | `/habits/[id]/reflection` | Pass |
| `/habits/[id]/reflection` | Capture daily reflection | Option chips, notes | Save Reflection | `/habits/[id]/milestone` | Pass |
| `/habits/[id]/adjust` | Offer habit adjustments | Suggestion rows | Done | `/habits/[id]` | Pass |
| `/habits/[id]/milestone` | Celebrate streak | Message, streak stat | View Progress / Continue | Patterns or habit detail | Pass |
| `/settings` | App preferences | Preference rows, logout row | Back / row press | Previous screen | Pass |
| `/loading` | Loading state | Spinner, status copy | Automatic/system | N/A | Pass |
| `/errors/network` | Local recovery | Error title/copy | Try Again | Previous screen | Pass |

## Findings

- Xcode MCP inspection is blocked because no Xcode MCP tool is available in this environment.
- Public MCP candidates exist, including `r-huijts/xcode-mcp-server`, `obj-p/xcode-mcp`, and iOS simulator MCP servers, but adding one requires Codex MCP configuration and a session restart before tools become callable.
- Previous runtime crashes came from `moti`, `victory-native`, and Reanimated-dependent chart code in Expo Go. These were replaced with native-safe components.
- Error screens render and include CTAs with concrete retry navigation.
- Screen density was highest in Home, Patterns, Profile, Settings, and habit flows. These now use grouped lists, native bar chart, calm cards, and a single primary action per decision screen.
- Spacing now uses an 8pt-derived scale: 4, 8, 16, 24, 32, and 56.
- Welcome was simplified per UX review: no logo block, no account secondary link, full-opacity illustration, tighter vertical rhythm, and a single Continue action.
