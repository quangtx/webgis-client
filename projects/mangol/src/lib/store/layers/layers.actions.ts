import { Action } from '@ngrx/store';
import { createAction } from '@ngrx/store';
import { MangolLayer } from './../../classes/Layer';
import VectorLayer from 'ol/layer/Vector';

export const SET_LAYERS = '[Layers] Set Layers';
export const SET_MEASURE_LAYER = '[Layers] Set Measure Layer';
export const SET_VISIABLE = '[Layers] Set Visable';

export class SetLayers implements Action {
  readonly type = SET_LAYERS;
  constructor(public payload: MangolLayer[]) {}
}
export class SetMeasureLayer implements Action {
  readonly type = SET_MEASURE_LAYER;
  constructor(public payload: VectorLayer) {}
}
export class SetVisiable implements Action {
  readonly type = SET_VISIABLE;
  constructor(public payload: boolean) {}
}
export const onShowHide = createAction('[Layer Component] onShowHide')

export type LayersActions = SetLayers | SetMeasureLayer | SetVisiable;
