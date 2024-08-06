import { AppError, catchError } from '../Middleware/errorHandlingMiddleware.js';
import scrapeTwitter from '../services/scrapeService.js';

const handleScraping = catchError(
    async (req, res, next) => {
        const { accounts, symbol, interval } = req.body;

        // Validate input parameters
        if (!accounts || !symbol || !interval) 
            return next(new AppError('Please provide accounts, symbol, and interval.', 400));

        const results = await scrapeTwitter(accounts, symbol, interval);

        // Send response with scraping results
        res.json({
            message: "Data scraped successfully.",
            data: results
        });
    }
);

export default {
    handleScraping
};
