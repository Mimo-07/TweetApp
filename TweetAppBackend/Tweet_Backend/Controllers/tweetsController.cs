using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tweet_Backend.Models;
using Tweet_Backend.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Tweet_Backend.Controllers
{
    [Route("api/v1.0/[controller]")]
    [ApiController]
    public class tweetsController : ControllerBase
    {
        private readonly TweetService tweetService;
        private readonly AuthenticateService authenticateService;
        private readonly RegisterService registerService;

        public tweetsController(TweetService _tweetService,
            AuthenticateService _authenticateService,
            RegisterService _registerService
            )
        {
            tweetService = _tweetService;
            authenticateService = _authenticateService;
            registerService = _registerService;
        }
        // GET: api/<UserController>
        //Get all users
        [Route("users/all")]
        [HttpGet]
        public ActionResult<List<User>> GetAllUsers()
        {
            var users = tweetService.GetUsers();
            if (users.Count > 0)
            {
                return Ok(users);
            }
            return BadRequest("User List not found");
        }

        // GET api/<UserController>/all
        [Route("all")]
        [HttpGet]
        public ActionResult<List<Tweets>> GetAllTweets()
        {
            var tweets = tweetService.GetAllTweets();
            if (tweets.Count == 0)
            {
                return BadRequest("No Tweets!");
            }
            return Ok(tweets);
        }

        //GET api/<UserController>/replies/{id}       
        [Route("replies/{tweetId}")]
        [HttpGet]
        public ActionResult<List<Tweets>> GetAllReplies(string tweetId)
        {
            var tweets = tweetService.GetReplies(tweetId);
            if (tweets.Count == 0)
            {
                return BadRequest("No Tweets!");
            }
            return Ok(tweets);
        }

        // POST api/<UserController>
        [Route("{username}/add")]
        [HttpPost]
        public ActionResult<Tweets> PostNewTweet(string username, [FromBody] Tweets tweet)
        {
            Tweets result = tweetService.PostNewTweet(username, tweet);
            if (result == null)
            {
                return BadRequest("Request not completed");

            }

            return Ok(result);
        }

        // PUT api/<UserController>/5
        [Route("{username}/update/{id}")]
        [HttpPut]
        public ActionResult<Tweets> UpdateTweet(string id, [FromBody] string message, string username)
        {
            UpdateResult result = tweetService.UpdateTweet(id, message, username);
            if (result == null)
            {
                return BadRequest("Tweet not updated/ Request not completed");
            }
            return Ok("SUCCESS");
        }

        // DELETE api/<UserController>/5
        [Route("{username}/delete/{id}")]
        [HttpDelete]
        public ActionResult DeleteTweet(string id, string username)
        {
            var tweet = tweetService.DeleteTweet(username, id);
            if(tweet.DeletedCount == 0)
            {
                return BadRequest("Not Deleted");
            }
            return Ok(tweet);
        }

        //Like Tweet POST api/v1.0/tweets/{username}/like/{id}
        [Route("{username}/like/{id}")]
        [HttpPut]
        public ActionResult LikeTweet(string username,string id)
        {
            Tweets result = tweetService.LikeTweet(username, id);
            if(result == null)
            {
                return BadRequest("Like not updated");
            }
            return Ok(result);
        }

        //Search by username
        [Route("user/search/{username}")]
        [HttpGet]
        public ActionResult SearchByUserName(string username)
        {
            var result = tweetService.SearchByUserName(username);
            return Ok(result);
        }

        //Reply Tweet
        [Route("{username}/reply/{id}")]
        [HttpPost]
        public ActionResult ReplyTweet(string username, [FromBody] Tweets replyTweet ,string id)
        {
            var result = tweetService.PostReplyTweet(username, replyTweet, id);
            if(result == null)
            {
                return BadRequest("Reply not executed");
            }
            return Ok(result);
        }

        [Route("{username}")]
        [HttpGet]
        public ActionResult<List<Tweets>> GetAllTweetsUser(string username)
        {
            var result = tweetService.GetAllTweetsUser(username);
            if(result == null)
            {
                return BadRequest("Request not completed");
            }
            return Ok(result);
        }

        [AllowAnonymous]
        [Route("login")]
        [HttpPost]
        public ActionResult Login([FromBody] UserLogin user)
        {
            var token = authenticateService.Authenticate(user.LoginId, user.Password);
            if (token == null)
            {
                return Unauthorized();
            }
            var registerUserDetails = authenticateService.ReturnRegisterUser(user.LoginId, user.Password);
            return Ok(new { token,  registerUserDetails});
        }

        [AllowAnonymous]
        [Route("register")]
        [HttpPost]
        public ActionResult Register([FromBody] RegisterUserDetails registerUser)
        {
            var result = registerService.RegisterUser(registerUser);
            if (result == null)
            {
                return BadRequest("Username/Email already registered, Try with a different username/Email");
            }
            return Ok(registerUser);
        }

        [AllowAnonymous]
        [Route("{username}/forgot")]
        [HttpPut]
        public ActionResult ForgotPassword(string username,[FromBody] ForgetPasswordDetails details)
        {
            var result = tweetService.ForgotPassword(username, details);
            if(result == null)
            {
                return BadRequest("Request Cannot be completed");
            }
            return Ok(result);
        }
    }
}
