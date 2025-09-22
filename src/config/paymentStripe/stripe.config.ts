import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  publicKey: process.env.STRIPE_PUBLIC_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  platformFeePercent: parseFloat(process.env.PLATFORM_FEE_PERCENT || '0'),
  commissionPercent: parseFloat(process.env.COMMISSION_PERCENT || '8'),
}));
