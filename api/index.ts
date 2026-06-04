import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express } from 'express';

let app: Express | null = null;

async function getApp(): Promise<Express> {
  if (!app) {
    const { getExpressApp } = await import('../dist/src/bootstrap.js');
    app = await getExpressApp();
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await getApp();
  return expressApp(req, res);
}
