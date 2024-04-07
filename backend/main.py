from models import User, Manager, Restaurant
from flask import Flask, request, make_response, Response
from dotenv import load_dotenv
from db import get_db, close_db, init_db


load_dotenv()
app = Flask(__name__)


@app.route('/')
def root():
    response = make_response("Hello from the backend!")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/users')
def users():
    db = get_db()
    users = db.execute("SELECT * FROM users").fetchall()
    close_db()
    response = make_response({"users": users})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/managers')
def managers():
    db = get_db()
    managers = db.execute("SELECT * FROM managers").fetchall()
    close_db()
    response = make_response({"managers": managers})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/restaurants')
def restaurants():
    db = get_db()
    restaurants = db.execute("SELECT * FROM restaurants").fetchall()
    close_db()
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
                                request.json["rating"],
                                request.json["reviews"],
                                request.json["discounts"])
        db.execute(
            "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, rating, reviews, discounts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.rating, restaurant.reviews, restaurant.discounts)
        )
        db.commit()
        close_db()
        response = make_response({"message": "Restaurant added successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
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
