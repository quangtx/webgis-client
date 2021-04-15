import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddEditLayerDialogComponent } from './add-edit-layer-dialog.component';

import { MatTabsModule } from '@angular/material/tabs'
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import { Action, ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    MdePopoverModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    FormsModule
  ],
  declarations: [AddEditLayerDialogComponent]
})
export class AddEditLayerDialogModule { }
