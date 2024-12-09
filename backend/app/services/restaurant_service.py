from app.models.restaurant import Restaurant
from app.extensions.database import db

def create_restaurant(data):
    restaurant = Restaurant(
        name=data['name'],
        location=data['location'],
        type=data['type'],
        phone_number=data['phone_number'],
        kosher=data.get('kosher', False),
        order_table=data.get('order_table', False),
        opening_time=data['opening_time'],
        closing_time=data['closing_time'],
        discounts=data.get('discounts', ''),
        manager_ids=data.get('manager_ids', '')
    )
    db.session.add(restaurant)
    db.session.commit()
    return restaurant

def update_restaurant(restaurant_id, data):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return None

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
    return restaurant

def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return False

    db.session.delete(restaurant)
    db.session.commit()
    return True
