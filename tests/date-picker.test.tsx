import { expect, it } from 'vitest';
import { loadDatePicker } from '../src/lib/datePicker';

it('selects a local calendar date, rejects future dates, and destroys its calendar', async () => {
  const flatpickr = await loadDatePicker();
  const input = document.createElement('input');
  input.setAttribute('aria-label', 'Volunteer date');
  document.body.append(input);
  let selected = '';
  const picker = flatpickr(input, { dateFormat: 'Y-m-d', defaultDate: '2026-01-02', maxDate: new Date(2026, 0, 12), onChange: (_dates, dateString) => { selected = dateString; } });
  picker.setDate(new Date(2026, 0, 3), true);
  expect(selected).toBe('2026-01-03');
  expect(input.value).toBe('2026-01-03');
  picker.setDate(new Date(2026, 0, 13), true);
  expect(picker.selectedDates).toHaveLength(0);
  picker.destroy();
  expect(document.querySelector('.flatpickr-calendar')).toBeNull();
  input.remove();
});
