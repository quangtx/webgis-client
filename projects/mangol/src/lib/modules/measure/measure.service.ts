import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import CircleStyle from 'ol/style/Circle';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {
  constructor() {}

  exchangeMetersAndKilometers(value: number): string {
    return value < 1000
      ? parseFloat(value.toString()).toFixed(2) + ' m'
      : parseFloat((value / 1000).toString()).toFixed(2) + ' km';
  }

  exchangeSqmetersAndSqkilometers(value: number): string {
    return value < 10000
      ? parseFloat(value.toString()).toFixed(2) + ' m\u00B2'
      : parseFloat((value / 1000000).toString()).toFixed(2) + ' km\u00B2';
  }

  getStyle(feature: Feature): Style[] {
    return [
      new Style({
        fill: new Fill({
          color: [0, 0, 0, 0]
        })
      }),
      new Style({
        image: new CircleStyle({
          radius: 2,
          fill: new Fill({
            color: [255, 0, 0, 0]
          }),
          stroke: new Stroke({color: 'red', width: 2}),
        }),
      }),
      new Style({
        stroke: new Stroke({
          color: [28, 28, 28, 1],
          width: 2,
          // lineDash: [5, 5]
        }),
        text: new Text({
          textAlign: 'center',
          textBaseline: 'middle',
          text: feature.getProperties().hasOwnProperty('text')
            ? feature.getProperties().text
            : '',
          font: 'normal 12px Roboto',
          fill: new Fill({
            color: 'white'
          }),
          backgroundFill: new Fill({
            color: [0, 0, 0, 0.6]
          }),
          overflow: true,
          offsetX: 0,
          offsetY: 15,
          rotation: 0,
          padding: [5, 8, 5, 8]
        })
      })
    ];
  }
}
