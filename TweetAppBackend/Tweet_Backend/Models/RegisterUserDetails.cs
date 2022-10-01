using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tweet_Backend.Models
{
    public class RegisterUserDetails
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("FirstName")]
        public string FirstName { get; set; }
        [BsonElement("LastName")]
        public string LastName { get; set; }
        [BsonElement("Email")]
        public string Email { get; set; }
        [BsonElement("LoginId")]
        public string LoginId { get; set; }
        [BsonElement("Password")]
        public string Password { get; set; }
        [BsonElement("ConfirmPassword")]
        public string ConfirmPassword { get; set; }
        [BsonElement("ContactNumber")]
        public long ContactNumber { get; set; }
    }
}
