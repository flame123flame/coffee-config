import { Injectable } from '@angular/core';
@Injectable()
export class AuthService {
  constructor() {}
  // ...
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return token != undefined && token != null;
  }

  logout(): void {
    // ให้ค่าสถานะล็อกอินเป็น false
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('menuAccess');
  }
}
