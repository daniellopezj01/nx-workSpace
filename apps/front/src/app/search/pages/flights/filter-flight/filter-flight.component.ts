import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FilterFlightService } from '../services/filter-flight.service';

@Component({
  selector: 'app-filter-flight',
  templateUrl: './filter-flight.component.html',
  styleUrls: ['./filter-flight.component.scss'],
})
export class FilterFlightComponent implements AfterViewChecked {
  @Input() small = true;
  isBrowser: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    public filterFlights: FilterFlightService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  public get activeClear() {
    return this.filterFlights.getactiveClear;
  }

  // changeInputTime() {
  //   this.filterFlights.checkActiveTime();
  //   this.actionFilters();
  // }

  durationFlight(totalDuration: any) {
    const minutes = totalDuration % 60;
    // tslint:disable-next-line:radix
    const hours = parseInt('' + totalDuration / 60);
    return `${hours}h ${minutes}m`;
  }

  clearFilters() {
    this.filterFlights.clearFilters();
  }

  public closeModal() {
    this.filterFlights.closeModal();
  }

  closeFilters() {
    this.closeModal();
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 650);
    }
  }
}
