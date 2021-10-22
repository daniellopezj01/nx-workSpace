import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  SearchCountryField,
  CountryISO,
} from 'ngx-intl-tel-input';
import * as _ from 'lodash';
import countriesJson from '../../../../../assets/jsonFiles/countries.json';
import { RestService } from 'src/app/services/rest/rest.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import {
  FilePickerComponent,
} from 'ngx-awesome-uploader';
import { MediaService } from 'src/app/modules/shared/drop-galery/media.service';
import { MediaVideoService } from 'src/app/modules/shared/drop-video/media-video.service';

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.scss'],
})
export class DetailsUserComponent implements OnInit, AfterContentChecked {
  @Input() id: any;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('uploader', { static: false }) uploader: FilePickerComponent;
  @ViewChild('uploaderVideo', { static: false })
  uploaderVideo: FilePickerComponent;
  public optionsButtons = ['save'];
  public optionsButtonsVideo = ['save'];
  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;
  public user: any;
  public countries: string[] = [];
  public loading: any;
  public formLocation: FormGroup;
  public formSecurity: FormGroup;
  public ngSelectCountry: any;

  public history: any = [
    {
      name: 'Ajustes',
      router: ['/', 'settings'],
    },
  ];
  public preview = {
    image: null,
    blob: null,
  };

  constructor(
    public share: SharedService,
    private rest: RestService,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    public media: MediaService,
    public mediaVideo: MediaVideoService
  ) { }

  ngOnInit(): void {
    this.rest.setActiveConfirmLeave = true;
    this.media.files = [];
    this.mediaVideo.files = [];
    this.formLocation = this.formBuilder.group({
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
    });
    this.formSecurity = this.formBuilder.group(
      {
        password: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ])
        ),
        confirmpassword: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ])
        ),
      },
      {
        validators: this.passwordCheck.bind(this),
      }
    );
    countriesJson.forEach((element) => {
      this.countries.push(element);
    });
    this.loadData();
  }

  passwordCheck(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmpassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  get f() {
    return this.formSecurity.controls;
  }

  validateMessage() {
    if (!this.f.password.errors && !this.f.confirmpassword.errors) {
      return !!this.formSecurity?.errors;
    }
  }

  ngAfterContentChecked(): any {
    this.cdref.detectChanges();
  }

  loadData = () => {
    this.loading = true;
    this.rest.get(`users/${this.id}`).subscribe((res) => {
      this.user = res;
      this.loadaDataInforms()
      this.loading = false;
    });
  };

  update(Typeform) {
    let objectPatch;
    switch (Typeform) {
      case 'location':
        objectPatch = this.formLocation.value;
        break;
      default:
        break;
    }
    this.rest.patch(`users/${this.user._id}`, objectPatch).subscribe((res) => {
      this.rest.toastSuccess(
        'Se ha actualizado el Usuario exitosamente.',
        'Usuario Actualizado'
      );
    });
  }

  loadaDataInforms() {
    const { country, avatar, video } = this.user
    this.formLocation.patchValue(this.user);
    if (video) {
      this.mediaVideo.files = [video]
    }
    if (avatar) {
      this.media.files = [avatar]
    }
    this.ngSelectCountry = country
  }

  updateSecurity() {
    const object = { id: this.user._id, ...this.formSecurity.value };
    this.rest.post('resetPasswordFromAdmin', object).subscribe((res) => {
      this.rest.toastSuccess(
        'Se ha actualizado la Contraseña exitosamente.',
        'Contraseña Actualizado'
      );
    });
  }

  async deleteFile(type: String) {
    let objectDelete: any = {};
    objectDelete[`${type}`] = null;
    this.rest.patch(`users/${this.user._id}`, objectDelete).subscribe((res) => {
      this.rest.toastSuccess(
        `Se ha Eliminado el ${type} del Usuario exitosamente.`,
        `${type} Eliminado`
      );
      if (type === 'video') {
        this.mediaVideo.files = [];
        _.remove(this.optionsButtonsVideo, (a) => a === 'trash');
        this.mediaVideo.deleteVideo.emit(false);
      } else {
        this.media.files = [];
        _.remove(this.optionsButtons, (a) => a === 'trash');
        this.media.deleteImage.emit(false);
      }
    });
  }

  async updateFile(type: String) {
    let urlAvatar, objectUpdate;
    switch (type) {
      case 'avatar':
        await this.media.loadImages().then((res: any) => {
          const item: any = _.head(res);
          urlAvatar = typeof item === 'string' ? item : item.source.original;
          objectUpdate = { avatar: urlAvatar };
        });
        break;
      case 'video':
        await this.mediaVideo.loadVideo().then((res: any) => {
          const item: any = _.head(res);
          urlAvatar = typeof item === 'string' ? item : item.source.original;
          objectUpdate = { video: urlAvatar };
        });
        break;
    }
    this.rest.patch(`users/${this.user._id}`, objectUpdate).subscribe((res) => {
      this.rest.toastSuccess(
        `Se ha actualizado el ${type} del Usuario exitosamente.`,
        `${type} Actualizado`
      );
      if (type === 'video') {
        this.optionsButtonsVideo.push('trash');
        this.mediaVideo.files = [res.video];
      } else {
        this.optionsButtons.push('trash');
        this.media.files = [res.avatar];
      }
    });
  }
}
