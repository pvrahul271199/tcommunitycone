import { rwUser } from './services/twitterapi/twitterUser.js';
import { isSameDate } from './tools/isSameDate.js';
import { callNewsAPI } from './services/newsapi/newsReq.js';
import cron from 'node-cron';
import express from 'express';

const app = express();


const PORT = process.env.PORT || 8000

const timer = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const selectNews = async () => {
    
    const tweetMessages = [];
    console.log("api called");
    const newsBody = await callNewsAPI();
    if(newsBody!=""){
        for(let i=0;i<newsBody.length; i++)
        {
            const tweetBody = {};
            tweetBody.name = newsBody[i].name;
            tweetBody.description = newsBody[i].description;
            tweetBody.url = newsBody[i].url;
            tweetBody.datePublished = newsBody[i].datePublished;
            tweetMessages.push(tweetBody);
            console.log(i);
            tweetNews(tweetMessages[i]);
            await timer(60000);
        }
    }else{
        console.log("No new news");
    }
}

const tweetNews= async (tweetMessages) => {
    try {
        console.log(tweetMessages);
        console.log("inside");
        console.log("same date",isSameDate(tweetMessages.datePublished));
        if ((isSameDate(tweetMessages.datePublished)) && (tweetMessages.name !== null) && (tweetMessages.url!== null)){
            const message = `${tweetMessages.name} \n${tweetMessages.url}`;
            console.log(message);
            await rwUser.v2.tweet(message);
            console.log("Tweeted");
        }
    } catch (e) {
        console.log(e)
      }
}

cron.schedule('*/3 * * * *', () => {
    selectNews();
  });

app.get('/isWorking', (req, res) => { 
    
    res.send(`\nLast changed on - Sun Jul 09 2023 22:51:08 \n Refreshed Time:${new Date()}`);
    
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })