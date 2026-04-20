import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_SESSIONS = [
  {
    id: "1",
    title: "Weekend Smash",
    courtName: "District 7 Sports Center",
    date: "2026-04-25",
    time: "18:00 - 20:00",
    skillRequired: "INTERMEDIATE",
    totalSlots: 8,
    availableSlots: 2,
    price: 50000,
  },
  {
    id: "2",
    title: "Beginner Friendly",
    courtName: "City Hall Courts",
    date: "2026-04-26",
    time: "10:00 - 12:00",
    skillRequired: "BEGINNER",
    totalSlots: 6,
    availableSlots: 4,
    price: 40000,
  }
];

export default function SessionsPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SESSIONS.map(session => (
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
                <MapPin className="mr-2 h-4 w-4 text-emerald-600" />
                {session.courtName}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="mr-2 h-4 w-4 text-emerald-600" />
                {session.date}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="mr-2 h-4 w-4 text-emerald-600" />
                {session.time}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Users className="mr-2 h-4 w-4 text-emerald-600" />
                Skill: {session.skillRequired}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t p-4 pb-0 bg-slate-50 mt-4 rounded-b-xl border-x-0 border-b-0">
              <span className="font-semibold text-emerald-700">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(session.price)}
              </span>
              <Link href={`/sessions/${session.id}`}>
                <Button variant="outline" size="sm">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
