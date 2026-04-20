"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function GuestBookingPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(r => setTimeout(r, 1000))
    
    toast.success("Booking Request Sent!", {
      description: "The host will confirm your slot shortly."
    })
    
    router.push(`/sessions/${params.id}`)
    router.refresh()
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <Link href={`/sessions/${params.id}`} className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
        &larr; Back to details
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Confirm Booking</CardTitle>
          <CardDescription>
            You are booking as a guest. Please provide your contact details so the host can reach you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBooking} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Nguyen Van A" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Zalo/SMS)</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="09xx xxx xxx" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg mt-6 border">
              <p className="text-sm font-medium mb-1">Payment Method</p>
              <p className="text-sm text-slate-500">Momo / Bank Transfer (instructions will be shown after host confirmation).</p>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Complete Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
