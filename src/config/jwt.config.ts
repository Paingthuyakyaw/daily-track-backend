import { ConfigService } from '@nestjs/config';

const DEV_JWT_SECRET = 'dev-only-jwt-secret-change-before-production';

export function getJwtSecret(config: ConfigService): string {
  const secret = config.get<string>('JWT_SECRET');
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET is required. Set it in .env (see .env.example).',
    );
  }

  return DEV_JWT_SECRET;
}
