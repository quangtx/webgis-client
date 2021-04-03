import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import Map from 'ol/Map';
import Feature from 'ol/Feature';
import Circle from 'ol/geom/Circle';
import Geometry from 'ol/geom/Geometry';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import BaseEvent from 'ol/events/Event';
import VectorSource from 'ol/source/Vector';
import { unByKey } from 'ol/Observable';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import { getArea, getLength } from 'ol/sphere';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { take, filter } from 'rxjs/operators';

import { MangolConfig } from './interfaces/config.interface';
import * as ConfigActions from './store/config/config.actions';
import * as MangolActions from './store/mangol.actions';
import * as fromMangol from './store/mangol.reducers';
import * as fromLayer from './store/layers/layers.reducers';
import * as SidebarActions from './store/sidebar/sidebar.actions';
import * as CursorActions from './store/cursor/cursor.actions';
import * as MeasureActions from './store/measure/measure.actions';
import * as LayerActions from './store/layers/layers.actions';

import { addCommon as addCommonProjections } from 'ol/proj.js';
import { register } from 'ol/proj/proj4.js';
import proj4 from 'proj4';
import { MeasureService } from './modules/measure/measure.service';
import VectorLayer from 'ol/layer/Vector';
import { MeasureMode, MeasureDictionary } from './store/measure/measure.reducers';

@Component({
  selector: 'mangol',
  templateUrl: './mangol.component.html',
  styleUrls: ['./mangol.component.scss']
})
export class MangolComponent implements OnInit {
  @HostBinding('class') class = 'mangol';
  @Input() config: MangolConfig;
  dictionary: MeasureDictionary;
  visiable$: Observable<boolean>;
  absoluteTop = '15%';
  hasSidebar$: Observable<boolean>;
  sidebarOpened$: Observable<boolean>;
  sidebarMode$: Observable<string>;
  map$: Observable<Map>;
  layer$: Observable<VectorLayer>;
  measureMode$: Observable<MeasureMode>;
  cursorText$: Observable<string>;
  combinedSubscription: Subscription;

  draw: Draw = null;
  initialText: string = null;
  displayValue: string = null;


  constructor(private store: Store<fromMangol.MangolState>,   private measureService: MeasureService) {
    this.store.select((state) => state.measure.dictionary).subscribe(dictionary => (this.dictionary = dictionary));
    this.visiable$ = this.store.select(state => state.layers.visiable)
    this.hasSidebar$ = this.store.select(state => state.sidebar.hasSidebar);
    this.sidebarOpened$ = this.store.select(state => state.sidebar.opened);
    this.sidebarMode$ = this.store.select(state => state.sidebar.mode);
    this.map$ = this.store.select(state => state.map.map).pipe(filter((m) => m !== null));;
    this.layer$ = this.store.select((state) => state.layers.measureLayer).pipe(filter((l) => l !== null));
    this.measureMode$ = this.store.select((state) => state.measure.mode).pipe(filter((mode) => mode !== null));
    this.cursorText$ = this.store.select((state) => state.cursor.mode.text);
  }

  ngOnInit() {
    addCommonProjections();
    register(proj4);
    const hasMeasure = true;
    this.store.dispatch(new MeasureActions.HasMeasure(hasMeasure));
    if (hasMeasure) {
        this.store.dispatch(new MeasureActions.SetTitle('measure'));
    }
    this.store.dispatch(new SidebarActions.SetSelectedModule('measure'));
    this.map$.pipe(take(1)).subscribe((m) => {
      const layer = new VectorLayer({
        source: new VectorSource(),
        style: (feature: Feature) => this.measureService.getStyle(feature),
      });
      m.addLayer(layer);
      this.store.dispatch(new LayerActions.SetMeasureLayer(layer));
    });

    // this.store.dispatch(new MangolActions.ClearState());
    this.store.dispatch(new ConfigActions.SetConfig(this.config));
    if (typeof this.config !== 'undefined' && this.config !== null) {
      // register the config in the Store
      this.store.dispatch(
        new SidebarActions.SetHasSidebar(!!this.config.sidebar)
      );
      if (!!this.config.sidebar) {
        /**
         * Basic sidebar options
         */
        if (!!this.config.sidebar.collapsible) {
          this.store.dispatch(
            new SidebarActions.SetCollapsible(this.config.sidebar.collapsible)
          );
        }
        if (!!this.config.sidebar.mode) {
          this.store.dispatch(
            new SidebarActions.SetMode(this.config.sidebar.mode)
          );
        }
        if (!!this.config.sidebar.opened) {
          this.store.dispatch(
            new SidebarActions.SetOpened(this.config.sidebar.opened)
          );
        }
        if (!!this.config.sidebar.title) {
          this.store.dispatch(
            new SidebarActions.SetTitle(this.config.sidebar.title)
          );
        }
      }
    } else {
      this.store.dispatch(new SidebarActions.SetHasSidebar(false));
    }

    this.combinedSubscription = combineLatest([
      this.map$,
      this.layer$,
      this.measureMode$,
    ]).subscribe(([m, layer, mode]) => {
      const mapLayers = m.getLayers().getArray();
      let maxZIndex = mapLayers.length - 1;
      m.getLayers()
        .getArray()
        .forEach((l) => {
          if (l !== layer) {
            maxZIndex = l.getZIndex() > maxZIndex ? l.getZIndex() : maxZIndex;
          }
        });
      layer.setZIndex(maxZIndex + 1);
      layer.getSource().clear();
      this._activateDraw(m, layer, mode);
    });
  }

  private _activateDraw(map: Map, layer: VectorLayer, mode: MeasureMode) {
    this._deactivateDraw(map, layer);
    map.addLayer(layer);
    this.draw = new Draw({
      source: layer.getSource(),
      style: (feature: Feature) => this.measureService.getStyle(feature),
      type: mode.geometryName,
    });
    this.initialText =
      (mode.type === 'radius'
        ? this.dictionary.drawStartTextRadius
        : this.dictionary.drawStartText) + '.';
    this.store.dispatch(
      new CursorActions.SetMode({
        text: this.initialText,
        cursor: 'crosshair',
      })
    );
    this.displayValue = this.initialText;
    let listener = null;
    this.draw.on('drawstart', (e: DrawEvent) => {
      layer.getSource().clear();
      this.store.dispatch(
        new CursorActions.SetMode({
          text: this.initialText,
          cursor: 'crosshair',
        })
      );
      this.displayValue = null;
      const feature = e.feature;
      listener = feature.getGeometry().on('change', (evt: BaseEvent) => {
        const geom: Geometry = evt.target;
        let displayValue: string = null;
        switch (mode.type) {
          case 'line':
            const lineString = geom as LineString;
            displayValue = `${
              this.dictionary.distance
            }: ${this.measureService.exchangeMetersAndKilometers(
              getLength(lineString)
            )}.`;
            break;
          case 'area':
            const polygon = geom as Polygon;
            displayValue = `${
              this.dictionary.area
            }: ${this.measureService.exchangeSqmetersAndSqkilometers(
              getArea(polygon)
            )}.`;
            break;
          case 'radius':
            const circle = geom as Circle;
            this.store
              .select((state) => state.controllers.position.coordinates)
              .pipe(take(1))
              .subscribe((position) => {
                const center = circle.getCenter();
                const dx = position[0] - center[0];
                const dy = position[1] - center[1];
                // This is needed for calculationg the length of the radius
                const line = new LineString([
                  [+center[0], +center[1]],
                  [+position[0], +position[1]],
                ]);
                // range (-PI, PI]
                let angle = Math.atan2(dy, dx);
                // rads to degs, range (-180, 180]
                angle *= 180 / Math.PI;
                // [0, 360]; clockwise; 0° = east
                angle = angle < 0 ? angle + 360 : angle;
                const displayAngle =
                  parseFloat(angle.toString()).toFixed(2) + '°';
                displayValue = `${
                  this.dictionary.radius
                }: ${this.measureService.exchangeMetersAndKilometers(
                  getLength(line)
                )}, ${this.dictionary.angle}: ${displayAngle}.`;
              });
            break;
          default:
            break;
        }
        this.store.dispatch(
          new CursorActions.SetMode({
            text: `${displayValue}\n${this.initialText}`,
            cursor: 'crosshair',
          })
        );
        this.displayValue = displayValue;
      });
    });

    this.draw.on('drawend', (e: DrawEvent) => {
      unByKey(listener);
      e.feature.setProperties({ text: this.displayValue });
      this.store.dispatch(
        new CursorActions.SetMode({
          text: this.dictionary.clickOnMap,
          cursor: 'crosshair',
        })
      );
    });

    this.draw.setActive(true);
    map.addInteraction(this.draw);
    this.store.dispatch(
      new CursorActions.SetMode({
        text: this.dictionary.clickOnMap,
        cursor: 'crosshair',
      })
    );
    this.displayValue = this.dictionary.clickOnMap;
  }

  private _deactivateDraw(map: Map, layer: VectorLayer) {
    this.displayValue = null;
    try {
      map.removeLayer(layer);
      map.removeInteraction(this.draw);
    } catch (error) {}
  }

  onOpenedChange(evt: boolean) {
    this.store
      .select(state => state.sidebar.opened)
      .pipe(take(1))
      .subscribe(opened => {
        if (opened !== evt) {
          this.store.dispatch(new SidebarActions.Toggle());
        }
        this.store
          .select(state => state.map.map)
          .pipe(take(1))
          .subscribe((m: Map) => {
            if (m !== null) {
              m.updateSize();
            }
          });
      });
  }
}
