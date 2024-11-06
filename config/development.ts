export default () => ({
    environment: 'development',
    port: parseInt(process.env.PORT, 10),
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
});
  