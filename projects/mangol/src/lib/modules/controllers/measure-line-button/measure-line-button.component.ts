import { Component, OnInit, Input } from '@angular/core';
import { MangolControllersLineOptions } from '../../../interfaces/config-map-controllers.interface';
import { RemoveLayer }  from '../../../classes/RemoveLayer'
import * as fromMangol from './../../../store/mangol.reducers';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MeasureMode, MeasureDictionary } from '../../../store/measure/measure.reducers';
import GeometryType from 'ol/geom/GeometryType';
import * as MeasureActions from '../../../store/measure/measure.actions';
import * as SidebarActions from '../../../store/sidebar/sidebar.actions';
import * as CursorActions from '../../../store/cursor/cursor.actions';
import * as ControllersActions from '../../../store/controllers/controllers.actions';
import * as LayerActions from '../../../store/layers/layers.actions';
import { CursorMode } from '../../../interfaces/cursor-mode';

@Component({
  selector: 'app-measure-line-button',
  templateUrl: './measure-line-button.component.html',
  styleUrls: ['./measure-line-button.component.scss']
})
export class MeasureLineButtonComponent implements OnInit {
  @Input() disableButton: boolean;

  animationDuration = 500;
  line$: Observable<MangolControllersLineOptions>;
  cursorMode: CursorMode;
  cursorVisible: boolean;
  modes$: Observable<MeasureMode[]>;
  selectedMode$: Observable<MeasureMode>;

  @Input() dictionary: MeasureDictionary;

  constructor(private store: Store<fromMangol.MangolState>) {
    this.line$ = this.store.select(state => state.controllers.line);
    this.modes$ = this.store.select((state) => state.measure.modes);
    this.selectedMode$ = this.store.select((state) => state.measure.mode);
    this.store.select(state => state.cursor.mode).subscribe(mode => (this.cursorMode = mode));
  }

  ngOnInit() {
  }

  setLine(type:string, event: Object) {
    this.store.select(state => state.cursor.mode).subscribe(mode => (this.cursorMode = mode));
    if(type === 'line' && this.cursorMode.cursor =='default') {
      const mode: MeasureMode = {
        fontIcon: "ms-measure-distance",
        fontSet: "ms",
        geometryName: GeometryType.LINE_STRING,
        type: "line",
      }
      const cursorMode: CursorMode = {
        cursor: "crosshair",
        text: "Click on Map to start measurement"
      }

      // this.store.dispatch(new MeasureActions.HasMeasure(true));
      this.store.dispatch(new SidebarActions.SetSelectedModule('measure'));
      this.store.dispatch(new MeasureActions.SetMode(mode));
      this.store.dispatch(new CursorActions.SetMode(cursorMode));
      this.store.dispatch(new ControllersActions.SetDisableButtonDictionary(true));
    } else {
      const rm: RemoveLayer[] = [
        {
          removeAll: true, layer:null
        }
      ]
      this.store.dispatch(new MeasureActions.SetMode(null));
      this.store.dispatch(new CursorActions.ResetMode());
    }
  }
}
