import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Tweet } from 'src/app/interfaces/tweet';
import { apiRoutes } from 'src/endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  TweetToReply : BehaviorSubject<any> = new BehaviorSubject<any>(0);

  constructor(private http : HttpClient) { }

  fetchTweetsUser(loginId : string){
    const tweetUserUrl = apiRoutes.tweetUser+`/${loginId}`;
    return this.http.get(tweetUserUrl);
  }

  fetchAllReplyTweets(id : string){
    const getAllRepliesTweetsUrl = apiRoutes.getAllRepliesTweets+`/${id}`;
    return this.http.get(getAllRepliesTweetsUrl);
  }

  fetchAllTweets(){
    const getAllTweetsUrl = apiRoutes.getAllTweets;
    return this.http.get(getAllTweetsUrl); 
  }

  postNewTweet(userName:string, tweetObj: any){
    const postNewTweetUrl = apiRoutes.postNewTweet+`/${userName}/add`;
    return this.http.post(postNewTweetUrl,tweetObj);
  }

  likeTweet(username:string, id:string){
    const likeTweetUrl = apiRoutes.likeTweet+`/${username}/like/${id}`;
    const updObj = {};
    return this.http.put(likeTweetUrl,updObj);
  }

  deleteTweet(username:string, id:string){
    const deleteTweetUrl = apiRoutes.deleteTweet+`/${username}/delete/${id}`;
    return this.http.delete(deleteTweetUrl);
  }

  replyTweet(username:string, id:string, tweetObj:any){
    const replyTweeUrl = apiRoutes.replyTweet+`/${username}/reply/${id}`;
    return this.http.post(replyTweeUrl,tweetObj);
  }




}
