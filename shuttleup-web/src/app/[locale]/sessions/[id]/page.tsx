"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, ShieldAlert, CheckCircle2, Star, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useSession } from "@/lib/hooks/use-sessions";
import { useSession as useAuthSession } from "@/lib/auth-client";
import { useCreateBooking, useMyBookingStatus } from "@/lib/hooks/use-bookings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Map raw skill enum → readable label */
const SKILL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  PRO: "Pro",
  ALL: "All Levels",
};

/** Map skill → badge CSS utility */
const SKILL_CLASS: Record<string, string> = {
  BEGINNER: "skill-beginner",
  INTERMEDIATE: "skill-intermediate",
  ADVANCED: "skill-advanced",
  PRO: "skill-pro",
  ALL: "skill-all",
};

/** Locale-aware date formatter */
const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/** Locale-aware time formatter */
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Locale-aware currency formatter */
const priceFmt = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

/** Avatar with initials */
function HostAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, isLoading, error } = useSession(id);

  /* Loading */
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="ml-3 text-muted-foreground">Loading session…</span>
      </div>
    );
  }

  /* Error */
  if (error || !session) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center" role="alert" aria-live="polite">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
        </div>
        <h1 className="font-display text-xl font-semibold mb-2">Session Not Found</h1>
        <p className="text-muted-foreground text-sm mb-6">
          This session may have been removed or doesn&apos;t exist.
        </p>
        <Link href="/sessions">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Sessions
          </Button>
        </Link>
      </div>
    );
  }

  const isFull = session.availableSlots <= 0;
  const skillLabel = SKILL_LABELS[session.skillRequired] ?? session.skillRequired;
  const skillClass = SKILL_CLASS[session.skillRequired] ?? "skill-all";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/sessions" className="text-sm text-primary hover:underline mb-6 inline-flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to All Sessions
      </Link>

      <div className="grid md:grid-cols-3 gap-8 mt-2">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl font-bold" style={{ textWrap: "balance" }}>
                {session.title}
              </h1>
              <Badge
                variant={isFull ? "destructive" : "secondary"}
                className={cn(!isFull && "bg-primary/10 text-primary border-primary/20")}
              >
                {session.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {session.court?.name ?? "Unknown Court"} – {session.court?.address ?? ""}
            </p>
          </div>

          {/* Details card */}
          <Card>
            <CardContent className="p-6 grid grid-cols-2 gap-6">
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="font-medium">{dateFmt.format(new Date(session.startTime))}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {timeFmt.format(new Date(session.startTime))} – {timeFmt.format(new Date(session.endTime))}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldAlert className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skill Level</p>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", skillClass)}>
                    {skillLabel}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Availability</p>
                  <p className="font-medium tabular-nums">
                    {session.availableSlots} / {session.totalSlots} slots open
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {session.description && (
            <div>
              <h2 className="font-display text-xl font-bold mb-3">About This Session</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {session.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price + CTA */}
          <Card className="border-primary/20">
            <CardHeader className="bg-secondary rounded-t-xl border-b pb-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Fee per Slot</span>
                <span className="font-display text-2xl font-bold text-primary tabular-nums">
                  {priceFmt.format(session.pricePerSlot)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <BookingCTA sessionId={session.id} hostId={session.hostId} isFull={isFull} />
            </CardContent>
          </Card>

          {/* Host card */}
          {session.host && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Hosted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <HostAvatar name={session.host.name ?? "Host"} />
                  <div className="min-w-0">
                    <p className="font-bold truncate">{session.host.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 text-orange-400" aria-hidden="true" />
                      ELO: <span className="tabular-nums">{session.host.eloScore}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/** Auth-aware booking CTA */
function BookingCTA({ sessionId, hostId, isFull }: { sessionId: string; hostId: string; isFull: boolean }) {
  const { data: authSession, isPending: authLoading } = useAuthSession();
  const isLoggedIn = !!authSession?.user;
  const isHost = authSession?.user?.id === hostId;

  const { data: bookingStatus } = useMyBookingStatus(sessionId, isLoggedIn && !isHost);
  const createBooking = useCreateBooking();

  const hasActiveBooking = bookingStatus?.hasActiveBooking ?? false;

  const handleBookAsUser = async () => {
    try {
      await createBooking.mutateAsync(sessionId);
      toast.success("Request Sent!", { description: "The host will review your request." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Booking failed";
      toast.error("Booking failed", { description: message });
    }
  };

  if (authLoading) {
    return (
      <Button className="w-full h-12 text-lg font-semibold" disabled>
        <Loader2 className="h-5 w-5 animate-spin mr-2" aria-hidden="true" />
        Loading…
      </Button>
    );
  }

  // Host sees their own session label
  if (isHost) {
    return (
      <>
        <Button className="w-full h-12 text-lg font-semibold" variant="secondary" disabled>
          Your Session
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          You are the host of this session.
        </p>
      </>
    );
  }

  if (isFull) {
    return (
      <Button className="w-full h-12 text-lg font-semibold" variant="destructive" disabled>
        Session Full
      </Button>
    );
  }

  // Already booked
  if (hasActiveBooking) {
    return (
      <>
        <Button className="w-full h-12 text-lg font-semibold bg-primary text-primary-foreground" disabled>
          <CheckCircle2 className="h-5 w-5 mr-2" aria-hidden="true" />
          Request Pending
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          Your request is awaiting host approval.
        </p>
      </>
    );
  }

  // Logged-in user — book directly
  if (isLoggedIn) {
    return (
      <>
        <Button
          className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-semibold"
          onClick={handleBookAsUser}
          disabled={createBooking.isPending}
        >
          {createBooking.isPending ? (
            <><Loader2 className="h-5 w-5 animate-spin mr-2" aria-hidden="true" />Sending…</>
          ) : (
            "Request to Join"
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          Host will review your request.
        </p>
      </>
    );
  }

  // Guest — go to guest booking form
  return (
    <>
      <Link href={`/sessions/${sessionId}/book`}>
        <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-semibold">
          Request to Join
        </Button>
      </Link>
      <p className="text-xs text-center text-muted-foreground mt-3">
        You&apos;ll need to provide contact details as a guest.
      </p>
    </>
  );
}
