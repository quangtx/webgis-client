import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {
  MangolControllersZoomOptions,
  MangolControllersFullScreenOptions
} from '../../interfaces/config-map-controllers.interface';
import { MangolConfig } from './../../interfaces/config.interface';
import * as ControllersActions from './../../store/controllers/controllers.actions';
import {
  MangolControllersPositionStateModel,
  MangolControllersRotationStateModel
} from './../../store/controllers/controllers.reducers';
import * as fromMangol from './../../store/mangol.reducers';
// import { MangolLayer, MangolLayerGroup } from 'projects/mangol/src/public_api';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import TileWMS from 'ol/source/TileWMS';
// import View from 'ol/View';
// import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'mangol-controllers',
  templateUrl: './controllers.component.html',
  styleUrls: ['./controllers.component.scss']
})
export class ControllersComponent implements OnInit, OnDestroy {
  @Input()  visiable: boolean;
  @Output() visiableChange = new EventEmitter<boolean>();

  mangolConfig: MangolConfig;
  config$: Observable<MangolConfig>;
  hasSidebar$: Observable<boolean>;
  sidebarCollapsible$: Observable<boolean>;
  zoom$: Observable<MangolControllersZoomOptions>;
  position$: Observable<MangolControllersPositionStateModel>;
  rotation$: Observable<MangolControllersRotationStateModel>;
  fullScreen$: Observable<MangolControllersFullScreenOptions>;

  configSubscription: Subscription;

  constructor(private store: Store<fromMangol.MangolState>) {
    this.config$ = this.store.select(state => state.config.config);
    this.hasSidebar$ = this.store.select(state => state.sidebar.hasSidebar);
    this.sidebarCollapsible$ = this.store.select(
      state => state.sidebar.collapsible
    );
    this.zoom$ = this.store.select(state => state.controllers.zoom);
    this.position$ = this.store.select(state => state.controllers.position);
    this.rotation$ = this.store.select(state => state.controllers.rotation);
    this.fullScreen$ = this.store.select(state => state.controllers.fullScreen);
  }

