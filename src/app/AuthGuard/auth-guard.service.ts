import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(
    private router: Router,
    private cookieService: CookieService
    ) { }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  canActivate() {
    let token = this.cookieService.get('auth_token');

    // if (localStorage.getItem('currentUser')) {
    if (token) {
        // logged in so return true
        return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/' }});
    return false;
  }

  /**
   * Is login
   */
  isLogined() {
    let token = this.cookieService.get('auth_token');
    if(token) {
      return true;
    }else {
      return false;
    }
  }
}
