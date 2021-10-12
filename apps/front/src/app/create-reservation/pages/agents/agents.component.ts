import { Component, Input, OnInit } from '@angular/core';
import { ModalsService } from '../../../core/services/modals.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  @Input() public agentList: any = []
  public agentSelected: any;
  public loading: boolean = false

  constructor(
    private modalService: ModalsService,
    private shared: SharedService
  ) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.modalService.close();
  }

  sendAgent() {
    this.shared.loadSignature.emit({ agent: this.agentSelected });
    this.closeModal()
  }
}
