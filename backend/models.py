from dataclasses import dataclass
from db import get_db, close_db



@dataclass
class User:
    username: str
    password: str
    email: str
    first_name: str
    last_name: str


@dataclass
class Manager:
    username: str
    full_name: str
    password: str
    email: str
    restaurant: str
    phone_number: str
    role: str = "manager" # default value


@dataclass
class Restaurant:
    id: str
    name: str
    location: str
    phone_number: str
    type: str
    Kosher: str
    order_table: str
    Availability: str
    discounts: str
    manager_id: str


@dataclass
class RestaurantUpdate:
    id: str
    name: str
    location: str
    phone_number: str
    type: str
    Kosher: str
    order_table: str
    Availability: str


@dataclass
class Menu:
    name: str
    price: str
    description: str


class AdminActions:
    @staticmethod
    def delete_user(username):
        db = get_db()
        db.execute("DELETE FROM users WHERE username=?", (username,))
        db.commit()
        close_db()
        return {"message": "User deleted successfully"}

    @staticmethod
    def delete_restaurant(name):
        db = get_db()
        db.execute("DELETE FROM restaurants WHERE name=?", (name,))
        db.commit()
        close_db()
        return {"message": "Restaurant deleted successfully"}
    
    @staticmethod
    def add_restaurant(restaurant):
        db = get_db()
        db.execute(
            "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.discounts)
        )
        db.commit()
        close_db()
        return {"message": "Restaurant added successfully"}
    
    @staticmethod
    def add_manager(manager):
        db = get_db()
        db.execute(
            "INSERT INTO managers (username, full_name, password, email, restaurant, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
            (manager.username, manager.full_name, manager.password, manager.email, manager.restaurant, manager.phone_number)
        )
        db.commit()
        close_db()
        return {"message": "Manager added successfully"}
    
    @staticmethod
    def delete_manager(username):
        db = get_db()
        db.execute("DELETE FROM managers WHERE username=?", (username,))
        db.commit()
        close_db()
        return {"message": "Manager deleted successfully"}
    
    @staticmethod
    def manage_users():
        db = get_db()
        users = db.execute("SELECT * FROM users").fetchall()
        close_db()
        return {"users": [dict(user) for user in users]}
    
    @staticmethod
    def view_statistics():
        db = get_db()
        statistics = db.execute("SELECT * FROM statistics").fetchall()
        close_db()
        return {"statistics": [dict(statistic) for statistic in statistics]}