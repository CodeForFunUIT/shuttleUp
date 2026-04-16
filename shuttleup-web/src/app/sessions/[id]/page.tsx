import Link from "next/link";
import { parseISO, format } from "date-fns";
import { MapPin, Calendar, Clock, Navigation, ShieldCheck, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SESSION_MOCK = {
  id: "1",
  courtName: "Tao Dan Sports Club",
  address: "1 Huyen Tran Cong Chua, Ben Thanh, District 1, HCMC",
  startTime: "2026-04-18T18:00:00Z",
  endTime: "2026-04-18T20:00:00Z",
  price: 50000,
  availableSlots: 4,
  totalSlots: 6,
  skillLevel: "INTERMEDIATE",
  description: "Friendly match, shuttles are provided! Please bring your own racket. We play doubles and rotate every 2 games.",
  host: {
    name: "Tuan Anh",
    avatar: null,
    rating: 4.8,
    reviewsCount: 12
  }
};

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // const session = await fetchSession(id);
  const session = SESSION_MOCK;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
      <Link href="/sessions" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to feed
      </Link>
      
      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        {/* Banner/Header */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        
        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Main Info */}
            <div className="flex-1 -mt-16 md:-mt-20">
              <div className="bg-white p-2 rounded-xl inline-block shadow-sm mb-4">
                <div className="bg-emerald-50 text-emerald-700 h-16 w-16 rounded-lg flex items-center justify-center font-bold text-xl">
                  {format(parseISO(session.startTime), "d")}
                  <br />
                  <span className="text-sm font-normal">{format(parseISO(session.startTime), "MMM")}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex gap-2 mb-3">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{session.skillLevel}</Badge>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{session.courtName}</h1>
                <p className="text-slate-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {session.address}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 flex items-center mb-1">
                    <Calendar className="mr-1.5 h-4 w-4" /> Date
                  </span>
                  <span className="font-semibold">{format(parseISO(session.startTime), "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 flex items-center mb-1">
                    <Clock className="mr-1.5 h-4 w-4" /> Time
                  </span>
                  <span className="font-semibold">{format(parseISO(session.startTime), "h:mm a")} - {format(parseISO(session.endTime), "h:mm a")}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">About this session</h3>
                <p className="text-slate-600 leading-relaxed">
                  {session.description}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-bold mb-4">Hosted by</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-slate-200 text-lg">{session.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg flex items-center">
                      {session.host.name} <ShieldCheck className="h-4 w-4 text-emerald-500 ml-1" />
                    </div>
                    <div className="text-sm text-slate-500">
                      ★ {session.host.rating} ({session.host.reviewsCount} reviews)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / CTA */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl border shadow-lg p-6 sticky top-24">
                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(session.price)}
                </div>
                <div className="text-sm text-slate-500 mb-6">per person</div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-slate-600">Available Slots</span>
                    <span className="font-bold">{session.availableSlots} / {session.totalSlots}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-slate-600">Skill Level</span>
                    <span className="font-medium text-sm">{session.skillLevel}</span>
                  </div>
                </div>

                <Link href={`/sessions/${id}/book`}>
                  <Button className="w-full h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700">
                    Book Now
                  </Button>
                </Link>
                
                <p className="text-center text-xs text-slate-400 mt-4">
                  No account required to book.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
