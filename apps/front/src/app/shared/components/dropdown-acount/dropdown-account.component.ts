import { Subscription } from 'rxjs';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { UpdateService } from '../../../profile/pages/media/services/update.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash'
import { RestService } from '../../../core/services/rest.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-dropdown-acount',
  templateUrl: './dropdown-account.component.html',
  styleUrls: ['./dropdown-account.component.scss'],
})
export class DropdownAccountComponent implements OnInit, OnDestroy {
  public user: any;
  public channelSubscribe: any;
  public listSubscribers: any = [];
  public ngAvatar: any;
  public accountMenu: any = []
  public active: boolean = false

  constructor(
    public translate: TranslateService,
    private update: UpdateService,
    private rest: RestService,
    private library: FaIconLibrary,
    private service: SharedService,
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
  ) {
    library.addIcons(faPencilAlt);
  }

  ngOnInit(): void {
    this.accountMenu = this.service.accountMenu
    this.user = this.rest.getCurrentUser();
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.update.cookieUser.subscribe((res) => {
      this.user = this.rest.getCurrentUser();
    });
    this.listSubscribers.push(observer1$);
  }

  gotoTopLevel(child: any) {
    const { route, link, action } = child
    if (action) {
      action()
    } else if (link) {
      if (isPlatformBrowser(this.platformId)) {
        window.open(link, '_blank');
      }
    } else if (route) {
      this.router.navigateByUrl(route)
    }
  }

  checkSession = () => this.rest.checkIsLogged();

  ngOnDestroy(): void {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }
}
