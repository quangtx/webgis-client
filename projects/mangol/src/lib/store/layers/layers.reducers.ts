import { MangolLayer } from './../../classes/Layer';
import * as LayersActions from './layers.actions';
import VectorLayer from 'ol/layer/Vector';
import { createReducer, on } from '@ngrx/store';
import { RemoveLayer } from '../../classes/RemoveLayer';

export interface State {
  layers: MangolLayer[];
  visiable: boolean;
  measureLayer: VectorLayer;
  rmLayer: RemoveLayer[];
}

const initialState: State = {
  layers: [],
  visiable: false,
  measureLayer: null,
  rmLayer: []
};

export function layersReducer(
  state = initialState,
  action: LayersActions.LayersActions
) {
  switch (action.type) {
    case LayersActions.SET_LAYERS:
      return { ...state, layers: action.payload };
    case LayersActions.SET_VISIABLE:
      return { ...state, visiable: action.payload };
    case LayersActions.SET_MEASURE_LAYER:
      return { ...state, measureLayer: action.payload };
    case LayersActions.REMOVE_LAYER:
      return { ...state, rmLayer: action.payload };
    default:
      return state;
  }
}
