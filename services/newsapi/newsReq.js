import fetch from 'node-fetch'
import { isSameResponse } from '../../tools/isSameResponse.js';



const url = 'https://news-api14.p.rapidapi.com/top-headlines?country=in&language=en&pageSize=3';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'c016081313mshe24bfd6c427b622p1d2208jsn0f8a5336ead8',
    'X-RapidAPI-Host': 'news-api14.p.rapidapi.com'
  }
};



var data = [];
let previousResponse = [];
async function callNewsAPI() {
    try {
        console.log("1");
        const result = await fetch(url, options);
        console.log("2",result);
        const newResult = await result.json();
        console.log("3",newResult);
        const response = await newResult.articles;
        console.log("response",response);
        console.log(response.length);
        console.log(isSameResponse(previousResponse, response));
        if (previousResponse.length>0 && isSameResponse(previousResponse, response)) {
            console.log("no new news");
            return ""
        } else {
            //data = response.data.value;
            previousResponse = response;
            console.log("actual data",response);
            return response;
          }
        
    } catch (error) {
        console.error("error",error);
    }
};

export { callNewsAPI };
