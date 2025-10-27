# NestJS Template 1

Template for NestJS projects using Vertical Slice Architecture, CQRS, SQL database, JWT authentication.

## Common features
This template already implemented some common features below:

Auth:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/sign-up`
- `POST /api/v1/auth/new-at`: Refresh access token
- `GET /api/v1/auth/confirm-email`
- `POST /api/v1/auth/resend-confirmation-email`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/forgot-password`: Send password reset email

User
- `GET /api/v1/users/me`: Get authenticated user
- `PATCH /api/v1/users/me`: Edit authenticated user


## How to run

1. Install the dependencies
   ```shell
   npm install
   ```
2. Create a database on your MySQL server.

3. Set up environment variables. Rename the `.env.example` file to `.env` and provide the necessary values for your environment.

4. Run migrations
   ```shell
   npm run migration:run
   ```
5. Run
   ```shell
   npm run start:dev
   ```
Go to http://localhost:3000/swagger to view swagger document.