"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>

      <Card>
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 rounded-full bg-emerald-100 flex items-center justify-center text-4xl font-bold text-emerald-700">
            {initials}
          </div>
          <div className="text-center md:text-left space-y-2 flex-1">
            <h2 className="text-2xl font-bold">{user?.name ?? "Anonymous"}</h2>
            <p className="text-muted-foreground">{user?.email ?? "—"}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <Badge variant="outline" className="text-base px-3 py-1">
                ELO: {String((user as Record<string, unknown>)?.eloScore ?? 1200)}
              </Badge>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {String((user as Record<string, unknown>)?.skillLevel ?? "BEGINNER")}
              </Badge>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email Verified</span>
            <Badge variant={user?.emailVerified ? "default" : "secondary"}>
              {user?.emailVerified ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since</span>
            <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