  ngOnInit() {
    // this.mangolConfig = {
    //   map: {
    //     target: 'mangol-demo-full',
    //     view: new View({
    //       projection: 'EPSG:900913',
    //       center: fromLonLat(
    //         [108.083496, 15.919074],
    //         'EPSG:900913'
    //       ),
    //       zoom: 6,
    //       // minZoom: 6,
    //     }),
    //     controllers: {
    //       zoom: {
    //         show: true,
    //         showTooltip: true,
    //         dictionary: {
    //           zoomIn: 'Zoom in',
    //           zoomOut: 'Zoom out'
    //         }
    //       },
    //       visiable: {
    //         show: true,
    //         showTooltip: true,
    //         dictionary: {
    //           showHideLayer: 'Show/Hide Layers',
    //         }
    //       },
    //       position: {
    //         show: true,
    //         precision: 2
    //       },
    //       fullScreen: {
    //         show: false,
    //         showTooltip: true
    //       }
    //     },
    //     layers: [
    //       new MangolLayer({
    //         name: 'OpenStreetMap Layer',
    //         details: 'Here are the OSM layer details',
    //         layer: new TileLayer({
    //           source: new OSM(),
    //           visible: true
    //         })
    //       }),
    //       new MangolLayerGroup({
    //         name: 'Overlays',
    //         children: [
    //           new MangolLayer({
    //             name: 'Roads',
    //             queryable: true,
    //             querySrs: 'EPSG:900913',
    //             layer: new TileLayer({
    //               source: new TileWMS({
    //                 url: '',
    //                   // 'http://188.166.116.137:8080/geoserver/gwc/service/wms',
    //                 crossOrigin: 'anonymous',
    //                 params: {
    //                   LAYERS: ['naturalearth:roads'],
    //                   format: 'image/png',
    //                   SRS: 'EPSG:900913'
    //                 }
    //               }),
    //               opacity: 0.5,
    //               visible: true
    //             })
    //           }),
    //           new MangolLayerGroup({
    //             name: 'Coutries & Cities',
    //             children: [
    //               new MangolLayer({
    //                 name: 'Country borders',
    //                 queryable: true,
    //                 querySrs: 'EPSG:900913',
    //                 details:
    //                   'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    //                 layer: new TileLayer({
    //                   source: new TileWMS({
    //                     url: '',
    //                       // 'http://188.166.116.137:8080/geoserver/gwc/service/wms',
    //                     crossOrigin: 'anonymous',
    //                     params: {
    //                       LAYERS: ['naturalearth:countries'],
    //                       format: 'image/png',
    //                       SRS: 'EPSG:900913'
    //                     }
    //                   }),
    //                   opacity: 0.5,
    //                   visible: false
    //                 })
    //               }),
    //               new MangolLayer({
    //                 name: 'Cities',
    //                 queryable: true,
    //                 querySrs: 'EPSG:900913',
    //                 layer: new TileLayer({
    //                   source: new TileWMS({
    //                     url: '',
    //                       // 'http://188.166.116.137:8080/geoserver/gwc/service/wms',
    //                     crossOrigin: 'anonymous',
    //                     params: {
    //                       LAYERS: ['naturalearth:populated_places'],
    //                       format: 'image/png',
    //                       SRS: 'EPSG:900913'
    //                     }
    //                   }),
    //                   visible: true
    //                 })
    //               })
    //             ]
    //           })
    //         ]
    //       })
    //     ]
    //   },
    //   // sidebar: {
    //   //   collapsible: true,
    //   //   opened: true,
    //   //   title: 'Full functionality example',
    //   //   mode: 'side',
    //   //   toolbar: {
    //   //     layertree: {
    //   //       active: true,
    //   //       disabled: false,
    //   //       title: 'Layers',
    //   //       details: {
    //   //         opacity: {
    //   //           sliderStep: 1,
    //   //           showLabels: true
    //   //         }
    //   //       }
    //   //     },
    //   //     featureinfo: {
    //   //       title: 'Feature info'
    //   //     },
    //   //     measure: { disabled: false },
    //   //     print: { disabled: false }
    //   //   }
    //   // }
    // };

    this.configSubscription = this.config$.subscribe(config => {
      this.store.dispatch(new ControllersActions.Reset());
      if (
        typeof config !== 'undefined' &&
        config !== null &&
        !!config.map &&
        !!config.map.controllers
      ) {
        /**
         * Zoom buttons config
         */
        if (!!config.map.controllers.zoom) {
          const zoomOptions = config.map.controllers.zoom;
          if (!!zoomOptions.show) {
            this.store.dispatch(
              new ControllersActions.SetShowZoom(zoomOptions.show)
            );
          }
          if (!!zoomOptions.dictionary) {
            this.store.dispatch(
              new ControllersActions.SetZoomDictionary(zoomOptions.dictionary)
            );
          }
          if (!!zoomOptions.showTooltip) {
            this.store.dispatch(
              new ControllersActions.SetShowTooltip(zoomOptions.showTooltip)
            );
          }
        }
        /**
         * Scalebar config (not yet implemented)
         */
        if (!!config.map.controllers.scalebar) {
          this.store.dispatch(
            new ControllersActions.SetScalebar(config.map.controllers.scalebar)
          );
        }
        /**
         * Mouse position config
         */
        if (!!config.map.controllers.position) {
          const positionOptions = config.map.controllers.position;
          if (!!positionOptions.show) {
            this.store.dispatch(
              new ControllersActions.SetShowPosition(positionOptions.show)
            );
          }
          if (!!positionOptions.precision) {
            this.store.dispatch(
              new ControllersActions.SetPositionPrecision(
                positionOptions.precision
              )
            );
          }
          if (!!positionOptions.dictionary) {
            this.store.dispatch(
              new ControllersActions.SetPositionDictionary(
                positionOptions.dictionary
              )
            );
          }
        }
        /**
         * Rotation button config
         */
        if (!!config.map.controllers.rotation) {
          const rotationOptions = config.map.controllers.rotation;
          if (!!rotationOptions.show) {
            this.store.dispatch(
              new ControllersActions.SetShowRotation(rotationOptions.show)
            );
          }
          if (!!rotationOptions.dictionary) {
            this.store.dispatch(
              new ControllersActions.SetRotationDictionary(
                rotationOptions.dictionary
              )
            );
          }
          if (!!rotationOptions.showTooltip) {
            this.store.dispatch(
              new ControllersActions.SetShowRotationTooltip(
                rotationOptions.showTooltip
              )
            );
          }
        }
        /**
         * Fullscreen button config
         */
        if (!!config.map.controllers.fullScreen) {
          const fullscreenOptions = config.map.controllers.fullScreen;
          if (fullscreenOptions.hasOwnProperty('show')) {
            this.store.dispatch(
              new ControllersActions.SetShowFullscreen(fullscreenOptions.show)
            );
          }
          if (fullscreenOptions.hasOwnProperty('dictionary')) {
            this.store.dispatch(
              new ControllersActions.SetFullscreenDictionary(
                fullscreenOptions.dictionary
              )
            );
          }
          if (fullscreenOptions.hasOwnProperty('showTooltip')) {
            this.store.dispatch(
              new ControllersActions.SetShowFullscreenTooltip(
                fullscreenOptions.showTooltip
              )
            );
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
}
