import { AbstractControl } from '@angular/forms';
import { formatDate } from '@angular/common';

export function DateValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const today = changeFormatDate(new Date());
  if (control.value) {
    const dataPickert = changeFormatDate(control.value);
    if (dataPickert >= today) {
      return { date: true };
    }
  }
  return null;
}

function changeFormatDate(date: any) {
  return formatDate(date, 'MM-dd-yyyy', 'en-US');
}
