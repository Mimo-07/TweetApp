using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tweet_Backend.Models;

namespace Tweet_Backend.Services
{
    public class RegisterService
    {
        private IMongoCollection<RegisterUserDetails> registrationCollection;
        private IMongoCollection<User> usersCollection;

        public RegisterService( IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetConnectionString("Tweet_Db"));
            var database = client.GetDatabase("Tweet_App_DB");
            registrationCollection = database.GetCollection<RegisterUserDetails>("Registration");
            usersCollection = database.GetCollection<User>("Users");
        }

        public RegisterUserDetails RegisterUser(RegisterUserDetails newUser)
        {
            //Checking if existing user already created
            var existingUser =
                registrationCollection.Find<RegisterUserDetails>(user => user.Email == newUser.Email).FirstOrDefault<RegisterUserDetails>();
            var existingRegisteredUser =
                usersCollection.Find<User>(user => user.LoginId == newUser.LoginId).FirstOrDefault<User>();
            if(existingUser != null || existingRegisteredUser != null)
            {
                return null;
            }
            registrationCollection.InsertOne(newUser);
            usersCollection.InsertOne(new User() { LoginId = newUser.LoginId });
            
            
            return newUser;

        }
    }
}
