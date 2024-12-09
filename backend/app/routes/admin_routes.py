from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.restaurant import Restaurant
from app.models.manager import Manager
from app.models.admin import Admin
from app.extensions.database import db

admin_routes = Blueprint('admin', __name__, url_prefix='/admin')

@admin_routes.route('/adminPage', methods=['GET'])
@jwt_required()
def admin_page():
    current_user = get_jwt_identity()
    user_role = current_user.get('role')
    if user_role != "admin":
        return jsonify({"message": "Unauthorized"}), 401

    return jsonify({"message": "Welcome to the admin page!"}), 200

@admin_routes.route('/add_admin', methods=['POST'])
@jwt_required()
def add_admin():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()
    admin = Admin(username=data['username'], email=data['email'], role='admin')
    admin.set_password(data['password'])
    db.session.add(admin)
    db.session.commit()

    return jsonify({"message": "Admin added successfully"}), 201

@admin_routes.route('/add_manager_and_restaurant', methods=['POST'])
@jwt_required()
def add_manager_and_restaurant():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()
    manager_data = data['manager']
    restaurant_data = data['restaurant']

    # Add manager
    manager = Manager(username=manager_data['username'], email=manager_data['email'], role='manager')
    manager.set_password(manager_data['password'])
    db.session.add(manager)
    db.session.commit()

    # Add restaurant
    restaurant = Restaurant(
        name=restaurant_data['name'],
        location=restaurant_data['location'],
        type=restaurant_data['type'],
        phone_number=restaurant_data['phone_number'],
        kosher=restaurant_data['kosher'],
        order_table=restaurant_data['order_table'],
        opening_time=restaurant_data['opening_time'],
        closing_time=restaurant_data['closing_time'],
        discounts=restaurant_data['discounts'],
        manager_ids=str(manager.id)
    )
    db.session.add(restaurant)
    db.session.commit()

    return jsonify({"message": "Manager and restaurant added successfully"}), 201

@admin_routes.route('/manage_users', methods=['GET', 'DELETE'])
@jwt_required()
def manage_users():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Unauthorized"}), 401

    if request.method == 'GET':
        users = User.query.filter_by(role='user').all()
        return jsonify([user.serialize() for user in users]), 200

    if request.method == 'DELETE':
        username = request.json.get('username')
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
