const Axios = require('axios');
const { isSameResponse } = require('../../tools/isSameResponse.js');
const apiKey= process.env.NEWSAPI_ACCESS_TOKEN;

var url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=d25290f43ab94ec78fb33024be6f8738`;

const options = {
    method: 'GET',
    url: 'https://bing-news-search1.p.rapidapi.com/news/search',
    params: {
      cc: 'in',
      freshness: 'Day',
      textFormat: 'Raw',
      safeSearch: 'Off'
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
        const response = await Axios.request(options);
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

module.exports = { callNewsAPI };