import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainDetailsComponent } from './pages/main-details/main-details.component';
const routes: Routes = [
  {
    path: ':query',
    component: MainDetailsComponent,
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

// @ts-ignore
export class TourDetailsRoutingModule {}
