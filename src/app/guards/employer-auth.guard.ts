import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmployerAuthGuard implements CanActivate,CanActivateChild {

  constructor(private router: Router) {}

private checkAuth(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true; //  User is authenticated
    } else {
      this.router.navigate(['/login']); //  Redirect to login if not
      return false;
    }
  }

  canActivate(): boolean {
    return this.checkAuth();
  }

  canActivateChild(): boolean {
    return this.checkAuth();
  }
}