import { rwUser } from './services/twitterapi/twitterUser.js';
import { isSameDate } from './tools/isSameDate.js';
import { callNewsAPI } from './services/newsapi/newsReq.js';
import express from 'express';
import cron from "node-cron";

const app = express();


const PORT = process.env.PORT || 8000

const timer = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const selectNews = async () => {
    
const tweetMessages = [];
    console.log("api called");
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
            console.log(i,"30 minutes timer started");
            await timer(1800000);
        }
        console.log("calling selectnews")
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

async function fetchNewsAndPostTweets() {
    try {
        const response = await fetch("https://api.hindustantimes.com/api/app/homenew/sectionfeed/v2/latest?size=1", {
            method: "GET",
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "en-GB,en;q=0.9",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://www.hindustantimes.com/",
                "Referrer-Policy": "no-referrer-when-downgrade",
                "Cookie": "ht-city=KOCHI; ht-country=IN"
            }
        });

        const data = await response.json();

        // Extract relevant news details (headLine and websiteURL)
        const newsItems = data.content.sectionItems.map(item => ({
            headLine: item.headLine,
            websiteURL: item.websiteURL
        }));

        async function postTweet(newsItem) {
            const message = `${newsItem.headLine} \n${newsItem.websiteURL}`;
            try {
                await rwUser.v2.tweet(message);
                console.log(`Tweet posted: ${message}`);
            } catch (error) {
                console.error(`Error posting tweet: ${error}`);
            }
        }

        for (let i = 0; i < newsItems.length; i++) {
            const newsItem = newsItems[i];
            await postTweet(newsItem);  // Post the tweet
            if (i < newsItems.length - 1) {
                console.log(`Waiting for 30 minutes before posting the next tweet...`);
                await new Promise(resolve => setTimeout(resolve, 1800000)); // 30 minutes delay
            }
        }

    } catch (error) {
        console.error('Error fetching or posting news:', error);
    }
}

async function scheduleJob(){
    try {
        await fetchNewsAndPostTweets();
        cron.schedule('0 */3 * * *', async () => {
            console.log('Cron job triggered to post news every 3 hours...');
            await fetchNewsAndPostTweets(); // Call the function to fetch news and post tweets
        });
    } catch (error) {
        console.error('Error in the /post-news route:', error);
        res.status(500).send('An error occurred while posting news.');
    }
}

app.get('/isWorking', (req, res) => {
    // selectNews()
    res.send(`\nv9 Last changed on - Sun Jul 09 2023 22:51:08 \n Refreshed Time:${new Date()}`);

})

app.get('/', (req, res) => {
    res.send(`\nv12`);

})
app.get('/post-news', async (req, res) => {
    await scheduleJob();
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
