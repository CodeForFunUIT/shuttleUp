import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';

// Mock matchMedia because next-themes uses it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock next/navigation (useRouter + usePathname + redirect)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock auth client (useSession)
vi.mock('@/lib/auth-client', () => ({
  useSession: () => ({ data: null, isPending: false }),
}));

// Mock ThemeToggle (uses next-themes internally)
vi.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => <button>toggle</button>,
}));

// Mock LocaleSwitcher
vi.mock('@/components/layout/LocaleSwitcher', () => ({
  LocaleSwitcher: () => <button>lang</button>,
}));

// Mock @/i18n/navigation
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className}>{children}</a>
  ),
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    if (key === 'brandName') return 'ShuttleUp';
    return key;
  },
  useLocale: () => 'vi',
}));

describe('Navbar Component', () => {
  it('renders brand name ShuttleUp', () => {
    render(<Navbar />);
    expect(screen.getByText(/ShuttleUp/i)).toBeInTheDocument();
  });
});
