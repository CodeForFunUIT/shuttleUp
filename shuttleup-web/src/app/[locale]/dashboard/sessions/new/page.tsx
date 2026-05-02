"use client"

import { useRouter } from "@/i18n/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { Link } from "@/i18n/navigation";
import { Loader2 } from "lucide-react"

import { CourtSelect } from "@/components/court-select"
import { useCourts } from "@/lib/hooks/use-courts"
import { useCreateSession } from "@/lib/hooks/use-create-session"
import {
  createSessionFormSchema,
  toCreateSessionPayload,
  type CreateSessionFormValues,
} from "@/lib/schemas/create-session-schema"

const DURATION_OPTIONS = [
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "150", label: "2.5 hours" },
  { value: "180", label: "3 hours" },
]

export default function CreateSessionPage() {
  const router = useRouter()
  const { data: courts = [], isLoading: courtsLoading } = useCourts()
  const createSession = useCreateSession()

  const form = useForm<CreateSessionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createSessionFormSchema) as any,
    defaultValues: {
      title: "",
      courtId: "",
      date: "",
      time: "",
      duration: 120,
      totalSlots: 8,
      pricePerSlot: 50000,
      skillRequired: "ALL",
      gameType: "doubles",
      description: "",
    },
  })

  const onSubmit = (values: CreateSessionFormValues) => {
    const payload = toCreateSessionPayload(values)

    createSession.mutate(payload, {
      onSuccess: () => {
        toast.success("Session Created", {
          description: "Your session has been published on the platform.",
        })
        router.push("/dashboard")
        router.refresh()
      },
      onError: (error) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const msg = (error as any)?.response?.data?.message || "Failed to create session"
        toast.error("Error", {
          description: Array.isArray(msg) ? msg.join(", ") : msg,
        })
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/dashboard"
        className="text-sm text-emerald-600 hover:underline mb-6 inline-block"
      >
        &larr; Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Session</CardTitle>
          <CardDescription>
            Host a new badminton session and start accepting bookings.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Weekend Smash District 7"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief details about the session..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date + Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration + Game Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DURATION_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gameType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select game type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="singles">Singles</SelectItem>
                          <SelectItem value="doubles">Doubles</SelectItem>
                          <SelectItem value="mixed">Mixed Doubles</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Court Picker */}
              <FormField
                control={form.control}
                name="courtId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Court</FormLabel>
                    <FormControl>
                      <CourtSelect
                        courts={courts}
                        value={field.value}
                        onSelect={field.onChange}
                        disabled={courtsLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slots + Price */}
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Slots</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={50}
                          placeholder="8"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Slot (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={1000}
                          placeholder="50000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Skill Level */}
              <FormField
                control={form.control}
                name="skillRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Required</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">All Levels</SelectItem>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-3 mt-4 border-t pt-6">
              <Link href="/dashboard">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                type="submit"
                disabled={createSession.isPending}
              >
                {createSession.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Session"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
