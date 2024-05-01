import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  imagePath: string = 'assets/images/user.png';
  fullName: string;
  emailId: string;
  firstName: string;
  lastName: string;
  editImagePath: string | undefined = "assets/images/noimage.png";
  fileToUpload: File;
  userDetails: any;

  @ViewChild('file') elfile: ElementRef;

  constructor(private _dataService: DataService, private _toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails')!);
    console.log(this.userDetails)
    this.fullName = `${this.userDetails.firstName} ${this.userDetails.lastName}`;
    this.emailId = this.userDetails.email;
    this.firstName = this.userDetails.firstName;
    this.lastName = this.userDetails.lastName;
    this.imagePath = (this.userDetails.imagePath == '' || this.userDetails.imagePath == null)
      ? 'assets/images/user.png' : environment.BASE_USERS_PATH + this.userDetails.imagePath;
  }

  selectFile(files: any) {
    if (files.Length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastr.error("Only images are supported !!", "BrandLogo Master");
      this.elfile.nativeElement.value = "";
      return;
    }

    this.fileToUpload = files[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.editImagePath = reader.result?.toString();
    }
  }

  onUpdate() {
    if (!this.fileToUpload) {
      this._toastr.error("Please upload image !!", "Profile Master");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.userDetails.id);
    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }

    this._dataService.postImage(environment.BASE_API_PATH + "UserMaster/UpdateProfile/", formData).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("Profile updated successfully !!", "Profile Master");
        this.elfile.nativeElement.value = "";
        this.editImagePath = "assets/images/noimage.png";
        Swal.fire({
          title: 'Are you sure?',
          text: 'are you want to see this changes right now ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, right now!',
          cancelButtonText: 'No, keep it'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['auth/login']);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        }
        )
      } else {
        this._toastr.error(res.errors[0], 'Profile Master');
      }
    });
  }
}
