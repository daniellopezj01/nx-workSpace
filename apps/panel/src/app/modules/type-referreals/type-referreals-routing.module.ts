import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from '../../services/auth/auth-guard.guard';
import { AddTypeReferrealsComponent } from './pages/add-type-referreals/add-type-referreals.component';
import { ListTypeReferrealsComponent } from './pages/list-type-referreals/list-type-referreals.component';

const routes: Routes = [
  { path: '', component: ListTypeReferrealsComponent },
  {
    path: ':id',
    component: AddTypeReferrealsComponent,
    canDeactivate: [AuthGuardGuard],
  },
  {
    path: 'new',
    component: ListTypeReferrealsComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeReferrealsRoutingModule { }
