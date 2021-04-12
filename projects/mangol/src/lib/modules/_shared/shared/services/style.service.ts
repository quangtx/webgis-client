import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import Select from 'ol/interaction/Select';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Icon from 'ol/style/Icon';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import * as fromMangol from './../../../../store/mangol.reducers';
import { take, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Map from 'ol/Map';

@Injectable({
  providedIn: 'root'
})

export class StyleService {
  hoverColor: [number, number, number];
  map$: Observable<Map>;

  constructor(private store: Store<fromMangol.MangolState>) {
    this.store
      .select(state => state.featureinfo.hoverColor)
      .subscribe(color => (this.hoverColor = color));
    this.map$ = this.store.select(state => state.map.map).pipe(filter((m) => m !== null));;
  }

  hoverStyle(feature: Feature) {
    return [
      new Style({
        fill: new Fill({
          // color: this._colorWithOpacity(this.hoverColor, 0.3)
        }),
        stroke: new Stroke({
          color: this._colorWithOpacity(this.hoverColor, 0.5),
          width: 10
        }),
        image:
        new Icon({
          scale: [0.03, 0.03],
          crossOrigin: 'anonymous',
          src: '../assets/img/map_layer_point/Location.png',
          // src: '../assets/img/map_layer_point/map-marker-alt-solid.svg',
        }),
        // new CircleStyle({
        //   fill: new Fill({
        //     color: this._colorWithOpacity(this.hoverColor, 0.7)
        //   }),
        //   stroke: new Stroke({
        //     width: 1,
        //     color: this._colorWithOpacity(this.hoverColor, 0.9)
        //   }),
        //   radius: 7
        // })
      })
    ];
  }

  private _colorWithOpacity(
    color: number[],
    opacity: number
  ): [number, number, number, number] {
    return <[number, number, number, number]>[
      color[0],
      color[1],
      color[2],
      opacity
    ];
  }
}
