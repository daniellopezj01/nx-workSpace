import { Injectable, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RestService } from '../../core/services/rest.service';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  public activeMessage = true;
  public activeConversation = true;
  public conversations: any = [];
  protected user: any;
  private widthScreen: any;
  private currentChat: any = 0;

  constructor(
    private rest: RestService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.user = this.rest.getCurrentUser();
    if (isPlatformBrowser(this.platformId)) {
      this.widthScreen = window.innerWidth;
    }
  }

  activeAll() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.widthScreen > 768) {
        this.activeConversation = true;
        this.activeMessage = true;
      }
    }
  }

  setWidth(value: any) {
    this.widthScreen = value;
  }

  getWidth() {
    return this.widthScreen;
  }

  setCurrentChat(chat: any) {
    this.currentChat = chat;
  }

  getCurrentChat() {
    return this.currentChat;
  }

  getConversations() {
    return this.conversations;
  }

  setConversations(res: any) {
    this.conversations = res;
  }

  showMessage() {
    if (this.widthScreen < 768) {
      this.activeMessage = true;
      this.activeConversation = false;
    }
  }

  showConversation() {
    if (this.widthScreen < 768) {
      this.activeMessage = false;
      this.activeConversation = true;
    } else {
      this.activeAll();
    }
  }

  changeMessage(b: boolean) {
    if (this.widthScreen < 768) {
      this.activeMessage = b;
    }
  }

  changeConversation(b: boolean) {
    if (this.widthScreen < 768) {
      this.activeConversation = b;
    }
  }
}
