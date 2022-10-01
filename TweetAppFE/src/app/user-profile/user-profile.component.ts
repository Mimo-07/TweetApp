import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TweetService } from 'src/services/tweet.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  fullName! : string;
  userDetails! : any;
  userName: any;
  tweetForm! : FormGroup;
  tweetUserList = [];
  buttonDisabled: boolean = true;


  @ViewChild('message') message!: ElementRef;
  showTweets!: boolean;
  tweetsCalled!: any;
  
  constructor( private tweetService : TweetService, private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.initializeTweetForm();
  }

  keyupevent(){
    this.buttonDisabled = false;
    if(this.message.nativeElement.value == '')
      this.buttonDisabled = true;
  }

  initializeTweetForm(){
    this.tweetForm = this.formBuilder.group({
      Message: new FormControl('',Validators.required)
    })
  }

  deleteTweetUpdateList(eventValue : any){
    if(eventValue == true){
      this.fetchTweetsUser();
    }
    else if(eventValue == false){
      alert("You cannot delete this tweet");
    }
  }

  postTweet(){
    
    const tweetObj = {
      tweetText: this.tweetForm.get('Message')?.value,
      replyId: 0
    }

    console.log(tweetObj);

    this.tweetService.postNewTweet(this.userName,tweetObj).subscribe({
      next:(res: any)=>{
        console.log(res);
        this.message.nativeElement.value = '';
        this.buttonDisabled = true;
        this.tweetsCalled = false;
        this.fetchTweetsUser();
      },
      error:(err:any)=>{
        console.log("Tweet not posted error");
        console.log(err);
      }
    });


  }

  getUserDetails(){
    this.userDetails = localStorage.getItem("userDetails");
    this.userDetails = JSON.parse(this.userDetails);
    this.fullName = this.userDetails.firstName + " " + this.userDetails.lastName;
    this.userName = this.userDetails.loginId;
  }

  fetchTweetsUser(){
    if(this.tweetsCalled){
      this.showTweets = false;
      this.tweetsCalled = false;
      return;
    }
    this.tweetService.fetchTweetsUser(this.userName).subscribe({
      next : (res:any) => {
        console.log(res);
        this.tweetsCalled = true;
        this.showTweets = true;
        //res.sort((a,b)=> a.PostTime.localeCompare(b.PostTime));
        res = res.sort(function(a: any, b: any){
          return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
        });
        this.tweetUserList = res;
      },
      error : (error) => {
        console.log(error);
      }
    });
  }


}
