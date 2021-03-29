import { Component, OnInit } from '@angular/core';
import * as fromMangol from './../../../store/mangol.reducers';
import { Store } from '@ngrx/store';
import { MangolControllersRadiusOptions } from '../../../interfaces/config-map-controllers.interface';
import { Observable } from 'rxjs';
import { CursorMode } from '../../../interfaces/cursor-mode';
import * as MeasureActions from '../../../store/measure/measure.actions';
import * as SidebarActions from '../../../store/sidebar/sidebar.actions';
import * as CursorActions from '../../../store/cursor/cursor.actions';
import { MeasureMode } from '../../../store/measure/measure.reducers';
import GeometryType from 'ol/geom/GeometryType';


@Component({
  selector: 'app-measure-radius-button',
  templateUrl: './measure-radius-button.component.html',
  styleUrls: ['./measure-radius-button.component.scss']
})
export class MeasureRadiusButtonComponent implements OnInit {
  animationDuration = 500;
  radius$: Observable<MangolControllersRadiusOptions>;
  cursorMode: CursorMode;
  cursorVisible: boolean;

  constructor(private store: Store<fromMangol.MangolState>) {
    this.radius$ = this.store.select(state => state.controllers.radius);
  }

  ngOnInit() {
  }

  setRadius(type) {
    this.store.select(state => state.cursor.mode).subscribe(mode => (this.cursorMode = mode));
    if(type === 'radius' && this.cursorMode.cursor =='default') {
      const mode: MeasureMode = {
        fontIcon: "ms-geolocation",
        fontSet: "ms",
        geometryName: GeometryType.POLYGON,
        type: "radius",
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
