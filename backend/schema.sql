CREATE TABLE IF NOT EXISTS restaurants (
                    id INTEGER PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL UNIQUE,
                    location TEXT,
                    phone_number TEXT,
                    type TEXT,
                    Kosher TEXT ,
                    order_table_option TEXT NULL,
                    Availability TEXT NULL,
                    rating FLOAT NOT NULL DEFAULT 0.0,
                    discounts FLOAT NOT NULL DEFAULT 0.0
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
                    item_price FLOAT NOT NULL
);
CREATE TABLE IF NOT EXISTS reviews (
                    id INTEGER PRIMARY KEY,
                    restaurant_id INTEGER NOT NULL,
                    user_id INTEGER,
                    review TEXT NOT NULL,
                    rating FLOAT NOT NULL,
                    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id),
                    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS admin (
                    id INTEGER PRIMARY KEY NOT NULL UNIQUE, 
                    full_name TEXT,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'admin'
);


INSERT INTO users (username, password, email, first_name, last_name, role) VALUES ('user1', '1234', 'DDD', 'John', 'Doe', 'user');
INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table_option, Availability, rating, discounts) VALUES ('Burger King', 'Tel Aviv', '03-1234567', 'Fast Food', 'No', 'Yes', 'Yes', 4.5, 0.0);
INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table_option, Availability, rating, discounts) VALUES ('Pizza Hut', 'Jerusalem', '02-1234567', 'Pizza', 'Yes', 'Yes', 'Yes', 4.0, 0.0);
INSERT INTO reviews (restaurant_id, user_id, review, rating) VALUES (1,1, 'Great food', 5.0);
INSERT INTO reviews (restaurant_id, user_id, review, rating) VALUES (1, NULL, 'Great food', 5.5);