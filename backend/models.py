from dataclasses import dataclass



@dataclass
class User:
    username: str
    password: str
    email: str
    first_name: str
    last_name: str


@dataclass
class Manager:
    full_name: str
    password: str
    email: str
    restaurant: str
    phone_number: str


@dataclass
class Restaurant:
    name: str
    location: str
    phone_number: str
    type: str
    Kosher: str
    order_table: str
    Availability: str
    rating: str
    reviews: str
    discounts: str