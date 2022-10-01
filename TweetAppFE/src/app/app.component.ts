import { Component } from '@angular/core';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TweetAppFE';
  isToken : boolean = false;

  constructor(private loginService : LoginService){}

  ngOnInit(){
    this.loginService.token.subscribe((res)=>{
      if(res){
        this.isToken = true;
      }else{
        this.isToken = false;
      }
    })
      
  }
}
