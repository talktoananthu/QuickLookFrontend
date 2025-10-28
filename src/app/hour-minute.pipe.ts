import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourMinute',
  standalone: true
})
export class HourMinutePipe implements PipeTransform {

   transform(value: number): string {
    if (value == null || isNaN(value)) return '';

    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);

    if (hours > 0 && minutes > 0) {
      return `${hours} hr ${minutes} min`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else {
      return `${minutes} min`;
    }
  }
}
