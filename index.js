import { rwUser } from './services/twitterapi/twitterUser.js';
import { isSameDate } from './tools/isSameDate.js';
import { callNewsAPI } from './services/newsapi/newsReq.js';
import { scrapData } from "./services/scrapping/scrapData.js";
import cron from 'node-cron';
import express from 'express';

const app = express();


const PORT = process.env.PORT || 8000

const timer = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const selectNews = async () => {
    
    const tweetMessages = [];
    console.log("api called");
    const newsBody = await scrapData();
    console.log(newsBody);
    if(newsBody.length>0){
        for(let i=0;i<newsBody.length; i++)
        {
            const tweetBody = {};
            tweetBody.name = newsBody[i].newsTitle;
            tweetBody.url = newsBody[i].newsLink;
            tweetMessages.push(tweetBody);
            console.log(i);
            tweetNews(tweetMessages[i]);
            await timer(60000);
        }
        selectNews();
    }else
     {
        console.log("No new news");
        selectNews();
    }
}

const tweetNews= async (tweetMessages) => {
    try {
        console.log(tweetMessages);
        console.log("same date",isSameDate(tweetMessages.datePublished));
        if ((tweetMessages.name !== null) && (tweetMessages.url!== null)){
            const message = `${tweetMessages.name} \n${tweetMessages.url}`;
            console.log(message);
            await rwUser.v2.tweet(message);
            console.log("Tweeted");
        }
    } catch (e) {
        console.log(e)
      }
}

// cron.schedule('*/3 * * * *', () => {
//     selectNews();
//   });

app.get('/isWorking', (req, res) => {
    selectNews()
    res.send(`\nLast changed on - Sun Jul 09 2023 22:51:08 \n Refreshed Time:${new Date()}`);

})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })