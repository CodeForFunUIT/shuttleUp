import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CreateSessionPayload {
  courtId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  pricePerSlot: number;
  skillRequired?: string;
  gameType?: string;
}

/** Mutation hook: POST /api/sessions — invalidates sessions cache on success */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSessionPayload) =>
      api.post("/api/sessions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
