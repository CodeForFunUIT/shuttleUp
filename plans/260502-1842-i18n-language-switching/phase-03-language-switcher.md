# Phase 3: Language Switcher Component

## Context Links
- [Plan Overview](./plan.md)
- Depends on Phase 1 + 2

## Overview
- **Priority:** Medium
- **Status:** ⬜ Not started
- Create a globe icon dropdown that switches between EN 🇬🇧 and VI 🇻🇳
- Place next to ThemeToggle in Navbar

## Requirements
- Globe icon button that opens dropdown with 2 options
- Shows current locale with flag emoji
- On select: navigates to same page in new locale via `useRouter().replace()`
- Persists in `NEXT_LOCALE` cookie (handled by next-intl middleware automatically)
- Works on both desktop and mobile (Sheet sidebar)

## Implementation Steps

### Step 1: Create `LocaleSwitcher` component
```
src/components/locale-switcher.tsx
```

Pattern:
```tsx
"use client"
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, ... } from '@/components/ui/dropdown-menu'

const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
]

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  const current = LOCALES.find(l => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Switch language">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map(l => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => switchLocale(l.code)}
            className={locale === l.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{l.flag}</span>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Step 2: Add to Navbar (desktop)
In `Navbar.tsx`, place `<LocaleSwitcher />` next to `<ThemeToggle />`:
```tsx
<div className="hidden md:flex items-center gap-2 ml-auto">
  <LocaleSwitcher />
  <ThemeToggle />
  {/* ... user menu */}
</div>
```

### Step 3: Add to Navbar (mobile)
In mobile Sheet sidebar, add locale options:
```tsx
<div className="flex md:hidden items-center gap-2 ml-auto">
  <LocaleSwitcher />
  <ThemeToggle />
  {/* ... hamburger */}
</div>
```

### Step 4: Style polish
- Active locale gets checkmark or highlighted background
- Smooth dropdown animation (already from shadcn DropdownMenu)

## Todo List
- [ ] Create `src/components/locale-switcher.tsx`
- [ ] Add to Navbar desktop actions
- [ ] Add to Navbar mobile actions
- [ ] Test switching EN → VI → EN preserves current page
- [ ] Test that `NEXT_LOCALE` cookie is set after switch

## Success Criteria
- Globe icon visible in Navbar next to theme toggle
- Clicking switches locale and navigates to same page in new language
- Cookie persisted — refreshing page stays in chosen locale
- Works on mobile
