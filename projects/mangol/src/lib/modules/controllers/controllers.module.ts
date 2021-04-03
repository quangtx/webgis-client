import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs'
import { MatCardModule } from '@angular/material/card'
import { MatGridListModule } from '@angular/material/grid-list'

import { ControllersComponent } from './controllers.component';
import { CursorComponent } from './cursor/cursor.component';
import { PositionComponent } from './position/position.component';
import { RotationButtonComponent } from './rotation-button/rotation-button.component';
import { ScalebarComponent } from './scalebar/scalebar.component';
import { SidebarButtonComponent } from './sidebar-button/sidebar-button.component';
import { ZoomButtonsComponent } from './zoom-buttons/zoom-buttons.component';
import { LayersButtonComponent } from './layers-button/layers-button.component';

import { FullscreenButtonComponent } from './fullscreen-button/fullscreen-button.component';
import { MeasureLineButtonComponent } from './measure-line-button/measure-line-button.component'
import { MeasureAreaButtonComponent } from './measure-area-button/measure-area-button.component'
import { MeasureRadiusButtonComponent } from './measure-radius-button/measure-radius-button.component'
import { MeasurePointButtonComponent } from './measure-point-button/measure-point-button.component'

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTabsModule,
    MatCardModule,
    MatGridListModule,
  ],
  declarations: [
    ControllersComponent,
    SidebarButtonComponent,
    ZoomButtonsComponent,
    CursorComponent,
    PositionComponent,
    ScalebarComponent,
    RotationButtonComponent,
    FullscreenButtonComponent,
    LayersButtonComponent,
    MeasureLineButtonComponent,
    MeasureAreaButtonComponent,
    MeasureRadiusButtonComponent,
    MeasurePointButtonComponent
  ],
  exports: [ControllersComponent]
})
export class ControllersModule {}
