import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TweetService } from 'src/services/tweet.service';
import { Tweet } from '../interfaces/tweet';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent implements OnInit {
  @Input() tweet! : Tweet;
  @Output() deletedTweet : EventEmitter<any> = new EventEmitter();
  registrationDetails : any;
  tweetLikedByUser! : boolean;
  tweetTime!: any;
  pipe = new DatePipe('en-US');
  userDetails!: any;
  userName!: any;

  constructor(private router : Router, private tweetService : TweetService) { }

  ngOnInit(): void {
    this.initialiseTweetDetails();
  }

  initialiseTweetDetails(){
    this.userDetails = localStorage.getItem("userDetails");
    this.userDetails = JSON.parse(this.userDetails);
    this.userName = this.userDetails.loginId;

    if(this.tweet){
      this.tweetTime = this.tweet.time.split("T");
      this.tweetTime[0] = this.pipe.transform(this.tweetTime[0],"MMM d,y");
      this.tweetLikedByUser = this.tweet.likedByIds.find((id : any) =>{
        return id == this.userName
      })? true : false;
      //this.tweetTime[1] = this.pipe.transform(this.tweetTime[1],"h:mm a");
    }
  }

  likeTweet(){
    this.tweetService.likeTweet(this.userName,this.tweet.id).subscribe({
      next : (res:any) =>{
        this.tweetLikedByUser = res.likedByIds.find((id : any) =>{
          return id == this.userName
        })? true : false;
      },
      error : (err: any) => {
        console.log("error");
        console.log(err);
      }
    });
  }

  redirectToReplyPage(){
    this.tweetService.TweetToReply.next(this.tweet);
    this.router.navigate(["/reply"]);
  }

  deleteTweet(){
    if(this.tweet.loginId !== this.userName){
      this.deletedTweet.emit(false);
      return;
    }
    this.tweetService.deleteTweet(this.userName,this.tweet.id).subscribe({
      next: (res: any) =>{
        if(res.deletedCount > 0)
        {
          this.deletedTweet.emit(true);
          return;
        }
        this.deletedTweet.emit(false);
      },
      error: (err:any) =>{
        console.log("Error");
        console.log(err);
        this.deletedTweet.emit(false);
      }
    })
  }

}
