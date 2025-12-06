import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-add-edit-properties-component',
  templateUrl: './add-edit-properties-component.html'
})
export class AddEditPropertiesComponent implements OnInit {

  propertyForm!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.propertiesId;
    this.propertyForm = this.fb.group({
      propertiesId: [this.data?.propertiesId ?? null],
      propertiesKey: [this.data?.propertiesKey ?? '', [Validators.required]],
      propertiesValue: [this.data?.propertiesValue ?? '', [Validators.required]],
      description: [this.data?.description ?? '']
    });
  }

  save(): void {
    if (this.propertyForm.valid) {
      this.dialogRef.close(this.propertyForm.value);
    } else {
      this.propertyForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

}
