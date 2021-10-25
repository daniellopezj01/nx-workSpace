import { RestService } from './../../../../services/rest/rest.service';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ElementRef, Input, AfterViewChecked,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, AfterViewChecked {
  @ViewChild('containerMessage') componentRef?: ElementRef;
  // @ViewChild('#textArea') textArea: ElementRef;
  @Input() ticket: any;
  public user: any;
  public loadingButton = false;
  public mainLoading = true;
  public sendForm: FormGroup;
  public scroll = 0;
  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    private rest: RestService,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.sendForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.user = this.rest.getCurrentUser();
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
    return creator.role !== 'admin'
  }

  send() {
    this.loadingButton = true;
    const { message } = this.sendForm.value;
    const object = {
      message,
      id: this.ticket._id,
    };
    this.rest.post('Support', object).subscribe(
      (res: any) => {
        this.ticket = res;
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
