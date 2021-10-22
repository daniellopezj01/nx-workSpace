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
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import { faTired } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() label: string;
  @Input() history: any = [];
  public title: null;
  public logo: null;
  public listSubscribers: any = [];
  public limitAccount: any = null;
  faTired = faTired;
  faUserCircle = faUserCircle;
  faBars = faBars;
  faLifeRing = faLifeRing;
  faAngleRight = faAngleRight;
  faBell = faBell;
  faQuestionCircle = faQuestionCircle;
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
  ) {}

  ngOnInit(): void {
    this.listObserver();
    const { name } = this.share.getSettings() || { name: null };
    this.title = name;
    // this.logo = logo;
    this.form = this.formBuilder.group({
      q: [''],
    });
    this.share.changeHistory.subscribe((res) => {
      this.history = res;
    });
  }

  listObserver = () => {
    const observer1$ = this.share.changeSetting.subscribe((res) => {
      const { name } = res;
      this.title = name;
    });

    const observer2$ = this.share.limitAccount.subscribe((res) => {
      if (res) {
        this.limitAccount = res;
      }
    });
    this.listSubscribers.push(observer1$);
    this.listSubscribers.push(observer2$);
  };

  ngOnDestroy() {
    this.listSubscribers.forEach((a) => a.unsubscribe());
  }

  search = () => {
    this.router.navigate(['/', 'search'], { queryParams: this.form.value });
    console.log(this.form.value);
  };

  openM = () => {
    // this.share.openMenu.emit(true)
  };
}
