import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RestService } from '../core/services/rest.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  public data: any;
  public chats: any = [];
  public codeReservation: any;
  private currentCode: any;
  selectChat = new EventEmitter<any>();
  private currentHash = '';
  private currentChat: any;
  public requireUpdate = false;
  uploadPassport = new EventEmitter<any>();

  constructor(private rest: RestService, private router: Router) { }

  public setData(v: any) {
    this.data = { ...this.data, ...v };
  }

  public setCurrentChat(chat: any) {
    this.currentChat = chat;
  }

  public setCode(v: any) {
    this.codeReservation = v;
  }

  public async getData() {
    if (!this.data || this.currentCode !== this.codeReservation || this.requireUpdate) {
      await this.callData(`reservations/${this.codeReservation}`)
        .then((res) => {
          this.currentCode = this.codeReservation;
          this.data = res;
          this.chats = [];
          this.requireUpdate = false;
        })
        .catch((err) => {
          this.router.navigate(['user']);
        });
      return this.data;
    } else {
      return this.data;
    }
  }

  public async getChats() {
    if (this.data && this.chats.length === 0) {
      const { code } = this.data;
      await this.callData(`support/${code}`)
        .then((res: any) => {
          const { docs } = res;
          this.chats = docs;
        })
        .catch((err) => {
          console.log(err);
          this.router.navigate(['user']);
        });
      return this.chats;
    } else {
      return this.chats;
    }
  }

  public async getChat(hash: any) {
    if (this.data && this.currentHash !== hash) {
      const { code } = this.data;
      const params = { hash, codeReservation: code };
      await this.callData('support/currentChat', 'post', params)
        .then((res: any) => {
          // tslint:disable-next-line:no-shadowed-variable
          const { hash } = res;
          this.currentHash = hash;
          this.currentChat = res;
        })
        .catch((err) => {
          console.log(err);
          this.router.navigate(['user']);
        });
      return this.currentChat;
    } else {
      return this.currentChat;
    }
  }

  callData = (url: any, method: string = 'get', object = {}) =>
    new Promise((resolve, reject) => {
      let request: Observable<any> = new Observable
      if (method === 'get') {
        request = this.rest.get(url);
      } else if (method === 'post') {
        request = this.rest.post(url, object);
      }
      request.subscribe(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    })
}
