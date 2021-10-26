/* eslint-disable no-empty */
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../shared.service';
import { TranslateService } from '@ngx-translate/core';
import { DemoFilePickerAdapter } from '../../../directives/demo-file-picker.adapter';

@Component({
  selector: 'app-modal-wizard',
  templateUrl: './modal-wizard.component.html',
  styleUrls: ['./modal-wizard.component.scss'],
})
export class ModalWizardComponent {
  adapter = new DemoFilePickerAdapter(this.http, this.cookieService);
  public form: FormGroup;
  faTimes = faTimes;
  options: AnimationOptions = {
    path: '/assets/images/wizard.json',
  };
  public preview: modelPreview = {
    image: '',
    blob: ''
  };

  constructor(
    private ngZone: NgZone,
    public bsModalRef: BsModalRef,
    private http: HttpClient,
    private share: SharedService,
    private sanitizer: DomSanitizer,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    public translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      currency: ['', Validators.required],
      currencySymbol: [''],
      logo: [''],
    });
  }

  reset = () => {
    this.preview = {
      image: null,
      blob: null,
    };
  };

  close = () => {
    this.bsModalRef.hide();
  };

  update = () => {
    const { name, currency, currencySymbol } = this.form.value;
    const { _id } = this.share.getSettings();
    const formData = new FormData();
    formData.append('logo', this.preview.blob);
    formData.append('name', name);
    formData.append('currency', currency);
    formData.append('currencySymbol', currencySymbol);

    this.saveRest(`settings/${_id}`, formData).subscribe(
      (res: any) => {
        this.share.changeSetting.emit(res);
        this.cookieService.set(
          'settings',
          JSON.stringify(res),
          environment.daysTokenExpire,
          '/'
        );

        this.bsModalRef.hide();
      },
      (error: any) => console.log('err', error)
    );
  };

  fileAdded($event: any) {
    const unsafeImg = URL.createObjectURL($event.file);
    const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
    this.preview = {
      blob: $event.file,
      image,
    };
  }

  parseHeader = () => {
    const token = this.cookieService.get('session');
    const header = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
    return new HttpHeaders(header);
  };

  saveRest(path = '', body = {}): any {
    try {
      return this.http
        .patch(`${environment.api}/${path}`, body, {
          headers: this.parseHeader(),
        })
        .pipe(
          catchError((e: any) => {
            return throwError({
              status: e.status,
              statusText: e.statusText,
              e,
            });
          })
        );
    } catch (e) { }
  }
}

export class modelPreview {
  image: any;
  blob: any;
}
