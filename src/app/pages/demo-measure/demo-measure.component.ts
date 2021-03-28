import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromLonLat } from 'ol/proj.js';
import View from 'ol/View';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppService } from '../../app.service';
import { MangolConfig } from './../../../../projects/mangol/src/lib/interfaces/config.interface';
import { MangolService } from './../../../../projects/mangol/src/lib/mangol.service';
import { code } from './code';

@Component({
  selector: 'app-demo-measure',
  templateUrl: './demo-measure.component.html',
  styleUrls: ['./demo-measure.component.scss'],
})
export class DemoMeasureComponent implements OnInit, OnDestroy {
  mangolConfig: MangolConfig;
  sidebarOpenedSubscription: Subscription;

  code = code;

  constructor(
    private appService: AppService,
    private mangolService: MangolService
  ) {
    this.sidebarOpenedSubscription = this.appService.sidebarOpenedSubject.subscribe(
      (opened) => {
        if (opened !== null) {
          this.mangolService.mapState$
            .pipe(
              map((m) => m.map),
              filter((m) => m !== null)
            )
            .subscribe((m) => {
              setTimeout(() => {
                m.updateSize();
              }, 500);
            });
        }
      }
    );
  }

  ngOnInit() {
    this.mangolConfig = {
      map: {
        target: 'mangol-demo-measure',
        view: new View({
          projection: 'EPSG:3857',
          center: fromLonLat([108.083496, 15.919074], 'EPSG:3857'),
          zoom: 6,
        }),
      },
      sidebar: {
        title: 'Measure example',
        opened: true,
        toolbar: {
          measure: {},
        },
      },
    };
  }

  ngOnDestroy() {
    if (this.sidebarOpenedSubscription) {
      this.sidebarOpenedSubscription.unsubscribe();
    }
    this.mangolService.resetMangolState();
  }
}
