import { z } from "zod";

export const createSessionFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  courtId: z.string().min(1, "Please select a court"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.coerce
    .number()
    .min(30, "Min 30 minutes")
    .max(480, "Max 8 hours"),
  totalSlots: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "At least 1 slot")
    .max(50, "Max 50 slots"),
  pricePerSlot: z.coerce
    .number()
    .int("Must be a whole number")
    .min(0, "Price cannot be negative"),
  skillRequired: z
    .enum(["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"])
    .default("ALL"),
  gameType: z.enum(["singles", "doubles", "mixed"]).default("singles"),
  description: z.string().optional(),
});

export type CreateSessionFormValues = z.infer<typeof createSessionFormSchema>;

/** Transform form values → API payload (date+time+duration → startTime/endTime) */
export function toCreateSessionPayload(values: CreateSessionFormValues) {
  const startTime = new Date(`${values.date}T${values.time}`);
  const endTime = new Date(startTime.getTime() + values.duration * 60_000);

  return {
    courtId: values.courtId,
    title: values.title,
    description: values.description,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    totalSlots: values.totalSlots,
    pricePerSlot: values.pricePerSlot,
    skillRequired: values.skillRequired,
    gameType: values.gameType,
  };
}
