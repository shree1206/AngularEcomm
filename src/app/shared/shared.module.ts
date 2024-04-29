import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FeatherIconComponent } from './components/feather-icon/feather-icon.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    FeatherIconComponent,
    ContentLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    FeatherIconComponent
  ]
})
export class SharedModule {
}
