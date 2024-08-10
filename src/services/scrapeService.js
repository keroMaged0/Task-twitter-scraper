import puppeteer from 'puppeteer';

const scrollPage = async (page) => {
    let previousHeight;
    while (true) {
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForSelector('article', { timeout: 10000 }); // Wait for 2 seconds to load new content
        const currentHeight = await page.evaluate('document.body.scrollHeight');
        if (currentHeight === previousHeight) break; // Exit if no new content is loaded
    }
};

const scrapeTwitter = async (accounts, symbol, interval) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let results = [];

    for (const account of accounts) {
        try {
            await page.goto(account, { waitUntil: 'networkidle2' }); // Go to the Twitter account page
            await scrollPage(page); // Scroll to load all tweets
            await page.waitForSelector('article', { timeout: 10000 }); // Wait for the tweets to load


            // Extract the text content of the tweets
            const tweets = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.r-18u37iz a[href*="cashtag_click"]'))
                .map(tweet => tweet.innerText.trim())
                .filter(text => text.startsWith('$'))
            });

            let count = 0;
            const tickerPattern = new RegExp(`\\${symbol}`, 'i'); // Case-insensitive regex pattern

            console.log(tweets);
            
            // Count mentions of the ticker symbol
            tweets.forEach(tweet => {
                if (tweet == symbol || tickerPattern.test(tweet)) {
                    count++;
                }
            });

            results.push({ account, mentioned: count, stockSymbol: symbol, timeInterval: `${interval} minutes` });
        } catch (error) {
            console.error(`Error scraping account ${account}:`, error);
            results.push({ account, error: 'Failed to scrape' });
        }
    }

    await browser.close(); // Close the browser
    return results;
};

export default scrapeTwitter;

