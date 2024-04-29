import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperations } from 'src/app/shared/services/db-operations';
import { NoWhiteSpaceValidator, TextFieldValidators } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

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
    },
    code: {
      required: 'Code is required',
      minlength: 'Code can not be less than 1 char long',
      maxlength: 'Code can not be more than 10 chars long',
      validTextField: 'Code must be contains only numbers and letters',
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
      ])],
      code: ['', Validators.compose([
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
    this._dataService.get(environment.BASE_API_PATH + 'ColorMaster/GetAll').subscribe((res) => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "ColorMaster Master");
      }
    });
  }

  onSubmit() {
    switch (this.dbOps) {
      case DBOperations.create:
        this._dataService.post(environment.BASE_API_PATH + 'ColorMaster/Save/', this.addForm.value).subscribe((res) => {
          if (res.isSuccess) {
            this._toastr.success("Data saved successfully", "ColorMaster Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "ColorMaster Master");
          }
        });
        break;
      case DBOperations.update:
        this._dataService.post(environment.BASE_API_PATH + 'ColorMaster/Update/', this.addForm.value).subscribe((res) => {
          if (res.isSuccess) {
            this._toastr.success("Data updated successfully", "ColorMaster Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "ColorMaster Master");
          }
        });
        break;
    }
  }

  resetForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      code: ''
    });
    this.dbOps = DBOperations.create;
    this.buttonText = "Submit";
    this.elname.select('viewTab');
    this.getData();
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      code: ''
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
    this.addForm.controls['code'].setValue(this.objRow.code);
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
          this._dataService.post(environment.BASE_API_PATH + 'ColorMaster/Delete/', obj).subscribe((res) => {
            if (res.isSuccess) {
              //this._toastr.success("Data Deleted successfully", "ColorMaster Master");
              Swal.fire('Deleted!', 'Your data has been deleted.', 'success')
              this.getData();
            } else {
              this._toastr.error(res.errors[0], "ColorMaster Master");
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
        name: '',
        code: ''
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
