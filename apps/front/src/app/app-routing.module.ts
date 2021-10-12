import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { SettingsGuardGuard } from './guards/settings-guard.guard';
import { CheckReferredGuard } from './guards/check-referred.guard';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./principal/principal.module').then(
        (m) => m.PrincipalModule
      ),
    canActivate: [SettingsGuardGuard, CheckReferredGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [CheckReferredGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./public-profile/public-profile.module').then(
        (m) => m.PublicProfileModule
      ),
    canActivate: [SettingsGuardGuard, CheckReferredGuard],
  },
  {
    path: 'departures',
    loadChildren: () =>
      import('./departures/departures.module').then(
        (m) => m.DeparturesModule
      ),
    canActivate: [SettingsGuardGuard, CheckReferredGuard],
  },
  {
    path: 'search',
    runGuardsAndResolvers: 'always',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
    canActivate: [SettingsGuardGuard, CheckReferredGuard],
  },
  {
    path: 'destination', // MODULE DETAILS-TOUR
    loadChildren: () =>
      import('./tour-details/tour-details.module').then(
        (m) => m.TourDetailsModule
      ),
    canActivate: [SettingsGuardGuard, CheckReferredGuard],
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./blog/blog.module').then((m) => m.BlogModule),
    canActivate: [CheckReferredGuard],
  },
  {
    path: 'reservation',
    loadChildren: () =>
      import('./create-reservation/create-reservation.module').then(
        (m) => m.CreateReservationModule
      ),
    canActivate: [AuthGuard, CheckReferredGuard],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard, CheckReferredGuard],
    data: { changeRedirect: ['free-account'] }
  },
  {
    path: 'free-account',
    loadChildren: () =>
      import('./free-account/free-account.module').then((m) => m.FreeAccountModule),
  },
  {
    path: 'referred',
    loadChildren: () =>
      import('./referred/referred.module').then(
        (m) => m.ReferredModule
      ),
    canActivate: [AuthGuard, CheckReferredGuard],
  },
  {
    path: 'trips',
    loadChildren: () =>
      import('./reservations/reservations.module').then(
        (m) => m.ReservationsModule
      ),
    canActivate: [AuthGuard, CheckReferredGuard],
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('./payment/payment.module').then((m) => m.PaymentModule),
    canActivate: [AuthGuard, CheckReferredGuard],
  },
  {
    path: 'inbox',
    loadChildren: () =>
      import('./inbox/inbox.module').then((m) => m.InboxModule),
    canActivate: [AuthGuard, CheckReferredGuard],
  },
  {
    path: 'notFound',
    component: NotFoundComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
