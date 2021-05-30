import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service'
import { UserAuth } from '../classes/user-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  activeUser: UserAuth

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user: UserAuth = this.authenticationService.getActiveUser();
      // console.log('user:', user);
      if (user.isAuthenticated) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
  
}
