import { rwUser } from './services/twitterapi/twitterUser.js';
import { isSameDate } from './tools/isSameDate.js';
import { callNewsAPI } from './services/newsapi/newsReq.js';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

// Queue system to manage tweets
const tweetQueue = [];
let isProcessingQueue = false;
let fetchNewsIntervalId = null;
const FETCH_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Fetches news and adds to tweet queue
 */
const fetchNewsAndQueue = async () => {
    try {
        console.log("[" + new Date().toISOString() + "] Fetching news...");
        const newsBody = await callNewsAPI();
        console.log("[" + new Date().toISOString() + "] Retrieved", newsBody.length, "articles");
        
        if (newsBody.length > 0) {
            for (let i = 0; i < newsBody.length; i++) {
                tweetQueue.push({
                    name: newsBody[i].title,
                    url: newsBody[i].url
                });
            }
            console.log("[" + new Date().toISOString() + "] Added", newsBody.length, "items to queue. Queue size:", tweetQueue.length);
            
            // Start processing queue if not already running
            if (!isProcessingQueue) {
                processQueue();
            }
        } else {
            console.log("[" + new Date().toISOString() + "] No new articles found");
        }
    } catch (error) {
        console.error("[" + new Date().toISOString() + "] Error fetching news:", error);
        // Continue running despite errors
    }
};

/**
 * Process the tweet queue with proper spacing
 */
const processQueue = async () => {
    if (isProcessingQueue || tweetQueue.length === 0) return;
    
    isProcessingQueue = true;
    
    try {
        const tweetMessage = tweetQueue.shift();
        console.log("[" + new Date().toISOString() + "] Processing tweet:", tweetMessage.name);
        
        await tweetNews(tweetMessage);
        
        console.log("[" + new Date().toISOString() + "] Tweet posted. Remaining in queue:", tweetQueue.length);
        console.log("[" + new Date().toISOString() + "] Waiting 30 minutes before next tweet");
        
        // Schedule next tweet after 30 minutes
        setTimeout(() => {
            isProcessingQueue = false;
            processQueue();
        }, 30 * 60 * 1000);
        
    } catch (error) {
        console.error("[" + new Date().toISOString() + "] Error processing queue:", error);
        // Reset processing flag after error to allow retry
        isProcessingQueue = false;
    }
};

/**
 * Tweet a single news item
 */
const tweetNews = async (tweetMessage) => {
    try {
        if ((tweetMessage.name !== null) && (tweetMessage.url !== null)) {
            const message = `${tweetMessage.name} \n${tweetMessage.url}`;
            console.log("[" + new Date().toISOString() + "] Sending tweet:", message.substring(0, 30) + "...");
            await rwUser.v2.tweet(message);
            console.log("[" + new Date().toISOString() + "] Tweet sent successfully");
            return true;
        }
        return false;
    } catch (error) {
        console.error("[" + new Date().toISOString() + "] Error posting tweet:", error);
        // Optionally re-queue the tweet for retry
        // tweetQueue.unshift(tweetMessage);
        throw error;
    }
};

// Start the service
const startNewsService = () => {
    if (fetchNewsIntervalId) {
        console.log("[" + new Date().toISOString() + "] News service already running");
        return;
    }
    
    console.log("[" + new Date().toISOString() + "] Starting news service");
    // Fetch news immediately on start
    fetchNewsAndQueue();
    
    // Then set up regular interval
    fetchNewsIntervalId = setInterval(fetchNewsAndQueue, FETCH_INTERVAL);
    console.log("[" + new Date().toISOString() + "] News service scheduled to run every", FETCH_INTERVAL/60000, "minutes");
};

// Stop the service
const stopNewsService = () => {
    if (fetchNewsIntervalId) {
        clearInterval(fetchNewsIntervalId);
        fetchNewsIntervalId = null;
        console.log("[" + new Date().toISOString() + "] News service stopped");
    }
};

// API Routes
app.get('/pushTweet', (req, res) => {
    startNewsService();
    res.send('News service started');
});

app.get('/stopTweet', (req, res) => {
    stopNewsService();
    res.send('News service stopped');
});

app.get('/status', (req, res) => {
    res.json({
        serviceRunning: fetchNewsIntervalId !== null,
        queueSize: tweetQueue.length,
        isProcessingQueue: isProcessingQueue
    });
});

app.get('/version', (req, res) => {
    res.send(`\nv11`);
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server listening on port ${PORT}`);
    
    // Automatically start the news service when the app starts
    startNewsService();
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log("[" + new Date().toISOString() + "] SIGTERM received, shutting down gracefully");
    stopNewsService();
    // Give time for any pending operations to complete
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

process.on('SIGINT', () => {
    console.log("[" + new Date().toISOString() + "] SIGINT received, shutting down gracefully");
    stopNewsService();
    // Give time for any pending operations to complete
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});