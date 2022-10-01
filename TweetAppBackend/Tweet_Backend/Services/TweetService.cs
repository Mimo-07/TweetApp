using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Tweet_Backend.Models;

namespace Tweet_Backend.Services
{
    public class TweetService
    {
        private IMongoCollection<User> users;
        private IMongoCollection<Tweets> tweets;
        private IMongoCollection<RegisterUserDetails> registrationCollection;

        public TweetService(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetConnectionString("Tweet_Db"));
            var database = client.GetDatabase("Tweet_App_DB");
            users = database.GetCollection<User>("Users");
            tweets = database.GetCollection<Tweets>("Tweets");
            registrationCollection = database.GetCollection<RegisterUserDetails>("Registration");
        }

        public List<User> GetUsers()
        {
            return users.Find(user => true).ToList();
        }

        public List<Tweets> GetAllTweets()
        {
            return tweets.Find(t => t.ReplyId == 0).ToList<Tweets>();
        }

        public List<Tweets> GetReplies(string tweetId)
        {
            return tweets.Find(t => (t.ReplyId == 1 && t.ReplyForTweetId == tweetId)).ToList<Tweets>();
        }

        public List<Tweets> GetAllTweetsUser(string loginId)
        {
            User existingUser = users.Find(user => user.LoginId == loginId).FirstOrDefault<User>();
            if(existingUser == null)
            {
                return null;
            }
            List<Tweets> tweetList = tweets.Find(tweet => (tweet.LoginId == existingUser.LoginId &&
                                                           tweet.ReplyId == 0)).ToList<Tweets>();
            return tweetList;
        }

        public Tweets PostReplyTweet(string username, Tweets tweet, string id)
        {
            Tweets parentTweet = tweets.Find(t => t.Id == id).FirstOrDefault<Tweets>();
            User existingUser = users.Find(user => user.LoginId == username).FirstOrDefault<User>();
            if(parentTweet == null || existingUser == null)
            {
                return null;
            }
            tweet.Time = DateTime.Now;
            tweet.LoginId = existingUser.LoginId;
            tweet.LikedByIds = new List<string>();
            if(tweet.ReplyId == 1 && parentTweet != null)
            {
                tweet.ReplyForTweetId = parentTweet.Id;
            }
            tweets.InsertOne(tweet);
            return tweet;
        }

        public Tweets PostNewTweet(string userName, Tweets tweet)
        {
            User existingUser = users.Find<User>(user => user.LoginId == userName).FirstOrDefault<User>();
            if(existingUser == null)
            {
                return null;
            }
            tweet.Time = DateTime.Now;
            tweet.LoginId = existingUser.LoginId;
            tweet.ReplyForTweetId = "";
            tweet.LikedByIds = new List<string>();
            tweets.InsertOne(tweet);
            return tweet;
        }

        public UpdateResult UpdateTweet(string id, string message, string userName)
        {
            var result = (UpdateResult?)null;
            var _id = ObjectId.Parse(id);
            //User existingUser = users.Find<User>(user => user.LoginId == userName).FirstOrDefault<User>();
            Tweets existingTweetFilter = tweets.Find<Tweets>(t => t.Id == id).FirstOrDefault<Tweets>();
            var existingUser = existingTweetFilter.LoginId;

            if (existingTweetFilter == null)
            {
                return null;
            }
            if (existingTweetFilter != null && existingUser == userName) 
            {
                var filter = Builders<Tweets>.Filter.Eq(t => t.Id, existingTweetFilter.Id);
                var update = Builders<Tweets>.Update.Set(t => t.TweetText, message);

                result = tweets.UpdateOne(filter, update);

            }
            else
            {
                return null;
            }

            //var filter = new BsonDocument("_id", _id);
            //var update = Builders<Tweets>.Update.Set("TweeText", message);

            //Tweets result = tweets.FindOneAndUpdate(filter, update);

            return result;            
        }

        public RegisterUserDetails ForgotPassword(string userName, ForgetPasswordDetails details)
        {
            RegisterUserDetails registeredUser = registrationCollection.Find(r =>
                (r.LoginId == userName && r.Email == details.Email)
            ).FirstOrDefault<RegisterUserDetails>();



            if (registeredUser == null)
            {
                return null;
            }

            var filter = Builders<RegisterUserDetails>.Filter.Eq(user => user.LoginId, userName);
            var update = Builders<RegisterUserDetails>.Update.Set(user => user.Password, details.Password)
                                                             .Set(user => user.ConfirmPassword, details.Password);

            UpdateResult result = registrationCollection.UpdateOne(filter, update);

            return registrationCollection.Find(user => user.LoginId == userName).FirstOrDefault<RegisterUserDetails>();
        }

        public DeleteResult DeleteTweet(string userName, string id)
        {
            DeleteResult existingTweet;
            Tweets tweet = tweets.Find(t => t.Id == id).FirstOrDefault<Tweets>();
            if(tweet!=null && tweet.ReplyId == 0)
            {
                var replyTweets = tweets.DeleteMany(t => t.ReplyForTweetId == id);
                existingTweet = tweets.DeleteOne(t => (t.Id == id && t.LoginId == userName));
                return existingTweet;
            }
            existingTweet = tweets.DeleteOne(t => (t.Id == id && t.LoginId == userName));

            return existingTweet;
        }

        public Tweets LikeTweet(string LoginId, string id)
        {
            User existingUser = users.Find<User>(user => 
                user.LoginId == LoginId).FirstOrDefault<User>();

            Tweets existingTweet = tweets.Find(t => 
                (t.Id == id)).FirstOrDefault<Tweets>();


            if (existingTweet == null || existingUser == null)
            {
                return null;
            }

            List<string> likedIds = existingTweet.LikedByIds.ToList<string>();
            bool alreadyLikedId = likedIds.Contains(LoginId);

            var filter = Builders<Tweets>.Filter.Eq(t => t.Id, id);

            if (alreadyLikedId == true)
            {
                likedIds.Remove(LoginId);
                
            }
            else if(alreadyLikedId == false)
            {
                likedIds.Add(LoginId);
            }

            var update = Builders<Tweets>.Update.Set(t => t.LikedByIds, likedIds)
                                                .Set(t => t.Likes, likedIds.Count);

            var result = tweets.UpdateOne(filter, update);
            
            return tweets.Find(t =>
                (t.Id == id)).FirstOrDefault<Tweets>();
        }

        public List<User> SearchByUserName(string username)
        {

            var filter = Builders<User>.Filter.Regex("LoginId", new BsonRegularExpression(username, "i"));
            List<User> result = users.Find(filter).ToList<User>();

            return result;

        }



    }
}
