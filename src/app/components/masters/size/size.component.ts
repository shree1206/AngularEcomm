import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperations } from 'src/app/shared/services/db-operations';
import { NoWhiteSpaceValidator, TextFieldValidators } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit, OnDestroy {

  addForm: FormGroup;
  dbOps: DBOperations;
  objRows = [];
  objRow: any;
  buttonText: string;

  formErrors: any = {
    name: ''
  };

  validationMessages: any = {
    name: {
      required: 'Name is required',
      minlength: 'Name can not be less than 1 char long',
      maxlength: 'Name can not be more than 10 chars long',
      validTextField: 'Name must be contains only numbers and letters',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    }
  };

  @ViewChild('nav') elname: any;
  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  setFormState() {
    this.dbOps = DBOperations.create;
    this.buttonText = "Submit";
    this.addForm = this._fb.group({
      id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        TextFieldValidators.validTextField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])]
    });

    //give the atest value whenever form values changes
    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    })
  }

  onValueChanged() {
    if (!this.addForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';

      const control = this.addForm.get(field);
      if (control && control.dirty && !control.valid) {
        const message = this.validationMessages[field];

        for (const key of Object.keys(control.errors!)) {
          if (key != 'required') {
            this.formErrors[field] += message[key] + ' ';
          }
        }
      }
    }
  }

  get f() {
    return this.addForm.controls;
  }

  getData() {
    this._dataService.get(environment.BASE_API_PATH + 'SizeMaster/GetAll').subscribe((res) => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Size Master");
      }
    });
  }

  onSubmit() {
    switch (this.dbOps) {
      case DBOperations.create:
        this._dataService.post(environment.BASE_API_PATH + 'SizeMaster/Save/', this.addForm.value).subscribe((res) => {
          if (res.isSuccess) {
            this._toastr.success("Data saved successfully", "Size Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "Size Master");
          }
        });
        break;
      case DBOperations.update:
        this._dataService.post(environment.BASE_API_PATH + 'SizeMaster/Update/', this.addForm.value).subscribe((res) => {
          if (res.isSuccess) {
            this._toastr.success("Data updated successfully", "Size Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "Size Master");
          }
        });
        break;
    }
  }

  resetForm() {
    this.addForm.reset({
      id: 0,
      name: ''
    });
    this.dbOps = DBOperations.create;
    this.buttonText = "Submit";
    this.elname.select('viewTab');
    this.getData();
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: ''
    });
    this.dbOps = DBOperations.create;
    this.buttonText = "Submit";
    this.elname.select('viewTab');
  }

  Edit(id: number) {
    this.dbOps = DBOperations.update;
    this.buttonText = 'Update';
    this.elname.select('addTab');
    this.objRow = this.objRows.find((x: any) => x.id === id);
    this.addForm.controls['id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
  }

  Delete(id: any) {
    let obj = {
      id: id
    }
    Swal.fire(
      {
        title: 'Are you sure?',
        text: 'You will not be able to recover this imaginary file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this._dataService.post(environment.BASE_API_PATH + 'SizeMaster/Delete/', obj).subscribe((res) => {
            if (res.isSuccess) {
              //this._toastr.success("Data Deleted successfully", "Size Master");
              Swal.fire('Deleted!', 'Your data has been deleted.', 'success')
              this.getData();
            } else {
              this._toastr.error(res.errors[0], "Size Master");
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your data is safe :)', 'error')
        }
      });
  }

  onTabChange(e: any) {
    if (e.activeId == 'addTab') {
      this.addForm.reset({
        id: 0,
        name: ''
      });
      this.dbOps = DBOperations.create;
      this.buttonText = "Submit";
    }
  }

  ngOnDestroy() {
    this.objRow = '';
    this.objRows = [];
  }

}
