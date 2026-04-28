import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { provideQuillConfig } from 'ngx-quill';
import localeHr from '@angular/common/locales/hr';

import { routes } from './app.routes';
import { HrDatePipe } from 'src/utils/hr-date.pipe';

registerLocaleData(localeHr, 'hr-HR');

export const appConfig: ApplicationConfig = {
 providers: [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideHttpClient(),
  provideQuillConfig({}),
  { provide: LOCALE_ID, useValue: 'hr-HR' },
  HrDatePipe  
 ]
};