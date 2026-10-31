import { Pipe, PipeTransform } from '@angular/core';
import { formatEuros } from '../utils/format.utils';

/** Centimes → « 150 € » */
@Pipe({ name: 'euros' })
export class EurosPipe implements PipeTransform {
  transform(cents: number | null | undefined): string {
    return formatEuros(cents);
  }
}
