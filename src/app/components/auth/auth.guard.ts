import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router, private _toastr: ToastrService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return this._authService.isLoggedIn.pipe(
    //   map((isLoggedIn: boolean) => {
    //     if (!isLoggedIn) {
    //       this._toastr.error("Please Login First", "Error");
    //       this._router.navigate(['/auth/login']);
    //       return false;
    //     }
    //     return true;
    //   })
    // )

    if (localStorage.getItem('userDetails')) {
      return true;
    } else {
      this._toastr.error("Please Login First", "Error");
      this._router.navigate(['/auth/login']);
      return false;
    }

  }

}
