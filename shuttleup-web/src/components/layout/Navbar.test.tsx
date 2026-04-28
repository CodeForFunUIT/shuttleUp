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

// Mock next/navigation (useRouter + usePathname)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
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

describe('Navbar Component', () => {
  it('renders brand name ShuttleUp', () => {
    render(<Navbar />);
    expect(screen.getByText(/ShuttleUp/i)).toBeInTheDocument();
  });
});
