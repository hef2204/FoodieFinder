from flask import Blueprint, jsonify, request
from app.models.restaurant import Restaurant
from app.extensions.database import db
from flask_jwt_extended import jwt_required


restaurant_routes = Blueprint('restaurant', __name__, url_prefix='/restaurants')

@restaurant_routes.route('/', methods=['GET'])
def get_restaurants():
    restaurants = Restaurant.query.all()
    return jsonify([restaurant.serialize() for restaurant in restaurants]), 200

@restaurant_routes.route('/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404
    return jsonify(restaurant.serialize()), 200

@restaurant_routes.route('/<int:restaurant_id>', methods=['PUT'])
@jwt_required()
def update_restaurant(restaurant_id):
    data = request.get_json()
    restaurant = Restaurant.query.get(restaurant_id)

    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404

    restaurant.name = data.get('name', restaurant.name)
    restaurant.location = data.get('location', restaurant.location)
    restaurant.type = data.get('type', restaurant.type)
    restaurant.phone_number = data.get('phone_number', restaurant.phone_number)
    restaurant.kosher = data.get('kosher', restaurant.kosher)
    restaurant.order_table = data.get('order_table', restaurant.order_table)
    restaurant.opening_time = data.get('opening_time', restaurant.opening_time)
    restaurant.closing_time = data.get('closing_time', restaurant.closing_time)
    restaurant.discounts = data.get('discounts', restaurant.discounts)

    db.session.commit()
    return jsonify({"message": "Restaurant updated successfully", "restaurant": restaurant.serialize()}), 200

@restaurant_routes.route('/<int:restaurant_id>', methods=['DELETE'])
@jwt_required()
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404

    db.session.delete(restaurant)
    db.session.commit()
    return jsonify({"message": "Restaurant deleted successfully"}), 200
