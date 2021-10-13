import { RestService } from './../../../../core/services/rest.service';
import { ReservationService } from '../../../reservation.service';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ElementRef, AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-message-support',
  templateUrl: './message-support.component.html',
  styleUrls: ['./message-support.component.scss'],
})
export class MessageSupportComponent implements OnInit, AfterViewChecked {
  @ViewChild('containerMessage') componentRef?: ElementRef;
  // @ViewChild('#textArea') textArea: ElementRef;
  public reservation: any;
  public hash = 'string';
  public chat: any;
  public code?: string;
  public user: any;
  public loadingButton = false;
  public mainLoading = true;
  public sendForm: FormGroup;
  public scroll?: number;
  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    private service: ReservationService,
    private active: ActivatedRoute,
    private rest: RestService,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.sendForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.code = this.active.snapshot?.parent?.params.id;
    this.service.setCode(this.code);
    this.hash = this.active.snapshot.params.hash;

    this.user = this.rest.getCurrentUser();
    this.reservation = await this.service.getData();

    this.chat = await this.service.getChat(this.hash);
    this.mainLoading = false;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();

    this.cdRef.detectChanges();
  }

  public scrollToBottom(): void {
    if (this.componentRef) {
      this.componentRef.nativeElement.scrollTop = this.componentRef.nativeElement.scrollHeight;
    }
  }

  get f() {
    return this.sendForm.controls.areaMessage;
  }

  checkMessage = (creator: any) => {
    // console.log(this.user._id === creator);
    return this.user._id.toString() === creator._id.toString();
  }

  send() {
    this.loadingButton = true;
    const { message } = this.sendForm.value;
    const { code } = this.reservation;
    console.log(code);
    const object = {
      message,
      hash: this.hash,
      codeReservation: code,
    };
    this.rest.post('Support', object).subscribe(
      (res) => {
        this.chat = res;
        this.service.setCurrentChat(this.chat);
        this.loadingButton = false;
        this.sendForm.reset();
      },
      (err) => {
        this.loadingButton = false;
        console.log(err);
      }
    );
  }
}
