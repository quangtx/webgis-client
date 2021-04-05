import Layer from 'ol/layer/Layer';

export class RemoveLayer {
    public removeAll: boolean;
    public layer: Layer;

    constructor(removeAll: boolean, layer: Layer) {
        this.removeAll = removeAll;
        this.layer = layer;
    }
  }