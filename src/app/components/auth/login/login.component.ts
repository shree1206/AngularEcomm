import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MustMatchValidators } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  strMsg: string;
  submitted: boolean = false;
  showloader: boolean = false;

  @ViewChild('nav') elname: any;

  constructor(private _authService: AuthService, private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService) {
    this.strMsg = '';
    this._authService.logout();
  }

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegisterForm();
  }

  createLoginForm() {
    this.loginForm = this._fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  createRegisterForm() {
    this.registerForm = this._fb.group({
      Id: [0],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")])],
      userTypeId: [1],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$")])],
      confirmPassword: ['', Validators.required]
    },
      {
        validators: MustMatchValidators('password', 'confirmPassword')
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  login() {
    this.showloader = true;
    if (this.loginForm.get('userName')?.value == "") {
      this._toastr.error("UserName is required !!", "Login");
      this.showloader = false;
    } else if (this.loginForm.get('password')?.value == '') {
      this.showloader = false;
      this._toastr.error("password is required !!", "Login");
    } else {
      if (this.loginForm.valid) {
        this._dataService.post(environment.BASE_API_PATH + "UserMaster/Login/", this.loginForm.value).subscribe((res) => {
          if (res.isSuccess) {
            this._authService.login(res.data);
            this.strMsg = this._authService.getMessage();
            if (this.strMsg != "") {
              this.showloader = false;
              this._toastr.error(this.strMsg, "Login")
              this.resetLoginForm();
            }
          } else {
            this.showloader = false;
            this._toastr.error(res.errors, "Login");
            this.resetLoginForm();
          }
        })
      } else {
        this.showloader = false;
        this._toastr.error("Invalid Credentials !!", "Login");
        this.resetLoginForm();
      }
    }
  }

  resetLoginForm() {
    this.loginForm.reset();
  }

  resetRegisterForm() {
    this.registerForm.reset();
  }

  register(formData: any) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this._dataService.post(environment.BASE_API_PATH + 'UserMaster/Save/', formData.value).subscribe((res) => {
      if (res.isSuccess) {
        this._toastr.success("Successfully Register", "Register");
        this.resetRegisterForm();
        this.submitted = false;
        this.elname.select('logintab');
      } else {
        this._toastr.error("Soemthing went wrong", "Register");
      }
    })
  }

}
