"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Calendar as CalendarIcon, Users, Bell, Loader2, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useSessions } from "@/lib/hooks/use-sessions";
import { useSession } from "@/lib/auth-client";
import { usePendingCounts } from "@/lib/hooks/use-bookings";
import { ManageSessionPanel } from "@/components/dashboard/manage-session-panel";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: sessions, isLoading, error } = useSessions();
  const { data: pendingCounts } = usePendingCounts();

  // Manage panel state
  const [manageSession, setManageSession] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Filter sessions hosted by current user
  const mySessions = sessions?.filter(s => s.hostId === session?.user?.id) ?? [];
  const upcomingSessions = mySessions.filter(s => new Date(s.startTime) > new Date());
  const totalParticipants = mySessions.reduce(
    (sum, s) => sum + (s.totalSlots - s.availableSlots), 0
  );
  const totalPending = pendingCounts
    ? Object.values(pendingCounts).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your badminton sessions and bookings</p>
        </div>
        <Link href="/dashboard/sessions/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Session
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{upcomingSessions.length}</div>
                <p className="text-xs text-muted-foreground">
                  {upcomingSessions.length > 0
                    ? `Next: ${format(new Date(upcomingSessions[0].startTime), "dd MMM, HH:mm")}`
                    : "No upcoming sessions"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalParticipants}</div>
                <p className="text-xs text-muted-foreground">Across {mySessions.length} sessions</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">Failed to load sessions. Is the API running?</p>
        </div>
      )}

      {/* Recent Sessions List */}
      <h2 className="text-xl font-bold mt-8 mb-4">Your Recent Sessions</h2>
      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && mySessions.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm mb-4">You haven&apos;t hosted any sessions yet.</p>
              <Link href="/dashboard/sessions/new">
                <Button variant="outline" size="sm">Create your first session</Button>
              </Link>
            </div>
          )}

          {mySessions.length > 0 && (
            <div className="divide-y">
              {mySessions.slice(0, 5).map(s => (
                <div key={s.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{s.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(s.startTime), "dd MMM")} • {format(new Date(s.startTime), "HH:mm")} - {format(new Date(s.endTime), "HH:mm")}
                    </p>
                  </div>
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setManageSession({ id: s.id, title: s.title })}
                    >
                      Manage
                    </Button>
                    {(pendingCounts?.[s.id] ?? 0) > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold pointer-events-none animate-pulse">
                        {pendingCounts![s.id]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manage Session Panel */}
      <ManageSessionPanel
        sessionId={manageSession?.id ?? null}
        sessionTitle={manageSession?.title ?? ""}
        open={!!manageSession}
        onClose={() => setManageSession(null)}
      />
    </div>
  );
}
