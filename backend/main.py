
from models import User, Manager, Restaurant, Menu
from flask import Flask, request, make_response, Blueprint, jsonify

from flask_cors import CORS
from dotenv import load_dotenv
from db import get_db, close_db
from admin.admin_functions import admin_functions
from manager.manager_functions import manager_functions
from flask_jwt_extended import JWTManager, create_access_token










load_dotenv()
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
jwt = JWTManager(app)
app.register_blueprint(admin_functions)
app.register_blueprint(manager_functions)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=["http://localhost:5173"], methods=["GET", "POST", "DELETE"], supports_credentials=True)
print(FRONTEND_URL)



@app.route('/')
def root():
    response = make_response("Hello from the backend!")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/login', methods=["POST"])
def login():
    db = get_db()
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Invalid credentials"}, 400)
    
    tables = ['users', 'managers', 'admin', 'restaurants']
    user = None
    table_used = None

    for table in tables:
        user = db.execute(f"SELECT * FROM {table} WHERE username=? AND password=?", (username, password)).fetchone()
        if user is not None:
            table_used = table
            break

    if user:
        user = dict(user)
        if user['firstLogin']:
            db.execute(f"UPDATE {table_used} SET firstLogin = 0 WHERE username = ?", (username,))
            db.commit()
        if table_used == 'managers':

            restaurant = db.execute("SELECT id FROM restaurants WHERE manager_id = ?", (user['id'],)).fetchone()
            if restaurant:
                user['restaurantId'] = restaurant['id']
                user['restaurantName'] = db.execute("SELECT name FROM restaurants WHERE id = ?", (restaurant['id'],)).fetchone()['name']
                user['managerName'] = db.execute("SELECT username FROM managers WHERE id = ?", (user['id'],)).fetchone()['username']
                user['firstName'] = db.execute("SELECT first_name FROM users WHERE id = ?", (user['id'],)).fetchone()['first_name']
                
            
        access_token = create_access_token(identity=user)
        response = make_response({"message": "Login successful", "user": dict(user), "access_token": access_token})
        return response

    return jsonify({"message": "Invalid credentials"}, 401)

def response(body, status):
    res = make_response(body, status)
    res.headers.add("Access-Control-Allow-Origin", "*")
    return res


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
        response = make_response({"message": "User added successfully", "username": user.username})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

@app.route('/homepage')
def home():
    response = make_response("Welcome to the home page!")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response





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
    

    






    
@app.route('/restaurant_page/<int:restaurant_id>', methods=["GET"])
def restaurant_page(restaurant_id):
    db = get_db()
    restaurant = db.execute("SELECT * FROM restaurants WHERE id=?", (restaurant_id,)).fetchone()
    menu = db.execute("SELECT * FROM menu_items WHERE restaurant_id=?", (restaurant_id,)).fetchall()
    close_db()
    if restaurant is not None:
        response = make_response({
            "restaurant": dict(restaurant),
            "menu": [dict(item) for item in menu]
        })
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Restaurant not found"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    


    


@app.route('/user_profile/<int:user_id>', methods=["GET", "PUT"])
def user_profile(user_id):
    db = get_db()
    if request.method == "GET":
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        close_db()
        if user is None:
            return make_response({"error": "User not found"}, 404)
        response = make_response({"user": dict(user)})
    elif request.method == "PUT":
        data = request.get_json()
        db.execute(
            "UPDATE users SET name = ?, email = ? WHERE id = ?",
            (data['name'], data['email'], user_id)
        )
        db.commit()
        close_db()
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        response = make_response({"user": dict(user)})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response











    


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)