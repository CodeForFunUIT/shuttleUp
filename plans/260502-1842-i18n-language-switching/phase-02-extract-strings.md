# Phase 2: Extract Strings → JSON Messages

## Context Links
- [Plan Overview](./plan.md)
- [Phase 1: Setup](./phase-01-nextintl-setup.md)
- Depends on Phase 1 completion

## Overview
- **Priority:** High
- **Status:** ⬜ Not started
- Extract all hardcoded UI strings from 23 files into namespaced `en.json` / `vi.json`
- Replace strings with `t('key')` calls using `useTranslations` hook

## JSON Message Structure

```json
{
  "Common": { ... },
  "Navbar": { ... },
  "Footer": { ... },
  "HomePage": { "hero": {...}, "stats": {...}, "features": {...}, "cta": {...} },
  "LoginPage": { ... },
  "RegisterPage": { ... },
  "DashboardPage": { ... },
  "SessionsPage": { ... },
  "SessionDetailPage": { ... },
  "BookSessionPage": { ... },
  "CreateSessionPage": { ... },
  "ProfilePage": { ... },
  "Belo": { "hero": {...}, "simulator": {...}, "tiers": {...} },
  "CourtSelect": { ... },
  "Metadata": { "home": {...}, "login": {...}, ... }
}
```

## Files to Modify (grouped by priority)

### Group A: Layout + Navigation (shared across all pages)
| File | Namespace | Strings |
|---|---|---|
| `Navbar.tsx` | `Navbar` | Find Session, Dashboard, Profile, Sign Out, Login, ShuttleUp, Navigation menu |
| `Footer.tsx` | `Footer` | © ShuttleUp, Built for badminton community |

### Group B: Public Pages
| File | Namespace | Strings |
|---|---|---|
| `homepage-sections.tsx` | `HomePage` | Hero title, subtitle, CTA, stats labels, feature cards, gallery, CTA banner |
| `login/page.tsx` | `LoginPage` | Welcome back, Sign in to..., Email, Password, Sign In, Don't have account?, Sign up |
| `register/page.tsx` | `RegisterPage` | Create account, Full Name, Email, Password, Sign Up, Already have account? |
| `sessions/page.tsx` | `SessionsPage` | Find Sessions, Join upcoming..., Host a Session, Loading, error messages, No Sessions Yet, skill labels |
| `sessions/[id]/page.tsx` | `SessionDetailPage` | Session Details, Available Slots, Price, Hosted by, Book Now, etc. |
| `sessions/[id]/book/page.tsx` | `BookSessionPage` | Book Session, Confirm, Guest booking, etc. |

### Group C: Dashboard Pages (authenticated)
| File | Namespace | Strings |
|---|---|---|
| `dashboard/page.tsx` | `DashboardPage` | Host Dashboard, Manage your..., Create Session, Upcoming Sessions, Total Participants, Your Recent Sessions, etc. |
| `dashboard/layout.tsx` | `DashboardLayout` | Sidebar labels if any |
| `dashboard/sessions/new/page.tsx` | `CreateSessionPage` | Create New Session, Host a new..., Title, Court, Date, Time, Duration, etc. |
| `dashboard/sessions/[id]/page.tsx` | `ManageSessionPage` | Session management strings |
| `dashboard/belo/page.tsx` | `Belo` | BELo page strings |

### Group D: Belo Components
| File | Namespace | Strings |
|---|---|---|
| `belo-hero-section.tsx` | `Belo.hero` | BELo Rating System, subtitle, etc. |
| `belo-how-it-works.tsx` | `Belo.howItWorks` | How it works steps |
| `belo-simulator.tsx` | `Belo.simulator` | Simulate, Player A/B, etc. |
| `belo-public-simulator.tsx` | `Belo.simulator` | Public simulator strings |
| `belo-tier-table.tsx` | `Belo.tiers` | Tier names, ranges |
| `sim-singles-panel.tsx` | `Belo.simulator` | Singles panel labels |
| `sim-doubles-panel.tsx` | `Belo.simulator` | Doubles panel labels |
| `sim-result-display.tsx` | `Belo.simulator` | Result display strings |

### Group E: Shared Components
| File | Namespace | Strings |
|---|---|---|
| `court-select.tsx` | `CourtSelect` | Select a court, Search court name, No courts found |
| `profile/page.tsx` | `ProfilePage` | Profile, Edit, Save, etc. |

## Implementation Steps

### Step 1: Build complete `en.json`
Go through each file above, extract every user-visible string, assign namespace + key.

### Step 2: Translate to `vi.json`
Copy `en.json` structure, translate all values to Vietnamese.

### Step 3: Update components — Group A first
For each file:
1. Add `import { useTranslations } from 'next-intl'`
2. Add `const t = useTranslations('Namespace')` at top of component
3. Replace `"Hardcoded String"` → `{t('keyName')}`
4. For server components: use `import { getTranslations } from 'next-intl/server'`

### Step 4: Update components — Groups B through E
Same pattern, file by file.

### Step 5: Handle dynamic strings
- `SKILL_LABELS` map in `sessions/page.tsx` → move to messages: `t('skills.BEGINNER')` etc.
- Date formatting: use `useFormatter()` from `next-intl` for locale-aware dates
- Currency: `useFormatter().number(price, {style: 'currency', currency: 'VND'})`

### Step 6: Update metadata
For each page that exports `metadata`, switch to `generateMetadata`:
```ts
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'Metadata' });
  return { title: t('home.title'), description: t('home.description') };
}
```

### Step 7: Verify no hardcoded strings remain
```bash
# Quick grep for remaining English strings in TSX
grep -rn '"[A-Z][a-z]' src/app/ src/components/ --include="*.tsx" | grep -v "import\|className\|aria-\|data-\|href=\|src=\|alt=" | head -30
```

## Todo List
- [ ] Build complete `src/messages/en.json` with all namespaces
- [ ] Translate to `src/messages/vi.json`
- [ ] Update Navbar.tsx with `useTranslations('Navbar')`
- [ ] Update Footer.tsx with `useTranslations('Footer')`
- [ ] Update homepage-sections.tsx
- [ ] Update login/page.tsx
- [ ] Update register/page.tsx
- [ ] Update sessions/page.tsx + skill labels
- [ ] Update sessions/[id]/page.tsx
- [ ] Update sessions/[id]/book/page.tsx
- [ ] Update dashboard/page.tsx
- [ ] Update dashboard/sessions/new/page.tsx
- [ ] Update dashboard/sessions/[id]/page.tsx
- [ ] Update belo components (6 files)
- [ ] Update court-select.tsx
- [ ] Update profile/page.tsx
- [ ] Switch all metadata to `generateMetadata`
- [ ] Switch date/number formatting to `useFormatter()`
- [ ] Verify grep shows no remaining hardcoded strings
- [ ] Build passes

## Success Criteria
- `en.json` and `vi.json` contain all UI strings (~150-200 keys)
- Every user-visible string in TSX uses `t('key')` pattern
- All `metadata` exports use `generateMetadata` for locale-aware SEO
- Date/currency formatting uses locale from `next-intl`
- Build passes with 0 errors
