import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperations } from 'src/app/shared/services/db-operations';
import { MustMatchValidators } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {

  buttonText: string;
  objUserTypes: any;
  registerForm: FormGroup;
  submitted: boolean = false;
  dbOps: DBOperations;
  objRow: any;
  userId: number = 0;

  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService, private _route: ActivatedRoute, private _navRoute: Router) {
    this._route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId == undefined) {
        this.registerForm.reset();
        this.buttonText = 'Submit';
      }
    })
  }

  ngOnInit(): void {
    this.setFormState();
    this.getUserTypes();
    if (this.userId != null && this.userId > 0 && this.userId != undefined) {
      this.dbOps = DBOperations.update;
      this.buttonText = 'Update';
      this.getUserById();
    }
  }

  getUserTypes() {
    this._dataService.get(environment.BASE_API_PATH + 'UserType/GetAll').subscribe((res) => {
      if (res.isSuccess) {
        this.objUserTypes = res.data;
        console.log(this.objUserTypes);
      } else {
        this._toastr.error(res.errors[0], "Size Master");
      }
    });
  }

  getUserById() {
    this._dataService.get(environment.BASE_API_PATH + 'UserMaster/GetbyId/' + this.userId).subscribe((res) => {
      if (res.isSuccess) {
        this.objRow = res.data;
        // this.registerForm.controls['id'].setValue(this.objRow.id);
        this.registerForm.patchValue(this.objRow);
      } else {
        this._toastr.error(res.errors[0], "Size Master");
      }
    });
  }

  setFormState() {
    this.dbOps = DBOperations.create;
    this.buttonText = 'Submit';
    this.registerForm = this._fb.group({
      id: [0],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")])],
      userTypeId: ['', Validators.required],
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

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    switch (this.dbOps) {
      case DBOperations.create:
        this._dataService.post(environment.BASE_API_PATH + 'UserMaster/Save/', this.registerForm.value).subscribe((res) => {
          if (res.isSuccess) {
            this._toastr.success("Data saved successfully", "UserMaster Master");
            this.registerForm.reset();
            this.submitted = false;
            this._navRoute.navigate(['/users/list-user']);
          } else {
            this._toastr.error(res.errors[0], "UserMaster Master");
          }
        });
        break;
      case DBOperations.update:
        this._dataService.post(environment.BASE_API_PATH + 'UserMaster/Update/', this.registerForm.value).subscribe((res) => {
          if (res.isSuccess) {
            this._toastr.success("Data updated successfully", "UserMaster Master");
            this.registerForm.reset();
            this.submitted = false;
            this._navRoute.navigate(['/users/list-user']);
          } else {
            this._toastr.error(res.errors[0], "UserMaster Master");
          }
        });
        break;
    }
  }

  ngOnDestroy() {
    this.objRow = null;
  }

}
