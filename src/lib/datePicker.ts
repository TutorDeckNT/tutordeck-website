export async function loadDatePicker() {
  const [{ default: flatpickr }] = await Promise.all([import('flatpickr'), import('./datePicker.css')]);
  return flatpickr;
}
