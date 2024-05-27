# FoodieFinder Application

This repository contains the backend and frontend code for a full stack application. The backend is built with Flask and the frontend is built with React and TypeScript.

## Prerequisites

- Python 3.x
- Node.js and npm (Node Package Manager)

## Setup

### Backend

1. **Clone the repository**:

    ```sh
    git clone https://github.com/hef2204/FoodieFinder.git
    ```

2. **Install the required packages**:

    ```sh
    pip install -r requirements.txt
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root directory of the backend and add the following variables:

    ```env
    FLASK_APP=main.py
    FLASK_DEBUG=true
    FLASK_FRONTEND_URL=http://localhost:5173
    JWT_SECRET_KEY=your_secret_key_here
    ```

4. **Initialize the database**:

    Run the `schema.sql` file to set up the database:

    ```sh
    flask shell
    ```

5. **Run the backend server**:

    ```sh
    flask run
    ```

### Frontend

1. **Navigate to the frontend directory**:

    ```sh
    cd frontend
    ```

2. **Install the required packages**:

    ```sh
    npm install
    ```


3. **Run the frontend development server**:

    ```sh
    npm run dev
    ```

### Production Build

To create a production build of the frontend, run:

```sh
npm run build

To preview the production build, run:
npm run preview

Backend Project Structure
markdown
Copy code
backend/
│
├── __init__.py
├── main.py
├── models.py
├── db.py
├── UserClasses.py
├── requirements.txt
├── schema.sql
├── .env
├── admin/
│   ├── __init__.py
│   └── admin_functions.py
├── manager/
│   ├── __init__.py
│   └── manager_functions.py
└── tests/
    ├── __init__.py
    └── test_register.py
File Descriptions:
__init__.py: Marks the directory as a Python package.
main.py: Main entry point of the Flask application.
models.py: Contains database models (if any).
db.py: Contains functions for database setup and management.
UserClasses.py: Contains user-related classes.
requirements.txt: Lists the Python dependencies.
schema.sql: SQL script to set up the database schema.
.env: Environment variables file.
admin/: Directory for admin-related functions.
__init__.py: Marks the directory as a Python package.
admin_functions.py: Contains admin-related routes and functions.
manager/: Directory for manager-related functions.
__init__.py: Marks the directory as a Python package.
manager_functions.py: Contains manager-related routes and functions.
tests/: Directory for tests.
__init__.py: Marks the directory as a Python package.
test_register.py: Contains tests for user registration.




Usage

Usage
```sh
Start the backend server:
flask run


Start the frontend development server:
npm run dev

Open your browser and navigate to:
http://localhost:5173

Notes
Ensure the backend server is running on port 5000 and the frontend server is running on port 5173.
Update the environment variables as per your requirements.
