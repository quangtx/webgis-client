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
    private cookieService: CookieService

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
    console.warn('cookie', this.cookieService.get('auth_token'));
    const pseudoGeoJSONFormat = <any>GeoJSON;
    this.mangolConfig = {
      map: {
        target: 'mangol-home',
        view: new View({
          projection: 'EPSG:4326',
          center: fromLonLat(
            [108.083496, 15.919074],
            'EPSG:4326'
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
              new MangolLayerGroup({
                name: 'Coutries & Cities',
                children: [
                  new MangolLayer({
                    name: 'Country borders',
                    queryable: true,
                    querySrs: 'EPSG:4326',
                    details:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                      layer: new VectorLayer({
                        source: new VectorSource({
                          url: 'assets/geojson/countries.geojson',
                          format: new pseudoGeoJSONFormat({
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:4326'
                          })
                        })
                      })
                  }),
                  new MangolLayer({
                    name: 'Province',
                    queryable: true,
                    querySrs: 'EPSG:4326',
                    layer: new VectorLayer({
                      source: new VectorSource({
                        url:'assets/geojson/province.geojson',
                          // 'http://188.166.116.137:8080/geoserver/gwc/service/wms',
                        format: new pseudoGeoJSONFormat({
                          dataProjection: 'EPSG:4326',
                          featureProjection: 'EPSG:4326'
                        })
                      }),
                      visible: true
                    })
                  })
                ]
              }),
              new MangolLayerGroup({
                name: 'Coronavirus (COVID-19)',
                children: [
                  new MangolLayer({
                    name: 'Covid-19',
                    queryable: true,
                    querySrs: 'EPSG:4326',
                    layer: new VectorLayer({
                      source: new VectorSource({
                        url:'assets/geojson/covid19.geojson',
                        format: new pseudoGeoJSONFormat({
                          dataProjection: 'EPSG:4326',
                          featureProjection: 'EPSG:4326'
                        })
                      }),
                      visible: true
                    })
                  })
                ]
              })
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
