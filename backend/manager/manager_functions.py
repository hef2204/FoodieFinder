from flask import make_response, Blueprint, request, jsonify
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
        current_manager_restaurant = db.execute("SELECT * FROM restaurants WHERE manager_id = ?", 
                                                (current_user['id'],)).fetchone()
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
            
            # Associate the new manager with the same restaurant
            db.execute(
                "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (current_manager_restaurant['name'], current_manager_restaurant['location'], current_manager_restaurant['phone_number'], 
                 current_manager_restaurant['type'], current_manager_restaurant['Kosher'], current_manager_restaurant['order_table'], 
                 current_manager_restaurant['Availability'], current_manager_restaurant['discounts'], new_manager_id)
            )
            db.commit()
            close_db()
            return jsonify({"message": "Manager added successfully", "manager_id": new_manager_id}), 201
        except Exception as e:
            return jsonify({"message": str(e)}), 500
    else:
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
@manager_functions.route("/manager/add_restaurant", methods=["POST"])
def add_another_restaurant_by_manager():
    db = get_db()
    if request.json is not None:
        restaurant = addRestaurant(**request.json)
        print(restaurant.__dict__)
        manager_id = restaurant.manager_id 
        db.execute(
            "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.discounts, manager_id)  # Use the manager_id variable
        )
        db.commit()
        close_db()
        return jsonify({"message": "Restaurant added successfully"})
    else:
        return jsonify({"message": "Invalid request"})
    
############################################# Done
@manager_functions.route('/manager/restaurant_page/<int:restaurant_id>/update_restaurant', methods=["PUT"])
def update_restaurant(restaurant_id):
    db = get_db()
    if request.json is not None:
        
        restaurant = RestaurantUpdate(**request.json)
        
        db.execute(
            "UPDATE restaurants SET name=?, location=?, phone_number=?, type=?, Kosher=?, order_table=?, Availability=? WHERE id=?",
            (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant_id)
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

    restaurants = db.execute("SELECT * FROM restaurants WHERE manager_id=?", (current_user['id'],)).fetchall()
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
    manager_id = current_user['id']

    # Fetch restaurant ID associated with the manager
    restaurant = db.execute("SELECT id FROM restaurants WHERE manager_id = ?", (manager_id,)).fetchone()
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

