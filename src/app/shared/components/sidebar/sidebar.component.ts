import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { Menu } from '../../interface/menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: Menu[];
  fullname: string;
  emailId: string;
  imagePath: string = 'assets/images/user.png';

  constructor(private _navService: NavService) { }

  ngOnInit(): void {
    this.menuItems = this._navService.MenuItems;
    this.fullname = 'Vaibhav Chaudhary';
    this.emailId = 'vaibhav@gmail.com';
  }

  //click toggle menu
  toggleNavActive(item: any) {
    item.active = !item.active;
  }

}
