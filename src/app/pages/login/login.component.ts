import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { EncrDecrService } from '../../EncrDecr/encr-decr.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios'
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
  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private EncrDecr: EncrDecrService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private cookieService: CookieService
    ) { }


  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
        validator: this.MustMatch('password', 'confirmPassword')
    });

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })

    document.getElementById("log-in").addEventListener('click', function() {
      document.getElementById("signIn").classList.add("active-dx");
      document.getElementById("signUp").classList.add("inactive-sx");
      document.getElementById("signUp").classList.remove("active-sx");
      document.getElementById("signIn").classList.remove("inactive-dx");
    });

    document.getElementById("btnBack").addEventListener('click', function(){
      document.getElementById("signUp").classList.add("active-sx");
      document.getElementById("signIn").classList.add("inactive-dx");
      document.getElementById("signIn").classList.remove("active-dx");
      document.getElementById("signUp").classList.remove("inactive-sx");
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

  onSignUp() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    const form = this.registerForm.value;
    var passwordEncrypted = this.EncrDecr.set(environment.SECRET_KEY, form.password);
    const data = {
      firt_name: form.firstName,
      last_name: form.lastName,
      username: form.username,
      password: passwordEncrypted,
      email: form.email,
      token: '',
      exprise_at: 3600
    }
    axios.post("http://localhost:3000/users", data )
    .then((response) => {
      if(response && response.data) {
        const res = response.data
        console.warn('response::::::::::::',res);
      }
    })
    .catch((error) => {
        console.log(error);
    });
  }

  onSignIn() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    let username = this.loginForm.value.username
    let password = this.loginForm.value.password

    axios.get("http://localhost:3000/users?username=" +username)
    .then((response) => {
      if(response && response.data) {
        const res = response.data
        if(Array.isArray(res) && res.length) {
          var passwordDecrypted = this.EncrDecr.get(environment.SECRET_KEY, res[0].password);
          if(password === passwordDecrypted) {
            this.openSnackBar('Login completed!', 'Login')
            this.generateToken(res[0])
            this.router.navigate(['/']);
          }else {
            this.openSnackBar('Login faile! Username or password incorrect!', 'Login')
          }
        }
      }
    })
    .catch((error) => {
        console.log(error);
    });
  }

  generateToken(userInfo) {
    let token = userInfo.username + ':'+ userInfo.password + ':' + userInfo.first_name + ':'+ userInfo.last_name + ':'+ userInfo.email;
    var tokenEncrypted = this.EncrDecr.set(environment.SECRET_KEY, token);
    axios.put('http://localhost:3000/users/' + userInfo.id, {
      firt_name: userInfo.firstName,
      last_name: userInfo.lastName,
      username: userInfo.username,
      password: userInfo.password,
      email: userInfo.email,
      token: tokenEncrypted,
      exprise_at: 3600
    }).then(res => {
      this.cookieService.set('auth_token',  tokenEncrypted);
      let time  = parseInt((new Date('2012.08.10').getTime() / 1000).toFixed(0)) + 3600;
      this.cookieService.set('exprise_at',  time.toString());
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
