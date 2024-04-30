import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperations } from 'src/app/shared/services/db-operations';
import { NoWhiteSpaceValidator, NumericFieldValidators, TextFieldValidators } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  addForm: FormGroup;
  dbOps: DBOperations;
  objRows = [];
  objRow: any;
  buttonText: string;
  editImagePath: string | undefined = "assets/images/noimage.png";
  fileToUpload: File;
  formErrors: any = {
    name: '',
    title: '',
    isSave: '',
    link: ''
  };

  validationMessages: any = {
    name: {
      required: 'Name is required',
      minlength: 'Name can not be less than 1 char long',
      maxlength: 'Name can not be more than 10 chars long',
      validTextField: 'Name must be contains only numbers and letters',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    title: {
      required: 'Title is required',
      minlength: 'Title can not be less than 1 char long',
      maxlength: 'Title can not be more than 10 chars long',
      validTextField: 'Title must be contains only numbers and letters',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    isSave: {
      required: 'Save Value is required',
      minlength: 'Save Value can not be less than 1 char long',
      maxlength: 'Save Value can not be more than 2 chars long',
      validNumericField: 'Save Value must be contains only numbers',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    link: {
      required: 'Link is required',
      minlength: 'Link can not be less than 1 char long',
      maxlength: 'Link can not be more than 100 chars long',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
  };

  @ViewChild('nav') elname: any;
  @ViewChild('file') elfile: ElementRef;
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
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        TextFieldValidators.validTextField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      isSave: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        NumericFieldValidators.validNumericField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      link: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
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
    this._dataService.get(environment.BASE_API_PATH + 'Category/GetAll').subscribe((res) => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Category Master");
      }
    });
  }

  onSubmit() {
    if (this.dbOps == DBOperations.create && !this.fileToUpload) {
      this._toastr.error("Please select file", "Category Master");
      return;
    }
    const formData = new FormData();
    formData.append("Id", this.addForm.controls['id'].value);
    formData.append("Name", this.addForm.controls['name'].value);
    formData.append("Title", this.addForm.controls['title'].value);
    formData.append("isSave", this.addForm.controls['isSave'].value);
    formData.append("Link", this.addForm.controls['link'].value);
    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }

    switch (this.dbOps) {
      case DBOperations.create:
        this._dataService.postImage(environment.BASE_API_PATH + 'Category/Save/', formData).subscribe((res) => {
          if (res.isSuccess) {
            this._toastr.success("Data saved successfully", "Category Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "Category Master");
          }
        });
        break;
      case DBOperations.update:
        this._dataService.postImage(environment.BASE_API_PATH + 'Category/Update/', formData).subscribe((res) => {
          if (res.isSuccess) {
            this._toastr.success("Data updated successfully", "Category Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "Category Master");
          }
        });
        break;
    }
  }

  resetForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      title: '',
      isSave: '',
      link: ''
    });
    this.dbOps = DBOperations.create;
    this.buttonText = "Submit";
    this.elname.select('viewTab');
    this.editImagePath = "assets/images/noimage.png";
    this.getData();
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      title: '',
      isSave: '',
      link: ''
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
    this.addForm.controls['title'].setValue(this.objRow.title);
    this.addForm.controls['isSave'].setValue(this.objRow.isSave);
    this.addForm.controls['link'].setValue(this.objRow.link);
    this.editImagePath = this.objRow.imagePath;
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
          this._dataService.post(environment.BASE_API_PATH + 'Category/Delete/', obj).subscribe((res) => {
            if (res.isSuccess) {
              //this._toastr.success("Data Deleted successfully", "Category Master");
              Swal.fire('Deleted!', 'Your data has been deleted.', 'success')
              this.getData();
            } else {
              this._toastr.error(res.errors[0], "Category Master");
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
        title: '',
        isSave: '',
        link: ''
      });
      this.dbOps = DBOperations.create;
      this.buttonText = "Submit";
      this.editImagePath = "assets/images/noimage.png";
    }
  }

  selectFile(files: any) {
    if (files.length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastr.error("Only images are allowed", "Category Master");
      this.elfile.nativeElement.value = "";
      return;
    }

    this.fileToUpload = files[0];

    //read Image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.editImagePath = reader.result?.toString();
    }
  }

  ngOnDestroy() {
    this.objRow = '';
    this.objRows = [];
  }

}
