from flask import make_response, Blueprint, request
from db import get_db, close_db
from models import Restaurant, Manager

admin_functions = Blueprint("admin_functions", __name__)

class AdminActions:
    @staticmethod
    def delete_user(username):
        db = get_db()
        db.execute("DELETE FROM users WHERE username=?", (username,))
        db.commit()
        close_db()
        return {"message": "User deleted successfully"}

    @staticmethod
    def delete_restaurant(name):
        db = get_db()
        db.execute("DELETE FROM restaurants WHERE name=?", (name,))
        db.commit()
        close_db()
        return {"message": "Restaurant deleted successfully"}
    
    @staticmethod
    def add_restaurant(restaurant):
        db = get_db()
        db.execute(
            "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.discounts)
        )
        db.commit()
        close_db()
        return {"message": "Restaurant added successfully"}
    
    @staticmethod
    def add_manager(manager):
        db = get_db()
        db.execute(
            "INSERT INTO managers (username, full_name, password, email, restaurant, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
            (manager.username, manager.full_name, manager.password, manager.email, manager.restaurant, manager.phone_number)
        )
        db.commit()
        close_db()
        return {"message": "Manager added successfully"}
    
    @staticmethod
    def delete_manager(username):
        db = get_db()
        db.execute("DELETE FROM managers WHERE username=?", (username,))
        db.commit()
        close_db()
        return {"message": "Manager deleted successfully"}
    
    @staticmethod
    def manage_users():
        db = get_db()
        users = db.execute("SELECT * FROM users").fetchall()
        close_db()
        return {"users": [dict(user) for user in users]}
    
    @staticmethod
    def view_statistics():
        db = get_db()
        statistics = db.execute("SELECT * FROM statistics").fetchall()
        close_db()
        return {"statistics": [dict(statistic) for statistic in statistics]}


@admin_functions.route("/admin/delete_user", methods=["DELETE"])
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
    
@admin_functions.route("/admin/delete_restaurant", methods=["DELETE"])
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
    

@admin_functions.route("/admin/add_restaurant", methods=["POST"])
def add_restaurant():
    db = get_db()
    data = request.get_json()
    restaurant = Restaurant(**data['restaurant'])
    manager_id = data['managerId']  # Extract managerId from the request
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.discounts, manager_id)
    )
    db.commit()
    close_db()
    response = make_response({"message": "Restaurant added successfully"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
    
    

@admin_functions.route("/admin/add_manager", methods=["POST"])
def add_manager():
    db = get_db()
    manager = Manager(**request.get_json())
    print(f"Manager: {manager.__dict__}")  # Print the manager object
    cursor = db.cursor()

    # Check if the username already exists
    cursor.execute("SELECT * FROM managers WHERE username = ?", (manager.username,))
    existing_manager = cursor.fetchone()
    if existing_manager is not None:
        return make_response({"message": "Username already exists"}, 400)

    # If the username doesn't exist, insert the new manager
    cursor.execute(
        "INSERT INTO managers (username, full_name, password, email, restaurant, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
        (manager.username, manager.full_name, manager.password, manager.email, manager.restaurant, manager.phone_number)
    )
    db.commit()
    manager_id = cursor.lastrowid  # Get the ID of the new manager
    print(f"Manager ID: {manager_id}")  # Print the manager ID
    close_db()
    response = make_response({"message": "Manager added successfully", "managerId": manager_id})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@admin_functions.route("/admin/add_manager_and_restaurant", methods=["POST"])
def add_manager_and_restaurant():
    db = get_db()
    data = request.get_json()

    # Add manager
    manager = Manager(**data['manager'])
    cursor = db.cursor()
    cursor.execute("SELECT * FROM managers WHERE username = ?", (manager.username,))
    existing_manager = cursor.fetchone()
    if existing_manager is not None:
        return make_response({"message": "Username already exists"}, 400)
    cursor.execute(
        "INSERT INTO managers (username, full_name, password, email, restaurant, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
        (manager.username, manager.full_name, manager.password, manager.email, manager.restaurant, manager.phone_number)
    )
    db.commit()
    manager_id = cursor.lastrowid

    # Add restaurant
    restaurant = Restaurant(**data['restaurant'])
    cursor.execute(
        "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.discounts, manager_id)
    )
    db.commit()
    close_db()

    response = make_response({"message": "Manager and restaurant added successfully", "managerId": manager_id})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response



@admin_functions.route("/admin/delete_manager", methods=["DELETE"])
def delete_manager():
    db = get_db()
    if request.json is not None:
        db.execute("DELETE FROM managers WHERE username=?", (request.json["username"],))
        db.commit()
        close_db()
        response = make_response({"message": "Manager deleted successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    

@admin_functions.route('/admin/manage_users', methods=['GET'])
def manage_users():
    db = get_db()
    users = db.execute("SELECT * FROM users").fetchall()
    close_db()
    return {"users": [dict(user) for user in users]}

@admin_functions.route('/admin/view_statistics', methods=['GET'])
def view_statistics():
    db = get_db()
    statistics = db.execute("SELECT * FROM statistics").fetchall()
    close_db()
    return {"statistics": [dict(statistic) for statistic in statistics]}




