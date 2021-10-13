import { SharedService } from './../../../../../core/services/shared.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements AfterViewInit {
  @ViewChild('templatePhone') templatePhone: ElementRef | undefined;
  @ViewChild('templateChat') templateChat: ElementRef | undefined;
  @ViewChild('templatePlace') templatePlace: ElementRef | undefined;
  public itemsHeader: Array<headerInterface> = [];
  public chatButtons: any = [
    {
      text: 'HEADER.CONTACT_MENU.MESSENGER_CHAT',
      link: 'http://m.me/mochileros.com.mx',
      color: '#4B6AAB',
      icon: 'uil-facebook-messenger'
    },
    {
      text: 'HEADER.CONTACT_MENU.MESSENGER_CHAT',
      link: 'https://wa.link/f9azy1',
      color: '#4BAB53',
      icon: 'uil-whatsapp'
    },
    {
      text: 'HEADER.CONTACT_MENU.MESSENGER_WEB',
      link: 'https://jivo.chat/ps2UK9T7Kf',
      color: '#313331',
      icon: 'uil-user'
    },
  ]
  socialButtons = [
    {
      color: '#3b5998',
      icon: 'uil-facebook-f',
      link: 'https://www.facebook.com/mochileros.com.mx'
    },
    {
      color: '#F21D6E',
      link: 'https://www.instagram.com/mochileros.mex/',
      icon: 'uil-instagram'
    },
    {
      color: '#f00',
      link: 'https://www.youtube.com/channel/UClXvORGUGA-V53LcWaJGL2w',
      icon: 'uil-youtube'
    },
  ]

  constructor(public service: SharedService) { }

  ngAfterViewInit(): void {
    this.itemsHeader = [
      {
        title: 'HEADER.CONTACT_MENU.CALL_US',
        template: this.templatePhone,
      },
      {
        title: 'HEADER.CONTACT_MENU.CHAT_STAFF',
        template: this.templateChat,
      },
      {
        title: 'HEADER.CONTACT_MENU.VISIT_US',
        template: this.templatePlace,
      }
    ]
  }


  handlePhone(phone: any) {
    console.log('aqui se inicia la llamada');
  }

}
interface headerInterface {
  title: string;
  template: any;
}
