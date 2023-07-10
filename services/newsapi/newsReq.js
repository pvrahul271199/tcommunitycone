import axios from 'axios';
import { isSameResponse } from '../../tools/isSameResponse.js';

const NEWSAPI_ACCESS_TOKEN="d25290f43ab94ec78fb33024be6f8738"
const apiKey= NEWSAPI_ACCESS_TOKEN;


const options = {
    method: 'GET',
    url: 'https://bing-news-search1.p.rapidapi.com/news',
    params: {
      safeSearch: 'Off',
      textFormat: 'Raw'
    },
    headers: {
      'X-BingApis-SDK': 'true',
      'X-RapidAPI-Key': 'c016081313mshe24bfd6c427b622p1d2208jsn0f8a5336ead8',
      'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
    }
  };

var data = [];
let previousResponse = null;
async function callNewsAPI() {
    try {
        console.log("3");
        const response = await axios.request(options);
        console.log(response);
        console.log(isSameResponse(previousResponse, response));
        if (previousResponse && isSameResponse(previousResponse, response)) {
            return ""
        } else {
            data = response.data.value;
            previousResponse = response.data.value;
            console.log("data",data.length);
            return data
          }
        
    } catch (error) {
        console.error("error",error);
    }
};

export { callNewsAPI };