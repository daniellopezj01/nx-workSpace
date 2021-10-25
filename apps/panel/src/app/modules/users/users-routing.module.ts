import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from '../../services/auth/auth-guard.guard';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { ListUserComponent } from './pages/list-user/list-user.component';

const routes: Routes = [
  { path: '', component: ListUserComponent },
  {
    path: ':id',
    component: AddUserComponent,
    canDeactivate: [AuthGuardGuard],
  },
  {
    path: 'new',
    component: ListUserComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
