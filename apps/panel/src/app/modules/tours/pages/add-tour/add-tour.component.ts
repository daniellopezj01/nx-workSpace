import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { RestService } from '../../../../services/rest/rest.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-add-tour',
  templateUrl: './add-tour.component.html',
  styleUrls: ['./add-tour.component.scss'],
})
export class AddTourComponent implements OnInit {
  // @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
  //   event.returnValue = false;
  // }
  public id: any = false;
  public currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private share: SharedService,
    public router: Router,
    private auth: AuthService
  ) {}

  public history: any = [
    {
      name: 'Tours',
      router: ['/'],
    },
    {
      name: 'Nuevo',
      router: null,
    },
  ];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params.id === 'add' ? '' : params.id;
    });

    this.currentUser = this.auth.getCurrentUser();
  }

  save = () => {
    this.share.confirm().then(() => {
      this.share.saveTour.emit(true);
    });
  };
}
