import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { ToursModule } from '../tours/tours.module';
import { MovementsModule } from '../movements/movements.module';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ReservationsModule,
    ToursModule,
    MovementsModule,
  ],
})
export class HomeModule {}
