import { Component, OnInit } from '@angular/core';
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

    // document.getElementById("log-in").addEventListener('click', function() {
    //   document.getElementById("signIn").classList.add("active-dx");
    //   document.getElementById("signUp").classList.add("inactive-sx");
    //   document.getElementById("signUp").classList.remove("active-sx");
    //   document.getElementById("signIn").classList.remove("inactive-dx");
    // });

    // document.getElementById("btnBack").addEventListener('click', function(){
    //   document.getElementById("signUp").classList.add("active-sx");
    //   document.getElementById("signIn").classList.add("inactive-dx");
    //   document.getElementById("signIn").classList.remove("active-dx");
    //   document.getElementById("signUp").classList.remove("inactive-sx");
    // });
  }
  get f() { return this.loginForm.controls; }

  onSignIn() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    let username = this.loginForm.value.username
    let password = this.loginForm.value.password
    axios.post(this.apiUrl + 'login', {email: username, password: password}).then(res => {
      if(res && res.data) {
        this.openSnackBar('Đăng nhập thành công!', 'Đóng')
        let time  = parseInt((new Date().getTime() / 1000).toFixed(0)) + 3600;
        this.cookieService.set('auth_token', res.data.token , time);
        this.router.navigate(['/']);
      }else {
        this.openSnackBar('Đăng nhập lỗi! Tài khoản hoặc mật khẩu không chính xác!', 'Đóng')
      }
    }).catch(e => {
      console.error('ERROR:', e);
      this.openSnackBar('Đăng nhập lỗi! Tài khoản hoặc mật khẩu không chính xác!', 'Đóng')
    })
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
