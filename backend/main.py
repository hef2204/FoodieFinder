from models import User, Manager, Restaurant, Menu
from flask import Flask, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv
from db import get_db, close_db



load_dotenv()
app = Flask(__name__)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"])
print(FRONTEND_URL)



@app.route('/')
def root():
    response = make_response("Hello from the backend!")
    # response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/home')
def home():
    response = make_response("Welcome to the home page!")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


    


@app.route('/users')
def users():
    db = get_db()
    users = db.execute("SELECT * FROM users").fetchall()
    close_db()
    users = [dict(user) for user in users]
    response = make_response({"users": users})
    # response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/managers')
def managers():
    db = get_db()
    managers = db.execute("SELECT * FROM managers").fetchall()
    close_db()
    managers = [dict(manager) for manager in managers]
    response = make_response({"managers": managers})
    # response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/restaurants')
def restaurants():
    db = get_db()
    restaurants = db.execute("SELECT * FROM restaurants").fetchall()
    close_db()
    restaurants = [dict(restaurant) for restaurant in restaurants]
    response = make_response({"restaurants": restaurants})
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


@app.route('/add_manager', methods=["POST"])
def add_manager():
    db = get_db()
    manager = Manager(**request.get_json())
    db.execute(
        "INSERT INTO managers (full_name, password, email, restaurant, phone_number) VALUES (?, ?, ?, ?, ?)",
        (manager.full_name, manager.password, manager.email, manager.restaurant, manager.phone_number)
    )
    db.commit()
    close_db()
    response = make_response({"message": "Manager added successfully"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/add_restaurant', methods=["POST"])
def add_restaurant():
    db = get_db()
    # restaurant = Restaurant(**request.json)
    if request.json is not None:
        restaurant = Restaurant(request.json["name"], 
                                request.json["location"],
                                request.json["phone_number"],
                                request.json["type"],
                                request.json["Kosher"],
                                request.json["order_table"],
                                request.json["Availability"],
                                request.json["discounts"])
        db.execute(
            "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.discounts)
        )
        db.commit()
        close_db()
        response = make_response({"message": "Restaurant added successfully"})
        # response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

@app.route('/delete_user', methods=["POST"])
def delete_user():
    db = get_db()
    if request.json is not None:
        db.execute("DELETE FROM users WHERE username=?", (request.json["username"],))
        db.commit()
        close_db()
        response = make_response({"message": "User deleted successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
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
    

@app.route('/delete_restaurant', methods=["POST"])
def delete_restaurant():
    db = get_db()
    if request.json is not None:
        db.execute("DELETE FROM restaurants WHERE name=?", (request.json["name"],))
        db.commit()
        close_db()
        response = make_response({"message": "Restaurant deleted successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    

@app.route('/login', methods=["POST"])
def login():
    db = get_db()
    if request.json is not None:
        username = request.json["username"]
        password = request.json["password"]
        user = db.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password)).fetchone()
        if user is not None:
            user = dict(user)
            response = make_response({"message": "Login successful", "user": user})
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
        else:
            response = make_response({"message": "Invalid credentials"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    
@app.route('/login_manager', methods=["POST"])
def login_manager():
    db = get_db()
    if request.json is not None:
        full_name = request.json["full_name"]
        password = request.json["password"]
        manager = db.execute("SELECT * FROM managers WHERE full_name=? AND password=?", (full_name, password)).fetchone()
        if manager is not None:
            manager = dict(manager)
            response = make_response({"message": "Login successful", "manager": manager})
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
        else:
            response = make_response({"message": "Invalid credentials"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    

@app.route('/login_restaurant', methods=["POST"])
def login_restaurant():
    db = get_db()
    if request.json is not None:
        name = request.json["name"]
        password = request.json["password"]
        restaurant = db.execute("SELECT * FROM restaurants WHERE name=? AND password=?", (name, password)).fetchone()
        if restaurant is not None:
            restaurant = dict(restaurant)
            response = make_response({"message": "Login successful", "restaurant": restaurant})
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
        else:
            response = make_response({"message": "Invalid credentials"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
    else:
        response = make_response({"message": "Invalid request"})
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
    

@app.route('/update_restaurant', methods=["POST"])
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
        response = make_response({"message": "Restaurant updated successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    
@app.route('/menu')
def menu():
    db = get_db()
    menu = db.execute("SELECT * FROM menu").fetchall()
    close_db()
    menu = [dict(menu) for menu in menu]
    response = make_response({"menu": menu})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/add_menu', methods=["POST"])
def add_menu():
    db = get_db()
    if request.json is not None:
        menu = Menu(**request.json)
        db.execute(
            "INSERT INTO menu (name, price, description, restaurant) VALUES (?, ?, ?, ?)",
            (menu.name, menu.price, menu.description, menu.restaurant)
        )
        db.commit()
        close_db()
        response = make_response({"message": "Menu added successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    
@app.route('/delete_menu', methods=["POST"])
def delete_menu():
    db = get_db()
    if request.json is not None:
        db.execute("DELETE FROM menu WHERE name=?", (request.json["name"],))
        db.commit()
        close_db()
        response = make_response({"message": "Menu deleted successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    

@app.route('/menu_by_restaurant', methods=["POST"])
def menu_by_restaurant():
    db = get_db()
    if request.json is not None:
        restaurant = request.json["restaurant"]
        menu = db.execute("SELECT * FROM menu WHERE restaurant=?", (restaurant,)).fetchall()
        close_db()
        menu = [dict(menu) for menu in menu]
        response = make_response({"menu": menu})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response






if __name__ == "__main__":
    app.run(debug=True)