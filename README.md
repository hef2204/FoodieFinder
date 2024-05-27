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
    ```

To preview the production build, run:
    ```sh
    npm run preview
    ```

 
### Backend Project Structure

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
    *__init__.py: Marks the directory as a Python package.
    *main.py: Main entry point of the Flask application.
    *models.py: Contains database models (if any).
    *db.py: Contains functions for database setup and management.
    *UserClasses.py: Contains user-related classes.
    *requirements.txt: Lists the Python dependencies.
    *schema.sql: SQL script to set up the database schema.
    *.env: Environment variables file.
    *admin/: Directory for admin-related functions.
    *__init__.py: Marks the directory as a Python package.
    *admin_functions.py: Contains admin-related routes and functions.
    *manager/: Directory for manager-related functions.
    *__init__.py: Marks the directory as a Python package.
    *manager_functions.py: Contains manager-related routes and functions.
    *tests/: Directory for tests.
        *__init__.py: Marks the directory as a Python package.
        *test_register.py: Contains tests for user registration.


### Frontend Project Structure
        frontend/
    │
    ├── .env.development
    ├── .env.production
    ├── .eslintrc.cjs
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── index.tsx
        ├── App.tsx
        ├── components/
        │   ├── about.tsx
        │   ├── add_manager_restaurant.tsx
        │   ├── AddAdmin.tsx
        │   ├── AddManager.tsx
        │   ├── AddRestaurant.tsx
        │   ├── adminPage.tsx
        │   ├── homepage.tsx
        │   ├── login.tsx
        │   ├── ManagerPage.tsx
        │   ├── ManagerReservationPage.tsx
        │   ├── ManagersTable.tsx
        │   ├── register.tsx
        │   ├── ReservationPage.tsx
        │   ├── RestaurantDetailPage.tsx
        │   ├── restaurantPage.tsx
        │   ├── RestaurantUpdateForm.tsx
        │   ├── UpdateMenu.tsx
        │   ├── user-profile.tsx
        │   ├── UserReservationPage.tsx
        │   ├── UsersTable.tsx
        └── css/
            ├── about.css
            ├── add_manager_restaurant.css
            ├── AddAdmin.css
            ├── AddManager.css
            ├── AddRestaurant.css
            ├── adminPage.css
            ├── homepage.css
            ├── login.css
            ├── ManagerPage.css
            ├── ManagerReservationPage.css
            ├── ManagersTable.css
            ├── register.css
            ├── ReservationPage.css
            ├── RestaurantDetailPage.css
            ├── restaurantPage.css
            ├── RestaurantUpdateForm.css
            ├── UpdateMenu.css
            ├── user-profile.css
            ├── UserReservationPage.css
            ├── UsersTable.css

    `File Descriptions:
    *.env.development: Environment variables for development.
    *.env.production: Environment variables for production.
    *.eslintrc.cjs: ESLint configuration file.
    *index.html: Main HTML file.
    *package.json: Lists the Node.js dependencies and scripts.
    *package-lock.json: Lock file for npm.
    *tsconfig.json: TypeScript configuration file.
    *tsconfig.node.json: TypeScript configuration for Node.js.
    *vite.config.ts: Vite configuration file.
    *src/: Source directory containing the main application files.
    *index.tsx: Main entry point for the React application.
    *App.tsx: Main application component.
    *components/: Directory for React components.
    *about.tsx: Component for the about page.
    *add_manager_restaurant.tsx: Component for adding a manager to a restaurant.
    *AddAdmin.tsx: Component for adding an admin.
    *AddManager.tsx: Component for adding a manager.
    *AddRestaurant.tsx: Component for adding a restaurant.
    *adminPage.tsx: Admin dashboard component.
    *homepage.tsx: Homepage component.
    *login.tsx: Login component.
    *ManagerPage.tsx: Manager dashboard component.
    *ManagerReservationPage.tsx: Manager's reservation page component.
    *ManagersTable.tsx: Component displaying a table of managers.
    *register.tsx: User registration component.
    *ReservationPage.tsx: Reservation page component.
    *RestaurantDetailPage.tsx: Restaurant detail page component.
    *restaurantPage.tsx: Restaurant page component.
    *RestaurantUpdateForm.tsx: Form component for updating restaurant details.
    *UpdateMenu.tsx: Component for updating the menu.
    *user-profile.tsx: User profile component.
    *UserReservationPage.tsx: User's reservation page component.
    *UsersTable.tsx: Component displaying a table of users.
    *css/: Directory for CSS files corresponding to each component.
    *Each component has a corresponding CSS file for styling.

### Usage

1. **Start the backend server**:
        ```sh
        flask run
        ```

2. **Start the frontend development server**:
        ```sh
        npm run dev
        ```

3. **Open your browser and navigate to**:
        ```sh
        http://localhost:5173
        ```

### Notes
1. **ensure**:
        ```sh
        Ensure the backend server is running on port 5000 and the frontend server is running on port 5173.
        ```

2. **update**:    
        ```sh
        Update the environment variables as per your requirements.
        ```
