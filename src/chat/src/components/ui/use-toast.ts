
// Use the toast implementation from hooks directory
import { useToast } from "@/hooks/use-toast";
import type { ToastProps } from "@/hooks/use-toast";

// Re-export the hook
export { useToast };

// Create a local toast function for the chat module
export const toast = (props: Omit<ToastProps, "id">) => {
  const { toast: hookToast } = useToast();
  return hookToast(props);
};
