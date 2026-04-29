"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

const MOCK_BOOKINGS = [
  { id: "1", name: "Nguyen Van A", phone: "0901234567", status: "PENDING_PAYMENT", isGuest: true },
  { id: "2", name: "Tran Thi B", phone: "0987654321", status: "CONFIRMED", isGuest: false },
]

export default function ManageSessionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
        &larr; Back to Dashboard
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Weekend Smash District 7</CardTitle>
                  <CardDescription className="mt-1">Manage bookings for this session</CardDescription>
                </div>
                <Badge>OPEN</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y border rounded-lg overflow-hidden">
                <div className="bg-slate-50 p-3 grid grid-cols-12 gap-4 text-sm font-medium text-slate-500">
                  <div className="col-span-5">Player</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-4 text-right">Actions</div>
                </div>
                
                {MOCK_BOOKINGS.map(booking => (
                  <div key={booking.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
                      <p className="font-medium">{booking.name} {booking.isGuest && <Badge variant="secondary" className="ml-1 text-xs">Guest</Badge>}</p>
                      <p className="text-sm text-slate-500">{booking.phone}</p>
                    </div>
                    <div className="col-span-3">
                      <Badge variant={booking.status === "CONFIRMED" ? "default" : "outline"} className={booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : ""}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="col-span-4 flex justify-end gap-2">
                       {booking.status !== "CONFIRMED" && (
                         <Button size="sm" variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                           <CheckCircle className="mr-1 h-4 w-4" /> Confirm
                         </Button>
                       )}
                       <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                         <XCircle className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-slate-500 flex items-center"><Users className="mr-2 h-4 w-4"/> Fill Rate</span>
                <span className="font-bold">2 / 8</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-slate-500">Confirmed Revenue</span>
                <span className="font-bold text-emerald-700">50,000 ₫</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pending Revenue</span>
                <span className="font-bold">50,000 ₫</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
