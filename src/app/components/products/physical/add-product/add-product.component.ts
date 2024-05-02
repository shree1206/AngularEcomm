import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperations } from 'src/app/shared/services/db-operations';
import { Global } from 'src/app/shared/services/global';
import { NoWhiteSpaceValidator, NumericFieldValidators, TextFieldValidators } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  submitted: boolean = false;
  dbops: DBOperations;
  objRow: any;
  buttonText: string;
  productId: number = 0;
  bigImage = "assets/images/pro3/1.jpg";
  url: any = [
    { img: 'assets/images/noimage.png' },
    { img: 'assets/images/noimage.png' },
    { img: 'assets/images/noimage.png' },
    { img: 'assets/images/noimage.png' },
    { img: 'assets/images/noimage.png' }
  ];
  fileToUpload: any = [];
  objSizes: any = [];
  objTags: any = [];
  objColors: any = [];
  objCategories: any = [];
  counter: number = 0;

  formErrors: any = {
    name: '',
    title: '',
    code: '',
    price: '',
    salePrice: '',
    discount: '',
    sizeId: '',
    colorId: '',
    tagId: '',
    categoryId: ''
  };

  validationMessages: any = {
    name: {
      required: 'Name is required',
      minlength: 'Name cannot be less then 1 chars long',
      maxlength: 'Name cannot be more then 10 chars long',
      validTextField: 'Name must be contains only numbers and letters',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    title: {
      required: 'Title is required',
      minlength: 'Title cannot be less then 1 chars long',
      maxlength: 'Title cannot be more then 10 chars long',
      validTextField: 'Title must be contains only numbers and letters',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    code: {
      required: 'Code is required',
      minlength: 'Code cannot be less then 1 chars long',
      maxlength: 'Code cannot be more then 10 chars long',
      validTextField: 'Code must be contains only numbers and letters',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    price: {
      required: 'Price is required',
      minlength: 'Price cannot be less then 1 chars long',
      maxlength: 'Price cannot be more then 10 chars long',
      validNumericField: 'Price must be contains only numbers',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    salePrice: {
      required: 'Sale Price is required',
      minlength: 'Sale Price cannot be less then 1 chars long',
      maxlength: 'Sale Price cannot be more then 10 chars long',
      validNumericField: 'Sale Price must be contains only numbers',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    discount: {
      required: 'Discount is required',
      minlength: 'Discount cannot be less then 1 chars long',
      maxlength: 'Discount cannot be more then 10 chars long',
      validNumericField: 'Discount must be contains only numbers',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    sizeId: {
      required: 'Size is required',
    },
    tagId: {
      required: 'Tag is required',
    },
    colorId: {
      required: 'Color is required',
    },
    categoryId: {
      required: 'Category is required',
    }
  };

  @ViewChild('file') elfile: ElementRef;

  constructor(private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService,
    private route: ActivatedRoute, private navRoute: Router) {
    this.route.queryParams.subscribe(params => {
      this.productId = params['productId'];
    });
  }


  setFormState() {
    this.dbops = DBOperations.create;
    this.buttonText = "Submit";
    this.productForm = this._fb.group({
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
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        TextFieldValidators.validTextField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      price: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NumericFieldValidators.validNumericField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      salePrice: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NumericFieldValidators.validNumericField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      discount: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NumericFieldValidators.validNumericField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      sizeId: ['', Validators.required],
      tagId: ['', Validators.required],
      colorId: ['', Validators.required],
      categoryId: ['', Validators.required],
      quantity: [''],
      isSale: [false],
      isNew: [false],
      shortDetails: [''],
      description: ['']
    });

    this.productForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });

    this.productForm.controls['quantity'].setValue(1);
  }

  onValueChanged() {
    if (!this.productForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";

      const control = this.productForm.get(field);
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

  ngOnInit(): void {
    this.setFormState();
    this.getSizes();
    this.getCategories();
    this.getColors();
    this.getTags();

    if (this.productId && this.productId != null && this.productId > 0) {
      this.dbops = DBOperations.update;
      this.buttonText = "Update";
      this.getProductById();
    }
  }

  increment() {
    this.counter = this.counter + 1;
    this.productForm.controls['quantity'].setValue(this.counter);
  }


  decrement() {
    this.counter = this.counter - 1;
    this.productForm.controls['quantity'].setValue(this.counter);
  }

  upload(files: any, i: number) {
    if (files.Length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastr.error("Only images are supported !!", "ProductMaster Master");
      this.elfile.nativeElement.value = "";
      return;
    }

    this.fileToUpload[i] = files[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.url[i].img = reader.result?.toString();
    }

  }

  get f() {
    return this.productForm.controls;
  }

  getSizes() {
    this._dataService.get(environment.BASE_API_PATH + "SizeMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objSizes = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }
  getTags() {
    this._dataService.get(environment.BASE_API_PATH + "TagMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objTags = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }
  getColors() {
    this._dataService.get(environment.BASE_API_PATH + "ColorMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objColors = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }
  getCategories() {
    this._dataService.get(environment.BASE_API_PATH + "Category/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objCategories = res.data;
      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }
  getProductById() {
    this._dataService.get(environment.BASE_API_PATH + "ProductMaster/GetbyId/" + this.productId).subscribe(res => {
      if (res.isSuccess) {
        this.objRow = res.data;
        this.productForm.patchValue(this.objRow);

        this.productForm.controls['isSale'].setValue(this.objRow.isSale == 1 ? true : false);
        this.productForm.controls['isNew'].setValue(this.objRow.isNew == 1 ? true : false);

        this.counter = this.objRow.quantity;


        this._dataService.get(environment.BASE_API_PATH + "ProductMaster/GetProductPicturebyId/" + this.productId).subscribe(res => {
          if (res.isSuccess) {
            if (res.data.length > 0) {
              this.url = [
                { img: res.data[0] != null ? environment.BASE_IMAGES_PATH + res.data[0].name : 'assets/images/noimage.png' },
                { img: res.data[1] != null ? environment.BASE_IMAGES_PATH + res.data[1].name : 'assets/images/noimage.png' },
                { img: res.data[2] != null ? environment.BASE_IMAGES_PATH + res.data[2].name : 'assets/images/noimage.png' },
                { img: res.data[3] != null ? environment.BASE_IMAGES_PATH + res.data[3].name : 'assets/images/noimage.png' },
                { img: res.data[4] != null ? environment.BASE_IMAGES_PATH + res.data[4].name : 'assets/images/noimage.png' },
              ];
            }
          } else {
            this._toastr.error(res.errors[0], 'Product Master');
          }
        });

      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    debugger;
    if (this.dbops === DBOperations.create && this.fileToUpload.length < 5) {
      this._toastr.error("Please upload 5 image per product !!", "Product Master");
      return;
    }
    else if (this.dbops == DBOperations.update && (this.fileToUpload.length > 0 && this.fileToUpload.length < 5)) {
      this._toastr.error("Please upload 5 image per product !!", "Product Master");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.productForm.controls['id'].value);
    formData.append("Name", this.productForm.controls['name'].value);
    formData.append("Title", this.productForm.controls['title'].value);
    formData.append("Code", this.productForm.controls['code'].value);
    formData.append("Price", this.productForm.controls['price'].value);
    formData.append("SalePrice", this.productForm.controls['salePrice'].value);
    formData.append("Discount", this.productForm.controls['discount'].value);
    formData.append("SizeId", this.productForm.controls['sizeId'].value);
    formData.append("ColorId", this.productForm.controls['colorId'].value);
    formData.append("TagId", this.productForm.controls['tagId'].value);
    formData.append("CategoryId", this.productForm.controls['categoryId'].value);
    formData.append("Quantity", this.productForm.controls['quantity'].value);
    formData.append("IsSale", this.productForm.controls['isSale'].value);
    formData.append("IsNew", this.productForm.controls['isNew'].value);
    formData.append("ShortDetails", this.productForm.controls['shortDetails'].value);
    formData.append("Description", this.productForm.controls['description'].value);


    if (this.fileToUpload) {
      for (let i = 0; i < this.fileToUpload.length; i++) {
        let ToUpload = this.fileToUpload[i];
        formData.append("Image", ToUpload, ToUpload.name);

        // formData.append("Image", this.fileToUpload[i], this.fileToUpload[i].name);
      }
    }

    switch (this.dbops) {
      case DBOperations.create:
        this._dataService.postImage(environment.BASE_API_PATH + "ProductMaster/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Data saved successfully !!", "Product Master");
            this.productForm.reset();
            this.submitted = false;
            this.navRoute.navigate(['/products/physical/product-list']);
          } else {
            this._toastr.error(res.errors[0], 'Product Master');
          }
        });
        break;

      case DBOperations.update:
        this._dataService.postImage(environment.BASE_API_PATH + "ProductMaster/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Data updated successfully !!", "Product Master");
            this.productForm.reset();
            this.submitted = false;
            this.navRoute.navigate(['/products/physical/product-list']);
          }
          else {
            this._toastr.error(res.errors[0], 'Product Master');
          }
        });
    }
  }

  cancelForm() {
    this.dbops = DBOperations.create;
    this.buttonText = "Submit";
    this.productForm.reset({
      id: 0,
      name: '',
      title: '',
      code: '',
      price: '',
      salePrice: '',
      discount: '',
      sizeId: '',
      colorId: '',
      tagId: '',
      categoryId: '',
      quantity: '',
      isSale: false,
      isNew: false,
      shortDetails: '',
      description: ''
    });
    this.navRoute.navigate(['/products/physical/product-list']);
  }

  ngOnDestroy() {
    this.objRow = null;
    this.fileToUpload = [];
    this.objSizes = [];
    this.objTags = [];
    this.objColors = [];
    this.objCategories = [];
  }

}
