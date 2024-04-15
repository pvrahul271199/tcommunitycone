import fetch from 'node-fetch'
import { isSameResponse } from '../../tools/isSameResponse.js';

const NEWSAPI_ACCESS_TOKEN="d25290f43ab94ec78fb33024be6f8738"
const apiKey= NEWSAPI_ACCESS_TOKEN;



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
async function callNewsAPI() {
    try {
        console.log("3");
        const result = await fetch(url, options);
        console.log("result",result);
        const newResult = await result.json();
        console.log("newResult",newResult);
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

export { callNewsAPI };