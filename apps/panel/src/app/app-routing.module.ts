import { ReferralsModule } from './modules/referrals/referrals.module';
import { UsersModule } from './modules/users/users.module';
import { AuthGuardGuard } from './services/auth/auth-guard.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ToursModule } from './modules/tours/tours.module';
import { MovementsModule } from './modules/movements/movements.module';
import { SupportModule } from './modules/support/support.module';
import { TypeReferrealsModule } from './modules/type-referreals/type-referreals.module';
import { CommentsModule } from './modules/comments/comments.module';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => AuthModule,
  },
  {
    path: 'home',
    loadChildren: () => HomeModule,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'reservations',
    loadChildren: () => ReservationsModule,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'referrals',
    loadChildren: () => ReferralsModule,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'type-referrals',
    loadChildren: () => TypeReferrealsModule,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'tours',
    loadChildren: () => ToursModule,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'movements',
    loadChildren: () => MovementsModule,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'users',
    loadChildren: () => UsersModule,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'support',
    loadChildren: () => SupportModule,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'comments',
    loadChildren: () => CommentsModule,
    canActivate: [AuthGuardGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'notFound',
    component: NotFoundComponent,
  },
  { path: '**', redirectTo: 'notFound', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
