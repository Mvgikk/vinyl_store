
  

# Vinyl Store Backend

  

Backend API for a vinyl store, built with NestJS. This project includes user authentication, role-based access, Google OAuth, order management, and review handling. It also provides email notifications, Stripe integration for payments, and the ability to upload and manage user avatars stored in PostgreSQL as BLOBs. 

  

## Table of Contents

- [Requirements](#requirements)


- [Configuration](#configuration)

- [Running the Application](#running-the-application)

- [Database Migrations](#database-migrations)

- [Seeding the Database](#seeding-the-database)

- [Testing](#testing)

- [Deployment](#deployment)

- [API Documentation](#api-documentation)

  

## Requirements

- Node.js 22.11.0

- PostgreSQL

- Stripe account (for payment processing)

- Google Cloud account (for OAuth)

  


  


## Configuration

  

Configuration files are located in the `config` folder. Environment-specific settings are used to define the application's behavior in development, testing, and production environments.

  

-  `development`: Default for local development. Uses `.env`.

-  `production`: Configured for Heroku deployment, using `DATABASE_URL` and other secure environment variables in Heroku Config Vars.

-  `test`: Uses `.env.test` for test environment setup.

  

### Environment Variables

  

Required environment variables:

-  `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`,`DATABASE_NAME_TEST`

-  `JWT_SECRET`

-  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`

-  `STRIPE_SECRET_KEY`

-  `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_SECURE`

-  `ADMIN_EMAIL`, `ADMIN_PASSWORD`


  

## Running the Application

  

### Development

  

```bash

npm  run  start:dev

```

  

### Production

  

  

The application is available at `https://vinyl-store-mgk-20a9e299b438.herokuapp.com` 

  

## Database Migrations

  


The database schema is managed using TypeORM migrations. Run the following commands for different environments:

  

-  **Development**: Generate or run migrations locally

```bash

npm run migration:generate --name=MigrationName

npm run migration:run

```

  

-  **Production**: Run migrations on Heroku

```bash

heroku run npm run migration:run:prod -a app-name

```

  

## Seeding the Database

  

Run seeders to populate the database with initial data:

  

```bash

npm  run  seed

```
Clears database:

  

```bash

npm  run  seed:rollback

```
  

For production:

```bash

npm  run  seed:prod

```

For testing:

```bash

npm  run  seed:test

```
  

## Testing

  
Utilizes node:test.

1. Set up the `.env.test` file with database configurations for testing.

2. Run tests:

```bash

npm run test

```

3. Run e2e tests:

```bash

npm run test:e2e

```

  

## Deployment

  

### Heroku

1. Set up a Heroku project and add PostgreSQL.

2. Configure `Config Vars` on Heroku with the environment variables.

3. Push to Heroku:

```bash

git push heroku main

```

  

## API Documentation

  

API documentation is available via Swagger. 

  

```

https://vinyl-store-mgk-20a9e299b438.herokuapp.com/api-docs

```

  

## Key Features

  

-  **Authentication**: JWT, Google OAuth, and session whitelist.

-  **Stripe Integration**: For payment processing.

-  **Role-based Access**: Separate access for admins and users.

-  **Logging**: Centralized logging with Winston.

-  **Seeding and Migration**: Easy setup and management of database structure and initial data.

### Avatar Image Upload

  

To upload avatar images:

1. Select `multipart/form-data`.

2. Use the `file` key to attach the image.

  

Avatars are stored as BLOBs in PostgreSQL, accessible via the `avatarUrl` provided in user profile data.
  

