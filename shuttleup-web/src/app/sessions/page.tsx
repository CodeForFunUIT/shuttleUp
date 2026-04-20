"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSessions } from "@/lib/hooks/use-sessions";
import { format } from "date-fns";

export default function SessionsPage() {
  const { data: sessions, isLoading, error } = useSessions();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Sessions</h1>
          <p className="text-muted-foreground mt-1">Join up and play with matches matching your skill level</p>
        </div>
        <Link href="/dashboard/sessions/new">
          <Button>Host a Session</Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-muted-foreground">Loading sessions...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load sessions</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Could not connect to the API. Make sure the backend is running at{" "}
            <code className="bg-muted px-1 rounded">localhost:3000</code>.
          </p>
        </div>
      )}

      {/* Empty State */}
      {sessions && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Be the first to host a badminton session!</p>
          <Link href="/dashboard/sessions/new">
            <Button>Host a Session</Button>
          </Link>
        </div>
      )}

      {/* Sessions Grid */}
      {sessions && sessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(session => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{session.title}</CardTitle>
                  <Badge variant={session.availableSlots > 0 ? "default" : "destructive"}>
                    {session.availableSlots} slots left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="mr-2 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  {session.court?.name ?? "Unknown Court"}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="mr-2 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  {format(new Date(session.startTime), "dd MMM yyyy")}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Clock className="mr-2 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  {format(new Date(session.startTime), "HH:mm")} - {format(new Date(session.endTime), "HH:mm")}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Users className="mr-2 h-4 w-4 text-emerald-600 flex-shrink-0" />
                  Skill: {session.skillRequired}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t p-4 pb-0 bg-slate-50 mt-4 rounded-b-xl border-x-0 border-b-0">
                <span className="font-semibold text-emerald-700">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(session.pricePerSlot)}
                </span>
                <Link href={`/sessions/${session.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
