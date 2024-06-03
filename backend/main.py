
from models import User
from flask import Flask, request, jsonify

from flask_cors import CORS
from dotenv import load_dotenv
from db import get_db, close_db
from admin.admin_functions import admin_functions
from manager.manager_functions import manager_functions
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta
import logging




load_dotenv()
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
jwt = JWTManager(app)
app.register_blueprint(admin_functions)
app.register_blueprint(manager_functions)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=["http://localhost:5173"], methods=["GET", "POST", "DELETE", "PUT"], supports_credentials=True)
print(FRONTEND_URL)

logging.basicConfig(level=logging.DEBUG)



@app.route('/')
def root():
    return jsonify({"message": "Welcome to the restaurant API"})


@app.route('/login', methods=["POST"])
def login():
    db = get_db()
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Invalid credentials"}), 400

    user = db.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password)).fetchone()

    if user:
        user = dict(user)
        
        if user['role'] == 'manager':
            restaurant = db.execute("SELECT id, name FROM restaurants WHERE manager_ids LIKE ?", ('%' + str(user['id']) + '%',)).fetchone()
            if restaurant:
                user['restaurantId'] = restaurant['id']
                user['restaurantName'] = restaurant['name']
                user['managerName'] = user['username']

        access_token = create_access_token(identity=user, expires_delta=timedelta(seconds=500000))
        return jsonify({"message": "Login successful", "user": user, "access_token": access_token})


    return jsonify({"message": "Invalid credentials"}), 401


@app.route('/register', methods=["POST"])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    full_name = data.get('full_name')
    phone_number = data.get('phone_number')

    if not username or not password or not email or not full_name or not phone_number:
        return jsonify({"message": "Missing required fields"}), 400

    db = get_db()
    existing_user = db.execute("SELECT * FROM users WHERE username = ? OR email = ?", (username, email)).fetchone()
    if existing_user:
        if existing_user['username'] == username:
            return jsonify({"message": "Username already taken"}), 409
        if existing_user['email'] == email:
            return jsonify({"message": "Email already taken"}), 410

    db.execute("INSERT INTO users (username, password, email, full_name, phone_number, role) VALUES (?, ?, ?, ?, ?, ?)",
               (username, password, email, full_name, phone_number, 'user'))
    db.commit()

    user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    access_token = create_access_token(identity={"id": user['id'], "username": user['username'], "role": user['role']})
    
    return jsonify({
        'token': access_token,
        'user_id': user['id'],
        'username': user['username'],
        'role': user['role']
    }), 201


@app.route('/homepage')
def home():
    return jsonify({"message": "Welcome to the restaurant API"})





@app.route('/restaurants', methods=["GET"])
def get_restaurants():
    filters = {}

    location = request.args.get('location')
    if location:
        filters['location'] = location.lower()  # Convert to lowercase

    type_of_food = request.args.get('type')
    if type_of_food:
        filters['type'] = type_of_food.lower()  # Convert to lowercase

    # Building the SQL query dynamically
    query = "SELECT * FROM restaurants WHERE 1=1"
    params = []
    for key, value in filters.items():
        query += f" AND LOWER({key}) = ?"
        params.append(value)

    # Executing the query
    db = get_db()
    restaurants = db.execute(query, params).fetchall()
    close_db()

    # Returning the response
    return jsonify({"restaurants": [dict(restaurant) for restaurant in restaurants]})

@app.route('/restaurant/types', methods=["GET"])
def get_restaurant_types():
    db = get_db()
    types = db.execute("SELECT DISTINCT type FROM restaurants").fetchall()
    close_db()
    
    # Returning the response
    return jsonify({"types": [type['type'] for type in types]})

@app.route('/restaurant/locations', methods=["GET"])
def get_restaurant_locations():
    db = get_db()
    locations = db.execute("SELECT DISTINCT location FROM restaurants").fetchall()
    close_db()
    
    # Returning the response
    return jsonify({"locations": [location['location'] for location in locations]})




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
        return jsonify({"message": "User updated successfully"})
    else:
        return jsonify({"message": "Invalid request"}), 400

    






    
@app.route('/restaurant_page/<int:restaurant_id>', methods=["GET"])
def restaurant_page(restaurant_id):
    db = get_db()
    restaurant = db.execute("SELECT * FROM restaurants WHERE id = ?", (restaurant_id,)).fetchone()
    menu = db.execute("SELECT * FROM menu_items WHERE restaurant_id=?", (restaurant_id,)).fetchall()
    close_db()

    if restaurant is None:
        return jsonify({"message": "Restaurant not found"}), 404
    
    manager_ids_raw = restaurant['manager_ids']
    if isinstance(manager_ids_raw, int):
        manager_ids = [manager_ids_raw]
    elif isinstance(manager_ids_raw, str):
        manager_ids = [int(id) for id in manager_ids_raw.split(',')]
    else:
        manager_ids = []

    print("manager_ids_str:", manager_ids_raw)  # Debugging statement
    print("manager_ids:", manager_ids)

    return jsonify({
        "restaurant": dict(restaurant),
        "menu": [dict(item) for item in menu],
        "manager_ids": manager_ids
    })
    


    


@app.route('/user_profile/<int:user_id>', methods=["GET", "PUT"])
def user_profile(user_id):
    db = get_db()
    if request.method == "GET":
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if user is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"user": dict(user)})
    
    elif request.method == "PUT":
        data = request.get_json()
        db.execute(
            "UPDATE users SET name = ?, email = ? WHERE id = ?",
            (data['name'], data['email'], user_id)
        )
        db.commit()
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if user is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"user": dict(user)})
    
    return jsonify({"error": "Method not allowed"}), 405


@app.route('/restaurant_page/<int:restaurant_id>/reservation', methods=["POST"])
def reservation(restaurant_id):
    db = get_db()
    data = request.get_json()
    print(data)
    db.execute(
        "INSERT INTO reservations (restaurant_id, restaurant_name, user_id, date, time, number_of_people) VALUES (?, ?, ?, ?, ?, ?)",
        (restaurant_id, data['restaurant_name']  ,data['user_id'], data['date'], data['time'], data['number_of_people'])
    )
    db.commit()
    close_db()
    return jsonify({"message": "Reservation added successfully"}), 201

@app.route('/user_profile/<int:user_id>/reservations', methods=["GET"])
def user_reservations(user_id):
    if request.method == 'GET':
        db = get_db()
        reservations = db.execute("SELECT id, restaurant_id, restaurant_name, date, time, number_of_people FROM reservations WHERE user_id = ?", (user_id,)).fetchall()
        close_db()
        return jsonify({"reservations": [dict(reservation) for reservation in reservations]})
    else:
        return jsonify({"message": "Invalid request"}), 400
    

@app.route('/user_profile/<int:user_id>/reservations/<int:reservation_id>', methods=["DELETE"])
def delete_user_reservation(user_id, reservation_id):
    db = get_db()
    db.execute("DELETE FROM reservations WHERE user_id = ? AND id = ?", (user_id, reservation_id))
    db.commit()
    close_db()
    return jsonify({"message": "Reservation deleted successfully"})




if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)