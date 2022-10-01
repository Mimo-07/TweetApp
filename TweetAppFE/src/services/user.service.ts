import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiRoutes} from '../endpoints/api-endpoints'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  searchByUsername(searchString: string){
    const searchUserURL = apiRoutes.searchUserByUserName+`/${searchString}`;
    return this.http.get(searchUserURL);
  }

  registerUser(registerObjPayload: any){
    const registerUserURL = apiRoutes.registerUser;
    return this.http.post(registerUserURL,registerObjPayload);
  }

  forgotPassword(userDetailsPayload: any, username: string){
    const forgotPasswordURL = apiRoutes.forgotPassword+`/${username}/forgot`;
    return this.http.put(forgotPasswordURL,userDetailsPayload);
  }

}
