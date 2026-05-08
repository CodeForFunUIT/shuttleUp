# ShuttleUp Mobile — Error Analysis Report

## Environment

- **Flutter**: 3.38.5 (stable) — Dart 3.10.4
- **Freezed**: ^3.2.5 | **freezed_annotation**: ^3.1.0
- **`flutter analyze`**: 8 issues — **3 errors, 5 info/warnings**

---

## ❌ ERRORS (3) — Must Fix, Code Won't Compile

### 1. `session_model.dart:7` — Stale Freezed Codegen

```
error - Missing concrete implementations of 'getter _$SessionModel.bookedPlayers',
'getter _$SessionModel.courtName', 'getter _$SessionModel.endTime',
'getter _$SessionModel.id', and 6 more
```

**Root Cause**: Freezed v3 generates `mixin _$SessionModel` with abstract getters (`id`, `title`, etc.). The `class SessionModel with _$SessionModel` declaration must implement them — but the generated `.freezed.dart` file is **stale/out-of-sync** with the current Freezed v3 mixin pattern.

**Fix**: Re-run `build_runner`:
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### 2. `session_event.dart:6` — Same Stale Codegen

```
error - Missing concrete implementation of 'getter _$SessionEvent.query'
```

**Root Cause**: Same as above — `session_event.freezed.dart` needs regeneration.

**Fix**: Same `build_runner` command resolves both.

### 3. `widget_test.dart:16` — Wrong Class Name

```
error - The name 'MyApp' isn't a class
```

**Root Cause**: `main.dart` exports `ShuttleUpApp` (not `MyApp`), but the default Flutter scaffold test still references `MyApp`.

**Fix**: Change `widget_test.dart` line 16:
```diff
- await tester.pumpWidget(const MyApp());
+ await tester.pumpWidget(const ShuttleUpApp());
```

---

## ⚠️ WARNINGS/INFO (5) — Won't Block Compilation

### 4. `core_module.dart:19` — Deprecated `printTime`

```
info - 'printTime' is deprecated. Use `dateTimeFormat` instead
```

**Fix**:
```diff
- printTime: false,
+ dateTimeFormat: DateTimeFormat.none,
```

### 5. `app_theme.dart:11` — Deprecated `background`

```
info - 'background' is deprecated. Use surface instead. (deprecated after v3.18)
```

**Fix**: Remove `background` parameter — already covered by `surface`:
```diff
  surface: Colors.white,
- background: const Color(0xFFF8FAFC),
```

### 6. `session_detail_page.dart:64` — Unnecessary `const`

```
info - Unnecessary 'const' keyword (line 64)
```

Already inside a `const` constructor context. Remove duplicate `const`:
```diff
- style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
+ style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
```

### 7–8. `session_detail_page.dart:131,133` — Deprecated `withOpacity`

```
info - 'withOpacity' is deprecated. Use .withValues() instead (×2)
```

**Fix**:
```diff
- color: color.withOpacity(0.1),
+ color: color.withValues(alpha: 0.1),
- border: Border.all(color: color.withOpacity(0.5)),
+ border: Border.all(color: color.withValues(alpha: 0.5)),
```

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Error | 3 | Must fix — app won't compile |
| 🟡 Info/Deprecated | 5 | Low priority — deprecation warnings |

### Recommended Fix Order

1. **Run `build_runner`** → fixes errors #1 and #2 (stale freezed codegen)
2. **Fix `widget_test.dart`** → fixes error #3 (`MyApp` → `ShuttleUpApp`)
3. **Fix deprecation warnings** → optional but clean

### One-Liner Fix

```bash
# Fix errors #1-2
flutter pub run build_runner build --delete-conflicting-outputs

# Then manually fix widget_test.dart (MyApp → ShuttleUpApp)
# Then fix deprecation warnings
```

All 3 errors are low-effort fixes. No architectural or logic issues detected.
