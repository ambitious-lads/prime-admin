import { z } from "zod";

export const subscribeSchema = z.object({
  plan: z.enum(["free", "pro", "pro_plus"]),
  receiptUrl: z
    .string()
    .trim()
    .min(4, "Paste a receipt link or Telebirr reference")
    .max(500),
  note: z.string().max(500).optional(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
