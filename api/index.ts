import 'reflect-metadata';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express } from 'express';

let app: Express | null = null;
let initError: Error | null = null;

async function getApp(): Promise<Express> {
  if (initError) {
    throw initError;
  }
  if (!app) {
    try {
      const { getExpressApp } = await import('../dist/src/bootstrap.js');
      app = await getExpressApp();
    } catch (error) {
      initError = error instanceof Error ? error : new Error(String(error));
      console.error('Failed to start Nest app:', initError);
      throw initError;
    }
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Handler error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Server failed to start',
      detail: message,
    });
  }
}
