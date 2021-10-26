import { EventEmitter, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RestService } from '../../core/services/rest.service';

@Injectable({
  providedIn: 'root',
})
export class MessageInboxService {
  public toMessage = 25;
  public fromMessage = 0;
  newTap = new EventEmitter<any>();
  sendInbox = new EventEmitter<any>();
  loadingConversation: any;

  constructor(private rest: RestService, private title: Title) { }

  playBeep = () => {
    const audio = new Audio('assets/media/alert.mp3');
    audio.load();
    audio.play();

    let title = this.title.getTitle();
    title = title.replace('🔔', '');
    this.title.setTitle(`🔔 ${title}`);
  }

  newConversationMock(to: any): any {
    this.newTap.emit(to);
  }

  saveNewChat = ({ message, to, _id }: any) =>
    new Promise((resolve, reject) => {
      this.rest
        .post(`messages`, { message, to }, true, { ignoreLoadingBar: '' })
        .subscribe(
          (res: any) => {
            this.sendInbox.emit({ _id, res });
            resolve({ _id, res });
          },
          (err) => reject(err)
        );
    })

  firstConversation(data: any, user: any): any {
    const object: any = {
      createdAt: '',
      firstMessage: data?.message,
      hash: data?.hash,
      list: ([] as any[]).concat([data?.message]),
      messages: ([] as any[]).concat([data?.message]),
      members: ([] as any[]).concat([data?.fromUserObj, data?.userMergeObj]),
      membersOmit: ([] as any[]).concat([data?.fromUserObj]),
      openBox: true,
      toFrom: {},
      type: 'single',
      _id: '',
    };
    return object
  }
}
