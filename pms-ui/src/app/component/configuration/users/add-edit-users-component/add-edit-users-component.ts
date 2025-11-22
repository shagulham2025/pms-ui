
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  standalone: false,
  selector: 'app-add-edit-users-component',
  templateUrl: './add-edit-users-component.html'
})
export class AddEditUsersComponent implements OnInit {
  
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      username: ['', Validators.required],
      accessLevel: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      status: ['', Validators.required],
      createdDateTime: ['', Validators.required],
      lastLogin: [''],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      shiftSchedule: [''],
      specialization: [''],
      licenseNumber: [''],
      emergencyContact: ['']
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('User Data:', this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
