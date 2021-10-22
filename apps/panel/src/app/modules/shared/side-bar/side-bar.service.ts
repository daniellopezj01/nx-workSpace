import { Injectable } from '@angular/core';
// import {AddTaskComponent} from '../add-task/add-task.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxCopilotService } from 'ngx-copilot';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RestService } from 'src/app/services/rest/rest.service';
@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  bsModalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private copilot: NgxCopilotService,
    private rest: RestService,
    private auth: AuthService
  ) { }

  public openNewTask = (data: any = {}) => {
    const initialState = {
      section: data,
    };
    // this.bsModalRef = this.modalService.show(
    //   AddTaskComponent,
    //   Object.assign({initialState}, {
    //     class: 'modal-new-task ',
    //     ignoreBackdropClick: true,
    //     animated: true,
    //     show: false
    //   })
    // );
  };

  saveStepper = (step: string) => {
    this.rest
      .patch(`profile/stepper`, {
        stepper: step,
      })
      .subscribe((res) => {
        this.auth.updateUser('stepper', res.stepper);
      });
  };

  /*Re initialize in specify step*/
  initPosition = (stepNumber: any) => this.copilot.checkInit(stepNumber);

  /*Next Step*/
  nextStep = (stepNumber: any) => this.copilot.next(stepNumber);

  /*Finish*/
  done = (step: any = null) => {
    this.saveStepper(!step ? 'intro_user' : step);
    this.copilot.removeWrapper();
  };
}
