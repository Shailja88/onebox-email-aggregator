!!!!!Due to heavy load Render app crashed I have deployed twice but same error!!!!!



OneBox Email Aggregator
Overview

OneBox Email Aggregator is an email management system that fetches, categorizes, and organizes emails from multiple accounts in a unified platform. It utilizes rule-based categorization and IMAP integration to streamline email handling.

 Features

- Email Aggregation**: Fetch emails from multiple email providers using IMAP integration.
- Rule-Based Categorization**: Uses predefined rules to classify emails into relevant categories.
- Secure Authentication**: Uses JWT-based authentication for secure login and access control.
- Email Storage**: Stores fetched emails securely in MongoDB.
- Protected Routes**: Middleware implemented to secure API endpoints.
- Error Handling**: Centralized error handling to manage API responses efficiently.
- Frontend Integration**: User-friendly interface to view, search, and filter emails.

 Installation

# Prerequisites

Ensure you have the following installed:

- Node.js (v16 or later)
- MongoDB
- IMAP-supported email accounts

# Setup Steps

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd onebox-email-aggregator/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_secret_key>
   IMAP_HOST=<your_imap_host>
   IMAP_USER=<your_email>
   IMAP_PASS=<your_password>
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

## API Endpoints

# Authentication

- **POST** `/api/auth/login` - Login and receive JWT token

# Email Management

- **GET** `/api/emails` - Fetch aggregated emails
- **POST** `/api/emails/categorize` - Rule-based email categorization

# Frontend Flow

1. User Authentication: Users can log in to access their emails.
2. Dashboard: Displays categorized emails fetched from the backend.
3. Email Categorization: Users can view emails sorted into categories.
4. User Actions: Users can search, filter, and manage emails.
5. Logout & Session Management: Secure user sessions and logout functionality.

## Technologies Used

- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Email Handling: IMAP protocol
- Middleware: Used for route protection and error handling
- Frontend: React.js (for UI and API integration)

## Contribution

If you'd like to contribute, fork the repository and submit a pull request. Ensure all changes are tested properly.

## License

This project is licensed under the MIT License.

---

For any queries or support, feel free to contact the development team!

