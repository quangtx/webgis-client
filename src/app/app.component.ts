import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  homeButtonStateTrigger,
  routeStateTrigger,
  sidebarButtonStateTrigger
} from './app.animations';
import { AppService } from './app.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  sidebarOpenedSubscription: Subscription;
  activeRouteData = '/demo-home';
  createPoint: FormGroup;
  constructor(
    private appService: AppService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder,
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
    this.logo = 'assets/img/logo/mangol_logo.png';
    this.items = [
      {
        number: '/demo-map',
        title: 'Map'
      },
      {
        number: '/demo-controllers',
        title: 'Map controllers'
      },
      {
        number: '/demo-sidebar',
        title: 'Sidebar'
      },
      {
        number: '/demo-layertree',
        title: 'Layertree'
      },
      {
        number: '/demo-featureinfo',
        title: 'Feature info'
      },
      {
        number: '/demo-measure',
        title: 'Measure'
      },
      {
        number: '/demo-print',
        title: 'Print'
      },
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
    this.appService.sidebarOpenedSubject.next(!this.sidebarOpened);
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

  navigate(item: MangolDemoItem) {
    if (window.innerWidth <= 1000) {
      this.appService.sidebarOpenedSubject.next(false);
    }
    this.router.navigate([item.number]);
  }

  navigateHome() {
    if (window.innerWidth <= 1000) {
      this.appService.sidebarOpenedSubject.next(false);
    }
    this.router.navigate(['/demo-home']);
  }

  onSubmit() {
    this.openSnackBar('Submit form', 'Submit')
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
