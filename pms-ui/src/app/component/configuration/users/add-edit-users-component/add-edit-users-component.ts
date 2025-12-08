
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../../../model/confirm-dialog-data';
import { User } from '../../../../model/user';


@Component({
  standalone: false,
  selector: 'app-add-edit-users-component',
  templateUrl: './add-edit-users-component.html'
})
export class AddEditUsersComponent implements OnInit {
  
  userForm!: FormGroup;
  isEdit: boolean = false;
  userStatus: string[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
  userTypes: string[] = ['DOCTOR', 'ADMIN', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECHNICIAN', 'ACCOUNTANT'];
  genders: string[] = ['Male', 'Female', 'Other'];
  departments: string[] = [
    'Pharmacy -Pharmacist, Inventory Managers', 
    'Patient Services/Billing -Receptionist,Appointment Managers', 
    'Personal/HR -Admin, HR Managers'
  ];
  shiftList = [
  { label: 'Morning Shift (06:00 AM - 02:00 PM)', value: 'morning' },
  { label: 'Afternoon Shift (02:00 PM - 10:00 PM)', value: 'afternoon' },
  { label: 'Night Shift (10:00 PM - 06:00 AM)', value: 'night' },
  { label: 'General Shift (09:00 AM - 05:00 PM)', value: 'general' },
  { label: 'Custom / Flexible', value: 'flexible' }
  ];
  specializations = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics',
    'Gynecology', 'Psychiatry', 'Radiology', 'ENT', 'General Medicine',
    'Oncology', 'Nephrology', 'Urology', 'Gastroenterology', 'Endocrinology'
  ];
  gender: string = '';
  status: string = '';
  userType: string = '';
  departmentName: string = '';
  shiftSchedule: string = '';
  searchText = '';
  showDropdown = false;
  filteredList: string[] = [];
  profileImage: File | null = null;
  imageError = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<User> | null
  ) {
    this.isEdit = !!this.data?.userId;
  }

  ngOnInit(): void {
     setTimeout(() => {
      //this.selectedGender = this.data?.gender ?? '';
      //this.selectedStatus = this.data?.userStatus ?? '';
      //this.cd.detectChanges();  // important
    });
    // create form with fields we need for the users list; keep existing fields for compatibility
    this.userForm = this.fb.group({
      firstName: [this.getFirstName(), Validators.required],
      lastName: [this.getLastName(), Validators.required],
      emailId: [this.data?.email ?? '', [Validators.required, Validators.email]],
      mobileNumber: [(this.data as any)?.phoneNumber ?? '', Validators.required],
      emergencyContactNumber: [this.data?.emergencyContact ?? '', Validators.required],
      gender: [this.data?.gender ?? '', Validators.required],
      status: [this.data?.status ?? 'ACTIVE', Validators.required],
      userType: [this.data?.role ?? '', Validators.required],
      dob: [this.data?.dob ?? '', Validators.required],
      departmentName: [this.data?.department ?? '', Validators.required],
      specialization: [(this.data as any)?.specialization ?? ''],
      licenseNumber: [(this.data as any)?.licenseNumber ?? ''],
      shiftSchedule: [this.data?.shiftSchedule ?? ''],
      profileImage: [null],
      addresses: this.fb.array([this.createAddress()])
    });
  }

  private getFirstName(): string {
    if (!this.data?.fullName) return '';
    const parts = this.data.fullName.split(' ');
    return parts[0] ?? '';
  }

  private getLastName(): string {
    if (!this.data?.fullName) return '';
    const parts = this.data.fullName.split(' ');
    return parts.slice(1).join(' ') || '';
  }

  createAddress(): FormGroup {
    return this.fb.group({
      addressLine1: [''], // optional
      addressLine2: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', [Validators.required]]
    });
  }
    /** Getter for form array */
  get addresses(): FormArray {
    return this.userForm.get('addresses') as FormArray;
  }

  addAddress() {
    this.addresses.push(this.createAddress());
  }

  removeAddress(i: number) {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(i);
    }
  }

  filterSpecializations() {
    const val = this.searchText.toLowerCase();

    this.filteredList = this.specializations.filter(item =>
      item.toLowerCase().includes(val)
    );
  }

    /** PROFILE IMAGE UPLOAD VALIDATION */
  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.imageError = '';

    if (!file) return;

    if (file.size > 1024 * 1024) {
      this.imageError = 'File size must be less than 1 MB';
      return;
    }

    this.profileImage = file;
  }

  selectSpecialization(value: string) {
    this.searchText = value;
    this.showDropdown = false;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const v = this.userForm.value;
      const result: Partial<User> = {
        userId: this.data?.userId,
        fullName: `${v.firstName} ${v.lastName}`.trim(),
        email: v.emailId,
        phoneNumber: v.mobileNumber,
        role: v.userType,
        department: v.departmentName,
        designation: (this.data as any)?.designation ?? '',
        username: (this.data as any)?.username ?? '',
        accessLevel: (this.data as any)?.accessLevel ?? 1,
        status: v.status,
        createdDateTime: this.data?.createdDateTime ?? new Date().toISOString(),
        lastLogin: this.data?.lastLogin ?? '',
        gender: v.gender,
        dob: v.dob,
        shiftSchedule: v.shiftSchedule,
        specialization: v.specialization || null,
        licenseNumber: v.licenseNumber || null,
        emergencyContact: v.emergencyContactNumber
      };
      this.dialogRef.close(result);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
