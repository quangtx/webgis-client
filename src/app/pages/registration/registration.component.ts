import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { EncrDecrService } from '../../EncrDecr/encr-decr.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';
import { AuthGuardService } from 'src/app/AuthGuard/auth-guard.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  apiUrl = environment.baseUrlApi

  constructor(
    private formBuilder: FormBuilder,
    private EncrDecr: EncrDecrService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private authGuard: AuthGuardService
  ) { }

  ngOnInit() {
    this.authGuard.canActivate();
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // acceptTerms: [false, Validators.requiredTrue]
    }, {
        validator: this.MustMatch('password', 'confirmPassword')
    });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

  get f() { return this.registerForm.controls; }

  /**
   * Sign up
   */
  async onSignUp() {
    this.submitted = true;
    const form = this.registerForm.value;
    let resExist = await axios.get(this.apiUrl + 'users?username=' + form.username.trim())
    // stop here if form is invalid
    if (this.registerForm.invalid || (resExist && resExist.data)) {
        if(resExist && resExist.data.length > 0) {
          this.openSnackBar('Tài khoản đã tồn tại', 'Đóng')
          return;
        }
    }

    var passwordEncrypted = this.EncrDecr.set(environment.SECRET_KEY, form.password);
    const data = {
      firt_name: form.firstName,
      last_name: form.lastName,
      username: form.username.trim(),
      password: passwordEncrypted,
      email: form.email,
      token: '',
      exprise_at: 3600
    }
    axios.post(this.apiUrl + "users", data )
    .then((response) => {
      if(response && response.data) {
        this.openSnackBar('Đăng ký thành viên thành công', 'Đóng')
        this.router.navigate(['/'])
      }
    })
    .catch((error) => {
        console.log(error);
    });
  }

  /**
   * Cancel registration
   */
  cancel() {
    this.router.navigate(['/'])
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
