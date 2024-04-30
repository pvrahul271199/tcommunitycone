import { rwUser } from './services/twitterapi/twitterUser.js';
import { isSameDate } from './tools/isSameDate.js';
import { callNewsAPI } from './services/newsapi/newsReq.js';
import express from 'express';

const app = express();


const PORT = process.env.PORT || 8000

const timer = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const selectNews = async () => {
    
const tweetMessages = [];
    console.log("api called");
    await timer(300000);
    const newsBody = await callNewsAPI();
    console.log("inside index", newsBody);
    if(newsBody.length>0){
        for(let i=0;i<newsBody.length; i++)
        {
            const tweetBody = {};
            tweetBody.name = newsBody[i].title;
            tweetBody.url = newsBody[i].url;
            tweetMessages.push(tweetBody);
            console.log(i);
            tweetNews(tweetMessages[i]);
            await timer(300000);
        }
        await selectNews();
    }else
     {
        console.log("No new news");
        await selectNews();
    }
}

const tweetNews= async (tweetMessages) => {
    try {
        console.log("tweet message", tweetMessages);
        console.log("same date",isSameDate(tweetMessages.datePublished));
        if ((tweetMessages.title !== null) && (tweetMessages.url!== null)){
            const message = `${tweetMessages.name} \n${tweetMessages.url}`;
            console.log("inside tweet message", message);
            await rwUser.v2.tweet(message);
            console.log("Tweeted");
        }
    } catch (e) {
        console.log(e)
      }
}



app.get('/isWorking', (req, res) => {
    selectNews()
    res.send(`\nv5 Last changed on - Sun Jul 09 2023 22:51:08 \n Refreshed Time:${new Date()}`);

})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
