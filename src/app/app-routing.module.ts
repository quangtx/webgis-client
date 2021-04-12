import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
