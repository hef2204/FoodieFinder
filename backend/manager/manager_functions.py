from flask import make_response, Blueprint, request, jsonify, current_app
from db import get_db, close_db
from models import Restaurant, Manager, Menu, RestaurantUpdate, addRestaurant
manager_functions = Blueprint("manager_functions", __name__)
from flask_jwt_extended import jwt_required, get_jwt_identity



@manager_functions.route("/manager/add_manager", methods=["POST"])
@jwt_required()
def add_manager():
    current_user = get_jwt_identity()
    user_role = current_user['role']
    
    if user_role != "manager":
        return jsonify({"message": "Unauthorized"}), 401

    db = get_db()
    if request.json is not None:
        manager_data = request.json
        
        # Validate required fields
        if not all(key in manager_data for key in ('username', 'full_name', 'password', 'email', 'phone_number')):
            return jsonify({"message": "Missing required fields"}), 400
        
        # Verify the current manager is associated with a restaurant
        current_manager_restaurant = db.execute("SELECT * FROM restaurants WHERE manager_ids LIKE ?", 
                                                ('%' + str(current_user['id']) + '%',)).fetchone()
        if not current_manager_restaurant:
            return jsonify({"message": "Adding manager is not associated with any restaurant"}), 401

        # Check if username already exists
        existing_user = db.execute("SELECT * FROM users WHERE username = ?", (manager_data['username'],)).fetchone()
        if existing_user:
            return jsonify({"message": "Username already taken"}), 409
        
        # Check if email already exists
        existing_email = db.execute("SELECT * FROM users WHERE email = ?", (manager_data['email'],)).fetchone()
        if existing_email:
            return jsonify({"message": "Email already taken"}), 410

        new_manager_data = {
            'username': manager_data['username'],
            'full_name': manager_data['full_name'],
            'password': manager_data['password'],
            'email': manager_data['email'],
            'phone_number': manager_data['phone_number'],
            'role': 'manager',
        }

        try:
            # Add new manager to users table
            db.execute(
                "INSERT INTO users (username, full_name, password, email, phone_number, role) VALUES (?, ?, ?, ?, ?, ?)",
                (new_manager_data['username'], new_manager_data['full_name'], new_manager_data['password'], 
                 new_manager_data['email'], new_manager_data['phone_number'], new_manager_data['role'])
            )
            new_manager_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]

            # Update the manager_ids in the restaurants table
            manager_ids = current_manager_restaurant['manager_ids']
            if manager_ids:
                updated_manager_ids = f"{manager_ids},{new_manager_id}"
            else:
                updated_manager_ids = str(new_manager_id)
            
            db.execute(
                "UPDATE restaurants SET manager_ids = ? WHERE id = ?",
                (updated_manager_ids, current_manager_restaurant['id'])
            )
            db.commit()
            close_db()
            return jsonify({"message": "Manager added successfully", "manager_id": new_manager_id}), 201
        except Exception as e:
            return jsonify({"message": str(e)}), 500
    else:
        return jsonify({"message": "Invalid request"}), 400


@manager_functions.route("/manager/add_restaurant", methods=["POST"])
@jwt_required()
def add_another_restaurant_by_manager():
    current_user = get_jwt_identity()
    user_role = current_user.get('role')
    user_id = current_user.get('id')
    
    if user_role != "manager":
        return jsonify({"message": "Unauthorized"}), 401

    db = get_db()
    if request.json is not None:
        required_fields = ['name', 'location', 'phone_number', 'type', 'Kosher', 'order_table', 'opening_time', 'closing_time', 'discounts']
        
        current_app.logger.debug(f"Request JSON: {request.json}")

        missing_fields = [field for field in required_fields if not request.json.get(field)]
        if missing_fields:
            current_app.logger.debug(f"Missing required fields: {missing_fields}")
            return jsonify({"message": "Missing required fields", "missing_fields": missing_fields}), 400
        
        restaurant_data = {key: request.json[key] for key in required_fields}
        
        # Ensure manager_ids is a string and format it correctly
        manager_ids = request.json.get('manager_ids', '')
        if isinstance(manager_ids, list):
            manager_ids = ','.join(map(str, manager_ids))
        if manager_ids:
            manager_ids += f",{user_id}"
        else:
            manager_ids = str(user_id)
        restaurant_data['manager_ids'] = manager_ids
        
        try:
            restaurant = addRestaurant(**restaurant_data)
            current_app.logger.debug(f"Restaurant Data: {restaurant.__dict__}")
            
            db.execute(
                "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, opening_time, closing_time, discounts, manager_ids) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.opening_time, restaurant.closing_time, restaurant.discounts, restaurant.manager_ids)
            )
            db.commit()
            close_db()
            
            return jsonify({"message": "Restaurant added successfully"})
        except TypeError as e:
            current_app.logger.error(f"TypeError: {str(e)}")
            return jsonify({"message": f"Invalid data: {str(e)}"}), 400
    else:
        current_app.logger.debug("Invalid request: No JSON data received")
        return jsonify({"message": "Invalid request"}), 400










@manager_functions.route("/manager/delete_menu", methods=["DELETE"])
def delete_menu():
    db = get_db()
    if request.json is not None:
        db.execute("DELETE FROM menu WHERE name=?", (request.json["name"],))
        db.commit()
        close_db()
        return jsonify({"message": "Menu deleted successfully"})
    else:
        return jsonify({"message": "Invalid request"})

    


