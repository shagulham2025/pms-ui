
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-add-edit-patient-component',
  templateUrl: './add-edit-patient-component.html'
})
export class AddEditPatientComponent implements OnInit {
  form!: FormGroup;
  isReadOnly = false;

  visitTypes = ['OP','IP'];
  genders = ['Male','Female','Other'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditPatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.isReadOnly = !!data?.readonly; }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.id ?? null],
      name: [this.data?.name ?? '', Validators.required],
      age: [this.data?.age ?? 0, [Validators.required, Validators.min(0)]],
      height: [this.data?.height ?? 0],
      weight: [this.data?.weight ?? 0],
      gender: [this.data?.gender ?? '', Validators.required],
      phone: [this.data?.phone ?? '', Validators.required],
      emergencyContact: [this.data?.emergencyContact ?? '', Validators.required],
      visitType: [this.data?.visitType ?? 'OP', Validators.required],
      department: [this.data?.department ?? ''],
      doctor: [this.data?.doctor ?? ''],
      lastVisitDate: [this.data?.lastVisitDate ? (this.data?.lastVisitDate instanceof Date ? this.data?.lastVisitDate : new Date(this.data?.lastVisitDate)) : null],
      admissionStatus: [this.data?.admissionStatus ?? 'Not Admitted']
    });
    if (this.isReadOnly) this.form.disable();
  }

  submit() {
    if (this.isReadOnly) { this.dialogRef.close(null); return; }
    if (this.form.valid) {
      const v = { ...this.form.value };
      // normalize date to ISO string (date-only)
      if (v.lastVisitDate instanceof Date) {
        v.lastVisitDate = v.lastVisitDate.toISOString().split('T')[0];
      }
      this.dialogRef.close(v);
    }
    else this.form.markAllAsTouched();
  }

  cancel() { this.dialogRef.close(null); }
}
