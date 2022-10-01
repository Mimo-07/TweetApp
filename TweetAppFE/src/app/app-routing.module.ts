import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './auth-guard.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ReplyPageComponent } from './pages/reply-page/reply-page.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';


const routes: Routes = [
  { path: 'register', component:RegisterUserComponent},
  { path: 'forgotPassword', component:ForgotPasswordComponent},
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuardGuard]},
  { path: 'reply' , component:ReplyPageComponent, canActivate:[AuthGuardGuard]},
  { path: 'home', component:HomePageComponent, canActivate: [AuthGuardGuard]},
  { path: '', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
