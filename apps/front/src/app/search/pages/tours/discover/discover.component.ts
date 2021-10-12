import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent {
  itemsData = [
    {
      name: 'SEARCH.TOURS.DISCOVERY_ONE',
    },
    {
      name: 'SEARCH.TOURS.DISCOVERY_TWO',
    },
    {
      name: 'SEARCH.TOURS.DISCOVERY_THREE',
    },
    {
      name: 'SEARCH.TOURS.DISCOVERY_FOUR',
    },
  ];
  faSearch = faSearch;
  constructor(
    private library: FaIconLibrary,
    public translate: TranslateService
  ) {
    library.addIcons(faSearch);
  }

}
