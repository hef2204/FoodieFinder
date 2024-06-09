from dataclasses import dataclass
from db import get_db, close_db
from typing import Optional



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
    phone_number: str
    role: str = "manager" 


@dataclass
class Restaurant:
    id: Optional[str] = None
    name: Optional[str] = None
    location: Optional[str] = None
    phone_number: Optional[str] = None
    type: Optional[str] = None
    Kosher: Optional[str] = None
    order_table: Optional[str] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    discounts: Optional[str] = None
    manager_id: Optional[str] = None


@dataclass
class addRestaurant:
    name: str
    location: str
    phone_number: str
    type: str
    Kosher: str
    order_table: str
    opening_time: str
    closing_time: str
    discounts: str
    manager_ids: str


@dataclass
class RestaurantUpdate:
    id: str
    name: str
    location: str
    phone_number: str
    type: str
    Kosher: str
    order_table: str
    opening_time: str
    closing_time: str


@dataclass
class Menu:
    name: str
    price: str
    description: str

@dataclass
class Admin:
    username: str
    full_name: str
    password: str
    email: str
    phone_number: str
    role: str = "admin"
    



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
class ManagerActions:
    @staticmethod
    def delete_menu(name):
        db = get_db()
        db.execute("DELETE FROM menu WHERE name=?", (name,))
        db.commit()
        close_db()
        return {"message": "Menu deleted successfully"}

    @staticmethod
    def add_menu(menu):
        db = get_db()
        db.execute(
            "INSERT INTO menu (name, price, description, restaurant) VALUES (?, ?, ?, ?)",
            (menu.name, menu.price, menu.description, menu.restaurant)
        )
        db.commit()
        close_db()
        return {"message": "Menu added successfully"}
    
    @staticmethod
    def update_restaurant(restaurant):
        db = get_db()
        db.execute(
            "UPDATE restaurants SET location=?, phone_number=?, type=?, Kosher=?, order_table=?, Availability=?, rating=?, discounts=? WHERE name=?",
            (restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.rating, restaurant.discounts, restaurant.name)
        )
        db.commit()
        close_db()
        return {"message": "Restaurant updated successfully"}
    
    @staticmethod
    def add_restaurant(restaurant):
        db = get_db()
        db.execute(
            "INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, rating, discounts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (restaurant.name, restaurant.location, restaurant.phone_number, restaurant.type, restaurant.Kosher, restaurant.order_table, restaurant.Availability, restaurant.rating, restaurant.discounts)
        )
        db.commit()
        close_db()
        return {"message": "Restaurant added successfully"}
    
    @staticmethod
    def add_manager(manager):
        db = get_db()
        db.execute(
            "INSERT INTO managers (username, full_name, password, email, phone_number, restaurant) VALUES (?, ?, ?, ?, ?, ?)",
            (manager.username, manager.full_name, manager.password, manager.email, manager.phone_number, manager.restaurant)
        )
        db.commit()
        close_db()
        return {"message": "Manager added successfully"}
    
    @staticmethod
    def update_manager(manager):
        db = get_db()
        db.execute(
            "UPDATE managers SET email=?, phone_number=? WHERE username=?",
            (manager.email, manager.phone_number, manager.username)
        )
        db.commit()
        close_db()
        return {"message": "Manager updated successfully"}