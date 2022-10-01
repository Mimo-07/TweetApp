import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { registerUserDetails} from '../interfaces/registerUser';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  registrationForm!: FormGroup;
  disableRegisterBtn: boolean = true;

  emailIdregex = 
  new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  constructor(private formBuilder: FormBuilder, private userService: UserService, 
              private router: Router) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName:new FormControl('',Validators.required),
      lastName:new FormControl('',Validators.required),
      email:new FormControl('',Validators.compose([Validators.required,Validators.pattern(this.emailIdregex)])),
      loginId:new FormControl('',Validators.required),
      password:new FormControl('',Validators.required),
      confirmPassword:new FormControl('',Validators.required),
      contactNumber:new FormControl('',Validators.required)
    });
  }

  registrationSubmit(){
    if(this.registrationForm.invalid){
      alert("Submit all details/ Some fields format is not correct");
      return;
    }
    if(this.registrationForm.controls['password'].value !== this.registrationForm.controls['confirmPassword'].value){
      alert("Password and Confirm Password fields are not same");
      return;
    }

    const registerObjPayload: any = {
      firstName: this.registrationForm.controls['firstName'].value,
      lastName: this.registrationForm.controls['lastName'].value,
      email: this.registrationForm.controls['email'].value,
      loginId: this.registrationForm.controls['loginId'].value,
      password: this.registrationForm.controls['password'].value,
      confirmPassword: this.registrationForm.controls['confirmPassword'].value,
      contactNumber: this.registrationForm.controls['contactNumber'].value
    }

    this.userService.registerUser(registerObjPayload).subscribe({
      next:(res:any)=>{
        alert("User successfully created");
        this.router.navigate(["/"]);
      },
      error:(err: any)=>{
        alert("Error! Cannot register User! Check console!")
        console.log("Error");
        console.log(err);
      }

    });

  }

  
  redirectToLogin(){
    this.router.navigate(["/"]);
  }






}
