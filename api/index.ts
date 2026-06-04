import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { getExpressApp } = await import('../dist/src/bootstrap.js');
  const app = await getExpressApp();
  return app(req, res);
}
