const {TwitterApi} = require("twitter-api-v2");
require("dotenv").config();

const userDetails = {
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

const user = new TwitterApi(userDetails);
const bearer = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

const rwUser = user.readWrite;
const twitterBearer = bearer.readOnly;

module.exports = { rwUser,twitterBearer };