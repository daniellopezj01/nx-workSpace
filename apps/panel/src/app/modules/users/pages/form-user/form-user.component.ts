import { AuthService } from './../../../../services/auth/auth.service';
import { RestService } from './../../../../services/rest/rest.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchCountryField,
  CountryISO,
} from 'ngx-intl-tel-input';
import * as _ from 'lodash';
import genderJson from '../../../../../assets/jsonFiles/gender.json';
import countriesJson from '../../../../../assets/jsonFiles/countries.json';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
})
export class FormUserComponent implements OnInit {
  @Input() mode = 'list';
  @Input() activeUpdate = false;
  @Input() user: any;
  public optionsButtons: any = ['save', 'list'];
  public SearchCountryField = SearchCountryField;
  public loading = false;
  public CountryISO = CountryISO;
  public form: FormGroup;
  public countries: string[] = [];
  public id: any = null;
  public today = new Date();
  public data: any = [];
  public ngSelectStatus: any;
  public ngSelectRol: any;
  public genders: Array<any> = [];
  public ngSelectGender: any;
  public roles: any = [
    {
      name: 'Usuario',
      value: 'user',
    },
    {
      name: 'Administrador',
      value: 'admin',
    },
  ];
  public status: any = [
    {
      name: 'Habilitado',
      value: 'enabled',
    },
    {
      name: 'Deshabilitado',
      value: 'disabled',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    public translate: TranslateService,
    private rest: RestService,
    private auth: AuthService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      document: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      birthDate: ['', [Validators.required]],
      status: ['', Validators.required],
      gender: ['', Validators.required],
      description: [],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.genders = genderJson;

    this.route.params.subscribe((params) => {
      this.id = params.id === 'add' ? '' : params.id;
    });
    countriesJson.forEach((element: any) => {
      this.countries.push(element);
    });
    if (this.activeUpdate) {
      this.beforeUpdate();
      this.optionsButtons.push('trash');
    }
  }

  cbList = () => {
    this.router.navigate(['/', 'users']);
  };

  onSubmit(): any {
    if (this.activeUpdate) {
      this.updateUser();
    } else {
      this.saveUser();
    }
  }

  async updateUser() {
    let user;
    await this.trasnformObjectUpdate().then((a) => {
      user = a;
    });
    this.rest.patch(`users/${this.user._id}`, user).subscribe(
      (res) => {
        this.user = res
        this.rest.toastSuccess(
          'Se ha actualizado el Usuario exitosamente.',
          'Usuario Actualizado'
        );
        this.loading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async saveUser() {
    let user;
    await this.trasnformObjectSave().then((a) => {
      user = a;
    });
    this.rest.post(`users`, user).subscribe(
      (res) => {
        const { accessToken } = res;
        this.exchange(accessToken);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public exchange = (accessToken: any) => {
    this.auth
      .exchange({ accessToken })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        ({ user }) => {
          this.loading = false;
          this.rest.showToast('CHECK_PENDING');
          this.router.navigate(['/', 'users', user._id]);
          this.form.reset();
        },
        (e) => {
          this.chackError(e)
          this.form.reset();
        }
      );
  };

  trasnformObjectSave = () =>
    new Promise((resolve) => {
      const user = _.clone(this.form.value);
      const { internationalNumber, countryCode } = this.form.value.phone;
      user.phone = {
        number: internationalNumber,
        code: countryCode,
      };
      resolve(user);
    });

  trasnformObjectUpdate = () =>
    new Promise((resolve) => {
      const user = _.clone(this.form.value);
      const { phone } = this.form.value;
      const { internationalNumber, countryCode } = phone;
      user.phone = {
        number: internationalNumber,
        code: countryCode,
      };
      resolve(user);
    });

  beforeUpdate() {
    const newObject = _.clone(this.user);
    const { status, role, birthDate, gender } = this.user;
    this.ngSelectStatus = status;
    this.ngSelectRol = role;
    this.ngSelectGender = gender;
    if (birthDate) {
      newObject.birthDate = new Date(birthDate);
    }
    this.form.patchValue(newObject);
  }

  chackError(error: any) {
    const { msg } = error.errors.msg;
    this.rest.showToast(msg);
  }

  cbTrash() {
    this.rest
      .delete(`users/${this.id}`)
      .subscribe((res) => this.router.navigate(['/', 'users']));
  }
}
