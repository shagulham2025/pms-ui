export interface User {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  department: string;
  designation: string;
  username: string;
  accessLevel: number;
  status: string;
  createdDateTime: string;
  lastLogin: string;
  gender: string;
  dob: string;
  shiftSchedule: string;
  specialization: string | null;
  licenseNumber: string | null;
  emergencyContact: string;
}
