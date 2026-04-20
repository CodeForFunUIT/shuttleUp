import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';

// Mock matchMedia because next-themes uses it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock next/link
vi.mock('next/link', () => {
    return {
        default: ({ children }: any) => {
            return <a>{children}</a>;
        }
    }
});

describe('Navbar Component', () => {
  it('renders brand name ShuttleUp', () => {
    render(<Navbar />);
    expect(screen.getByText(/ShuttleUp/i)).toBeInTheDocument();
  });
});