####done 

    
############################################# Done
@manager_functions.route('/manager/restaurant_page/<int:restaurant_id>/update_restaurant', methods=["PUT"])
def update_restaurant(restaurant_id):
    db = get_db()
    if request.json is not None:
        restaurant = RestaurantUpdate(**request.json)
        
        db.execute(
            "UPDATE restaurants SET name=?, location=?, phone_number=?, type=?, Kosher=?, order_table=?, opening_time=?, closing_time=? WHERE id=?",
            (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.opening_time, restaurant.closing_time, restaurant_id)
        )
        db.commit()
        
        db.execute(
            "UPDATE reservations SET restaurant_name=? WHERE restaurant_id=?",
            (restaurant.name, restaurant_id)
        )
        db.commit()
        
        close_db()
        return jsonify({"message": "Restaurant updated successfully"})
    else:
        return jsonify({"message": "Invalid request"})




#### done
@manager_functions.route('/restaurant_page/menu/<int:restaurant_id>', methods=["POST"])
def add_menu(restaurant_id):
    db = get_db()
    if request.json is not None:
        menu = Menu(**request.json)
        db.execute(
            "INSERT INTO menu_items (name, price, description, restaurant_id) VALUES (?, ?, ?, ?)",
            (menu.name, menu.price, menu.description, restaurant_id)
        )
        db.commit()
        close_db()
        return jsonify({"message": "Menu added successfully"})
    else:
        close_db()
        return jsonify({"message": "Invalid request"})


    

@manager_functions.route('/manager/profilePage', methods=["GET"])
@jwt_required()
def profile_page():
   
    current_user = get_jwt_identity()
    user_role = current_user['role']
    if user_role != "manager":
        return jsonify({"message": "Unauthorized"}), 401
    db = get_db()
    manager = db.execute("SELECT * FROM users WHERE id=?", (current_user['id'],)).fetchone()
    if not manager:
        return jsonify({"message": "Manager not found"}), 404

    restaurants = db.execute("SELECT * FROM restaurants WHERE manager_ids LIKE ?", ('%' + str(current_user['id']) + '%',)).fetchall()
    close_db()
    response_data = {
        "manager": dict(manager),
        "restaurants": [dict(restaurant) for restaurant in restaurants],
        "manager_username": manager['username'], 
        "restaurant_name": [restaurant['name'] for restaurant in restaurants],
        "restaurant_id": [restaurant['id'] for restaurant in restaurants]
    }

    return jsonify(response_data)


@manager_functions.route('/manager/manager_reservations', methods=["GET"])
@jwt_required()
def manager_reservations():
    current_user = get_jwt_identity()
    user_role = current_user['role']
    if user_role != "manager":
        return jsonify({"message": "Unauthorized"}), 401

    db = get_db()
    manager_ids = current_user['id']

    # Fetch restaurant ID associated with the manager
    restaurant = db.execute("SELECT id FROM restaurants WHERE manager_ids = ?", (manager_ids,)).fetchone()
    if restaurant is None:
        return jsonify({"message": "Manager is not associated with any restaurant"}), 404

    restaurant_id = restaurant['id']

    # Fetch reservations for the manager's restaurant
    reservations = db.execute(
        """
        SELECT r.id, r.date, r.time, r.number_of_people, u.full_name, u.phone_number 
        FROM reservations r
        JOIN users u ON r.user_id = u.id
        WHERE r.restaurant_id = ?
        """, 
        (restaurant_id,)
    ).fetchall()

    reservations_list = []
    for reservation in reservations:
        reservations_list.append({
            'id': reservation['id'],
            'date': reservation['date'],
            'time': reservation['time'],
            'numberOfPeople': reservation['number_of_people'],
            'full_name': reservation['full_name'],
            'phone_number': reservation['phone_number']
        })

    return jsonify({"reservations": reservations_list}), 200


############################################################################################################    
# @manager_functions.route('/manager/update_manager', methods=["POST"])
# def update_manager():
#     db = get_db()
#     if request.json is not None:
#         manager = Manager(**request.json)
#         db.execute(
#             "UPDATE managers SET email=?, restaurant=?, phone_number=? WHERE full_name=?",
#             (manager.email, manager.restaurant, manager.phone_number, manager.full_name)
#         )
#         db.commit()
#         close_db()
#         response = make_response({"message": "Manager updated successfully"})
#         response.headers.add("Access-Control-Allow-Origin", "*")
#         return response
#     else:
#         response = make_response({"message": "Invalid request"})
#         response.headers.add("Access-Control-Allow-Origin", "*")
#         return response
    

# @manager_functions.route('/restaurant_page/menu', methods=["PUT"])
# def update_menu(restaurant_id):
#     db = get_db()
#     if request.json is not None:
#         menu = Menu(**request.json)
#         db.execute(
#             "UPDATE menu_items SET name=?, price=?, description=? WHERE restaurant_id=?",
#             (menu.name, menu.price, menu.description, restaurant_id)
#         )
#         db.commit()
#         response = make_response({"message": "Menu updated successfully"})
#         response.headers.add("Access-Control-Allow-Origin", "*")
#         close_db()
#         return response
#     else:
#         response = make_response({"message": "Invalid request"})
#         response.headers.add("Access-Control-Allow-Origin", "*")
#         close_db()
#         return response

