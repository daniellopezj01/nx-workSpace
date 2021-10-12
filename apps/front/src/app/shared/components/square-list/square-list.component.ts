import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-square-list',
  templateUrl: './square-list.component.html',
  styleUrls: ['./square-list.component.scss']
})
export class SquareListComponent implements OnInit {
  @Input() data: any = []

  ngOnInit(): void {
    console.log('SquareListComponent')
  }

}
