import { z } from 'zod'

export const journalSchema = z.object({
  title: z.string().max(100, 'Title too long').optional().or(z.literal('')),
  content: z
    .string()
    .min(1, 'Please write something')
    .min(10, 'Entry must be at least 10 characters')
    .max(5000, 'Entry too long'),
})

export type JournalFormValues = z.infer<typeof journalSchema>
