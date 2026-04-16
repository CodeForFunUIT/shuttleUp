import Link from "next/link";
import { parseISO, format } from "date-fns";
import { MapPin, Calendar, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_SESSIONS = [
  {
    id: "1",
    courtName: "Tao Dan Sports Club",
    address: "District 1, HCMC",
    startTime: "2026-04-18T18:00:00Z",
    endTime: "2026-04-18T20:00:00Z",
    price: 50000,
    availableSlots: 4,
    totalSlots: 6,
    skillLevel: "INTERMEDIATE",
    host: {
      name: "Tuan Anh",
      avatar: null,
    }
  },
  {
    id: "2",
    courtName: "Phu Tho Stadium",
    address: "District 11, HCMC",
    startTime: "2026-04-19T09:00:00Z",
    endTime: "2026-04-19T12:00:00Z",
    price: 40000,
    availableSlots: 1,
    totalSlots: 4,
    skillLevel: "ADVANCED",
    host: {
      name: "Nghia Th",
      avatar: null,
    }
  }
];

function formatTime(isoString: string) {
  return format(parseISO(isoString), "h:mm a");
}

function formatDate(isoString: string) {
  return format(parseISO(isoString), "EEE, MMM d");
}

export default function SessionsFeedPage() {
  // In a real app, we'd fetch this from the API via RSC or a Client Component using react-query
  // const sessions = await fetchSessions(...)

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Sessions</h1>
          <p className="text-slate-500 mt-1">Browse upcoming badminton sessions in your area.</p>
        </div>
        
        {/* Simple mock filters */}
        <div className="flex gap-2">
          <Button variant="outline"><MapPin className="mr-2 h-4 w-4" /> Distance: 5km</Button>
          <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> This Week</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {MOCK_SESSIONS.map((session) => (
          <div key={session.id} className="bg-white rounded-xl border p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-emerald-200 transition-colors">
            
            {/* Left Col - Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    {session.skillLevel}
                  </Badge>
                  <span className="text-sm text-slate-500 flex items-center">
                    <Navigation className="h-3 w-3 mr-1" /> ~2.5km away
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{session.courtName}</h3>
                <p className="text-slate-500 flex items-center text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {session.address}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm font-medium">
                  <div className="flex items-center text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border">
                    <Calendar className="mr-2 h-4 w-4 text-emerald-600" />
                    {formatDate(session.startTime)}
                  </div>
                  <div className="flex items-center text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border">
                    <Clock className="mr-2 h-4 w-4 text-emerald-600" />
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col - Price & Action */}
            <div className="flex flex-col sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 sm:border-l sm:pl-6 sm:w-48">
              <div className="flex justify-between sm:flex-col sm:items-end w-full mb-4 sm:mb-0">
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(session.price)}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">per person</div>
                </div>
                
                <div className="text-sm mt-2 text-right">
                  <span className="font-semibold text-emerald-600">{session.availableSlots} slots</span> left
                  <br />
                  <span className="text-slate-400 text-xs">out of {session.totalSlots}</span>
                </div>
              </div>
              
              <Link href={`/sessions/${session.id}`} className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-11">
                  View Details
                </Button>
              </Link>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
