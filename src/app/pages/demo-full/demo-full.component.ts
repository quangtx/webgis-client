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
import { MangolLayerGroup } from './../../../../projects/mangol/src/lib/classes/LayerGroup';
import { MangolConfig } from './../../../../projects/mangol/src/lib/interfaces/config.interface';
import { MangolService } from './../../../../projects/mangol/src/lib/mangol.service';
import { code } from './code';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

@Component({
  selector: 'app-demo-full',
  templateUrl: './demo-full.component.html',
  styleUrls: ['./demo-full.component.scss']
})
export class DemoFullComponent implements OnInit, OnDestroy {
  mangolConfig: MangolConfig;
  sidebarOpenedSubscription: Subscription;

  code = code;

  constructor(
    private appService: AppService,
    private mangolService: MangolService
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
    const pseudoGeoJSONFormat = <any>GeoJSON;
    this.mangolConfig = {
      map: {
        target: 'mangol-demo-full',
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
            name: 'Overlays',
            children: [
              new MangolLayer({
                name: 'Roads',
                queryable: true,
                querySrs: 'EPSG:900913',
                layer: new TileLayer({
                  source: new TileWMS({
                    url:'',
                      // 'http://188.166.116.137:8080/geoserver/gwc/service/wms',
                    crossOrigin: 'anonymous',
                    params: {
                      LAYERS: ['naturalearth:roads'],
                      format: 'image/png',
                      SRS: 'EPSG:900913'
                    }
                  }),
                  opacity: 0.5,
                  visible: true
                })
              }),
              new MangolLayerGroup({
                name: 'Coutries & Cities',
                children: [
                  new MangolLayer({
                    name: 'Country borders',
                    queryable: true,
                    querySrs: 'EPSG:900913',
                    details:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                      layer: new VectorLayer({
                        source: new VectorSource({
                          url: 'assets/geojson/countries.geojson',
                          format: new pseudoGeoJSONFormat({
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:900913'
                          })
                        })
                      })
                  }),
                  new MangolLayer({
                    name: 'Cities',
                    queryable: true,
                    querySrs: 'EPSG:900913',
                    layer: new TileLayer({
                      source: new TileWMS({
                        url:'',
                          // 'http://188.166.116.137:8080/geoserver/gwc/service/wms',
                        crossOrigin: 'anonymous',
                        params: {
                          LAYERS: ['naturalearth:populated_places'],
                          format: 'image/png',
                          SRS: 'EPSG:900913'
                        }
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
          // print: { disabled: false }
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
