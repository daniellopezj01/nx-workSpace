import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  faLifeRing,
  faBell,
  faQuestionCircle,
  faUserCircle,
} from '@fortawesome/free-regular-svg-icons';
import {
  faAngleRight,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { faTired } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() public label = '';
  @Input() public history: any = [];
  public title = '';
  public logo = '';
  public listSubscribers: any = [];
  public limitAccount: any = '';
  public faTired = faTired;
  public faUserCircle = faUserCircle;
  public faBars = faBars;
  public faLifeRing = faLifeRing;
  public faAngleRight = faAngleRight;
  public faBell = faBell;
  public faQuestionCircle = faQuestionCircle;
  public form: FormGroup;
  public menu: any = [
    {
      name: 'Ayuda',
      icon: faLifeRing,
      target: `https://help.kitagil.com`,
    },
  ];

  constructor(
    private share: SharedService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      q: [''],
    });
  }

  ngOnInit(): void {
    this.listObserver();
    const { name } = this.share.getSettings() || { name: null };
    this.title = name;
    // this.logo = logo;
    this.share.changeHistory.subscribe((res: any) => {
      this.history = res;
    });
  }

  listObserver = () => {
    const observer1$ = this.share.changeSetting.subscribe((res: any) => {
      const { name } = res;
      this.title = name;
    });

    const observer2$ = this.share.limitAccount.subscribe((res: any) => {
      if (res) {
        this.limitAccount = res;
      }
    });
    this.listSubscribers.push(observer1$);
    this.listSubscribers.push(observer2$);
  };

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  search = () => {
    this.router.navigate(['/', 'search'], { queryParams: this.form.value });
    console.log(this.form.value);
  };

  openM = () => {
    // this.share.openMenu.emit(true)
  };
}
