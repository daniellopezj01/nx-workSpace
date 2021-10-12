import { QuestionsService } from './questions.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AgentsComponent } from '../agents/agents.component';
import { ModalsService } from '../../../core/services/modals.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  @ViewChild('checkAccepted') checkAccepted: any;
  @Input() questions: any;
  @Input() agents: any;
  public currenQuestion = null;
  public position = 0;
  public loading = false;
  public value = false;
  public showSection = false;

  constructor(
    private modalService: ModalsService,
    private shared: SharedService,
  ) { }

  ngOnInit(): void {
    if (this.questions.length) {
      this.currenQuestion = this.questions[this.position];
    }
  }

  closeModal() {
    this.modalService.close();
  }

  accepted() {
    if (this.questions[this.position]?.specialKey === 'agent') {
      this.modalService.close();
      const data = { agentList: this.agents };
      this.modalService.openComponent(data, AgentsComponent, ' big-modal w-100');
    } else if (this.position >= this.questions.length - 1) {
      // this.shared.completedQuestions.emit();
      this.shared.loadSignature.emit({});
      this.closeModal();
    } else {
      this.position++;
      this.showSection = false;
      this.currenQuestion = this.questions[this.position];
      if (this.checkAccepted?._inputElem?.nativeElement?.checked) {
        this.checkAccepted._inputElem.nativeElement.checked = false;
      }
    }
  }

  refuse() {
    if (this.questions[this.position].specialKey) {
      this.position++;
      this.showSection = false;
      this.accepted()
    } else {
      this.showSection = true;
    }
  }
}
