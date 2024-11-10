export default () => ({
    environment: 'production',
    port: parseInt(process.env.PORT, 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwtSecret: process.env.JWT_SECRET,
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        secure: process.env.EMAIL_SECURE,
    },
});
