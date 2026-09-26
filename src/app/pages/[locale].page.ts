import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteMeta } from '@analogjs/router';

import { isLocale } from '../i18n';

/**
 * Only render `/:locale` for supported locales; anything else goes back to the home page.
 * Analog attaches `routeMeta` to an empty-path child route, so the locale is read from the
 * inherited route param rather than from `canMatch` URL segments.
 */
const supportedLocale: CanActivateFn = (route) =>
  isLocale(route.paramMap.get('locale')) || inject(Router).createUrlTree(['/']);

export const routeMeta: RouteMeta = {
  canActivate: [supportedLocale],
};

export { default } from '../landing/landing';
