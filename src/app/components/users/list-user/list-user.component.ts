import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperations } from 'src/app/shared/services/db-operations';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  objRows = [];

  constructor(private _dataService: DataService, private _toastr: ToastrService, private _navRoute: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._dataService.get(environment.BASE_API_PATH + 'UserMaster/GetAll').subscribe((res) => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Size Master");
      }
    });
  }

  Edit(id: number) {
    this._navRoute.navigate(['/users/create-user'], { queryParams: { userId: id } })
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
          this._dataService.post(environment.BASE_API_PATH + 'UserMaster/Delete/', obj).subscribe((res) => {
            if (res.isSuccess) {
              //this._toastr.success("Data Deleted successfully", "Size Master");
              Swal.fire('Deleted!', 'Your data has been deleted.', 'success')
              this.getData();
            } else {
              this._toastr.error(res.errors[0], "User Master");
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your data is safe :)', 'error')
        }
      });
  }

  ngOnDestroy() {
    this.objRows = [];
  }

}
