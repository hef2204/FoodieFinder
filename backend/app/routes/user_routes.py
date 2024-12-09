from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.reservation import Reservation
from app.extensions.database import db

user_routes = Blueprint('user', __name__, url_prefix='/user')

@user_routes.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.serialize()), 200

@user_routes.route('/reservations', methods=['POST'])
@jwt_required()
def create_reservation():
    current_user = get_jwt_identity()
    data = request.get_json()

    reservation = Reservation(
        user_id=current_user['id'],
        restaurant_id=data['restaurant_id'],
        date=data['date'],
        num_guests=data['num_guests']
    )
    db.session.add(reservation)
    db.session.commit()

    return jsonify({"message": "Reservation created successfully", "reservation": reservation.serialize()}), 201

@user_routes.route('/reservations/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def cancel_reservation(reservation_id):
    current_user = get_jwt_identity()
    reservation = Reservation.query.filter_by(id=reservation_id, user_id=current_user['id']).first()

    if not reservation:
        return jsonify({"message": "Reservation not found"}), 404

    db.session.delete(reservation)
    db.session.commit()
    return jsonify({"message": "Reservation canceled successfully"}), 200

@user_routes.route('/my_reservations', methods=['GET'])
@jwt_required()
def get_my_reservations():
    current_user = get_jwt_identity()
    reservations = Reservation.query.filter_by(user_id=current_user['id']).all()
    return jsonify([reservation.serialize() for reservation in reservations]), 200
