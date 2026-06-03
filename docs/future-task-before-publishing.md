# Future Task Before Publishing Next Binary

## Declare Native iOS Supported Languages

Status: future task, do not block the currently approved release.

Reason:
- App Store metadata localizations and localized keywords are already enough for localized App Store product pages and search indexing.
- The App Store "Languages" row comes from the app binary's native localization declarations.
- The current binary only reports English because native iOS localizations are not declared.

Task:
Add native iOS language declarations before the next binary submission so the App Store "Languages" row can show the supported app languages.

Recommended Expo config:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "CFBundleLocalizations": [
          "en",
          "fi",
          "it",
          "ja",
          "pt-BR",
          "pt-PT"
        ]
      }
    }
  }
}
```

After adding this:
1. Create a new iOS build.
2. Submit the new binary to App Store Connect.
3. Verify the App Store product page details show the expected languages after approval.

Do not do this for the currently approved version unless a new binary is already required for another reason.
