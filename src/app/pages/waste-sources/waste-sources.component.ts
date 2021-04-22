import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  homeButtonStateTrigger,
  routeStateTrigger,
  sidebarButtonStateTrigger
} from '../../app.animations';
import Map from 'ol/Map';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '../../global/constants'
import axios from 'axios'
import { SnackBarService } from '../../SnackBar/snack-bar.service'
import { environment } from '../../../environments/environment'
import { Store } from '@ngrx/store';
import * as fromMangol from 'projects/mangol/src/lib/store/mangol.reducers';
import { MangolControllersPositionStateModel } from 'projects/mangol/src/lib/store/controllers/controllers.reducers';
import { MeasureMode, MeasureDictionary } from 'projects/mangol/src/lib/store/measure/measure.reducers';
import * as MeasureActions from '../../../../projects/mangol/src/lib/store/measure/measure.actions';
import * as CursorActions from 'projects/mangol/src/lib/store/cursor/cursor.actions';
import * as SidebarActions from 'projects/mangol/src/lib/store/sidebar/sidebar.actions';
import * as ControllersActions from 'projects/mangol/src/lib/store/controllers/controllers.actions';
import { CursorMode } from 'projects/mangol/src/lib/interfaces/cursor-mode';
import GeometryType from 'ol/geom/GeometryType';
import { Subscription } from 'rxjs/internal/Subscription';
import { MangolLayer } from 'projects/mangol/src/lib/classes/Layer';
import { take, filter } from 'rxjs/operators';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import { MeasureService } from '../../../../projects/mangol/src/lib/modules/measure/measure.service';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import BaseEvent from 'ol/events/Event';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import { unByKey } from 'ol/Observable';
import { combineLatest, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
const LIMIT = 10000;

@Component({
  selector: 'app-waste-sources',
  templateUrl: './waste-sources.component.html',
  styleUrls: ['./waste-sources.component.scss'],
  animations: [
    homeButtonStateTrigger,
    sidebarButtonStateTrigger,
    routeStateTrigger
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WasteSourcesComponent implements OnInit, DoCheck {
  createPoint: FormGroup;
  wasteWaterForm: FormGroup;
  emissionsForm: FormGroup;
  wasteWaterTypeList: any[];
  exhaustGasTypeList: any[];
  // dischargeWastewaterMethodsList:any[] = []
  dischargeWasteWaterRegimeList:any[] = [];
  provinces:any[] = [];
  districts: any[];
  wards: any[];
  apiUrl = environment.baseUrlApi;
  position: MangolControllersPositionStateModel = null;
  selectedPostionMode: boolean = false;
  cursorMode: CursorMode;
  layersSubscription: Subscription;
  coordinate: number[];
  draw: Draw = null;
  initialText: string = null;
  displayValue: string = null;
  highlightStyle:Style = new Style({
    fill: new Fill({
      color: 'rgba(255,255,255,0.7)',
    }),
    stroke: new Stroke({
      color: '#3399CC',
      width: 3,
    }),
  });
  dictionary: MeasureDictionary;
  positionCood: number[];
  combinedSubscription: Subscription;
  map$: Observable<Map>;
  layer$: Observable<VectorLayer>;
  measureMode$: Observable<MeasureMode>;
  cursorText$: Observable<string>;
  map: Map;
  layer: VectorLayer;
  mode: MeasureMode;
  closeChoose: boolean = false;
  token: String;


  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private store: Store<fromMangol.MangolState>,
    private measureService: MeasureService,
    private cookieService: CookieService,
  ) {
    this.store.select((state) => state.measure.dictionary).subscribe(dictionary => (this.dictionary = dictionary));
    this.map$ = this.store.select(state => state.map.map).pipe(filter((m) => m !== null));
    this.layer$ = this.store.select((state) => state.layers.measureLayer).pipe(filter((l) => l !== null));
    this.measureMode$ = this.store.select((state) => state.measure.mode).pipe(filter((mode) => mode !== null));
  }

  ngOnInit() {
    this.token = this.cookieService.get('auth_token');
    this.initDefault()
    this.getDistricts()
    // this.getWards()

    this.wasteWaterForm = this.formBuilder.group({
      lat: ['', [Validators.required, Validators.pattern(new RegExp("([0-9].)"))]],
      long: ['', [Validators.required, Validators.pattern(new RegExp("([0-9].)"))]],
      leftBank: ['', [Validators.required, Validators.pattern(new RegExp("([0-9].)"))]],
      rightBank: ['', [Validators.required, Validators.pattern(new RegExp("([0-9].)"))]],
      outletSize: ['', [Validators.required, Validators.pattern(new RegExp("([0-9].)"))]],
      description: ['', [Validators.required]],
      wasteSourceOwner: ['', [Validators.required]], // Chủ nguồn thải
      wasteSource: ['', [Validators.required]], // Nguồn thải
      dischargePointLocation: ['', [Validators.required]], // Vị trí nguồn xả
      province: ['', [Validators.required]], // Tỉnh/Thành Phố
      district: ['', [Validators.required]], // Quận/huyện
      ward: ['', [Validators.required]], // Xã/phường
      village: ['', [Validators.required]], // Thôn/xóm
      wasteWaterType: ['', [Validators.required]], // Loại hình nước thải
      maximumWastewaterTraffic: ['', [Validators.required]], // Lưu lượng nước thải tối đa
      averageWastewaterTraffic: ['', [Validators.required]], // Lưu lượng nước thải trung bình
      // dischargeWastewaterMethods: ['', [Validators.required]], // Phương thức xả nước thải
      // dischargeWasteWaterRegime: ['', [Validators.required]], // Chế độ xả nước thải
      wastewaterMonitoringResults: ['', [Validators.required]], // Kết quả quan trắc nước thải
      theSources: ['', [Validators.required]], // Nguồn tiếp nhận
    })
    this.emissionsForm = this.formBuilder.group({
      lat: ['', [Validators.required]],
      long: ['', [Validators.required]],
      leftBank: ['', [Validators.required]],
      rightBank: ['', [Validators.required]],
      outletSize: ['', [Validators.required]],
      description: ['', [Validators.required]],
      wasteSourceOwner: ['', [Validators.required]], // Chủ nguồn thải
      wasteSource: ['', [Validators.required]], // Nguồn thải
      dischargePointLocation: ['', [Validators.required]], // Vị trí nguồn xả
      province: ['', [Validators.required]], // Tỉnh/Thành Phố
      district: ['', [Validators.required]], // Quận/huyện
      ward: ['', [Validators.required]], // Xã/phường
      village: ['', [Validators.required]], // Thôn/xóm
      chimneyHeight: ['', [Validators.required]], // Chiều cao ống khói
      exhaustGasType: ['', [Validators.required]], // Loại hình khí thải
      exhaustGasTraffic: ['', [Validators.required]], // Lưu lượng khí thải
      emissionMonitoringResults: ['', [Validators.required]], // Kết quả quan trắc khí thải
    })
    this.store.select(state => state.map.map).subscribe(map => this.map = map);
    this.store.select((state) => state.layers.measureLayer).subscribe(layer => this.layer = layer);
  }
  get f() { return this.wasteWaterForm.controls; }

  ngDoCheck() {
    this.cdr.detectChanges();
  }

  async initDefault() {
    this.wasteWaterTypeList = Constants.WASTE_WATER_TYPE
    this.exhaustGasTypeList = Constants.EXHAUST_GAS_TYPE
    this.dischargeWasteWaterRegimeList = Constants.DISCHARGE_WASTE_WATER_REGIME
    // const resdWwaterMethodsList  = await axios.get(this.apiUrl + 'dischargeWastewaterMethods')
    // this.dischargeWastewaterMethodsList = resdWwaterMethodsList.data;

    // const res = await axios.get(this.apiUrl + 'provinces')
    // this.provinces = res.data;
  }
  /**
   * Watching select change option.
   */
  // async changeProvince(provinceId) {
  //   const res = await axios.get(this.apiUrl + 'districts?province_id='+ provinceId)
  //   this.districts = res.data
  // }

  async getDistricts() {
    const res = await axios.get(this.apiUrl + `districts?limit=${LIMIT}`, {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })

    this.districts = res.data.data
  }


  async getWards() {
    const res = await axios.get(this.apiUrl + `wards?limit=${0}`, {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })

    this.wards = res.data.data
  }

  /**
   * Watching select change option.
   */
  async changeDistrict(districtId) {
    const res = await axios.get(this.apiUrl + `wards?district_id=${districtId}&limit=${0}`, {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    })

    this.wards = res.data.data

  }

  /**
   * Saving/update data in database.
   */
  onSubmit() {

  }

  /**
   * Choose point in map for form.
   */
  choosePoint() {
    this.closeChoose = true;
     const mode = {
      fontIcon: "gps_fixed",
      fontSet: "ms",
      geometryName: GeometryType.POINT,
      type: "point",
    }
    const cursorMode: CursorMode = {
      cursor: "crosshair",
      text: "Click on Map to start measurement"
    }
    this.activateDraw(mode)
  }

  /**
   * Deactive measure on map.
   * @param map
   * @param layer
   */
  public deactivateDraw(map: Map = null, layer: VectorLayer = null) {
    this.displayValue = null;
    try {
      this.closeChoose = false;
      this.map.removeLayer(this.layer);
      this.layer.getSource().clear();
      this.map.removeInteraction(this.draw);
      this.store.dispatch(new MeasureActions.SetMode(null));
      this.store.dispatch(new CursorActions.ResetMode());
    } catch (error) {}
  }

  /**
   * Active Draw on map
   * @param mode
   */
  public activateDraw(mode: MeasureMode) {
    this.mode = mode;
    this.map.addLayer(this.layer);
    this.draw = new Draw({
      source: this.layer.getSource(),
      style: (feature: Feature) => this.measureService.getStyle(feature),
      type: mode.geometryName,
    });
    this.initialText =
      (mode.type === 'radius'
        ? this.dictionary.drawStartTextRadius
        : this.dictionary.drawStartText) + '.';
    this.store.dispatch(
      new CursorActions.SetMode({
        text: this.initialText,
        cursor: 'crosshair',
      })
    );
    this.displayValue = this.initialText;
    let listener = null;
    this.draw.on('drawstart', (e: DrawEvent) => {
      this.layer.getSource().clear();
      this.store.dispatch(
        new CursorActions.SetMode({
          text: this.initialText,
          cursor: 'crosshair',
        })
      );
      this.displayValue = null;
      const feature = e.feature;
      listener = feature.getGeometry().on('change', (evt: BaseEvent) => {
        const geom: Geometry = evt.target;
        let displayValue: string = null;
        this.store.dispatch(
          new CursorActions.SetMode({
            text: `${displayValue}\n${this.initialText}`,
            cursor: 'crosshair',
          })
        );
        this.displayValue = displayValue;
      });

      if(mode.type == 'point') {
        this.store
          .select((state) => state.controllers.position.coordinates)
          .pipe(take(1))
          .subscribe((position) => {
            this.positionCood = position
          })
        this.wasteWaterForm.patchValue({lat: this.positionCood[0], long: this.positionCood[1]});
        this.emissionsForm.patchValue({lat: this.positionCood[0], long: this.positionCood[1]});
        this.displayValue = `${this.dictionary.point}: ${this.positionCood[0]}, ${this.positionCood[1]}.`
      }
    });

    this.draw.on('drawend', (e: DrawEvent) => {
      unByKey(listener);
      e.feature.setProperties({ text: this.displayValue });
      this.store.dispatch(
        new CursorActions.SetMode({
          text: this.dictionary.clickOnMap,
          cursor: 'crosshair',
        })
      );
    });

    this.draw.setActive(true);
    this.map.addInteraction(this.draw);
    this.store.dispatch(
      new CursorActions.SetMode({
        text: this.dictionary.clickOnMap,
        cursor: 'crosshair',
      })
    );
    this.displayValue = this.dictionary.clickOnMap;
  }
}
