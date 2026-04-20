import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, User, ShieldAlert, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SessionDetailPage({ params }: { params: { id: string } }) {
  // Mock data for Phase 4 UI visualization
  const session = {
    id: params.id,
    title: "Weekend Smash",
    courtName: "District 7 Sports Center",
    address: "123 Nguyen Van Linh, District 7, HCMC",
    date: "2026-04-25",
    time: "18:00 - 20:00",
    skillRequired: "INTERMEDIATE",
    totalSlots: 8,
    availableSlots: 2,
    price: 50000,
    hostName: "Minh Tran",
    hostElo: 1450,
    status: "OPEN",
    description: "Looking for intermediate players to practice doubles. Feather shuttlecocks provided.",
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/sessions" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
        &larr; Back to all sessions
      </Link>
      
      <div className="grid md:grid-cols-3 gap-8 mt-2">
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{session.title}</h1>
              <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
                {session.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {session.courtName} - {session.address}
            </p>
          </div>

          <Card>
            <CardContent className="p-6 grid grid-cols-2 gap-6">
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="font-medium">{session.date}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="font-medium">{session.time}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldAlert className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skill Level</p>
                  <p className="font-medium">{session.skillRequired}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Availability</p>
                  <p className="font-medium">{session.availableSlots} / {session.totalSlots} slots open</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-xl font-bold mb-3">About this session</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {session.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader className="bg-emerald-50 rounded-t-xl border-b pb-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Fee per slot</span>
                <span className="text-2xl font-bold text-emerald-700">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(session.price)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Link href={`/sessions/${session.id}/book`}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg">
                  Book Slot Now
                </Button>
              </Link>
              <p className="text-xs text-center text-slate-500 mt-3">
                No account required to book.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hosted by</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  {session.hostName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{session.hostName}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <StarIcon className="h-3 w-3 text-orange-400" />
                    ELO: {session.hostElo}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
