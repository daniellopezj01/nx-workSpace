import {
  Component,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { faCheckCircle, faHome } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessageInboxService } from '../../../inbox/services/message-inbox.service';
import { SharedService } from '../../../core/services/shared.service';
import { ModalsService } from '../../../core/services/modals.service';
import { RestService } from '../../../core/services/rest.service';
import { ModalMediaComponent } from '../../../shared/components/modal-media/modal-media.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  reviews: any;
  user: any;
  currentUser: any;
  loading = false;
  link = '';
  goEdit = false;
  itemsCheck: any = [];
  id: any;
  loadingReviews = false;
  numItems = 1;
  isBrowser: any;

  constructor(
    private active: ActivatedRoute,
    private library: FaIconLibrary,
    private modals: ModalsService,
    public translate: TranslateService,
    private cookies: CookieService,
    public datePipe: DatePipe,
    private shared: SharedService,
    public messageInboxService: MessageInboxService,
    @Inject(PLATFORM_ID) private platformId: any,
    private rest: RestService,
    private router: Router
  ) {
    library.addIcons(faCheckCircle, faHome);
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }
  }

  ngOnInit(): void {
    this.currentUser = this.rest.getCurrentUser();
    this.active.paramMap.subscribe((params: ParamMap) => {
      const key = params.get('id');
      if (!key) {
        this.router.navigate(['/', 'profile', this.currentUser?._id]);
      } else {
        this.getData();
      }
    });

    // this.getReviews();
  }

  getData(): any {
    this.itemsCheck = [];
    this.id = this.active.snapshot.paramMap.get('id');
    this.goEdit = this.currentUser?._id === this.id;
    this.loading = true;
    this.rest
      .get(`profile/public/${this.id}`)
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe(
        (res: any) => {
          this.user = res;
          this.checkVerified(res);
          if (isPlatformBrowser(this.platformId)) {
            // this.link = `${window.location.origin}/profile/${this.user?._id}?ref=${this.user?.referredCode}`;
            this.link = `${window.location.origin}/auth/register?ref=${this.user?.referredCode}`;
          }
        },
        (err) => {
          this.router.navigate(['/', 'profile']);
        }
      );
  }

  // getReviews() {
  //   this.rest.get(`comments/forUser/${this.id}`).subscribe(res => {
  //     this.loadingReviews = false;
  //     this.reviews = res;
  //   }, (err) => {
  //     console.log(err);
  //     this.loadingReviews = false;
  //   });
  // }

  callModalVideo() {
    if (this.user.video) {
      this.modals.openVideo(this.user.video, ModalMediaComponent);
    }
  }

  checkVerified(data: any) {
    this.addKey('PROFILE.VERIFIED_EMAIL', data?.email);
    // this.addKey('PROFILE.VERIFIED_DOCUMENT', data?.document);
    // this.addKey('PROFILE.VERIFIED_PHONE', data?.phone);
  }

  addKey(key: any, value: any) {
    this.itemsCheck.push({ key, value });
  }

  showToastClip() {
    this.rest.showToast('COPY_CLIP_BOARD');
  }
}
