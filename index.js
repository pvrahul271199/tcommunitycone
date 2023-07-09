const { rwUser } = require("./services/twitterapi/twitterUser.js");
const { isSameDate } = require("./tools/isSameDate.js")
const { callNewsAPI } = require("./services/newsapi/newsReq.js")
const express = require('express');
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8000

const timer = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const logs = [];
const newLogs = [];
const logValues = {
    time: null,
    message: null
};

const selectNews = async () => {
    const tweetMessages = [];
    const newsBody = await callNewsAPI();
    logValues.time = new Date();
    logValues.message = "News API values fetched";
    logs.push(logValues);
    if(newsBody!==null){
        for(let i=0;i<newsBody.length; i++)
        {
            const tweetBody = {};
            tweetBody.name = newsBody[i].name;
            tweetBody.description = newsBody[i].description;
            tweetBody.url = newsBody[i].url;
            tweetBody.datePublished = newsBody[i].datePublished;
            tweetMessages.push(tweetBody);
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
        if ((isSameDate(tweetMessages.datePublished)) && (tweetMessages.name !== null) && (tweetMessages.url!== null)){
            const message = `${tweetMessages.name} \n${tweetMessages.url}`;
            console.log(message);
            newLogs.push(message);
            await rwUser.v2.tweet(message);
            logValues.time = new Date();
            logValues.message = "Tweeted";
            logs.push(logValues);
            console.log("Tweeted");
        }
    } catch (e) {
        console.log(e)
      }
}

const newsTimeout = async () => {
    setInterval(selectNews,300000);
}

app.get('/isWorking', (req, res) => { 
    console.log(newLogs[0]);
    res.send(`\nLast changed on - Sun Jul 09 2023 22:51:08 \n ${logs.time} - ${logs.message} --${newLogs[0]} `);

})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })

newsTimeout();