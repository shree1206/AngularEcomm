import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { route } from './shared/routes/content-routes';
import { AuthGuard } from './components/auth/auth.guard';

const routes: Routes = [
  { path: '', component: ContentLayoutComponent, children: route, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
