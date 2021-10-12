import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss'],
})
export class SquareComponent implements OnInit {
  @Input() item: any;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goto(str: string) {
    this.router.navigate([`/user/${str}`]);
  }
}
