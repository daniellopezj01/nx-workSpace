import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { EmergencyComponent } from './pages/emergency/emergency.component';
import { BuyerComponent } from './pages/buyer/buyer.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { MainReservationComponent } from './pages/main-reservation/main-reservation.component';
import { ContainerSupportComponent } from './pages/support/container-support/container-support.component';
import { PassportComponent } from './pages/passport/passport.component';
import { TourComponent } from './pages/tour/tour.component';
import { ImportantInfoComponent } from './pages/important-info/important-info.component';

const routes: Routes = [
  {
    path: ':id',
    component: MainReservationComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'personal',
        component: PersonalInfoComponent,
      },
      {
        path: 'emergency',
        component: EmergencyComponent,
      },
      {
        path: 'buyer',
        component: BuyerComponent,
      },
      {
        path: 'tour',
        component: TourComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'support/:hash',
        component: ContainerSupportComponent,
      },
      {
        path: 'support',
        component: ContainerSupportComponent,
      },
      {
        path: 'important',
        component: ImportantInfoComponent,
      },
    ],
  },
  { path: '**', redirectTo: '/user', pathMatch: 'prefix' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

// @ts-ignore
export class ReservationsRoutingModule { }
