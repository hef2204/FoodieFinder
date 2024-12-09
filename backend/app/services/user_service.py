from app.models.user import User
from app.models.reservation import Reservation
from app.extensions.database import db

def get_user_by_id(user_id):
    return User.query.get(user_id)

def create_reservation(user_id, data):
    reservation = Reservation(
        user_id=user_id,
        restaurant_id=data['restaurant_id'],
        date=data['date'],
        num_guests=data['num_guests']
    )
    db.session.add(reservation)
    db.session.commit()
    return reservation

def cancel_reservation(user_id, reservation_id):
    reservation = Reservation.query.filter_by(id=reservation_id, user_id=user_id).first()
    if not reservation:
        return False

    db.session.delete(reservation)
    db.session.commit()
    return True

def get_reservations_for_user(user_id):
    return Reservation.query.filter_by(user_id=user_id).all()
