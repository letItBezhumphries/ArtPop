//production keys

module.exports = {
  mongoURI: process.env.MONGO_URI,
  adminId: process.env.ADMIN_ID,
  adminPswd: process.env.ADMIN_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  paymentServerUrl: process.env.PAYMENT_SERVER_URL,
};
