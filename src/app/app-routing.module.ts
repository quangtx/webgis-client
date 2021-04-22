import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AboutComponent } from './pages/about/about.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { animation: { page: 'home' } }
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    data: { animation: { page: 'registration' } }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: { page: 'login' } }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { animation: { page: 'about' } }
  },
  {
    path: 'user-info',
    component: UserInfoComponent,
    data: { animation: { page: 'user-info' } }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
