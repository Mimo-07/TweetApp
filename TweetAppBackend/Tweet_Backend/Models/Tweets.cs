using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tweet_Backend.Models
{
    public class Tweets
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("LoginId")]
        public string LoginId { get; set; }
        [BsonElement("TweeText")]
        public string TweetText { get; set; }
        [BsonElement("Likes")]
        public long Likes { get; set; }
        [BsonElement("LikedByIds")]
        public List<string> LikedByIds { get; set; }
        [BsonElement("ReplyId")]
        public int ReplyId { get; set; }
        [BsonElement("ReplyTweetId")]
        public string ReplyForTweetId { get; set; }
        [BsonElement("PostTime")]
        public DateTime Time { get; set; }
    }
}
