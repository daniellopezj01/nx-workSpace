import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TextRichService } from './text-rich.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { Subscription } from 'rxjs';
import 'quill-mention';
import { SharedService } from '../shared.service';
import {
  distinctUntilChanged,
} from 'rxjs/operators';

@Component({
  selector: 'app-text-rich',
  templateUrl: './text-rich.component.html',
  styleUrls: ['./text-rich.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextRichComponent),
      multi: true
    }
  ]
})

export class TextRichComponent implements OnInit, OnDestroy {
  @ViewChild(QuillEditorComponent, { static: true }) editor: QuillEditorComponent;
  faTimes = faTimes;
  faPaperclip = faPaperclip;
  modules: any;
  @Output() returnValue = new EventEmitter<any>();
  @Input() customId: any = false;
  @Input() mode = 'add';
  @Input() isFull: boolean;
  @Input() cancelBtn: boolean;
  @Input() activeLoadFiles: boolean = false;
  listSubscribers: Subscription[] = [];
  currentId: any = false;
  // tslint:disable-next-line:variable-name
  public users_subscriptions: any = [];
  public fullMode: boolean;
  counter = 0;
  iconPdf = '../../../../assets/downloadPdf.svg'
  value: string;
  isDisabled: boolean;
  onChange = (change: any) => { };
  onTouch = () => {
  };

  constructor(public textRich: TextRichService, private shared: SharedService) { }


  clickAction = (a = null) => {
    this.fullMode = false;
    this.textRich.cbClickAction.emit(a);
  };

  clickCancel = (a = null) => {
    this.fullMode = false;
    this.textRich.cbCancelBtn.emit(a);
  };

  /**
   * ReactForm
   */
  onInput(value: string | any) {
    const { html } = value;
    this.counter = (html) ? html.length : 0;
    this.value = html;
    this.onTouch();
    this.onChange(this.value);
    this.removeMentionUser(this.value);
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value || '';
      this.counter = value.length;
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onSelectMention = (item: any, insertItem: any) => {
    this.selectMention(JSON.parse(item.target));
  };

  public selectMention = (data: any = {}) => {
    this.users_subscriptions.push(data);
    this.textRich.mentionUsers.emit(data);
  };

  ngOnInit(): void {
    this.observers()
    this.modules = {
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        onSelect: (item, insertItem) => {
          this.onSelectMention(item, insertItem);
          const editor = this.editor.quillEditor;
          insertItem(item);
          editor.insertText(editor.getLength() - 1, '', 'user');
        },

        source: async (searchTerm, renderList) => {
          const values = await this.textRich.loadUser(searchTerm) as any;
          if (searchTerm.length === 0) {
            renderList(values, searchTerm);
          } else {
            const matches = [];

            values.forEach((entry) => {
              if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                matches.push(entry);
              }
            });
            renderList(matches, searchTerm);
          }
        }
      },
      toolbar: []
    };
  }

  observers() {
    const observer1$ = this.shared.callbackValueTextRich.pipe(
      distinctUntilChanged()).subscribe(res => {
        this.currentId = res.id
        if (this.currentId === this.customId) {
          this.returnData()
        }
      })
    const observer2$ = this.shared.setFilesTextRich.pipe(
      distinctUntilChanged()).subscribe(res => {
        const { id, attached } = res
        this.currentId = id
        if (this.currentId === this.customId) {
          this.setFiles(attached)
        }
      })
    this.listSubscribers.push(observer1$, observer2$)
  }
  ngOnDestroy(): void {
    this.listSubscribers.map(s => s.unsubscribe());
  }

  async returnData() {
    if (this.textRich.addAttachments.length) {
      const files = await this.textRich.uploadAttachments()
      this.returnValue.emit(files)
    } else {
      this.returnValue.emit([])
    }
  }

  setFiles(attached) {
    if (attached.length) {
      this.textRich.addAttachments = attached
    }
  }

  removeMentionUser = (data: string) => {
    try {
      setTimeout(() => {
        const containerEdit = this.editor.quillEditor.container;
        const listMentions = containerEdit.querySelectorAll('.ql-editor .mention');
        const really = [];
        listMentions.forEach((element) => {
          const { id } = element.dataset;
          really.push(id);
        });
        this.textRich.userRemoved.emit(really);
      }, 200);
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  onPaste = ($event: ClipboardEvent) => this.textRich.onPaste($event);
}
