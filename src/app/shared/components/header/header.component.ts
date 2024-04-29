import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  open: boolean = false;
  opneNav: boolean = false;

  constructor(private _navService: NavService) { }

  ngOnInit(): void {
  }

  collaspeSidebar() {
    this.open = !this.open;
    this._navService.collaspeSideBar = !this._navService.collaspeSideBar;
  }

  openMobileNav() {
    this.opneNav = !this.opneNav
  }

}
