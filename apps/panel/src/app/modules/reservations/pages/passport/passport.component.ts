import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.scss']
})
export class PassportComponent implements OnInit {
  @Input() reservation;
  constructor() { }

  ngOnInit(): void {
    console.log(this.reservation)
  }

  toDataURL(url) {
    return fetch(url)
      .then(response => {
        return response.blob();
      })
      .then(blob => {
        return URL.createObjectURL(blob);
      });
  }

  async download() {
    const { imagePassPort, code } = this.reservation
    const a = document.createElement("a");
    a.href = await this.toDataURL(imagePassPort.medium);
    a.download = `passport_${code}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
