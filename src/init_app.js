import { globalErrorHandler } from './Middleware/errorHandlingMiddleware.js';
import scrapeRoutes from './routes/scrapeRoutes.js';

const initApp = (app, express) => {
    app.use(express.json());

    // Register scrape routes
    app.use('/scrape', scrapeRoutes);

    // Global error handling
    app.use(globalErrorHandler);
};

export default initApp;
