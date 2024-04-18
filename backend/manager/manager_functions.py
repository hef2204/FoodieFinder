from flask import make_response, Blueprint, request, jsonify
from db import get_db, close_db
from models import Restaurant, Manager, Menu
from flask_login import login_required, current_user, login_user, logout_user, LoginManager
manager_functions = Blueprint("manager_functions", __name__)





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
    
<<<<<<< HEAD

@manager_functions.route('/update_restaurant', methods=["POST"])
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
=======
@manager_functions.route("/manager/manager-info", methods=["GET", "POST"])
@login_required
def manager_info():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Not logged in'}), 401

    if current_user.role != 'manager':
        return jsonify({'error': 'Not authorized'}), 403

    manager_name = current_user.username
    restaurant_name = current_user.restaurant.name
    return jsonify({'managername': manager_name, 'restaurantname': restaurant_name})
>>>>>>> 59c59e30af16320c7c26c82cb28c0bf0b993d612
