import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Calendar as CalendarIcon, Users } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your badminton sessions and bookings</p>
        </div>
        <Link href="/dashboard/sessions/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Session
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next one tomorrow at 18:00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">+3 since last week</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Your Recent Sessions</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium">Weekend Smash - District 7</h4>
                <p className="text-sm text-slate-500">Tomorrow • 18:00 - 20:00</p>
              </div>
              <Button size="sm" variant="outline">Manage</Button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium">Advanced Drills</h4>
                <p className="text-sm text-slate-500">28 Apr • 19:00 - 21:00</p>
              </div>
              <Button size="sm" variant="outline">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
