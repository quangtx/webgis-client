import { Component, OnDestroy, OnInit } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj.js';
import OSM from 'ol/source/OSM';
import TileJSON from 'ol/source/TileJSON';
import TileWMS from 'ol/source/TileWMS';
import View from 'ol/View';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { MangolLayer } from '../../../../projects/mangol/src/lib/classes/Layer';
import { AppService } from '../../app.service';
import { MangolLayerGroup } from '../../../../projects/mangol/src/lib/classes/LayerGroup';
import { MangolConfig } from '../../../../projects/mangol/src/lib/interfaces/config.interface';
import { MangolService } from '../../../../projects/mangol/src/lib/mangol.service';
import { code } from './code';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuardService } from '../../AuthGuard/auth-guard.service'
import { StyleService } from 'projects/mangol/src/lib/modules/_shared/shared/services/style.service';
import { Feature } from 'ol';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  mangolConfig: MangolConfig;
  sidebarOpenedSubscription: Subscription;

  code = code;


  constructor(
    private appService: AppService,
    private mangolService: MangolService,
    private cookieService: CookieService,
    private authGuard: AuthGuardService,
    private styleService: StyleService
  ) {
    this.sidebarOpenedSubscription = this.appService.sidebarOpenedSubject.subscribe(
      opened => {
        if (opened !== null) {
          this.mangolService.mapState$
            .pipe(
              map(m => m.map),
              filter(m => m !== null)
            )
            .subscribe(m => {
              setTimeout(() => {
                m.updateSize();
              }, 500);
            });
        }
      }
    );
  }

  ngOnInit() {
    // this.authGuard.canActivate();
    const pseudoGeoJSONFormat = <any>GeoJSON;
    this.mangolConfig = {
      map: {
        target: 'mangol-home',
        view: new View({
          projection: 'EPSG:900913',
          center: fromLonLat(
            [108.083496, 15.919074],
            'EPSG:900913'
          ),
          zoom: 6,
          minZoom: 6,
        }),
        controllers: {
          zoom: {
            show: true,
            showTooltip: true,
            dictionary: {
              zoomIn: 'Zoom in',
              zoomOut: 'Zoom out'
            }
          },
          visiable: {
            show: true,
            showTooltip: true,
            dictionary: {
              showHideLayer: 'Show/Hide Layers',
            }
          },
          position: {
            show: true,
            precision: 6
          },
          fullScreen: {
            show: false,
            showTooltip: true
          }
        },
        layers: [
          new MangolLayer({
            name: 'OpenStreetMap Layer',
            details: 'Here are the OSM layer details',
            layer: new TileLayer({
              source: new OSM(),
              visible: true
            })
          }),
          new MangolLayerGroup({
            name: 'Layers',
            children: [
              new MangolLayer({
                name: 'Ngu???n th???i',
                queryable: true,
                querySrs: 'EPSG:900913',
                layer: new VectorLayer({
                  source: new VectorSource({
                    //url:'http://localhost:3000/nguonthai',
                    // url:'assets/geojson/province.geojson',
                     // url: 'http://188.166.116.137:8080/geoserver/gwc/service/wms',
                      //url: 'http://localhost:8081/geoserver/SongHong/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SongHong%3Anguonthai&maxFeatures=1500&outputFormat=application%2Fjson',
                      url: 'https://master.demo.geonode.org/geoserver/ows?service=WMS&version=1.1.1&request=GetFeatureInfo&exceptions=application%2Fjson&layers=geonode:congtieu20&query_layers=geonode:congtieu20&styles=&x=51&y=51&height=101&width=101&srs=EPSG:3857&bbox=11696067.95308154,2182577.6296796077,11957829.071935963,2490338.74853403&feature_count=300&info_format=application%2Fjson&ENV=&access_token=SfR2dhmCnSzBsC2DV8qu6EfqpYyQQA',
                    format: new pseudoGeoJSONFormat({
                      dataProjection: 'EPSG:900913',
                      featureProjection: 'EPSG:900913'
                    })
                  }),
                  style: (feat) => {
                    return this.styleService.hoverStyle(<Feature>feat)
                  },
                  visible: true
                })
              })
              // new MangolLayerGroup({
              //   name: 'Coutries & Cities',
              //   children: [
                  // new MangolLayer({
                  //   name: 'Country borders',
                  //   queryable: true,
                  //   querySrs: 'EPSG:900913',
                  //   details:
                  //     'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                  //     layer: new VectorLayer({
                  //       source: new VectorSource({
                  //         url: 'assets/geojson/countries.geojson',
                  //         format: new pseudoGeoJSONFormat({
                  //           dataProjection: 'EPSG:900913',
                  //           featureProjection: 'EPSG:900913'
                  //         })
                  //       })
                  //     })
                  // }),
              //   ]
              // }),
              // new MangolLayerGroup({
              //   name: 'Coronavirus (COVID-19)',
              //   children: [
              //     new MangolLayer({
              //       name: 'Covid-19',
              //       queryable: true,
              //       querySrs: 'EPSG:900913',
              //       layer: new VectorLayer({
              //         source: new VectorSource({
              //           url:'assets/geojson/covid19.geojson',
              //           format: new pseudoGeoJSONFormat({
              //             dataProjection: 'EPSG:900913',
              //             featureProjection: 'EPSG:900913'
              //           })
              //         }),
              //         visible: true
              //       })
              //     })
              //   ]
              // })
            ]
          })
        ]
      },
      sidebar: {
        // collapsible: true,
        // opened: true,
        // mode: 'side',
        toolbar: {
          layertree: {
            active: true,
            disabled: false,
            title: 'Layers',
            details: {
              opacity: {
                sliderStep: 1,
                showLabels: true
              }
            }
          },
          featureinfo: {
            title: 'Feature info'
          },
          // measure: { disabled: false },
          print: { disabled: false }
        }
      }
    };
  }

  ngOnDestroy() {
    if (this.sidebarOpenedSubscription) {
      this.sidebarOpenedSubscription.unsubscribe();
    }
    this.mangolService.resetMangolState();
  }
}
