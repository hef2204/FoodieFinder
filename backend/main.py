
from models import User, Manager, Restaurant, Menu
from flask import Flask, request, make_response, Request, Blueprint
from flask_cors import CORS
from dotenv import load_dotenv
from db import get_db, close_db
from admin.admin_functions import admin_functions
from manager.manager_functions import manager_functions
from flask_login import LoginManager, login_user
from UserClasses import User








load_dotenv()
app = Flask(__name__)
app.secret_key = "secret"
login_manager = LoginManager()
@login_manager.user_loader
def load_user(user_id):
    db = get_db()
    row = db.execute("SELECT * FROM users WHERE username = ?", (user_id,)).fetchone()
    if row:
        return User(row)
    return None

login_manager.init_app(app)


app.register_blueprint(admin_functions)
app.register_blueprint(manager_functions)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"], supports_credentials=True)
print(FRONTEND_URL)



@app.route('/')
def root():
    response = make_response("Hello from the backend!")
    # response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/login', methods=["POST"])
def login():
    db = get_db()
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return response({"message": "Invalid credentials"}, 400)
    
    tables = ['users', 'managers', 'admin']
    user = None
    table_used = None

    for table in tables:
        user = db.execute(f"SELECT username, role, firstLogin FROM {table} WHERE username=? AND password=?", (username, password)).fetchone()
        if user is not None:
            table_used = table
            break

    if user:
        user = User(user)
        login_user(user)  # Log the user in
        if user['firstLogin']:
            db.execute(f"UPDATE {table_used} SET firstLogin = 0 WHERE username = ?", (username,))
            db.commit()
        return response({"message": "Login successful", "user": dict(user)}, 200)

    return response({"message": "Invalid credentials"}, 401)

def response(body, status):
    res = make_response(body, status)
    res.headers.add("Access-Control-Allow-Origin", "*")
    return res

@app.route('/homepage')
def home():
    response = make_response("Welcome to the home page!")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response



@app.route('/add_user', methods=["POST"])
def add_user():
    db = get_db()
    user = User(**request.json)
    db.execute(
        "INSERT INTO users (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
        (user.username, user.password, user.email, user.first_name, user.last_name)
    )
    db.commit()
    close_db()
    response = make_response({"message": "User added successfully"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


<<<<<<< HEAD
@app.route('/login', methods=["POST"])
def login():
    db = get_db()
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")
=======
@app.route('/add_manager', methods=["POST"])
def add_manager():
    db = get_db()
    manager = Manager(**request.get_json())
    db.execute(
        "INSERT INTO managers (username, full_name, password, email, restaurant, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
        (manager.username, manager.full_name, manager.password, manager.email, manager.restaurant, manager.phone_number)
    )
    db.commit()
    close_db()
    response = make_response({"message": "Manager added successfully"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response





@app.route('/delete_manager', methods=["POST"])
def delete_manager():
    db = get_db()
    if request.json is not None:
        db.execute("DELETE FROM managers WHERE full_name=?", (request.json["full_name"],))
        db.commit()
        close_db()
        response = make_response({"message": "Manager deleted successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    

def response(body, status):
    res = make_response(body, status)
    res.headers.add("Access-Control-Allow-Origin", "*")
    return res




@app.route('/logout', methods=["POST"])
def logout():
    return response({"message": "Logout successful"}, 200)


@app.route('/restaurants', methods=["GET"])
def get_restaurants():
    db = get_db()
    restaurants = db.execute("SELECT * FROM restaurants").fetchall()
    close_db()
    response = make_response({"restaurants": [dict(restaurant) for restaurant in restaurants]})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response



@app.route('/update_user', methods=["POST"])
def update_user():
    db = get_db()
    if request.json is not None:
        user = User(**request.json)
        db.execute(
            "UPDATE users SET email=?, first_name=?, last_name=? WHERE username=?",
            (user.email, user.first_name, user.last_name, user.username)
        )
        db.commit()
        close_db()
        response = make_response({"message": "User updated successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    
@app.route('/update_manager', methods=["POST"])
def update_manager():
    db = get_db()
    if request.json is not None:
        manager = Manager(**request.json)
        db.execute(
            "UPDATE managers SET email=?, restaurant=?, phone_number=? WHERE full_name=?",
            (manager.email, manager.restaurant, manager.phone_number, manager.full_name)
        )
        db.commit()
        close_db()
        response = make_response({"message": "Manager updated successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    


@app.route('/register', methods=["POST"])
def register():
    db = get_db()
    if request.json is not None:
        user = User(**request.json)
        db.execute(
            "INSERT INTO users (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
            (user.username, user.password, user.email, user.first_name, user.last_name)
        )
        db.commit()
        close_db()
        response = make_response({"message": "User added successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    


if __name__ == "__main__":
    app.run(debug=True)