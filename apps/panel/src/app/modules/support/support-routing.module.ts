import { DetailsSupportComponent } from './pages/details-support/details-support.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSupportComponent } from './pages/list-support/list-support.component';

const routes: Routes = [
  { path: '', component: ListSupportComponent },
  { path: ':id', component: DetailsSupportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
