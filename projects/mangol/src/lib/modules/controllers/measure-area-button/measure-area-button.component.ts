import { Component, OnInit } from '@angular/core';
import { MangolControllersAreaOptions } from '../../../interfaces/config-map-controllers.interface';
import * as fromMangol from './../../../store/mangol.reducers';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CursorMode } from '../../../interfaces/cursor-mode';
import { MeasureMode } from '../../../store/measure/measure.reducers';
import GeometryType from 'ol/geom/GeometryType';
import * as MeasureActions from '../../../store/measure/measure.actions';
import * as SidebarActions from '../../../store/sidebar/sidebar.actions';
import * as CursorActions from '../../../store/cursor/cursor.actions';

@Component({
  selector: 'app-measure-area-button',
  templateUrl: './measure-area-button.component.html',
  styleUrls: ['./measure-area-button.component.scss']
})
export class MeasureAreaButtonComponent implements OnInit {
  animationDuration = 500;
  area$: Observable<MangolControllersAreaOptions>;
  cursorMode: CursorMode;
  cursorVisible: boolean;

  constructor(private store: Store<fromMangol.MangolState>) {
    this.area$ = this.store.select(state => state.controllers.area);
  }

  ngOnInit() {
  }

  setArea(type) {
    this.store.select(state => state.cursor.mode).subscribe(mode => (this.cursorMode = mode));
    if(type === 'area' && this.cursorMode.cursor =='default') {
      const mode: MeasureMode = {
        fontIcon: "ms-measure-area",
        fontSet: "ms",
        geometryName: GeometryType.POLYGON,
        type: "area",
      }
      const cursorMode: CursorMode = {
        cursor: "crosshair",
        text: "Click on Map to start measurement"
      }
      this.store.dispatch(new MeasureActions.HasMeasure(true));
      this.store.dispatch(new SidebarActions.SetSelectedModule('measure'));
      this.store.dispatch(new MeasureActions.SetMode(mode));
      this.store.dispatch(new CursorActions.SetMode(cursorMode));
    } else {
      this.store.dispatch(new CursorActions.ResetMode());
    }
  }

}
