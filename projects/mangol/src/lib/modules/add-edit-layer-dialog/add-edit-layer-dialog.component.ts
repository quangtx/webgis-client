import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-layer-dialog',
  templateUrl: './add-edit-layer-dialog.component.html',
  styleUrls: ['./add-edit-layer-dialog.component.scss']
})
export class AddEditLayerDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddEditLayerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
