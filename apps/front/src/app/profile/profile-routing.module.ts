import { AgencyCallbackComponent } from './pages/agency-callback/agency-callback.component';
import { AgencyComponent } from './pages/agency/agency.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './pages/account/account.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { SecurityComponent } from './pages/security/security.component';
import { MediaComponent } from './pages/media/media.component';
import { TripsComponent } from './pages/trips/trips.component';
import { WalletComponent } from './pages/wallet/wallet.component';

import { MainProfileComponent } from './pages/main-profile/main-profile.component';

const routes: Routes = [
  {
    path: '',
    component: MainProfileComponent,
    children: [
      {
        path: '',
        component: AccountComponent,
      },
      {
        path: 'agency-link',
        component: AgencyComponent,
      },
      {
        path: 'agency-link-callback',
        component: AgencyCallbackComponent,
      },
      {
        path: 'notification',
        component: NotificationsComponent,
      },
      {
        path: 'trips',
        component: TripsComponent,
      },
      {
        path: 'wallet',
        component: WalletComponent,
      },
      {
        path: 'personal-info',
        component: PersonalInfoComponent,
      },
      {
        path: 'security',
        component: SecurityComponent,
      },
      {
        path: 'media',
        component: MediaComponent,
      },

      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class ProfileRoutingModule { }
