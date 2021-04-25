import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { EncrDecrService } from '../../EncrDecr/encr-decr.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  apiUrl = environment.baseUrlApi;

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private EncrDecr: EncrDecrService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private cookieService: CookieService
    ) { }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
  get f() { return this.loginForm.controls; }

  /**
   * Register member
   */
  onSignIn() {
    this.submitted = true;
    const self =this;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    let username = this.loginForm.value.username
    let password = this.loginForm.value.password
    axios.post(this.apiUrl + 'login', {username: username, password: password}).then(res => {
      if(res && res.data) {
        this.openSnackBar('Đăng nhập thành công!', 'Đóng')
        let time  = parseInt((new Date().getTime() / 1000).toFixed(0)) + 3600;
        this.cookieService.set('auth_token', res.data.token , time);
        console.log(22222222222);
        console.log(this.cookieService.get('auth_token'))
        self.cdr.detectChanges();
        self.router.navigate(['/']);
      }else {
        this.openSnackBar('Đăng nhập lỗi! Tài khoản hoặc mật khẩu không chính xác!', 'Đóng')
      }
    }).catch(e => {
      console.error('ERROR:', e);
      this.openSnackBar('Đăng nhập lỗi! Tài khoản hoặc mật khẩu không chính xác!', 'Đóng')
    })
  }

  /**
   * Open snack bar.
   * @param message
   * @param action
   */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
