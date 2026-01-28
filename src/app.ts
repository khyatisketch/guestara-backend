import express from 'express';

import addonRoutes from './modules/addons/addon.routes.js';
import categoryRoutes from './modules/category/category.routes.js';
import itemRoutes from './modules/item/item.routes.js';
import subcategoryRoutes from './modules/subcategory/subcategory.routes.js';
import { errorMiddleware } from './core/errors/error.middleware.js';

const app = express();

/**
 * Parse incoming JSON request bodies.
 * Needed for APIs expecting JSON payloads.
 */
app.use(express.json());

/**
 * Simple liveness check for deployment platforms and uptime monitors.
 */
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

/**
 * Public API routes grouped by domain.
 * Mounting by path keeps routing scalable and avoids route collisions.
 */
app.use('/api/addons', addonRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/subcategories', subcategoryRoutes);

/**
 * Global error formatter.
 * This must be the last middleware so it catches downstream errors
 * and produces a consistent JSON response format.
 */
app.use(errorMiddleware);

export default app;
