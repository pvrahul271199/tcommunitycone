import { TwitterApi } from 'twitter-api-v2';

const TWITTER_APP_KEY="nXzSZIqH841U0AZwXoS59Uk5X";
const TWITTER_APP_KEY_SECRET="PgCmIJlQxbjCPSEfHNKYhImZXLiR2EEYlyFBfTvXgRm2n3jjvQ";
const TWITTER_BEARER_TOKEN="AAAAAAAAAAAAAAAAAAAAAOeRogEAAAAAffZTAQNqOLRfvhAENEVLRtNsSWs%3D4V0RWQ2dVntkvHQfG1yGSnjb09Krh3q75lKa8bIbjojcNliBjt";
const TWITTER_ACCESS_TOKEN="1676917021676806145-b7zRSYKlh0D5IbB2HbVKw26m91FPTi";
const TWITTER_ACCESS_TOKEN_SECRET="44bnpF8xsXx0Jbtrx91gzBuotPmi2mL1ZpDPB97NVEuej";
const TWITTER_CLIENT_ID="RDZubzFVRVRhY01NSXJDRFFQZU46MTpjaQ";
const TWITTER_CLIENT_SECRET="5WuIHCwEKfHwgdItAQ8g7fMwaAdP1sNjBTV3cKZE49XJu_Hz00";
const APP_ID="1676917021676806145";

const userDetails = {
    appKey: TWITTER_APP_KEY,
    appSecret: TWITTER_APP_KEY_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_TOKEN_SECRET
}

const user = new TwitterApi(userDetails);
const bearer = new TwitterApi(TWITTER_BEARER_TOKEN);

const rwUser = user.readWrite;
const twitterBearer = bearer.readOnly;

export { rwUser,twitterBearer };