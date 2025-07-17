# Accounts Management System and Final Reports

A comprehensive full-stack application for managing financial accounts, processing Excel files, and generating reports. Built with Next.js frontend and Python FastAPI backend for Excel processing.

## 🚀 Features

- **User Management**: Multi-role authentication (Administrator, Employee, Reviewer)
- **File Upload & Processing**: Excel file upload with automated data extraction and validation
- **Financial Data Management**: Revenue and expense tracking with hierarchical account structures
- **Reporting**: Comprehensive financial reports and analytics
- **Task Management**: Assignment and tracking of financial tasks
- **Notifications**: Real-time notifications for system events
- **Data Validation**: Automated validation of financial data against predefined rules

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (3.8 or higher)
- **MySQL** database server (v8.0 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd AccountsManagementSystemandFinalReports

# Install Node.js dependencies
npm install
```

### 2. Python Backend Setup

```bash
# Navigate to Python backend directory
cd python_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install fastapi uvicorn python-multipart openpyxl pandas
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/accounts_management"

# Upload Directory (optional, defaults to ./uploads)
UPLOAD_DIR="./uploads"

# JWT Secret for authentication
JWT_SECRET="your-secure-secret-key-here"

# Python API URL (for Excel processing)
PYTHON_API_URL="http://localhost:8000"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with initial data
npx prisma db seed

# Create default administrator account
npm run create-default-admin
```

## 🚀 Running the Application

### 1. Start the Python Backend (Excel Processing API)

```bash
# In the python_backend directory with venv activated
cd python_backend
python Api_for_excels.py
```

The Python API will be available at `http://localhost:8000`

### 2. Start the Next.js Frontend

```bash
# In the root directory
npm run dev
```

The application will be available at `http://localhost:3000`

## 👤 Default Login Credentials

After setup, you can log in with the default administrator account:

- **Email**: `admin@system.com`
- **Password**: `admin123`

**⚠️ Security Note**: Change the default password immediately after first login!

## 📖 Operating Instructions

### User Management

#### Creating New Users

1. Log in as an administrator
2. Navigate to **Users** section
3. Click **Add User** button
4. Fill in user details:
   - Name
   - Email (unique)
   - Password
   - Phone (optional)
   - Role (Administrator/Employee/Reviewer)
5. Click **Save**

#### User Roles and Permissions

- **Administrator**: Full access to all features including user management
- **Employee**: Can upload files, manage data, create reports (no user management)
- **Reviewer**: Read-only access to reports, notifications, and tasks

### File Upload and Processing

#### Supported File Formats

- Excel files (`.xlsx`, `.xls`)
- Specific financial data structure required

#### Upload Process

1. Navigate to **Import File** section
2. Fill in file metadata:
   - Select Directorate
   - Choose Month (1-12)
   - Enter Year
   - Select Report Type
3. Click **Choose File** and select your Excel file
4. Click **Upload File**

#### File Processing Workflow

1. **Upload**: File is stored in the upload directory
2. **Validation**: Basic file format and structure validation
3. **Processing**: Python backend extracts data from Excel sheets
4. **Data Mapping**: Financial data is mapped to revenue/expense hierarchies
5. **Validation**: Data is validated against predefined rules
6. **Storage**: Validated data is stored in the database

#### Excel File Structure Requirements

The system expects Excel files with specific sheet structures:

- **Sheet 1**: Revenue data (Main accounts)
- **Sheet 2**: Expense data (Use accounts)
- **Month Mapping**: Each month corresponds to specific sheet indices

### Financial Data Management

#### Revenue Hierarchy

- **Chapters** → **Sections** → **Items** → **Types**
- Each level has unique codes and names
- Hierarchical relationship maintained

#### Expense Hierarchy

- **Use Chapters** → **Use Sections** → **Use Items** → **Use Types**
- Similar structure to revenue hierarchy
- Separate management for expense tracking

#### Account Types

- **Main Accounts**: Primary financial accounts
- **Auxiliary Accounts**: Supporting account structures

### Reporting

#### Available Reports

1. **Financial Data Reports**: Detailed financial entries by period
2. **Validation Reports**: Data validation results and errors
3. **User Activity Reports**: File upload and processing history
4. **Directorate Reports**: Financial data by organizational unit

#### Generating Reports

1. Navigate to **Reports** section
2. Select report type
3. Choose date range and filters
4. Click **Generate Report**
5. Download or view results

### Task Management

#### Creating Tasks

1. Navigate to **Tasks** section
2. Click **Create Task**
3. Fill in task details:
   - Title
   - Description
   - Assignee
   - Due Date
   - Priority
4. Click **Save**

#### Task Status Tracking

- **Pending**: Newly created tasks
- **In Progress**: Tasks being worked on
- **Completed**: Finished tasks
- **Overdue**: Past due date

### Notifications

The system provides real-time notifications for:

- File upload completions
- Data validation results
- Task assignments
- System errors
- User activity

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npx prisma db seed       # Seed database
npx prisma studio        # Open database GUI

# User Management
npm run create-default-admin    # Create default admin user
npm run create-admin            # Create admin user

# Python Backend
cd python_backend
python Api_for_excels.py        # Start Excel processing API
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Errors

```bash
# Check MySQL service status
# Windows:
net start mysql
# Linux/macOS:
sudo systemctl start mysql

# Verify connection string in .env
DATABASE_URL="mysql://username:password@localhost:3306/accounts_management"
```

#### Python Backend Issues

```bash
# Ensure virtual environment is activated
cd python_backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/macOS

# Reinstall dependencies
pip install -r requirements.txt
```

#### File Upload Problems

```bash
# Check upload directory permissions
# Create directory if missing
mkdir uploads

# Verify environment variable
UPLOAD_DIR="./uploads"
```

#### Port Conflicts

```bash
# Check if ports are in use
# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Linux/macOS:
lsof -i :3000
lsof -i :8000
```

### Error Logs

Check the following locations for error logs:

- **Next.js**: Browser console and terminal output
- **Python API**: Terminal output in python_backend directory
- **Database**: MySQL error logs

## 📁 Project Structure

```
AccountsManagementSystemandFinalReports/
├── src/                    # Next.js frontend source
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── context/          # React context providers
│   └── lib/              # Utility functions
├── python_backend/        # Python FastAPI backend
│   ├── Api_for_excels.py # Main API server
│   ├── reading_Excel.py  # Excel processing logic
│   └── temp_uploads/     # Temporary file storage
├── prisma/               # Database schema and migrations
├── scripts/              # Utility scripts
└── public/               # Static assets
```

## 🔒 Security Considerations

1. **Change Default Password**: Immediately change the default admin password
2. **Environment Variables**: Keep sensitive data in `.env` files
3. **Database Security**: Use strong passwords and limit database access
4. **File Uploads**: Validate file types and scan for malware
5. **CORS Configuration**: Configure CORS properly for production

## 📞 Support

For technical support or questions:

1. Check the troubleshooting section above
2. Review error logs in the console
3. Verify all prerequisites are installed
4. Ensure environment variables are correctly configured

## 📄 License

This project is proprietary software. All rights reserved.

---

**Last Updated**: December 2024
**Version**: 1.0.0
