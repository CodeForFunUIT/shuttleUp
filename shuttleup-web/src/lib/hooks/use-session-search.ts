import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CourtSession } from "@/lib/types";

/** Filter parameters for the sessions search API */
export interface SessionSearchFilters {
  title?: string;
  district?: string;
  skillRequired?: string;
  lat?: number;
  lng?: number;
  radiusMm?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
}

/** Paginated response from GET /api/sessions/search */
export interface PaginatedSessions {
  data: CourtSession[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Fetch sessions via the search API with filters + pagination.
 * Uses keepPreviousData so the UI doesn't flash empty between pages.
 */
export function useSessionSearch(filters: SessionSearchFilters = {}) {
  const params = new URLSearchParams();

  if (filters.title) params.set("title", filters.title);
  if (filters.district) params.set("district", filters.district);
  if (filters.skillRequired) params.set("skillRequired", filters.skillRequired);
  if (filters.lat != null) params.set("lat", String(filters.lat));
  if (filters.lng != null) params.set("lng", String(filters.lng));
  if (filters.radiusMm != null) params.set("radiusMm", String(filters.radiusMm));
  if (filters.priceMax != null) params.set("priceMax", String(filters.priceMax));
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 12));

  const queryString = params.toString();

  return useQuery<PaginatedSessions>({
    queryKey: ["sessions", "search", queryString],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api.get(`/api/sessions/search?${queryString}`);
      return (res?.data ?? res) as PaginatedSessions;
    },
    placeholderData: keepPreviousData,
  });
}
