import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ElementRef, Input,
} from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @ViewChild('containerMessage') componentRef: ElementRef;
  // @ViewChild('#textArea') textArea: ElementRef;
  @Input() ticket: any;
  public user: any;
  public loadingButton = false;
  public mainLoading = true;
  sendForm: FormGroup;
  public scroll: number;
  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    private rest: RestService,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
    this.sendForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
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

  checkMessage = (creator) => {
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
      (res) => {
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
