import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainCreateReservationComponent } from './pages/main-create-reservation/main-create-reservation.component';

const routes: Routes = [
  {
    path: ':slug/:idIntention',
    component: MainCreateReservationComponent,
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class CreateReservationRoutingModule {}
