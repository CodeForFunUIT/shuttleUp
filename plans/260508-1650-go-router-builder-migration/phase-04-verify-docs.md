# Phase 04 — Verify & Update Docs

## Context Links
- Docs: `shuttleup-mobile/docs/code-standards.md`
- Docs: `shuttleup-mobile/docs/architecture.md`

## Overview
- **Priority:** Low
- **Status:** ⬜ todo
- **Scope:** Final analysis pass + update routing docs to reflect new pattern

## Implementation Steps

1. **Final analysis check**
   ```bash
   cd shuttleup-mobile
   flutter analyze
   ```
   Fix any remaining issues.

2. **Search for stale casts** — ensure none remain:
   ```bash
   grep -r "state.extra as" lib/
   grep -r "context.push('/" lib/
   grep -r "context.go('/" lib/
   ```
   All should return empty.

3. **Update `docs/code-standards.md`** — add routing section:
   ```markdown
   ## Routing
   - Use `go_router_builder` generated route classes (not string literals)
   - Navigation: `XxxRoute(...).push(context)` or `XxxRoute(...).go(context)`
   - Route definitions in `lib/app/routes.dart` with `@TypedGoRoute` annotations
   - Generated file `lib/app/routes.g.dart` — do NOT edit manually
   - After adding/changing routes, run: `dart run build_runner build --delete-conflicting-outputs`
   ```

4. **Update `docs/architecture.md`** — update routing diagram/section to reference generated routes

## Todo
- [ ] Run `flutter analyze` — zero errors
- [ ] Verify no string-based nav calls remain (`grep` checks)
- [ ] Update `docs/code-standards.md` with routing guidelines
- [ ] Update `docs/architecture.md` routing section

## Success Criteria
- All 4 success criteria in `plan.md` green
- Docs reflect new routing pattern
- Future devs know to run build_runner after route changes
