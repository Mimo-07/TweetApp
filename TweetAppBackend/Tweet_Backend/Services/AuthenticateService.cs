using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Tweet_Backend.Models;

namespace Tweet_Backend.Services
{
    public class AuthenticateService
    {
        private readonly IMongoCollection<RegisterUserDetails> RegistrationCollection;
        private readonly string key;

        public AuthenticateService(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetConnectionString("Tweet_Db"));
            var database = client.GetDatabase("Tweet_App_DB");
            RegistrationCollection = database.GetCollection<RegisterUserDetails>("Registration");
            this.key = configuration.GetSection("jwtkey").ToString();
        }

        public string Authenticate(string LoginId, string Password)
        {
            var user = this.RegistrationCollection.Find(
                user => user.LoginId == LoginId && user.Password == Password).FirstOrDefault();

            if (user == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.UTF8.GetBytes(key);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.LoginId) //for login id
                }),
                Expires = DateTime.Now.AddHours(1),

                SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(tokenKey),
                SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public RegisterUserDetails ReturnRegisterUser(string LoginId, string Password)
        {
            RegisterUserDetails user = this.RegistrationCollection.Find(
                user => user.LoginId == LoginId && user.Password == Password).FirstOrDefault();

            return user;
        }
    }
}
