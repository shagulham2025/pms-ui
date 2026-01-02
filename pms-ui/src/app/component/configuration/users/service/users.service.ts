import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../../../core/api.service';
import { User } from '../../../../model/user';

@Injectable({ providedIn: 'root' })
export class UsersService {

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private readonly mockUrl = '/assert/mock-data/user-data.json';

  constructor(private http: HttpClient, private api: ApiService) {
    this.loadInitial();
  }

  private loadInitial(): void {
    this.api.get<User[]>(this.mockUrl, { skipAuth: true }).pipe(
      catchError(() => of([] as User[])),
      tap(users => this.usersSubject.next(users))
    ).subscribe();
  }

  refresh(): void {
    this.loadInitial();
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: number): Observable<User | undefined> {
    const found = this.usersSubject.value.find(u => u.userId === id);
    return of(found);
  }

  addUser(user: Partial<User>): Observable<User> {
    const current = this.usersSubject.value;
    const nextId = current.length ? Math.max(...current.map(u => u.userId)) + 1 : 1001;
    const newUser: User = {
      userId: nextId,
      fullName: user.fullName ?? '',
      email: user.email ?? '',
      phoneNumber: (user as any).phoneNumber ?? '',
      role: user.role ?? 'User',
      department: user.department ?? '',
      designation: user.designation ?? '',
      username: user.username ?? '',
      accessLevel: user.accessLevel ?? 1,
      status: user.status ?? 'Active',
      createdDateTime: new Date().toISOString(),
      lastLogin: '',
      gender: user.gender ?? '',
      dob: user.dob ?? '',
      shiftSchedule: user.shiftSchedule ?? '',
      specialization: (user as any).specialization ?? null,
      licenseNumber: (user as any).licenseNumber ?? null,
      emergencyContact: user.emergencyContact ?? ''
    };
    this.usersSubject.next([newUser, ...current]);
    return of(newUser);
  }

  updateUser(user: User): Observable<User> {
    const current = this.usersSubject.value.slice();
    const idx = current.findIndex(u => u.userId === user.userId);
    if (idx !== -1) {
      current[idx] = user;
      this.usersSubject.next(current);
    }
    return of(user);
  }

  deleteUser(id: number): Observable<void> {
    const current = this.usersSubject.value.filter(u => u.userId !== id);
    this.usersSubject.next(current);
    return of(void 0);
  }

}
