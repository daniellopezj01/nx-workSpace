import { FlightsService } from './../flights/services/flights.service';
import { HotelsService } from './../hotels/services/hotels.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainSearchService } from '../main-search.service';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.scss'],
})
export class MainSearchComponent implements OnInit {
  public paramQ: any;
  public segment: any;
  public activeItem = 0;
  // buttons: Array<string> = ['Tours', 'Hotel', 'Flight'];
  public mainActions = [
    {
      id: 0,
      name: 'SEARCH.FILTERS.TOURS',
      route: 'tours'
    },
    // {
    //   id: 1,
    //   name: 'SEARCH.FILTERS.HOTELS',
    //   route: 'hotels'
    // },
    {
      id: 2,
      name: 'SEARCH.FILTERS.FLIGHTS',
      route: 'flights'
    },
  ];

  constructor(
    private active: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private mainService: MainSearchService,
    private hotelService: HotelsService,
    private FlightsService: FlightsService,

  ) { }

  ngOnInit(): void {
    this.initialiseInvites();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  initialiseInvites() {
    // this.paramQ = this.mainService.getMainQuery;
    this.segment = this.active.snapshot.routeConfig?.path;
    const active = Object.values(this.mainActions).find(
      (a) => a.route === this.segment
    );
    if (active) {
      this.activeItem = active.id;
    }
  }

  goTo(item: any) {
    const { route, id } = item;
    const params = this.mainService.getParamsKey();
    this.activeItem = id;
    // if (route !== 'tours') {
    //   const service = (route === 'hotels') ? this.hotelService : this.FlightsService
    //   this.mainService.updateQueryURI({}, service)
    // }
    this.router.navigate(['search', route], {
      queryParams: params,
    });
  }
}
