
from models import User, Manager, Restaurant, Menu
from flask import Flask, request, make_response, Request, Blueprint
from flask_cors import CORS
from dotenv import load_dotenv
from db import get_db, close_db
from admin.admin_functions import admin_functions
from manager.manager_functions import manager_functions
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity










load_dotenv()
app = Flask(__name__)
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.register_blueprint(admin_functions)
app.register_blueprint(manager_functions)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"], supports_credentials=True)
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
        return response({"message": "Invalid credentials"}, 400)
    
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
                
            
        access_token = create_access_token(identity=user)
        response = make_response({"message": "Login successful", "user": dict(user), "access_token": access_token})
        return response

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

@app.route('/restaurant/<int:id>', methods=["GET"])
def restaurant_data():
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
        response = make_response({"message": "User added successfully", "username": user.username})
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
    

@app.route('/restaurant_page/<int:restaurant_id>/update', methods=["POST"])
def update_restaurant():
    db = get_db()
    if request.json is not None:
        restaurant = Restaurant(**request.json)
        db.execute(
            "UPDATE restaurants SET location=?, phone_number=?, type=?, Kosher=?, order_table=?, Availability=?, rating=?, discounts=? WHERE name=?",
            (restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.rating, restaurant.discounts, restaurant.name)
        )
        db.commit()
        close_db()
        return {"message": "Restaurant updated successfully"}
    else:
        return {"message": "Invalid request"}

    


if __name__ == "__main__":
    app.run(debug=True)