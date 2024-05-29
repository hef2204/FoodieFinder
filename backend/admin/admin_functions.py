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
    return jsonify(admin_data)






@admin_functions.route("/admin/delete_restaurant", methods=["DELETE"])
def delete_restaurant():
    db = get_db()
    if request.json is not None:
        db.execute("DELETE FROM restaurants WHERE name=?", (request.json["name"],))
        db.commit()
        close_db()
        return jsonify({"message": "Restaurant deleted successfully"})
    else:
        return jsonify({"message": "Invalid request"})
    


    
    
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
        return jsonify({"message": "Admin added successfully"})
   


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
        return jsonify({"message": "Missing 'manager' or 'restaurant' in request data"}), 400

    try:
        manager = data['manager']
        restaurant = data['restaurant']
        
        cursor = db.cursor()
        
        # Check if manager username already exists
        cursor.execute("SELECT * FROM users WHERE username = ?", (manager['username'],))
        existing_manager_username = cursor.fetchone()
        if existing_manager_username is not None:
            return jsonify({"message": "Username already exists"}), 400

        # Check if manager email already exists
        cursor.execute("SELECT * FROM users WHERE email = ?", (manager['email'],))
        existing_manager_email = cursor.fetchone()
        if existing_manager_email is not None:
            return jsonify({"message": "Email already exists"}), 400
        
        # Add manager
        cursor.execute(
            "INSERT INTO users (username, full_name, password, email, phone_number, role) VALUES (?, ?, ?, ?, ?, 'manager')",
            (manager['username'], manager['full_name'], manager['password'], manager['email'], manager['phone_number'])
        )
        db.commit()
        manager_id = cursor.lastrowid

        # Add restaurant
        cursor.execute(
            "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (restaurant['name'], restaurant['location'], restaurant['phone_number'], restaurant['type'], restaurant['Kosher'], restaurant['order_table'], restaurant['Availability'], restaurant['discounts'], manager_id)
        )
        db.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 500

    return jsonify({"message": "Manager and restaurant added successfully", "managerId": manager_id})


    

@admin_functions.route('/admin/manage_users', methods=['GET', 'DELETE'])
@jwt_required()
def manage_users():
    current_user = get_jwt_identity()
    user_role = current_user['role']
    if user_role != "admin":
        return jsonify({"message": "Unauthorized"}), 401

    db = get_db()

    if request.method == 'GET':
        users = db.execute("SELECT * FROM users WHERE role = 'user'").fetchall()
        close_db()
        return jsonify({"users": [dict(user) for user in users]}), 200
    
    elif request.method == 'DELETE':
        if request.json is None:
            return jsonify({"message": "No JSON data provided"}), 400
        username = request.json.get('username')
        if not username:
            return jsonify({"message": "Username not provided"}), 400
        user = db.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()
        if not user:
            return jsonify({"message": "User not found"}), 404
        db.execute("DELETE FROM users WHERE username=?", (username,))
        db.commit()
        close_db()
        return jsonify({"message": "User deleted successfully"}), 200
    
    return jsonify({"message": "Method not allowed"}), 405


@admin_functions.route('/admin/manage_managers', methods=['GET', 'DELETE'])
@jwt_required()
def manage_managers():
    current_user = get_jwt_identity()
    user_role = current_user['role']
    if user_role != "admin":
        return jsonify({"message": "Unauthorized"}), 401

    db = get_db()

    if request.method == 'GET':
        managers = db.execute("SELECT * FROM users WHERE role='manager'").fetchall()
        close_db()
        return jsonify({"managers": [dict(manager) for manager in managers]}), 200
    
    elif request.method == 'DELETE':
        if request.json is None:
            return jsonify({"message": "No JSON data provided"}), 400
        username = request.json.get('username')
        if not username:
            return jsonify({"message": "Username not provided"}), 400
        manager = db.execute("SELECT * FROM users WHERE username=? AND role='manager'", (username,)).fetchone()
        if not manager:
            return jsonify({"message": "Manager not found"}), 404

        # Delete manager's restaurants
        manager_id = manager['id']
        db.execute("DELETE FROM restaurants WHERE manager_id = ?", (manager_id,))
        
        # Delete manager
        db.execute("DELETE FROM users WHERE username=? AND role='manager'", (username,))
        db.commit()
        close_db()
        return jsonify({"message": "Manager and associated restaurants deleted successfully"}), 200
    
    return jsonify({"message": "Method not allowed"}), 405






