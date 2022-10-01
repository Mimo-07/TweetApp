import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgetPasswordForm!: FormGroup;

  emailIdregex = 
  new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);


  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email:new FormControl('',Validators.compose([Validators.pattern(this.emailIdregex),Validators.required])),
      loginId:new FormControl('',Validators.required),
      password:new FormControl('',Validators.required)
    });
  }

  redirectToLogin(){
    this.router.navigate(["/"]);
  }

  submitRequest(){
    if(this.forgetPasswordForm.invalid){
      alert("All fields are not properly filled!");
      return;
    }

    const userDetailsPayload = {
      email: this.forgetPasswordForm.controls['email'].value,
      password: this.forgetPasswordForm.controls['password'].value
    };

    this.userService.forgotPassword(userDetailsPayload, 
      this.forgetPasswordForm.controls['loginId'].value).subscribe({
        next: (res: any) => {
          alert("Password successfully updated for user");
          this.router.navigate(["/"]);
        },error: (err: any) =>{

          alert("Request not completed!");
          console.log("Error");
          console.log(err);
        }
      });



  }

}
