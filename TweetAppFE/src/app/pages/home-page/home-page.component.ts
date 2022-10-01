import { Component, OnInit } from '@angular/core';
import { Tweet } from 'src/app/interfaces/tweet';
import { TweetService } from 'src/services/tweet.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  firstName!: any;
  userDetails!: any;
  allTweets!: Tweet[];

  constructor(private tweetService: TweetService) { }

  ngOnInit(): void {
    this.userDetails = localStorage.getItem('userDetails');
    this.userDetails = JSON.parse(this.userDetails);
    this.firstName = this.userDetails?.firstName;
    this.fetchAllTweets();
  }

  deleteTweet(eventValue : any) {
    if (eventValue == true) {
      this.fetchAllTweets();
    }
    else if (eventValue == false) {
      alert("You cannot delete this tweet");

    }
  }

    fetchAllTweets(){
      this.tweetService.fetchAllTweets().subscribe({
        next: (res: any) => {
          res = res.sort(function (a: any, b: any) {
            return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
          });
          this.allTweets = res;
        },
        error: (err: any) => {

        }
      });
    }

  }
