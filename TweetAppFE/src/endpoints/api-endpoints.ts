

const baseUrl = "http://bijittweetbackendapi.eraufjatb9dgh6at.eastus.azurecontainer.io/api/v1.0/tweets"

export const apiRoutes = {
    //Login Endpoint
    login : `${baseUrl}/login`,

    //Tweet Endpoint
    tweetUser : `${baseUrl}`,
    getAllRepliesTweets : `${baseUrl}/replies`,
    getAllTweets : `${baseUrl}/all`,
    postNewTweet : `${baseUrl}`,
    likeTweet : `${baseUrl}`,
    deleteTweet : `${baseUrl}`,
    replyTweet : `${baseUrl}`,
    searchUserByUserName: `${baseUrl}/user/search`,
    registerUser : `${baseUrl}/register`,
    forgotPassword : `${baseUrl}`,
    
}
