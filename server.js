const app = require('./src/app');
const { env } = require('./src/config/env');
const { logger } = require('./src/config/logger');

const server = app.listen(env.PORT, () => {
  logger.info(`API server is running on port ${env.PORT}`);
});

const shutdown = (signal) => {
  logger.info(`${signal} received. Closing HTTP server...`);

  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { message: error.message, stack: error.stack });
  process.exit(1);
});
