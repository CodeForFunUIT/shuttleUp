"use client";

import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";

const formSchema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestPhone: z.string().min(10, "Valid phone number required"),
});

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: "",
      guestPhone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Assuming our API handles booking creation
      // await api.post('/bookings', { sessionId: id, ...values });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      toast.success("Booking requested successfully!");
    } catch (error) {
      toast.error("Failed to book session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white text-center py-6">
          <CardHeader>
            <div className="mx-auto bg-emerald-100 text-emerald-600 rounded-full h-20 w-20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-bold">Booking Sent!</CardTitle>
            <CardDescription className="text-base mt-2">
              The host will review your request. We've sent the details to your phone number.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Link href={`/sessions/${id}`} className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12">
                Back to Session
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full h-12">
                Find More Sessions
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Link href={`/sessions/${id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" /> Cancel and go back
        </Link>
        
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="space-y-2 pb-6 pt-8 px-8">
            <CardTitle className="text-2xl font-bold tracking-tight">Complete Booking</CardTitle>
            <CardDescription className="text-base">
              Enter your details to request a slot for this session.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guestPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+84 987 654 321" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-slate-50 rounded-xl p-4 border mt-6 mb-6">
                  <div className="flex justify-between items-center text-sm text-slate-600 mb-2">
                    <span>Session Price</span>
                    <span>50.000 ₫</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 border-b pb-3 mb-3">
                    <span>Platform Fee</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span>Total due later</span>
                    <span>50.000 ₫</span>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Request to Book"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center pb-8 pt-4 px-8 text-center text-xs text-slate-500">
            By booking, you agree to our Terms of Service and Cancellation Policy.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
