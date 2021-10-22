import { AddReferredComponent } from './pages/add-referred/add-referred.component';
import { ListReferredComponent } from './pages/list-referred/list-referred.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from 'src/app/services/auth/auth-guard.guard';

const routes: Routes = [
  { path: '', component: ListReferredComponent },
  {
    path: ':id',
    component: AddReferredComponent,
    canDeactivate: [AuthGuardGuard],
  },
  {
    path: 'new',
    component: ListReferredComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferralsRoutingModule {}
