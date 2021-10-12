import { FlightDetailsComponent } from './pages/flights/flight-details/flight-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainSearchComponent } from './pages/main-search/main-search.component';
import { ConfirmFlightComponent } from './pages/flights/flight-details/components/confirm-flight/confirm-flight.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tours',
  },
  {
    path: 'tours',
    component: MainSearchComponent,
  },
  {
    path: 'flights',
    component: MainSearchComponent,
  },
  {
    path: 'hotels',
    component: MainSearchComponent,
  },
  {
    path: 'flights/details/:code',
    component: FlightDetailsComponent,
  },
  {
    path: 'flights/confirm/:code',
    component: ConfirmFlightComponent,
  },
  {
    path: '**',
    redirectTo: 'tours',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

// @ts-ignore
export class SearchRoutingModule { }
