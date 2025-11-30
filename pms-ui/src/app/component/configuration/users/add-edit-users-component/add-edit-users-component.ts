
import { Component, Inject, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../../../model/confirm-dialog-data';


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

  constructor(private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    //this.isEdit = data?.isEdit as;
  }

  ngOnInit(): void {
     setTimeout(() => {
      //this.selectedGender = this.data?.gender ?? '';
      //this.selectedStatus = this.data?.userStatus ?? '';
      //this.cd.detectChanges();  // important
    });
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      emergencyContactNumber: ['', Validators.required],
      gender: ['', Validators.required],
      status: ['', Validators.required],
      userType: ['', Validators.required],
      dob: ['', Validators.required],
      departmentName: ['', Validators.required],
      specialization: [''],
      licenseNumber: [''],
      shiftSchedule: [''],
      profileImage: [null],
      addresses: this.fb.array([this.createAddress()])
    });
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
      console.log('User Data:', this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
