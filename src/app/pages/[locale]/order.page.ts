import { RouteMeta } from '@analogjs/router';

import { supportedLocaleGuard } from '../../i18n';

export const routeMeta: RouteMeta = {
  canActivate: [supportedLocaleGuard],
};

export { default } from '../../order/order';
