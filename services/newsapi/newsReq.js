import fetch from 'node-fetch'
import { isSameResponse } from '../../tools/isSameResponse.js';

const url = 'https://news-api14.p.rapidapi.com/top-headlines?country=in&language=en&pageSize=6';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'c016081313mshe24bfd6c427b622p1d2208jsn0f8a5336ead8',
    'X-RapidAPI-Host': 'news-api14.p.rapidapi.com'
  }
};

let previousResponse = [];

/**
 * Fetches news from the API and returns only new articles
 * @returns {Promise<Array>} New articles or empty array if no new news
 */
async function callNewsAPI() {
    try {
        console.log("Fetching news from API...");
        const result = await fetch(url, options);
        
        if (!result.ok) {
            throw new Error(`API responded with status: ${result.status}`);
        }
        
        const newResult = await result.json();
        const articles = newResult.articles || [];
        
        console.log(`Retrieved ${articles.length} articles`);
        
        // Check if we have new content
        if (previousResponse.length > 0 && isSameResponse(previousResponse, articles)) {
            console.log("No new articles found");
            return [];
        } else {
            // Store current response for future comparison
            previousResponse = articles;
            console.log(`Found ${articles.length} new articles`);
            return articles;
        }
    } catch (error) {
        console.error("Error fetching news:", error.message);
        return [];
    }
}

export { callNewsAPI };