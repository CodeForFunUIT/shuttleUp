import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'vi'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Only prefix the URL for non-default locales (e.g. /vi/sessions, but /sessions for en)
  localePrefix: 'as-needed'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];
