import { Component, Input, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss'],
})
export class ReadMoreComponent implements OnInit {
  @Input() content = '';
  @Input() classText?: string;
  @Input() limit?: number;
  @Input() minLimit = 0;
  @Input() completeWords?: boolean;
  @Input() activeControls = true;

  public isContentToggled?: boolean;
  public nonEditedContent = '';

  ngOnInit() {
    if (this.activeControls) {
      this.activeControls = this.content.length > this.minLimit;
    }
    this.nonEditedContent = this.content;
    if (this.activeControls) {
      this.content = this.formatContent(this.content);
    }
  }

  toggleContent() {
    this.isContentToggled = !this.isContentToggled;
    this.content = this.isContentToggled ? this.nonEditedContent : this.formatContent(this.content);
  }

  formatContent(content: string) {
    if (this.completeWords) {
      this.limit = content.substr(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substr(0, this.limit)}...`;
  }
}
