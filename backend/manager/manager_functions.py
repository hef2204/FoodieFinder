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
        adding_manager_restaurant_id = manager_data['restaurantId']  # get restaurantId from the adding manager
        new_manager_data = {
            'username': manager_data['username'],
            'full_name': manager_data['full_name'],
            'password': manager_data['password'],
            'email': manager_data['email'],
            'phone_number': manager_data['phone_number'],
            'restaurantId': adding_manager_restaurant_id  
        }
        db.execute(
            "INSERT INTO managers (username, full_name, password, email, phone_number, restaurant_id) VALUES (?, ?, ?, ?, ?, ?)",
            (new_manager_data['username'], new_manager_data['full_name'], new_manager_data['password'], new_manager_data['email'], new_manager_data['phone_number'], new_manager_data['restaurantId'])
        )
        db.commit()
        close_db()
        response = make_response({"message": "Manager added successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response




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
        response = make_response({"message": "Restaurant added successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    
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
        close_db()
        response = make_response({"message": "Restaurant updated successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response 




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
        response = make_response({"message": "Menu added successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        close_db()
        return response
    else:
        response = make_response({"message": "Invalid request"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        close_db()
        return response


    

@manager_functions.route('/manager/profilePage', methods=["GET"])
@jwt_required()
def profile_page():
   
    current_user = get_jwt_identity()
    user_role = current_user['role']
    if user_role != "manager":
        return jsonify({"message": "Unauthorized"}), 401
    db = get_db()
    manager = db.execute("SELECT * FROM managers WHERE id=?", (current_user['id'],)).fetchone()
    if not manager:
        return jsonify({"message": "Manager not found"}), 404

    restaurants = db.execute("SELECT * FROM restaurants WHERE manager_id=?", (current_user['id'],)).fetchall()
    close_db()
    response = make_response({
        "manager": dict(manager),
        "restaurants": [dict(restaurant) for restaurant in restaurants],
        "manager_username": manager['username'], 
        "restaurant_name": [restaurant['name'] for restaurant in restaurants],
        "restaurant_id": [restaurant['id'] for restaurant in restaurants] 
    })
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response



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

