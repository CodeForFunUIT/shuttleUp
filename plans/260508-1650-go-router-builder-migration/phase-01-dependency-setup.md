# Phase 01 — Dependency & Codegen Setup

## Context Links
- Brainstormer report: `plans/reports/brainstormer-260507-1122-go-router-builder-migration.md`
- pubspec.yaml: `shuttleup-mobile/pubspec.yaml`
- pub.dev: https://pub.dev/packages/go_router_builder

## Overview
- **Priority:** High (blocker for Phase 2)
- **Status:** ⬜ todo
- **Scope:** Add `go_router_builder` dev dependency; verify build_runner works

## Requirements
- `go_router_builder ^2.7.1` compatible with `go_router ^17.2.1`
- `build_runner` already at `^2.13.1` ✅

## Related Code Files
| File | Action |
|------|--------|
| `shuttleup-mobile/pubspec.yaml` | Add `go_router_builder` to `dev_dependencies` |

## Implementation Steps

1. **Add `go_router_builder` to `pubspec.yaml`**

   In `dev_dependencies` block, after `injectable_generator`:
   ```yaml
   go_router_builder: ^2.7.1
   ```

2. **Fetch packages**
   ```bash
   cd shuttleup-mobile
   flutter pub get
   ```

3. **Verify compatibility**
   ```bash
   flutter pub deps | grep go_router
   ```
   Expected: `go_router 17.x.x`, `go_router_builder 2.x.x` both resolved.

## Todo
- [ ] Add `go_router_builder: ^2.7.1` to pubspec.yaml dev_dependencies
- [ ] Run `flutter pub get`
- [ ] Verify no version conflicts

## Success Criteria
- `flutter pub get` exits 0
- `go_router_builder` appears in `flutter pub deps`

## Risk
- Version conflict if `go_router_builder ^2.7.1` requires a different `go_router` version
- **Mitigation:** Both packages maintained by Flutter team; check https://pub.dev/packages/go_router_builder for `go_router` constraint
