import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

/** Fetch the current authenticated user's profile from /api/users/me */
export function useUserProfile() {
  return useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await api.get("/api/users/me");
      return res as unknown as User;
    },
    retry: false, // Don't retry on 401
  });
}
