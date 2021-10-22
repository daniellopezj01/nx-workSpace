import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  faThLarge,
  faAngleRight,
  faBell,
  faSearch,
  faChartLine,
  faSignOutAlt,
  faMapMarkedAlt,
  faUmbrellaBeach,
  faChartBar,
  faUser,
  faUsers,
  faEnvelope,
  faComments

} from '@fortawesome/free-solid-svg-icons';
import { faElementor } from '@fortawesome/free-brands-svg-icons';

import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SideBarService } from './side-bar.service';
// import {SearchService} from '../../modules/search/search.service';
// import {NotificationsService} from '../notifications-widget/notifications.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SharedService } from '../shared.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit, AfterViewInit {
  public logo: null;
  bsModalRef: BsModalRef;
  name: any;
  faSignOutAlt = faSignOutAlt;
  faAngleRight = faAngleRight;
  public menu: any;
  public currentUser: any;
  @ViewChild('step1') public step1: TemplateRef<any>;
  @ViewChild('step2') public step2: TemplateRef<any>;
  @ViewChild('step3') public step3: TemplateRef<any>;
  @ViewChild('step4') public step4: TemplateRef<any>;
  @ViewChild('step5') public step5: TemplateRef<any>;
  @ViewChild('step6') public step6: TemplateRef<any>;

  constructor(
    public auth: AuthService,
    private router: Router,
    private share: SharedService,
    public translate: TranslateService,
    public sideBarService: SideBarService // private searchService: SearchService, private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.getCurrent();
    const { logo, name } = this.share.getSettings();
  }

  getCurrent = () => {
    this.currentUser = this.auth.getCurrentUser();
  };

  logOut = () => {
    this.auth.logout().then(() => {
      this.router.navigate(['/', 'auth', 'login']);
    });
  };

  open(): any { }

  ngAfterViewInit(): void {
    this.menu = of([
      {
        name: 'SIDE_BAR.HOME',
        icon: faThLarge,
        route: ['/', 'home'],
        role: ['admin', 'user'],
        copilot: 1,
        copilotTemplate: this.step1,
        func: () => { },
      },
      {
        name: 'SIDE_BAR.TOURS',
        icon: faMapMarkedAlt,
        disable: false,
        route: ['/', 'tours'],
        role: ['admin', 'user'],
        copilot: 2,
        copilotTemplate: this.step2,
        func: () => {
          this.sideBarService.openNewTask();
        },
      },
      {
        name: 'SIDE_BAR.RESERVATION',
        icon: faUmbrellaBeach,
        copilot: 5,
        copilotTemplate: this.step5,
        disable: false,
        role: ['admin'],
        route: ['/', 'reservations'],
        func: () => { },
      },
      {
        name: 'SIDE_BAR.MOVEMENTS',
        icon: faChartBar,
        disable: false,
        role: ['admin', 'user'],
        route: ['/', 'movements'],
        func: () => { },
      },
      {
        name: 'SIDE_BAR.USERS',
        icon: faUser,
        disable: false,
        copilot: 6,
        copilotTemplate: this.step6,
        role: ['admin'],
        route: ['/', 'users'],
        func: () => { },
      },
      {
        name: 'SIDE_BAR.REFERREALS',
        icon: faUsers,
        disable: false,
        copilot: 6,
        copilotTemplate: this.step6,
        role: ['admin'],
        route: ['/', 'referrals'],
        func: () => { },
      },
      {
        name: 'SIDE_BAR.TYPE_REFERREALS',
        icon: faElementor,
        disable: false,
        copilot: 6,
        copilotTemplate: this.step6,
        role: ['admin'],
        route: ['/', 'type-referrals'],
        func: () => { },
      },
      {
        name: 'SIDE_BAR.SUPPORT',
        icon: faEnvelope,
        disable: false,
        copilot: 6,
        copilotTemplate: this.step6,
        role: ['admin'],
        route: ['/', 'support'],
        func: () => { },
      },
      {
        name: 'SIDE_BAR.COMMENTS',
        icon: faComments,
        disable: false,
        copilot: 6,
        copilotTemplate: this.step6,
        role: ['admin'],
        route: ['/', 'comments'],
        func: () => { },
      },
      {
        name: 'SIDE_BAR.FIND',
        icon: faSearch,
        disable: true,
        copilot: 3,
        copilotTemplate: this.step3,
        role: ['admin', 'user'],
        // route: ['/', 'map'],
        route: null,
        func: () => {
          // this.searchService.openSearch();
        },
      },

      {
        name: 'SIDE_BAR.NOTIFICATIONS',
        icon: faBell,
        disable: true,
        copilot: 4,
        copilotTemplate: this.step4,
        count: true,
        route: null,
        role: ['admin', 'user'],
        func: () => {
          // this.open();
        },
      },
    ]).pipe(delay(0));

    setTimeout(() => {
      if (this.currentUser?.stepper) {
        if (this.currentUser.role.includes('user')) {
          if (!this.currentUser?.stepper.includes('intro_user')) {
            this.sideBarService.initPosition(1);
          }
        }
        if (this.currentUser.role.includes('admin')) {
          if (!this.currentUser?.stepper.includes('intro_user')) {
            this.sideBarService.initPosition(1);
          } else if (!this.currentUser?.stepper.includes('intro_admin')) {
            this.sideBarService.initPosition(5);
          }
        }
      } else {
        this.sideBarService.initPosition(1);
      }
    }, 500);
  }
}
