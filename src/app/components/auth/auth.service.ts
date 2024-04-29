import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<any>(null); //token user
  private loggedIn = new BehaviorSubject<boolean>(false);
  private message: string;

  constructor(private _router: Router) {
    this.message = "";
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  login(objUserDetails: any) {
    if (objUserDetails.id === 0) {
      this.message = "Please enter valid username/password";
      this.loggedIn.next(false)
      this.currentUserSubject.next(null);
      localStorage.removeItem("userDetails");
    } else {
      localStorage.setItem("userDetails", JSON.stringify(objUserDetails));
      this.message = "";
      this.currentUserSubject.next(objUserDetails);
      this.loggedIn.next(true);
      this._router.navigate(['/dashboard']);
    }
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false)
    this.currentUserSubject.next(null);
  }

  getMessage(): string {
    return this.message;
  }

}
