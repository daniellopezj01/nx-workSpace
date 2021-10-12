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
import { FilterHotelService } from '../services/filter-hotel.service';
@Component({
  selector: 'app-filter-hotel',
  templateUrl: './filter-hotel.component.html',
  styleUrls: ['./filter-hotel.component.scss'],
})
export class FilterHotelComponent implements OnInit, AfterViewChecked {
  @Input() small = true;
  public isBrowser: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    public filterService: FilterHotelService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }
  }

  ngOnInit(): void {
    console.log('log filter hotels')
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  public get activeClear() {
    return this.filterService.getactiveClear;
  }

  clearFilters() {
    this.filterService.clearFilters();
  }

  public closeModal() {
    this.filterService.closeModal();
  }

  closeFilters() {
    this.closeModal();
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 650);
    }
  }
}
