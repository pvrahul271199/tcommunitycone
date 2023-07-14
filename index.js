import { rwUser } from './services/twitterapi/twitterUser.js';
// import { isSameDate } from './tools/isSameDate.js';
// import { callNewsAPI } from './services/newsapi/newsReq.js';
import fetch from 'node-fetch'
import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000
const timer = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const url = 'https://bing-news-search1.p.rapidapi.com/news?safeSearch=Off&textFormat=Raw';
const options = {
  method: 'GET',
  headers: {
    'X-BingApis-SDK': 'true',
    'X-RapidAPI-Key': 'c016081313mshe24bfd6c427b622p1d2208jsn0f8a5336ead8',
    'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
  }
};

var data = [];
let previousResponse = [];



app.get('/', (req, res) => { 
    async function callNewsAPI() {
        try {
            console.log("3");
            const result = await fetch(url, options);
            //console.log("result",result);
            const newResult = await result.json();
            //console.log("newResult",newResult);
            const response = await newResult.value;
            console.log("response",response);
            console.log(response.length);
            console.log(isSameResponse(previousResponse, response));
            if (previousResponse.length>0 && isSameResponse(previousResponse, response)) {
                console.log("no new news");
                return ""
            } else {
                //data = response.data.value;
                previousResponse = response[0];
                console.log("data",data.length);
                return response;
              }
            
        } catch (error) {
            console.error("error",error);
        }
    };
    
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
    
    function isSameResponse(previousResponse, response) {
        if(previousResponse!==response){
            return true
        }else{
            return false
        }
     }
    
     function isSameDate(PublishedAt){
        const dateString = PublishedAt;
        const dateObj = new Date(dateString);
        
        const currentDate = new Date();
        
        return (
          dateObj.getFullYear() === currentDate.getFullYear() &&
          dateObj.getMonth() === currentDate.getMonth() &&
          dateObj.getDate() === currentDate.getDate() 
        );
    }
    
    
    selectNews();
    res.send(`\nLast changed on - Sun Jul 09 2023 22:51:08 \n Refreshed Time:${new Date()}`); 
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })