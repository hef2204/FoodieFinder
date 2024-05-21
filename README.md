# FoodieFinder Application

This repository contains the backend and frontend code for a full stack application. The backend is built with Flask and the frontend is built with React and TypeScript.

## Prerequisites

- Python 3.x
- Node.js and npm (Node Package Manager)

## Setup

### Backend

1. **Clone the repository**:

    ```sh
    git clone <repository_url>
    cd <repository_directory>
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
    JWT_SECRET_KEY=your_secret_key
    ```

4. **Initialize the database**:

    Ensure you have `database.db` and `schema.sql` in the backend directory. Then, run the following commands to set up the database:

    ```sh
    flask db init
    flask db migrate
    flask db upgrade
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

3. **Set up environment variables**:

    Create a `.env.development` file in the root directory of the frontend and add the following variables:

    ```env
    VITE_API_URL=http://localhost:5000
    ```

4. **Run the frontend development server**:

    ```sh
    npm run dev
    ```

### Production Build

To create a production build of the frontend, run:

```sh
npm run build

To preview the production build, run:
npm run preview

Project Structure
Backend
main.py: The main entry point of the Flask application.
models.py: Contains the database models.
db.py: Database setup and initialization.
admin_functions.py: Functions related to admin operations.
manager_functions.py: Functions related to manager operations.
UserClasses.py: User-related classes.
requirements.txt: Lists the Python dependencies.
schema.sql: SQL script to set up the database schema.
Frontend
index.html: The main HTML file.
vite.config.ts: Vite configuration file.
package.json: Lists the Node.js dependencies and scripts.
src/: Contains the React components and other frontend code.
about.tsx
add_manager_restaurant.tsx
AddAdmin.tsx
AddManager.tsx
AddRestaurant.tsx
adminPage.tsx
homepage.tsx
login.tsx
ManagerPage.tsx
ManagerReservationPage.tsx
ManagersTable.tsx
register.tsx
ReservationPage.tsx
RestaurantDetailPage.tsx
restaurantPage.tsx
RestaurantUpdateForm.tsx
UpdateMenu.tsx
user-profile.tsx
UserReservationPage.tsx
UsersTable.tsx
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
