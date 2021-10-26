import { AuthGuardGuard } from './../../services/auth/auth-guard.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTourComponent } from './pages/add-tour/add-tour.component';
import { ListToursComponent } from './pages/list-tours/list-tours.component';

const routes: Routes = [
  { path: '', component: ListToursComponent },
  {
    path: ':id',
    component: AddTourComponent,
    canDeactivate: [AuthGuardGuard],
  },
  {
    path: 'new',
    component: AddTourComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToursRoutingModule { }
