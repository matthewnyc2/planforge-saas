import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  color: z.string().default("#6366f1"),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
