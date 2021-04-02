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
export class AppComponent implements OnInit, DoCheck, OnDestroy {
  items: MangolDemoItem[];
  logo: string;
  sidebarOpened: boolean;
  sidebarOpenedSubscription: Subscription;
  activeRouteData = '/demo-home';

  constructor(
    private cdr: ChangeDetectorRef,
    private appService: AppService,
    private router: Router
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

  ngDoCheck() {
    this.cdr.detectChanges();
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
}
