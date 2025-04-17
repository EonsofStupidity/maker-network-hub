
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges Tailwind CSS classes efficiently
 * Uses clsx for conditional class application and twMerge to handle Tailwind conflicts
 * 
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged className string with resolved Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default cn;
