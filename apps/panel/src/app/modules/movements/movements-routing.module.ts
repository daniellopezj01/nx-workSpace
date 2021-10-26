import { DetailsMovementsComponent } from './pages/details-movements/details-movements.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMovementsComponent } from './pages/list-movements/list-movements.component';
import { AuthGuardGuard } from './../../services/auth/auth-guard.guard';

const routes: Routes = [
  { path: '', component: ListMovementsComponent },
  {
    path: ':id',
    component: DetailsMovementsComponent,
    canDeactivate: [AuthGuardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovementsRoutingModule {}
