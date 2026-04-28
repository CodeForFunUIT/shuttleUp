import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CourtSession } from "@/lib/types";

/** Fetch all public sessions */
export function useSessions() {
  return useQuery<CourtSession[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api.get("/api/sessions");
      return (res?.data ?? res) as CourtSession[];
    },
  });
}

/** Fetch a single session by ID */
export function useSession(id: string) {
  return useQuery<CourtSession>({
    queryKey: ["sessions", id],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api.get(`/api/sessions/${id}`);
      return (res?.data ?? res) as CourtSession;
    },
    enabled: !!id,
  });
}
