import { MainDeparturesComponent } from './pages/main-departures/main-departures.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':query',
    component: MainDeparturesComponent,
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class DeparturesRoutingModule {}
