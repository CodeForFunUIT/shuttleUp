import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

/** Pending booking with user profile for manage panel */
export interface PendingBooking {
  id: string;
  sessionId: string;
  userId: string | null;
  guestName: string | null;
  guestPhone: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    eloScore: number;
    skillLevel: string;
  } | null;
}

/** Fetch pending-approval counts per session for dashboard dot */
export function usePendingCounts() {
  return useQuery<Record<string, number>>({
    queryKey: ["bookings", "pending-counts"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api.get("/api/bookings/pending/counts");
      return (res?.data ?? res) as Record<string, number>;
    },
    refetchInterval: 30_000,
  });
}

/** Fetch pending bookings for a specific session (with user profiles) */
export function usePendingBookings(sessionId: string | null) {
  return useQuery<PendingBooking[]>({
    queryKey: ["bookings", "pending", sessionId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api.get("/api/bookings/pending", {
        params: { sessionId },
      });
      return (res?.data ?? res) as PendingBooking[];
    },
    enabled: !!sessionId,
  });
}

/** Approve a booking request */
export function useApproveBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      api.patch(`/api/bookings/${bookingId}/approve`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["bookings"] });
      void qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** Reject a booking request */
export function useRejectBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      api.patch(`/api/bookings/${bookingId}/reject`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

/** Create a booking as authenticated user */
export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      api.post("/api/bookings", { sessionId }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["bookings"] });
      void qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** Create a booking as guest */
export function useCreateGuestBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionId: string; guestName: string; guestPhone: string }) =>
      api.post("/api/bookings/guest", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** Check if current user already has an active booking for a session */
export function useMyBookingStatus(sessionId: string, enabled: boolean) {
  return useQuery<{ hasActiveBooking: boolean; booking?: { id: string; status: string } }>({
    queryKey: ["bookings", "my-status", sessionId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await api.get("/api/bookings/my-status", {
        params: { sessionId },
      });
      return (res?.data ?? res) as { hasActiveBooking: boolean; booking?: { id: string; status: string } };
    },
    enabled,
  });
}
