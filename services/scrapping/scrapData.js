import puppeteer from "puppeteer";
import {isSameResponse} from "../../tools/isSameResponse.js";
import {response} from "express";

let previousResponse = [];
async function scrapData() {
    let browser;
    try{
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox']
        })
        const page = await browser.newPage();
        await page.goto('https://www.thehindu.com/news/national/');

        const htmlContent = await page.content();
        const articleData = await page.evaluate(() => {
            const articles = Array.from(document.querySelectorAll('.element.row-element'));

            const data = articles.map(article => {
                const titleElement = article.querySelector('.right-content');
                const newsTitle = titleElement.querySelector('.title').innerText.trim();
                const newsLink = titleElement.querySelector('.title a').getAttribute('href');;
                const newsImage = article.querySelector('.picture img').getAttribute('data-original');
                const title = titleElement ? titleElement.innerText.trim() : 'Title not found';
                return { title, newsTitle, newsLink, newsImage };
            });
            return data;
        });
        if (isSameResponse(previousResponse, response)) {
            console.log(previousResponse);
            console.log("no new news");
            return [];
        } else{
            previousResponse = articleData;
            return articleData;
        }
    } catch (e){
        console.error('Scraping data failed', e);
    }
    finally {
        await browser?.close();
    }
}
export { scrapData };