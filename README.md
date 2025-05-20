# 🎟️ Ticket System Server

A backend server for managing event ticketing operations, including ticket creation, distribution, and redemption.
Built with TypeScript and Node.js, this server is designed to handle ticket-related functionalities efficiently.

## 🚀 Features

- **Ticket Management**: Create, update, and delete event tickets.
- **User Authentication**: Secure login and registration for event organizers and attendees.
- **QR Code Generation**: Generate unique QR codes for each ticket to facilitate easy scanning and validation.
- **Ticket Redemption**: Scan and redeem tickets at event entry points.
- **Admin Dashboard**: Monitor ticket sales, check-in statistics, and manage events.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker, Docker Compose

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/gabrielrosinski/ticket-system-server.git
   cd ticket-system-server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and configure the following variables:

   ```env
   PORT=3000
   DATABASE_URL=postgres://user:password@localhost:5432/ticket_system
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application**:

   - **Using Docker**:

     ```bash
     docker-compose up --build
     ```

   - **Without Docker**:

     ```bash
     npm run dev
     ```

## 📚 API Documentation

The API provides endpoints for managing events, tickets, and users.
Detailed documentation can be accessed via the `/api-docs` endpoint when the server is running.

## 🧪 Running Tests

To run the test suite:

```bash
npm test
```

Ensure that the test database is configured correctly in your `.env` file.

## 📁 Project Structure

```plaintext
ticket-system-server/
├── src/
│   ├── controllers/
|   ├── config/
|   ├── constants/
|   ├── database/
|   ├── errors/
|   ├── middleware/
│   ├── types/
│   ├── routes/
│   ├── services/
|   ├── validators/
│   └── index.ts
├── app.ts
├── .dockerignore
├── .gitignore
├── .prettierrc
├── .env
├── docker-compose.yml
├── package.json
└── tsconfig.json
```
