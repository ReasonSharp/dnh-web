// hrvatski-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'hrDate',
 standalone: true
})
export class HrDatePipe implements PipeTransform {
 private readonly monthGenitive: string[] = [
  'siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja',
  'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenoga', 'prosinca'
 ];

 constructor() { }

 transform(value: Date | string | number | null | undefined): string | null {
  if (!value) return null;
  try {
   const date = new Date(value);
   if (isNaN(date.getTime())) return String(value);
   const day = date.getDate().toString();
   const month = this.monthGenitive[date.getMonth()];
   const year = date.getFullYear();
   return `${day}. ${month}, ${year}.`;
  } catch (e) {
   console.warn('Error parsing date:', value, e);
   return String(value);
  }
 }
}