import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  loginForm! : FormGroup;
  isSubmitted : boolean = false;
  loginId : any;
  invalidLogin : boolean = false;

  constructor(private router : Router, private fb : FormBuilder,
              private loginService : LoginService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        loginId : new FormControl('', Validators.required),
        password : new FormControl('', Validators.required)
      }
    )
    this.loginId = this.loginForm.controls['loginId'];
  }

  login(){
    this.isSubmitted = true;
    this.loginService.Login(this.loginForm).subscribe({
    next: (res : any) => { 
      const token = res.token;
      localStorage.setItem("jwt",token);
      localStorage.setItem("userDetails",JSON.stringify(res.registerUserDetails));
      this.router.navigate(["/profile"]);
      this.invalidLogin = false;
      this.isSubmitted = false;
    },
    error : (error) => {
      alert("Invalid credentials");
      console.log("Error");
      console.log(error);
    }
  });
}

  registerPageRedirect(){
    this.router.navigate(["/register"]);
    console.log(this.router);
  }

  forgotPasswordRedirect(){
    this.router.navigate(["/forgotPassword"]);
  }

}
