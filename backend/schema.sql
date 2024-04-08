CREATE TABLE IF NOT EXISTS restaurants (
                    id INTEGER PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL UNIQUE,
                    location TEXT,
                    phone_number TEXT,
                    type TEXT,
                    Kosher TEXT ,
                    order_table TEXT NULL,
                    availability TEXT NULL,
                    discounts FLOAT NOT NULL DEFAULT 0.0,
                    rating_count INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    username TEXT,
                    password TEXT,
                    email TEXT,
                    first_name TEXT,
                    last_name TEXT,
                    role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS managers (
                    id INTEGER PRIMARY KEY,
                    full_name TEXT,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL,
                    restaurant TEXT NOT NULL,
                    phone_number TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'manager'

);

CREATE TABLE IF NOT EXISTS menu (
                    restaurant_id INTEGER NOT NULL,
                    item_name TEXT NOT NULL,
                    item_description TEXT NOT NULL,
                    item_price FLOAT NOT NULL,
                    rating FLOAT FLOAT NOT NULL CHECK(rating >= 0.0 AND rating <= 5.0),
                    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)

);


CREATE TABLE IF NOT EXISTS admin (
                    id INTEGER PRIMARY KEY NOT NULL UNIQUE, 
                    full_name TEXT,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'admin'

);
CREATE TABLE IF NOT EXISTS reviews (
                    id INTEGER PRIMARY KEY,
                    restaurant_id INTEGER NOT NULL,
                    user_id INTEGER,
                    review TEXT NOT NULL,
                    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id),
                    FOREIGN KEY(user_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS ratings (
                    id INTEGER PRIMARY KEY,
                    restaurant_id INTEGER NOT NULL,
                    user_id INTEGER,
                    rating FLOAT NOT NULL CHECK(rating >= 0.0 AND rating <= 5.0),
                    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id),
                    FOREIGN KEY(user_id) REFERENCES users(id)
);




INSERT INTO users (username, password, email, first_name, last_name, role) VALUES ('user1', '1234', 'DDD', 'John', 'Doe', 'user');
INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts) VALUES ('Burger King', 'Tel Aviv', '03-1234567', 'Fast Food', 'No', 'Yes', 'Yes', 0.0);
INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, Availability, discounts) VALUES ('Pizza Hut', 'Jerusalem', '02-1234567', 'Pizza', 'Yes', 'Yes', 'Yes', 0.0);
INSERT INTO ratings (restaurant_id, user_id, rating) VALUES (1, 1, 4.5);
INSERT INTO ratings (restaurant_id, user_id, rating) VALUES (2, 1, 4.0);
INSERT INTO ratings (restaurant_id, user_id, rating) VALUES (1, 1, 3.6);


SELECT restaurant_id, COUNT(*) as rating_count
FROM ratings
GROUP BY restaurant_id;