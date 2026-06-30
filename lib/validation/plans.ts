import { z } from "zod";

export const subscribeSchema = z.object({
  plan: z.enum(["free", "pro", "pro_plus"]),
  transactionRef: z.string().max(120).optional(),
  note: z.string().max(500).optional(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
