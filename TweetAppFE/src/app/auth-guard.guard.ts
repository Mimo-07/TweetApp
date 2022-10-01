import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { LoginService } from 'src/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private router: Router, private jwtHelper: JwtHelperService,
              private loginService : LoginService){

  }

  canActivate() {
    const token = localStorage.getItem('jwt');
    if(token && !this.jwtHelper.isTokenExpired(token)){
      this.loginService.token.next(true);
      return true;
    }
    else{
      this.router.navigate(["/"]);
      this.loginService.token.next(false);
      localStorage.clear();
      return false;
    }
  }
  
}
