

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import { Action, ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCardModule } from '@angular/material/card';

import { MangolComponent } from './mangol.component';
import { ControllersModule } from './modules/controllers/controllers.module';
import { MapModule } from './modules/map/map.module';
import { MeasureService } from './modules/measure/measure.service';
import { TabsModule } from './modules/tabs/tabs.module';
import {
  clearState,
  mangolReducers,
  MangolState,
} from './store/mangol.reducers';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export function logger(reducer: ActionReducer<MangolState, Action>): any {
  return storeLogger({
    collapsed: true,
    filter: {
      // whitelist: ['']
      blacklist: [
        '[Controllers] Set Position Coordinates',
        '[Controllers] Set Rotation Value',
        '[Cursor] Set Mode',
        '[Cursor] Set Visible',
      ],
    },
  })(reducer);
}

const mangolMetaReducers: MetaReducer<MangolState>[] = [clearState];

export const metaReducers = [
  // logger,
  ...mangolMetaReducers,
];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    TabsModule,
    MapModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MdePopoverModule,
    MatTabsModule,
    ControllersModule,
    MatCardModule,
    StoreModule.forRoot(mangolReducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
      },
    }),
  ],
  declarations: [
    MangolComponent,
  ],
  providers: [MeasureService],
  exports: [MangolComponent],
})
export class MangolModule {}
