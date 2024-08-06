import express from 'express';
import { config } from 'dotenv';

import initApp from './src/init_app.js';

// Load environment variables
config({ path: './config/.env' });

const app = express();

// Initialize the application
initApp(app, express);

// Start the server
const port = process.env.PORT || 3100;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
