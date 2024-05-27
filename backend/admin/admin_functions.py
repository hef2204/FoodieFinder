from flask import make_response, Blueprint, request, jsonify
from db import get_db, close_db
from models import Restaurant, Manager
from flask_jwt_extended import jwt_required, get_jwt_identity




admin_functions = Blueprint("admin_functions", __name__)




@admin_functions.route("/admin/adminPage", methods=["GET"])
@jwt_required()
def admin_page():
    current_user = get_jwt_identity()
    user_role = current_user.get('role')
    if user_role != "admin":
        return jsonify({"message": "Unauthorized"}), 401
    
    # Sample admin data
    admin_data = {
        "message": "Welcome to the admin page!"
    }
    response = jsonify(admin_data)
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
    


    
    
############################################## Done
@admin_functions.route("/admin/add_admin", methods=["POST"])
@jwt_required()
def add_admin():
    current_user = get_jwt_identity()
    user_role = current_user['role']
    if user_role != "admin":
        return jsonify({"message": "Unauthorized"}), 401
    db = get_db()
    if request.json is not None:
        admin_data = request.json
        new_admin_data = {
            'username': admin_data['username'],
            'full_name': admin_data['full_name'],
            'password': admin_data['password'],
            'email': admin_data['email'],
        }

        # Check if an admin with the same username already exists
        existing_admin = db.execute("SELECT * FROM admin WHERE username = ?", (new_admin_data['username'],)).fetchone()

        if existing_admin:
            # If an admin with the same username already exists, return an error message
            return jsonify({"message": "Admin already exists"}), 400

        db.execute(
            "INSERT INTO admin (username, full_name, password, email) VALUES (?, ?, ?, ?)",
            (new_admin_data['username'], new_admin_data['full_name'], new_admin_data['password'], new_admin_data['email'])
        )
        db.commit()
        close_db()
        response = make_response({"message": "Admin added successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
   


@admin_functions.route("/admin/add_manager_and_restaurant", methods=["POST"])
@jwt_required()
def add_manager_and_restaurant():
    current_user = get_jwt_identity()
    user_role = current_user['role']
    if user_role != "admin":
        return jsonify({"message": "Unauthorized"}), 401
    db = get_db()
    data = request.get_json()

    # Validate data
    if 'manager' not in data or 'restaurant' not in data:
        return make_response({"message": "Missing 'manager' or 'restaurant' in request data"}, 400)

    try:
            manager = Manager(**data['manager'])
            print(manager)
            print(data['manager'])
        
            cursor = db.cursor()
            cursor.execute("SELECT * FROM managers WHERE username = ?", (manager.username,))
            existing_manager = cursor.fetchone()
            if existing_manager is not None:
                return make_response({"message": "Username already exists"}, 400)
            cursor.execute(
                "INSERT INTO managers (username, full_name, password, email, phone_number) VALUES (?, ?, ?, ?, ?)",
                (manager.username, manager.full_name, manager.password, manager.email, manager.phone_number)
            )
            db.commit()
            print("2")
            manager_id = cursor.lastrowid

            # Add restaurant
            restaurant = Restaurant(**data['restaurant'])
            print(data['restaurant'])
            cursor.execute(
                "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.discounts, manager_id)
            )
            db.commit()
    except Exception as e:
            return make_response({"message": str(e)}, 500)
    print("Manager and restaurant added successfully")

    response = make_response({"message": "Manager and restaurant added successfully", "managerId": manager_id})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


    

@admin_functions.route('/admin/manage_users', methods=['GET', 'DELETE'])
@jwt_required()
def manage_users():
    if request.method == 'GET':
        current_user = get_jwt_identity()
        user_role = current_user['role']
        if user_role != "admin":
            return jsonify({"message": "Unauthorized"}), 401
        db = get_db()
        users = db.execute("SELECT * FROM users").fetchall()
        close_db()
        response = make_response({"users": [dict(user) for user in users]})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    elif request.method == 'DELETE':
        current_user = get_jwt_identity()
        user_role = current_user['role']
        if user_role != "admin":
            return jsonify({"message": "Unauthorized"}), 401
        if request.json is None:
            return jsonify({"message": "No JSON data provided"}), 400
        username = request.json.get('username')
        if not username:
            return jsonify({"message": "Username not provided"}), 400
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()
        if not user:
            return jsonify({"message": "User not found"}), 404
        db.execute("DELETE FROM users WHERE username=?", (username,))
        db.commit()
        close_db()
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"message": "Method not allowed"}), 405


@admin_functions.route('/admin/manage_managers', methods=['GET', 'DELETE'])
@jwt_required()
def manage_managers():
    if request.method == 'GET':
        current_user = get_jwt_identity()
        user_role = current_user['role']
        if user_role != "admin":
            return jsonify({"message": "Unauthorized"}), 401
        db = get_db()
        managers = db.execute("SELECT * FROM managers").fetchall()
        close_db()
        response = make_response({"managers": [dict(manager) for manager in managers]})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    elif request.method == 'DELETE':
        current_user = get_jwt_identity()
        user_role = current_user['role']
        if user_role != "admin":
            return jsonify({"message": "Unauthorized"}), 401
        if request.json is None:
            return jsonify({"message": "No JSON data provided"}), 400
        username = request.json.get('username')
        if not username:
            return jsonify({"message": "Username not provided"}), 400
        db = get_db()
        manager = db.execute("SELECT * FROM managers WHERE username=?", (username,)).fetchone()
        if not manager:
            return jsonify({"message": "Manager not found"}), 404

        # Delete manager's restaurants
        manager_id = manager['id']
        db.execute("DELETE FROM restaurants WHERE manager_id = ?", (manager_id,))
        
        # Delete manager
        db.execute("DELETE FROM managers WHERE username=?", (username,))
        db.commit()
        close_db()
        return jsonify({"message": "Manager and associated restaurants deleted successfully"}), 200
    else:
        return jsonify({"message": "Method not allowed"}), 405






