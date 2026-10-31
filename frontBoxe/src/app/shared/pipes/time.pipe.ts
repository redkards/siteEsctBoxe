import { Pipe, PipeTransform } from '@angular/core';
import { formatTime } from '../utils/planning.utils';

/** "18:30" → "18h30" */
@Pipe({ name: 'hour' })
export class HourPipe implements PipeTransform {
  transform(time: string | null | undefined): string {
    return time ? formatTime(time) : '';
  }
}
