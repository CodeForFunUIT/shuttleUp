import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Court } from "@/lib/types";

/** Fetch all courts — cached for 5 minutes since courts rarely change */
export function useCourts() {
  return useQuery<Court[]>({
    queryKey: ["courts"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api.get("/api/courts");
      return (res?.data ?? res) as Court[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
