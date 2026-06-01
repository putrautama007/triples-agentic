---
name: dangerous-commands-safety
description: Safety guardrails — never run dangerous commands without explicit user confirmation
platform: all
---

## Safety Guardrails

Never run these commands without explicit user confirmation:

- **Filesystem**: `rm -rf`, `rm -fr`, any recursive force delete
- **Git destructive**: `git reset --hard`, `git checkout --`, `git restore .`
- **Git push force**: `git push --force`, `git push -f`
- **SQL destructive**: `DROP TABLE`, `DROP DATABASE`, `DELETE FROM <table>;`
- **Store publish**: `fastlane deliver`, `fastlane supply`, `gradlew publishBundle`, `xcrun altool`
- **Package publish**: `npm publish`, `npx ... publish`

Stop and ask the user for explicit confirmation before running any of the above.
