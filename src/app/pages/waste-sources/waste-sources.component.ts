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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constants } from '../../global/constants'
import axios from 'axios'
import { SnackBarService } from '../../SnackBar/snack-bar.service'
import { environment } from '../../../environments/environment'
import { Store } from '@ngrx/store';
import * as fromMangol from 'projects/mangol/src/lib/store/mangol.reducers';
import { MangolControllersPositionStateModel } from 'projects/mangol/src/lib/store/controllers/controllers.reducers';
import { MeasureMode } from 'projects/mangol/src/lib/store/measure/measure.reducers';
import * as MeasureActions from '../../../../projects/mangol/src/lib/store/measure/measure.actions';
import * as CursorActions from 'projects/mangol/src/lib/store/cursor/cursor.actions';
import * as SidebarActions from 'projects/mangol/src/lib/store/sidebar/sidebar.actions';
import { CursorMode } from 'projects/mangol/src/lib/interfaces/cursor-mode';
import GeometryType from 'ol/geom/GeometryType';

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
  dischargeWastewaterMethodsList:any[] = []
  dischargeWasteWaterRegimeList:any[] = [];
  provinces:any[] = [];
  districts: any[];
  apiUrl = environment.baseUrlApi;
  position: MangolControllersPositionStateModel = null;
  selectedPostionMode: boolean = false;
  cursorMode: CursorMode;

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private store: Store<fromMangol.MangolState>,
  ) { }

  ngOnInit() {
    this.initDefault()
    this.wasteWaterForm = this.formBuilder.group({
      lat: ['', [Validators.required]],
      long: ['', [Validators.required]],
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
      dischargeWastewaterMethods: ['', [Validators.required]], // Phương thức xả nước thải
      dischargeWasteWaterRegime: ['', [Validators.required]], // Chế độ xả nước thải
      wastewaterMonitoringResults: ['', [Validators.required]], // Kết quả quan trắc nước thải
      theSources: ['', [Validators.required]], // Nguồn tiếp nhận
    })
    this.emissionsForm = this.formBuilder.group({
      lat: ['', [Validators.required]],
      long: ['', [Validators.required]],
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
  }


  ngDoCheck() {
    this.cdr.detectChanges();
  }

  async initDefault() {
    this.wasteWaterTypeList = Constants.WASTE_WATER_TYPE
    this.exhaustGasTypeList = Constants.EXHAUST_GAS_TYPE
    this.dischargeWasteWaterRegimeList = Constants.DISCHARGE_WASTE_WATER_REGIME

    const resdWwaterMethodsList  = await axios.get(this.apiUrl + 'dischargeWastewaterMethods')
    this.dischargeWastewaterMethodsList = resdWwaterMethodsList.data;

    const res = await axios.get(this.apiUrl + 'provinces')
    this.provinces = res.data
  }
  /**
   * Watching select change option.
   */
  async changeProvince(provinceId) {
    const res = await axios.get(this.apiUrl + 'districts?province_id='+ provinceId)
    this.districts = res.data
  }

  /**
   * Watching select change option.
   */
  changeDistrict(districtId) {
  }

  /**
   * Saving/update data in database.
   */
  onSubmit() {

  }

  chooseLatLongMode(type) {
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
