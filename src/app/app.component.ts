import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import {
  homeButtonStateTrigger,
  routeStateTrigger,
  sidebarButtonStateTrigger
} from './app.animations';
import { AppService } from './app.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';

import { environment } from '../../src/environments/environment';

export interface MangolDemoItem {
  number: string;
  title: string;
}

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    homeButtonStateTrigger,
    sidebarButtonStateTrigger,
    routeStateTrigger
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  items: MangolDemoItem[];
  logo: string;
  sidebarOpened: boolean;
  auth:  String;
  apiUrl = environment.baseUrlApi;
  sidebarOpenedSubscription: Subscription;
  activeRouteData = '/demo-home';
  createPoint: FormGroup;
  constructor(
    private cdr: ChangeDetectorRef,
    private appService: AppService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
  ) {
    this.sidebarOpenedSubscription = this.appService.sidebarOpenedSubject.subscribe(
      opened => {
        if (opened !== null) {
          this.sidebarOpened = opened;
        }
      }
    );
    // this.appService.sidebarOpenedSubject.next(window.innerWidth > 500);
  }

  ngOnInit() {
    this.auth = this.cookieService.get('auth_token');
    this.logo = 'assets/img/logo/mangol_logo.png';
    this.items = [
      {
        number: '/home',
        title: 'Full functionality'
      }
    ];
  }

  ngOnDestroy() {
    if (this.sidebarOpenedSubscription) {
      this.sidebarOpenedSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    let token = this.cookieService.get('auth_token');
    if(token && this.router.url !== '/login' && this.router.url !== '/about') {
      this.appService.sidebarOpenedSubject.next(!this.sidebarOpened);
    }
  }

  getAnimationData(outlet: RouterOutlet) {
    let activeRouteData: string = null;
    const routeData = outlet.activatedRouteData['animation'];
    if (!routeData) {
      activeRouteData = '/demo-home';
    } else {
      activeRouteData = '/' + routeData['page'];
    }
    this.activeRouteData = activeRouteData;
    return this.activeRouteData;
  }

  navigateAbout() {
    if (window.innerWidth <= 1000) {
      this.appService.sidebarOpenedSubject.next(false);
    }
    this.router.navigate(['/about']);
  }

  navigateHome() {
    this.cdr.detectChanges();
    this.router.navigate(['/']);
  }

  goToInfo() {
    this.router.navigate(['/user-info']);
  }

  onSubmit() {
    this.openSnackBar('Submit form', 'Submit')
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  /**
   * Logout
   */
  logout() {
    axios.post(this.apiUrl + 'logout')
    this.cookieService.set('auth_token',  '', 0);
    this.router.navigate(['/login']);
  }

  /**
   * Logout
   */
  login() {
    this.cookieService.set('auth_token',  '', 0);
    this.router.navigate(['/login']);
  }

  /**
   * Registration member
   */
  registration() {
    this.router.navigate(['/registration']);
  }
}
