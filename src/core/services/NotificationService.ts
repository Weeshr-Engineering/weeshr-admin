import { useToast } from "vue-toast-notification";
import type { ToastProps } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

type Type = "success" | "info" | "warning" | "error" | "default";

type Position =
  | "top"
  | "bottom"
  | "top-right"
  | "bottom-right"
  | "top-left"
  | "bottom-left";

const $toast = useToast();

/**
 * Create Toast
 * @param {string} message
 * @param {Type} type (default to success)
 * @param {number} duration (in milliseconds)
 * @param {Position} position (defaults to top-right)
 * @return {void}
 */
export const Notify = (
  message: string,
  type: Type = "success",
  duration: number = 3000,
  position: Position = "top-right"
): void => {
  const options: ToastProps = {
    type: type,
    duration: duration,
    position: position,
  };

  $toast.success(message, options);
};

/**
 * Clears all notification
 * @return {void}
 */
export const NotifyClearAll = (): void => {
  $toast.clear();
};
