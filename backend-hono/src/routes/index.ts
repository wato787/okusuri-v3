import type { App } from '../types';
import { healthRoutes } from '../features/health/router';
import { medicationRoutes } from '../features/medication/router';
import { notificationRoutes } from '../features/notification/router';

export const registerRoutes = (app: App) => {
  app.route('/api/health', healthRoutes);
  app.route('/api/medication-log', medicationRoutes);
  app.route('/api/notification', notificationRoutes);
};
