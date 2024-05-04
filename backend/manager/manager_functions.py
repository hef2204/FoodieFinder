from flask import make_response, Blueprint, request, jsonify
from db import get_db, close_db
from models import Restaurant, Manager, Menu
manager_functions = Blueprint("manager_functions", __name__)
from flask_jwt_extended import jwt_required





class ManagerActions:
    @staticmethod
    def delete_menu(name):
        db = get_db()
        db.execute("DELETE FROM menu WHERE name=?", (name,))
        db.commit()
        close_db()
        return {"message": "Menu deleted successfully"}

    @staticmethod
    def add_menu(menu):
        db = get_db()
        db.execute(
            "INSERT INTO menu (name, price, description, restaurant) VALUES (?, ?, ?, ?)",
            (menu.name, menu.price, menu.description, menu.restaurant)
        )
        db.commit()
        close_db()
        return {"message": "Menu added successfully"}
    
    @staticmethod
    def update_restaurant(restaurant):
        db = get_db()
        db.execute(
            "UPDATE restaurants SET location=?, phone_number=?, type=?, Kosher=?, order_table=?, Availability=?, rating=?, discounts=? WHERE name=?",
            (restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.rating, restaurant.discounts, restaurant.name)
        )
        db.commit()
        close_db()
        return {"message": "Restaurant updated successfully"}
    
@manager_functions.before_request
@jwt_required()
def before_request():
    pass

@manager_functions.route("/manager/delete_menu", methods=["DELETE"])
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



@manager_functions.route("/manager/add_menu", methods=["POST"])
def add_menu():
    db = get_db()
    if request.json is not None:
        menu = Menu(**request.json)
        db.execute(
            "INSERT INTO menu (name, price, description, restaurant) VALUES (?, ?, ?, ?)",
            (menu.name, menu.price, menu.description)
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
    

@manager_functions.route('/manager/update_restaurant', methods=["POST"])
def update_restaurant():
    db = get_db()
    if request.json is not None:
        restaurant = Restaurant(**request.json)
        db.execute(
            "UPDATE restaurants SET location=?, phone_number=?, type=?, Kosher=?, order_table=?, Availability=?, discounts=? WHERE name=?",
            (restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.discounts, restaurant.name)
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
    
@manager_functions.route("/manager/add_restaurant", methods=["POST"])
def add_another_restaurant_by_manager():
    db = get_db()
    if request.json is not None:
        restaurant = Restaurant(**request.json)
        manager_id = restaurant.manager_id 
        db.execute(
            "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.discounts, manager_id)  # Use the manager_id variable
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
    
    
    
