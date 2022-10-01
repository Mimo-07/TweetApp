import { Component, OnInit,SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Tweet } from 'src/app/interfaces/tweet';
import { TweetService } from 'src/services/tweet.service';
import { Location} from '@angular/common';

@Component({
  selector: 'app-reply-page',
  templateUrl: './reply-page.component.html',
  styleUrls: ['./reply-page.component.scss']
})
export class ReplyPageComponent implements OnInit {

  replyForm!: FormGroup;
  replyTweetList!: any;
  tweet! : Tweet;
  userName! : any;
  dataLoaded : boolean = false;
  userDetails: any;
  @ViewChild('reply') replyText!:any;
  isButtonDisabled: boolean = true;
  showReply: boolean = false;

  constructor(private formBuilder: FormBuilder, private tweetService : TweetService, 
    private _location: Location) { 
    
  }

  ngOnInit(): void {
    this.replyForm = this.formBuilder.group({
      reply: new FormControl('',Validators.required)
    });

    this.fetchTweetToReply();
    this.userDetails = localStorage.getItem('userDetails');
    this.userName = JSON.parse(this.userDetails).loginId;
  }



  fetchTweetToReply(){
    this.tweetService.TweetToReply.subscribe((res)=>{
      //console.log(res);
      if(res === 0)
        return;
      
      this.tweet = res;
      this.dataLoaded = true;
      this.showReply = false;
      //this.fetchReplyList(this.tweet.id);
    })
  }

  showReplies(){
    if(this.tweet && this.showReply == false){
      this.fetchReplyList(this.tweet.id);
    }
    this.showReply = !this.showReply
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['replyTweetList'])
    {
      console.log(changes['replyTweetList'].currentValue);
    }
  }

  fetchReplyList(tweetId : string){
    this.tweetService.fetchAllReplyTweets(tweetId).subscribe({
      next:(res: any)=>{
        res = res.sort(function(a: any, b: any){
          return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
        });
        this.replyTweetList = res;
        console.log(this.replyTweetList);
      },
      error:(err: any)=>{
        console.log("Error");
        this.replyTweetList = []; //Reply List is empty if we get error
        console.log(err);
      }
    });
  }

  replyTextAreaKeyup(){
    this.isButtonDisabled = false;
    if(this.replyText.nativeElement.value == '')
      this.isButtonDisabled = true;
  }

  deleteTweetMain(eventValue : any){
    if(eventValue == true){
      this._location.back();
    }
    else if(eventValue == false){
      alert("You cannot delete this tweet");
    }
  }

  deletedReplyTweetUpdateList(eventValue : any){
    if(eventValue == true){
      console.log(this.tweet.id);
      this.fetchReplyList(this.tweet.id);
      alert("Tweet deleted");
    }
    else if(eventValue == false){
      alert("Reply Not deleted");
    }
  }


  replyTweet(){
    const replyTweet = {
      replyId:1,
      tweetText: this.replyForm.get('reply')?.value
    }
    if(this.tweet){
      this.tweetService.replyTweet(this.userName,this.tweet.id,replyTweet).subscribe({
        next:(res:any) =>{
          this.fetchReplyList(this.tweet.id);
          this.replyText.nativeElement.value = '';
          this.isButtonDisabled = true;
        },error:(err:any) =>{
          alert("Error! See console for more details");
          console.log("Error");
          console.log(err);
        }
      });      
    }

  }

}
