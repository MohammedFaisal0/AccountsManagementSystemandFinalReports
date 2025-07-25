# Accounts Management System and Final Reports

## Overview

Accounts Management System and Final Reports is a full-stack web application designed for managing financial accounts, processing and validating Excel files, and generating comprehensive financial reports. The system supports multi-role user management, task assignment, real-time notifications, and hierarchical financial data structures. It features a Next.js frontend and a Python FastAPI backend for advanced Excel processing, with a MySQL database managed via Prisma ORM.

---

## Features

- **User Management:** Multi-role authentication (Administrator, Employee, Reviewer)
- **Excel File Upload & Processing:** Automated extraction and validation of financial data from Excel files
- **Financial Data Management:** Revenue and expense tracking with hierarchical account structures
- **Reporting:** Generation of detailed financial, validation, and activity reports
- **Task Management:** Assignment and tracking of financial tasks
- **Notifications:** Real-time system notifications
- **Data Validation:** Automated checks against predefined rules

---

## Installation & Setup

### 1. Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (or yarn)
- **Python** (3.8 or higher)
- **MySQL** (v8.0 or higher)

### 2. Clone the Repository

```bash
git clone <repository-url>
cd AccountsManagementSystemandFinalReports
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Set Up the Python Backend

```bash
cd python_backend
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create a `.env` file in the project root with the following content:

```env
DATABASE_URL="mysql://username:password@localhost:3306/accounts_management"
UPLOAD_DIR="./uploads" # Optional, defaults to ./uploads
JWT_SECRET="your-secure-secret-key-here"
PYTHON_API_URL="http://localhost:8000"
```

Replace `username` and `password` with your MySQL credentials.

### 6. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with initial data
npx prisma db seed
```

### 7. Create the Default Administrator User

```bash
npm run create-default-admin
```

---

## Running the Application

### 1. Start the Python Backend

```bash
cd python_backend
# Activate the virtual environment if not already active
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
python Api_for_excels.py
```

The Python API will be available at [http://localhost:8000](http://localhost:8000)

### 2. Start the Next.js Frontend

```bash
# In the project root
dnpm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## Default Login Credentials

After setup, log in with the default administrator account:

- **Email:** admin@system.com
- **Password:** admin123

**Important:** Change the default password immediately after your first login.

---

## Resetting the Database (After Schema Changes)

If you modify the Prisma schema or want to reset the database:

1. **Drop the existing database:**
   - You can use a MySQL client or command line:
     ```sql
     DROP DATABASE accounts_management;
     CREATE DATABASE accounts_management;
     ```
2. **Re-run migrations and seed:**

```bash
   npx prisma migrate dev
   npx prisma db seed
```

3. **Recreate the default admin user:**

```bash
   npm run create-default-admin
```

This will ensure your database is in sync with the latest schema and seeded with initial data.

---

## Project Structure

```
AccountsManagementSystemandFinalReports/
├── src/                # Next.js frontend source
├── python_backend/     # Python FastAPI backend for Excel processing
├── prisma/             # Database schema and migrations
├── scripts/            # Utility scripts
└── public/             # Static assets
```

---

## Security Notes

- Change the default admin password after first login
- Keep sensitive data in `.env` files (never commit them)
- Use strong passwords for your database
- Validate uploaded files and restrict file types

---

## Troubleshooting

- Ensure MySQL is running and accessible
- Check `.env` configuration for correct credentials and URLs
- Activate the Python virtual environment before running the backend
- For port conflicts, ensure ports 3000 (frontend) and 8000 (backend) are free
- Review terminal output and logs for error details

---

## License

This project is proprietary software. All rights reserved.
