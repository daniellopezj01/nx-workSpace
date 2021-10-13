import { Component, Input, OnInit } from '@angular/core';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-section-itinerary',
  templateUrl: './section-itinerary.component.html',
  styleUrls: ['./section-itinerary.component.scss'],
})
export class SectionItineraryComponent implements OnInit {
  @Input() tour: any;
  activeItem = 0;
  faMapMarkerAlt = faMapMarkerAlt;
  itinerary: any;

  constructor() { }

  ngOnInit(): void {
    const { itinerary } = this.tour;
    this.itinerary = itinerary;
  }

  changeActive(i: any) {
    this.activeItem = this.activeItem === i ? 0 : i;
  }
}
