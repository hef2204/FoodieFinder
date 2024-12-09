from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.restaurant import Restaurant
from app.models.reservation import Reservation
from app.models.menu import Menu
from app.extensions.database import db

manager_routes = Blueprint('manager', __name__, url_prefix='/manager')

@manager_routes.route('/manager/add_restaurant', methods=['POST'])
@jwt_required()
def add_restaurant():
    current_user = get_jwt_identity()  # Get user from JWT
    data = request.get_json()

    # Debugging: Log received data
    print("Received data:", data)

    if not data:
        return jsonify({"message": "No data received"}), 400

    try:
        restaurant = {
            "name": data.get("name", "Default Name"),
            "location": data["location"],
            "type": data["type"],
            "phone_number": data["phone_number"],
            "kosher": data["kosher"],
            "order_table": data["order_table"],
            "opening_time": data["opening_time"],
            "closing_time": data["closing_time"],
            "discounts": data["discounts"],
            "manager_ids": f"{current_user['id']}",
        }

        # Log the restaurant object for debugging
        print("Restaurant object:", restaurant)

        # Simulate database save (replace with actual DB logic)
        return jsonify({"message": "Restaurant added successfully", "restaurant": restaurant}), 201
    except KeyError as e:
        return jsonify({"message": f"Missing required field: {str(e)}"}), 400

@manager_routes.route('/profilePage', methods=['GET'])
@jwt_required()
def profile_page():
    current_user = get_jwt_identity()
    if current_user['role'] != 'manager':
        return jsonify({"message": "Unauthorized"}), 401

    manager_restaurants = Restaurant.query.filter(Restaurant.manager_ids.contains(str(current_user['id']))).all()
    return jsonify({
        "manager_id": current_user['id'],
        "restaurants": [restaurant.serialize() for restaurant in manager_restaurants]
    }), 200

@manager_routes.route('/reservations', methods=['GET'])
@jwt_required()
def manager_reservations():
    current_user = get_jwt_identity()
    if current_user['role'] != 'manager':
        return jsonify({"message": "Unauthorized"}), 401

    manager_restaurants = Restaurant.query.filter(Restaurant.manager_ids.contains(str(current_user['id']))).all()
    restaurant_ids = [restaurant.id for restaurant in manager_restaurants]
    reservations = Reservation.query.filter(Reservation.restaurant_id.in_(restaurant_ids)).all()

    return jsonify([reservation.serialize() for reservation in reservations]), 200

# @manager_routes.route('/menu/<int:restaurant_id>', methods=['POST'])
# @jwt_required()
# def add_menu_item(restaurant_id):
#     current_user = get_jwt_identity()
#     if current_user['role'] != 'manager':
#         return jsonify({"message": "Unauthorized"}), 401

#     # Ensure JSON request
#     if not request.is_json:
#         return jsonify({"message": "Invalid request format. JSON expected."}), 400

#     data = request.get_json()

#     # Debugging
#     print("Received data:", data)
#     print("restaurant_id:", restaurant_id)

#     # Validate input
#     required_fields = ['name', 'price', 'description']
#     missing_fields = [field for field in required_fields if field not in data]
#     if missing_fields:
#         return jsonify({"message": "Missing fields", "fields": missing_fields}), 400

#     try:
#         # Create menu item
#         menu_item = Menu(
#             restaurant_id=restaurant_id,
#             item_name=data['name'],
#             price=data['price'],
#             description=data['description']
#         )
#         db.session.add(menu_item)
#         db.session.commit()

#         return jsonify({"message": "Menu item added successfully", "menu_item": menu_item.serialize()}), 201
#     except Exception as e:
#         return jsonify({"message": "Error adding menu item", "error": str(e)}), 500


