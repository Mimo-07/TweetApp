import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { MaterialModule } from './material/material.module';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HeaderComponent } from './header/header.component';
import { TweetComponent } from './tweet/tweet.component';
import { ReplyPageComponent } from './pages/reply-page/reply-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export function tokenGetter(){
  return localStorage.getItem("jwt");
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserProfileComponent,
    HeaderComponent,
    TweetComponent,
    ReplyPageComponent,
    HomePageComponent,
    RegisterUserComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    NgbModule,
    JwtModule.forRoot({
      config : {
        tokenGetter : tokenGetter,
        allowedDomains : ["localhost:65084"],
        disallowedRoutes : []
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
