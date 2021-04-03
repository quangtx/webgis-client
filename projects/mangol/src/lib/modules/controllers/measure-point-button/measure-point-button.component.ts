import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CursorMode } from '../../../interfaces/cursor-mode';
import { Store } from '@ngrx/store';
import { MeasureMode } from '../../../store/measure/measure.reducers';
import GeometryType from 'ol/geom/GeometryType';
import * as fromMangol from './../../../store/mangol.reducers';
import * as MeasureActions from '../../../store/measure/measure.actions';
import * as SidebarActions from '../../../store/sidebar/sidebar.actions';
import * as CursorActions from '../../../store/cursor/cursor.actions';
import { MangolControllersPointOptions } from '../../../interfaces/config-map-controllers.interface';


@Component({
  selector: 'app-measure-point-button',
  templateUrl: './measure-point-button.component.html',
  styleUrls: ['./measure-point-button.component.scss']
})
export class MeasurePointButtonComponent implements OnInit {
  animationDuration = 500;
  point$: Observable<MangolControllersPointOptions>;
  cursorMode: CursorMode;
  cursorVisible: boolean;

  constructor(private store: Store<fromMangol.MangolState>) {
    this.point$ = this.store.select(state => state.controllers.point);
  }

  ngOnInit() {
  }

  setPoint(type) {
    this.store.select(state => state.cursor.mode).subscribe(mode => (this.cursorMode = mode));
    if(type === 'point' && this.cursorMode.cursor =='default') {
      const mode: MeasureMode = {
        fontIcon: "gps_fixed",
        fontSet: "ms",
        geometryName: GeometryType.POINT,
        type: "point",
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
