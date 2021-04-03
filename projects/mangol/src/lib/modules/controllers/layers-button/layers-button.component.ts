import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromMangol from './../../../store/mangol.reducers';
import Map from 'ol/Map';
import { Observable } from 'rxjs';

import { shownStateTrigger } from '../controllers.animations';
import * as LayersActions from '../../../store/layers/layers.actions';
import { MangolControllersZoomOptions, MangolControllersVisiableOptions } from './../../../interfaces/config-map-controllers.interface';

@Component({
  selector: 'app-layers-button',
  templateUrl: './layers-button.component.html',
  styleUrls: ['./layers-button.component.scss']
})
export class LayersButtonComponent implements OnInit {
  animationDuration = 500;
  zoom$: Observable<MangolControllersZoomOptions>;
  visiable$: Observable<MangolControllersVisiableOptions>;

  @Input()  visiable: boolean;
  @Input()  iconName: string | '';
  @Output() visiableChange = new EventEmitter<boolean>();

  constructor(private store: Store<fromMangol.MangolState>) {
    this.zoom$ = this.store.select(state => state.controllers.zoom);
    this.visiable$ = this.store.select(state => state.controllers.visiable);
  }

  ngOnInit() {
  }


  showHideLayer() {
    this.visiable = this.visiable ? false :true
    this.visiableChange.emit(this.visiable);
    this.store.dispatch(new LayersActions.SetVisiable(this.visiable));
  }

  zoomOut() {
    this.store
      .select(state => state.map.map)
      .pipe(take(1))
      .subscribe((m: Map) => {
        m.getView().animate({
          zoom: m.getView().getZoom() - 1,
          duration: this.animationDuration
        });
      });
  }
}

