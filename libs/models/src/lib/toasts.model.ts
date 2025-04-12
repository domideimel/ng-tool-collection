import { z } from 'zod';

export const ToastMessageSchema = z.object({
  id: z.number(),
  message: z.string(),
  type: z.enum(['success', 'error', 'info', 'warning']),
});

export type ToastMessage = z.infer<typeof ToastMessageSchema>;
export type ToastType = ToastMessage['type'];
