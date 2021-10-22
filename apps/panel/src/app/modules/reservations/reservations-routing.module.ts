import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from './../../services/auth/auth-guard.guard';
import { AddReservationComponent } from './pages/add-reservation/add-reservation.component';
import { ListReservationComponent } from './pages/list-reservation/list-reservation.component';

const routes: Routes = [
  { path: '', component: ListReservationComponent },
  {
    path: ':id',
    component: AddReservationComponent,
    canDeactivate: [AuthGuardGuard],
  },
  {
    path: 'new',
    component: ListReservationComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationsRoutingModule {}
