import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MapComponent } from './map.component';

@NgModule({
  imports: [MatTableModule,CommonModule],
  declarations: [MapComponent],
  exports: [MapComponent]
})
export class MapModule {}
