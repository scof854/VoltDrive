const express = require('express');
const path = require('path');
const leadRoutes = require('./routes/leadRoutes');
const { corsMiddleware } = require('./config/cors');
const { requestLogger } = require('./config/requestLogger');
const { rateLimitMiddleware } = require('./config/rateLimit');
const { errorHandler } = require('./middleware/errorHandler');
const { notFoundHandler } = require('./middleware/notFoundHandler');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(corsMiddleware);
app.use(express.json({ limit: '16kb' }));
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Autoservice API is healthy',
  });
});

app.use('/api/lead', rateLimitMiddleware, leadRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
