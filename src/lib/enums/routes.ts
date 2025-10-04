import { m } from '$lib/paraglide/messages';

export enum Route {
  home = 'home',
  communities = 'communities',
  edit = 'edit',
}

export const kRouteLabel: Record<Route, string> = {
  [Route.home]: m['routes.home'](),
  [Route.communities]: m['routes.communities'](),
  [Route.edit]: m['routes.edit'](),
};
