# Normalize AI Project Setup for `shuttleup-mobile`

## Problem Statement

The `shuttleup-mobile` subproject has no AI-facing documentation, rules, or project conventions. This means every AI session starts cold — no context about architecture, conventions, forbidden patterns, or codebase state. The monorepo root already has mature docs (`./docs/`, `.agent/`) but the mobile subproject has zero of its own.

## Current State

### What monorepo root has (good reference):
- `.agent/instructions.md` — Agent context & commands
- `.agent/development-rules.md` — YAGNI/KISS/DRY + coding rules
- `docs/code-standards.md` — Full conventions (409 lines, includes Flutter section)
- `docs/system-architecture.md` — Topology, DB schema, auth flow
- `docs/codebase-summary.md` — File stats & tech stack
- `docs/project-roadmap.md` — Milestones & progress
- `docs/design-guidelines.md` — UI/UX standards
- `docs/deployment-guide.md` — Dev environment setup

### What `shuttleup-mobile` has:
- `README.md` — Default Flutter readme (575 bytes, generic)
- `analysis_options.yaml` — Basic lint rules
- `pubspec.yaml` — Dependencies listed
- **Nothing else** — no docs, no rules, no agent context

## Recommended Setup

### Approach: Lightweight Sub-Project Docs

Don't duplicate monorepo-level docs. Instead, create **mobile-specific** files that reference root docs and add Flutter/Dart-specific rules.

### File Structure to Create

```
shuttleup-mobile/
├── docs/
│   ├── architecture.md          # Mobile-specific architecture (BLoC, DI, layers)
│   ├── code-standards.md        # Flutter/Dart conventions, Freezed patterns
│   └── codebase-summary.md      # Current file stats, features, state
├── AGENTS.md                    # For AI agents (Antigravity, Cursor, etc.)
└── README.md                    # Update existing — dev setup, commands
```

### Content for Each File

#### 1. `AGENTS.md` (AI agent instructions)
- Project context: Flutter 3.38.5, Dart 3.10.4
- Tech stack: BLoC + GetIt + Dio + Freezed + GoRouter
- Key commands: `flutter analyze`, `flutter test`, `build_runner`
- Architecture pattern: Feature-first, BLoC pattern
- Link to monorepo root docs for shared conventions
- Forbidden patterns: no `setState()` for state management, no raw HTTP
- **Critical**: Freezed v3 requires `sealed class` — document this gotcha

#### 2. `docs/architecture.md`
- Layer diagram: Presentation → BLoC → Repository → DataSource → API
- Feature module structure template
- DI registration pattern (Injectable + GetIt)
- Navigation pattern (GoRouter)
- Error handling strategy

#### 3. `docs/code-standards.md`
- Dart naming conventions (snake_case files, PascalCase classes)
- BLoC conventions (Event naming, State patterns)
- Freezed model patterns (sealed class, fromJson)
- Widget composition rules
- Import ordering
- Testing patterns

#### 4. `docs/codebase-summary.md`
- Current features list and status
- File tree with descriptions
- Dependency inventory
- Known issues and tech debt

#### 5. `README.md` (update existing)
- Prerequisites (Flutter SDK version, Android Studio/Xcode)
- Getting started steps
- Environment config
- Available commands
- Project structure overview

## Implementation Considerations

| Concern | Decision |
|---------|----------|
| Duplication with root docs? | Reference root, don't copy. Mobile docs = Flutter-specific only |
| File size? | Each file ≤100 lines. Concise, scannable |
| Maintenance? | Update after each feature milestone |
| `.cursorrules` / `.windsurfrules`? | Skip — `AGENTS.md` is universal and agent-agnostic |

## Success Criteria

- [ ] AI agent can start implementing Flutter features without asking "what patterns do you use?"
- [ ] Freezed v3 `sealed class` gotcha is documented
- [ ] BLoC + DI pattern is clear from docs alone
- [ ] `flutter analyze` and `flutter test` pass with zero issues
- [ ] README has working dev setup instructions

## Next Steps

1. Create files in order: `AGENTS.md` → `docs/architecture.md` → `docs/code-standards.md` → `docs/codebase-summary.md` → update `README.md`
2. Each file should be reviewed before moving to the next
3. After all docs created, run `/plan` to create implementation plan for next mobile feature

Want to proceed with creating these files?
