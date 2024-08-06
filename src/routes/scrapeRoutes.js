import express from 'express';
import scrapeController from '../controllers/scrapeController.js';
import validation from '../Middleware/validationMiddleware.js';
import validationBody from '../validation/scrapeValidation.js';

const router = express.Router();

// Endpoint to scrape Twitter accounts
router.post('/',
    validation(validationBody),  // Validate request body
    scrapeController.handleScraping  // Handle scraping request
);

export default router;
