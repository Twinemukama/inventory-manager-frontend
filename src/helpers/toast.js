import { useToast } from "vue-toastification";

let toastInstance;

export function initToast() {
  toastInstance = useToast();
}

export function showToast(text, type = "default") {
  if (!toastInstance) toastInstance = useToast();
  toastInstance[type](text);
}
