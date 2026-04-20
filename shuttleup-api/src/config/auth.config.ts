import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.BETTER_AUTH_SECRET,
  url: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
}));
