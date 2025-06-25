import { z } from "zod";

export const ToastMessageSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  type: z.enum(["success", "error", "info", "warning"]),
});

export type ToastMessage = z.infer<typeof ToastMessageSchema>;
export type ToastType = ToastMessage["type"];
