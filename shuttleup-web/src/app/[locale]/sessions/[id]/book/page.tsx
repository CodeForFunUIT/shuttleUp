"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useCreateGuestBooking } from "@/lib/hooks/use-bookings";

export default function GuestBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const guestBooking = useCreateGuestBooking();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await guestBooking.mutateAsync({
        sessionId: id,
        guestName: name,
        guestPhone: phone,
      });

      // Store bookingId in localStorage for guest tracking
      const stored = JSON.parse(localStorage.getItem("guestBookings") || "[]");
      const bookingId = result?.id ?? result?.data?.id;
      if (bookingId) {
        stored.push({ bookingId, sessionId: id, phone, createdAt: new Date().toISOString() });
        localStorage.setItem("guestBookings", JSON.stringify(stored));
      }

      toast.success("Booking Request Sent!", {
        description: "The host will confirm your slot shortly.",
      });

      router.push(`/sessions/${id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Booking failed. Please try again.";
      toast.error("Booking Failed", { description: message });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <Link
        href={`/sessions/${id}`}
        className="text-sm text-primary hover:underline mb-6 inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Details
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Confirm Booking</CardTitle>
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
                name="name"
                autoComplete="name"
                placeholder="Nguyen Van A…"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Zalo/SMS)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="09xx xxx xxx…"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="bg-muted p-4 rounded-lg mt-6 border">
              <p className="text-sm font-medium mb-1">Payment Method</p>
              <p className="text-sm text-muted-foreground">
                Momo / Bank Transfer (instructions will be shown after host confirmation).
              </p>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 h-12"
              type="submit"
              disabled={guestBooking.isPending}
            >
              {guestBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Processing…
                </>
              ) : (
                "Complete Booking"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
