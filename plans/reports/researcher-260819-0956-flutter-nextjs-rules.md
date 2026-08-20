# Research Report: Flutter & Next.js Engineering Standards & Rules

> **Date:** 2026-08-19 | **Type:** researcher | **Project:** ShuttleUp Monorepo

## Executive Summary

This research establishes standard engineering rules, linting configurations, and architectural constraints for **Flutter (v3.38+ / Dart 3.10+)** and **Next.js (v16+ / React 19)** within the ShuttleUp monorepo. It focuses on type safety, modular architecture, performance, strict static analysis, and developer productivity while maintaining file size under 200 lines and zero runtime ambiguities.

## Key Findings & Core Rules

### 1. Flutter & Dart Standards (Mobile)

* **Architecture**: Feature-first (`lib/features/<feature>/[data|presentation]`) + BLoC Pattern + GetIt/Injectable.
* **Analyzer Strictness (`analysis_options.yaml`)**:
  * Enable strict type checking: `strict-casts: true`, `strict-inference: true`, `strict-raw-types: true`.
  * Elevate critical checks to errors: `use_build_context_synchronously`, `missing_required_argument`, `invalid_null_aware_operator`.
* **Linter Rules**:
  * Enforce `prefer_const_constructors`, `prefer_const_literals_to_create_immutables`, `sized_box_for_whitespace`.
  * Enforce `avoid_dynamic_calls`, `unawaited_futures`, `cancel_subscriptions`, `always_declare_return_types`, `prefer_final_locals`.
* **State & Data**:
  * **Freezed v3**: Must declare `sealed class Model with _$Model` (never plain `class`).
  * **Code Generation**: Run `dart run build_runner build --delete-conflicting-outputs` after editing any `@freezed` / `@injectable` file.
  * **Zero Manual DI**: All services, repositories, and BLoCs must use `@injectable` / `@singleton` annotations. No direct `new Service()` in UI.
  * **Async Context**: Always guard `if (!context.mounted) return;` across async gaps.

### 2. Next.js 16 & React 19 Standards (Web)

* **Architecture**: App Router (`src/app/`), atomic feature separation (`src/components/[ui|features|layouts]`), `src/lib/api/`.
* **Server-First Default (RSC)**:
  * Default to React Server Components for layouts, pages, and data-fetching boundaries.
  * Use `"use client"` strictly at leaf interactive boundaries (forms, client state widgets, interactive maps).
* **Data Fetching & State**:
  * Next.js 15/16 is uncached by default. Explicitly set cache policies or use TanStack Query for dynamic client fetching.
  * Mutate via React 19 Server Actions or typed REST endpoints with Zod schema validation.
  * Client UI state managed via Zustand; server state cached via TanStack Query / RSC.
* **Component & Styling Rules**:
  * Tailwind CSS v4 CSS variable design tokens (`@import "tailwindcss";`), unified with shadcn/ui.
  * Dynamic import with `ssr: false` for browser-only dependencies (e.g., Leaflet map).
* **ESLint & TypeScript Strictness**:
  * Modern Flat Config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and TypeScript strict rules.
  * Zero `any` policy (use `unknown` + type narrowing or Zod parsing).
  * No raw `<img>` tags (`@next/next/no-img-element: error`) — enforce `next/image`.

## Implementation Strategy for ShuttleUp

1. **`shuttleup-mobile/analysis_options.yaml`**: Update with strict analyzer flags and comprehensive lint rules.
2. **`shuttleup-mobile/AGENTS.md`**: Solidify BLoC, Freezed v3, GetIt, and async context rules.
3. **`shuttleup-web/AGENTS.md`**: Expand into full Next.js 16 + React 19 + Tailwind v4 + shadcn/ui rulebook.
4. **`shuttleup-web/eslint.config.mjs`**: Configure strict Next.js and TypeScript rules.
5. **`docs/code-standards.md`**: Enrich both Mobile and Web guidelines with practical patterns and anti-patterns.

## Unresolved Questions

- None. Both frameworks match the active project dependencies and specifications.
