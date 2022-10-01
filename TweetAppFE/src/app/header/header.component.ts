import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  searchForm!:FormGroup;
  searchValue!:any;
  userList!: any;


  constructor(private router : Router, private loginService : LoginService,
    private fb: FormBuilder, private userService : UserService) { }
  
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      accountCtrl:new FormControl(""),
      accountFilterCtrl: new FormControl("")
    });
  }

  

  searchUsers(){
    this.userService.searchByUsername(this.searchValue).subscribe({
      next:(res: any)=>{
        this.userList = res;
      },
      error:(err: any)=>{
        console.log("Error");
        this.userList = [];
        console.log(err);
      }
    })
  }

  redirectToHomePage(){
    this.router.navigate(["/home"]);
  }

  redirectToProfilePage(){
    this.router.navigate(["/profile"]);
  }

  Logout(){
    this.loginService.Logout();
    this.router.navigate(["/"]);
  }

}
