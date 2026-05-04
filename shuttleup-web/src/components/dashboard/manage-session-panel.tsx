"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Star, UserCircle } from "lucide-react";
import {
  usePendingBookings,
  useApproveBooking,
  useRejectBooking,
} from "@/lib/hooks/use-bookings";
import type { PendingBooking } from "@/lib/hooks/use-bookings";
import { toast } from "sonner";

interface ManageSessionPanelProps {
  sessionId: string | null;
  sessionTitle: string;
  open: boolean;
  onClose: () => void;
}

/** Initials avatar */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
      {initials}
    </div>
  );
}

/** Single pending booking row */
function PendingRow({ booking }: { booking: PendingBooking }) {
  const approve = useApproveBooking();
  const reject = useRejectBooking();
  const isGuest = !booking.user;
  const name = booking.user?.name ?? booking.guestName ?? "Unknown";
  const busy = approve.isPending || reject.isPending;

  const handleApprove = () => {
    approve.mutate(booking.id, {
      onSuccess: () => toast.success(`Approved ${name}`),
      onError: () => toast.error("Failed to approve"),
    });
  };

  const handleReject = () => {
    reject.mutate(booking.id, {
      onSuccess: () => toast.info(`Rejected ${name}`),
      onError: () => toast.error("Failed to reject"),
    });
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0">
      {isGuest ? (
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
          <UserCircle className="h-5 w-5 text-muted-foreground" />
        </div>
      ) : (
        <Avatar name={name} />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{name}</p>
          {isGuest && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Guest
            </Badge>
          )}
        </div>
        {booking.user && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Star className="h-3 w-3 text-orange-400" />
            ELO: {booking.user.eloScore} · {booking.user.skillLevel}
          </p>
        )}
        {isGuest && booking.guestPhone && (
          <p className="text-xs text-muted-foreground">
            {booking.guestPhone}
          </p>
        )}
      </div>

      <div className="flex gap-1.5 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
          onClick={handleApprove}
          disabled={busy}
          title="Accept"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 text-destructive border-destructive/20 hover:bg-destructive/5"
          onClick={handleReject}
          disabled={busy}
          title="Reject"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ManageSessionPanel({
  sessionId,
  sessionTitle,
  open,
  onClose,
}: ManageSessionPanelProps) {
  const { data: pending, isLoading } = usePendingBookings(
    open ? sessionId : null,
  );

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">Manage: {sessionTitle}</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Pending Requests ({pending?.length ?? 0})
          </h3>

          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && (!pending || pending.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No pending requests
            </p>
          )}

          {pending?.map((b) => <PendingRow key={b.id} booking={b} />)}
        </div>
      </SheetContent>
    </Sheet>
  );
}
