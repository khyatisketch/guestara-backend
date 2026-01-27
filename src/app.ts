import express from 'express';
// import categoryRoutes from './modules/category/category.routes.js';
// import { errorMiddleware } from './core/errors/error.middleware.js';

const app = express();

// Parse JSON
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Mount routes
// app.use('/api/categories', categoryRoutes);

// // Error middleware (should be last)
// app.use(errorMiddleware);

export default app;
