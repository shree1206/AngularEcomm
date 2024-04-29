import { Injectable } from '@angular/core';
import { Menu } from '../interface/menu';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  collaspeSideBar: boolean = false;
  constructor() { }

  MenuItems: Menu[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'home', type: 'link', active: true },
    {
      title: 'Products', icon: 'box', type: 'submenu', active: false, children: [
        {
          title: 'Physical', type: 'submenu', children: [
            { path: '/products/physical/product-list', title: 'Product List', type: 'link' },
            { path: '/products/physical/add-product', title: 'Add Product', type: 'link' }
          ]
        }
      ]
    },
    {
      title: 'Sales', icon: 'dollar-sign', type: 'submenu', active: false, children: [
        { path: '/sales/orders', title: 'Orders', type: 'link' },
        { path: '/sales/transaction', title: 'Transaction', type: 'link' }
      ]
    },
    {
      title: 'Masters', icon: 'clipboard', type: 'submenu', active: false, children: [
        { path: '/masters/brandlogo', title: 'BrandLogo', type: 'link' },
        { path: '/masters/category', title: 'Category', type: 'link' },
        { path: '/masters/color', title: 'Color', type: 'link' },
        { path: '/masters/size', title: 'Size', type: 'link' },
        { path: '/masters/tag', title: 'Tag', type: 'link' },
        { path: '/masters/usertype', title: 'User Type', type: 'link' }
      ]
    },
    {
      title: 'Users', icon: 'user-plus', type: 'submenu', active: false, children: [
        { path: '/users/list-user', title: 'User List', type: 'link' },
        { path: '/users/create-user', title: 'Create User', type: 'link' }
      ]
    },
    { path: '/reports', title: 'Reoprts', icon: 'bar-chart', type: 'link', active: false },
    {
      title: 'Settings', icon: 'settings', type: 'submenu', active: false, children: [
        { path: '/settings/profile', title: 'Profile', type: 'link' }
      ]
    },
    { path: '/invoice', title: 'Invoice', icon: 'archive', type: 'link', active: false },
    { path: '/auth/login', title: 'Logout', icon: 'log-out', type: 'link', active: false }
  ]
}
