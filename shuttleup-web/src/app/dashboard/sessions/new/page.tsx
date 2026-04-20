"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

export default function CreateSessionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API save
    await new Promise(r => setTimeout(r, 1000))
    
    toast.success("Session Created", {
      description: "Your session has been published on the platform."
    })
    
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/dashboard" className="text-sm text-emerald-600 hover:underline mb-6 inline-block">
        &larr; Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Session</CardTitle>
          <CardDescription>
            Host a new badminton session and start accepting bookings.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title</Label>
              <Input id="title" placeholder="e.g. Weekend Smash District 7" required />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="court">Court Name</Label>
              <Input id="court" placeholder="e.g. City Hall Courts" required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slots">Total Slots</Label>
                <Input id="slots" type="number" min="1" placeholder="8" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Slot (VND)</Label>
                <Input id="price" type="number" min="0" placeholder="50000" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill">Skill Required</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Levels</SelectItem>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 mt-4 border-t pt-6">
            <Link href="/dashboard">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button className="bg-emerald-600 hover:bg-emerald-700" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Session"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
