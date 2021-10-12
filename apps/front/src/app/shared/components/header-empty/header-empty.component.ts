import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { UpdateService } from '../../../profile/pages/media/services/update.service';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-header-empty',
  templateUrl: './header-empty.component.html',
  styleUrls: ['./header-empty.component.scss'],
})
export class HeaderEmptyComponent implements OnInit, OnDestroy {
  imageUser = '../../../../../assets/user/user-without-image.svg';
  withUser = false;
  user: any;
  channelSubscribe: any;
  faPencilAlt = faPencilAlt;

  constructor(
    public translate: TranslateService,
    private cookies: CookieService,
    private router: Router,
    private update: UpdateService,
    private rest: RestService,
    private library: FaIconLibrary
  ) {
    library.addIcons(faPencilAlt);
  }

  ngOnInit(): void {
    this.rest
      .checkSession(false, true)
      .then((a) => {
        this.user = this.rest.getCurrentUser();
        this.withUser = true;
      })
      .catch((e) => {
        this.withUser = false;
      });
    this.channelSubscribe = this.update.cookieUser.subscribe((res) => {
      this.user = this.rest.getCurrentUser();
    });
  }

  ngOnDestroy(): void {
    try {
      this.channelSubscribe.unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }

  goTo() {
    this.router.navigate(['/']);
  }
}
