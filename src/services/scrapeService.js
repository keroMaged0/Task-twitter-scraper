import puppeteer from 'puppeteer';

const scrapeTwitter = async (accounts, symbol, interval) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let results = [];

    for (const account of accounts) {
        try {
            await page.goto(account, { waitUntil: 'networkidle2' }); // Go to the Twitter account page
            await page.waitForSelector('article', { timeout: 10000 }); // Wait for the tweets to load

            // Extract the text content of the tweets
            const tweets = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('article')).map(tweet => tweet.innerText.trim());
            });
            

            let count = 0;
            const symbolPattern = new RegExp(`\\${symbol}`, 'i'); // Case-insensitive regex pattern
            
            // Count mentions of the symbol symbol
            tweets.forEach(tweet => {
                if (symbolPattern.test(tweet)) {                    
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