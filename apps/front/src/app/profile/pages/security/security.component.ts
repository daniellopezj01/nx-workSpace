import { Component } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../../../core/services/rest.service';
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent {
  showInfo: any = [
    {
      key: 'Password',
      value: 'Esta contraseña te brinda el acceso a la aplicacion.',
    },
  ];
  squeareItem = {
    title: 'USER.SECURITY.SQUARE_TITLE_SECURITY',
    description: 'USER.SECURITY.SQUARE_DESC_SECURITY',
    icon: '../../../../../assets/user/logo-security.svg',
  };
  titleButton = 'Update Password';
  form: FormGroup;
  position: any;
  loading = false;
  active = false;
  subForms = false;

  constructor(
    private formBuilder: FormBuilder,
    private rest: RestService,
    private router: Router
  ) {
    this.form = this.formBuilder.group(
      {
        old: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ])
        ),
        newpass: new FormControl(
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
        validators: this.password.bind(this),
      }
    );
  }

  password(formGroup: FormGroup) {
    const { value: password }: any = formGroup.get('newpass');
    const { value: confirmPassword }: any = formGroup.get('confirmpassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  buttonActive(i: any) {
    this.position = i;
    this.active = true;
  }

  get f() {
    return this.form.controls;
  }
  validateMessage() {
    if (!this.f.newpass.errors && !this.f.confirmpassword.errors) {
      return !!this.form?.errors;
    }
    return null
  }

  validateInput(control: any) {
    return (
      (!control.pristine && control.errors) || (this.subForms && control.errors)
    );
  }

  cancel() {
    this.position = null;
    this.active = false;
    this.subForms = false;
  }

  // tslint:disable-next-line:triple-equals
  isItemActive = (i: any) => this.position !== i && this.active;
  isItem = (i: any) => this.position === i && this.active;

  update() {
    this.subForms = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.rest.post('profile/changePassword', this.form.value, false).subscribe(
      (res) => {
        this.rest.showToast('SUCCESS_CHANGE');
        this.actions();
        this.router.navigate(['/', 'user']);
      },
      (err) => {
        this.rest.showToast('WRONG_PASSWORD');
        this.actions();
      }
    );
  }

  actions() {
    this.loading = false;
    this.subForms = false;
    this.form.reset();
  }
}
