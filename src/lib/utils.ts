import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    case "medium":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "low":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "todo":
      return "text-slate-600 bg-slate-50";
    case "in-progress":
      return "text-blue-600 bg-blue-50";
    case "done":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}
