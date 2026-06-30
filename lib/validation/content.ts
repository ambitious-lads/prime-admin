import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  iconName: z.string().optional(),
  accentColor: z.string().optional(),
  displayOrder: z.coerce.number().int().optional(),
});

export const topicSchema = z.object({
  categoryId: z.string().min(1, "Select a category"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  accentColor: z.string().optional(),
  displayOrder: z.coerce.number().int().optional(),
});

export const setSchema = z.object({
  topicId: z.string().min(1, "Select a topic"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  estimatedTimeMinutes: z.coerce.number().int().optional(),
  orderIndex: z.coerce.number().int().optional(),
});

export const questionSchema = z.object({
  practiceSetId: z.string().min(1, "Select a practice set"),
  questionText: z.string().min(1, "Question text is required"),
  options: z
    .array(z.object({ label: z.string().min(1), text: z.string().min(1) }))
    .min(2, "At least two options"),
  correctOption: z.string().min(1, "Mark the correct option"),
  explanation: z.string().optional(),
  orderIndex: z.coerce.number().int().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type TopicInput = z.infer<typeof topicSchema>;
export type SetInput = z.infer<typeof setSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
