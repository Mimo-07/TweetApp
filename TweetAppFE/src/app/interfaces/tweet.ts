export interface Tweet{
    id: string,
    likedByIds: string[],
    loginId: string,
    replyForTweetId: string,
    likes: number,
    time: string,
    tweetText: string,
    replyId:number
}