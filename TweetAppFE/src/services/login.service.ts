import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { apiRoutes } from 'src/endpoints/api-endpoints';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userDetails : Subject<any> = new Subject<any>();
  token : Subject<any> = new Subject<any>();

  constructor(private http : HttpClient) { }

  Login(credentialsForm : FormGroup){
    const loginUrl = apiRoutes.login;
    const credentials = {
      "loginId" : credentialsForm.get('loginId')?.value,
      "password" : credentialsForm.get('password')?.value
    }

    return this.http.post(loginUrl,credentials);
  }

  Logout(){
   localStorage.removeItem("jwt");
   this.token.next(false);
   localStorage.removeItem("userDetails");
  }
}
