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
                    rating_count INTEGER NOT NULL DEFAULT 0,
                    manager_id INTEGER,
                    FOREIGN KEY(manager_id) REFERENCES managers(id)
);

CREATE TABLE IF NOT EXISTS admin (
                    id INTEGER PRIMARY KEY NOT NULL UNIQUE,
                    username TEXT NOT NULL UNIQUE,
                    full_name TEXT,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'admin'

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
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    full_name TEXT,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone_number TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'manager'
);

CREATE TABLE IF NOT EXISTS menu_items (
                    id INTEGER PRIMARY KEY,
                    restaurant_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT,
                    price FLOAT NOT NULL CHECK(price >= 0.0),
                    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
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

CREATE TABLE IF NOT EXISTS reservations (
                    id INTEGER PRIMARY KEY,
                    restaurant_id INTEGER NOT NULL,
                    restaurant_name TEXT NOT NULL,
                    user_id INTEGER,
                    date TEXT NOT NULL,
                    time TEXT NOT NULL,
                    number_of_people INTEGER NOT NULL,
                    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id),
                    FOREIGN KEY(user_id) REFERENCES users(id)
);



INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, availability, discounts, rating_count, manager_id) VALUES ('Pizza Hut', '123 Main St', '123-456-7890', 'Italian', 'Yes', 'Yes', 'Yes', 0.0, 0, 1);
INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, availability, discounts, rating_count, manager_id) VALUES ('McDonalds', '456 Elm St', '123-456-7890', 'Fast Food', 'No', 'Yes', 'Yes', 0.0, 0, 2);
INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, availability, discounts, rating_count, manager_id) VALUES ('Burger King', '789 Oak St', '123-456-7890', 'Fast Food', 'No', 'Yes', 'Yes', 0.0, 0, 3);
INSERT INTO restaurants (name, location, phone_number, type, Kosher, order_table, availability, discounts, rating_count, manager_id) VALUES ('Subway', '101 Pine St', '123-456-7890', 'Fast Food', 'No', 'Yes', 'Yes', 0.0, 0, 4);
INSERT INTO users (username, password, email, first_name, last_name, role) VALUES ('user1', 'user1', 'sfsdf', 'sdf', 'sdf', 'user');
INSERT INTO users (username, password, email, first_name, last_name, role) VALUES ('user2', 'user2', 'sfsdf', 'sdf', 'sdf', 'user');
INSERT INTO admin (username, password, email, full_name, role) VALUES ('admin1', 'admin1', 'sfsdf', 'sdf', 'admin');
INSERT INTO managers (username, password, email, full_name, phone_number, role) VALUES ('manager1', '1234', 'sfsdf', 'sdf', 'sdf', 'manager');
INSERT INTO managers (username, password, email, full_name, phone_number, role) VALUES ('manager2', '1234', 'sfsdf', 'sdf', 'sdf', 'manager');
INSERT INTO managers (username, password, email, full_name, phone_number, role) VALUES ('manager3', '1234', 'sfsdf', 'sdf', 'sdf', 'manager');
INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (1, 'Pizza', 'Delicious cheese pizza', 10.0);
INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (1, 'Pasta', 'Tasty spaghetti with tomato sauce', 8.0);
INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (2, 'Burger', 'Juicy beef burger with fries', 12.0);
INSERT INTO menu_items (restaurant_id, name, description, price) VALUES (2, 'Salad', 'Fresh garden salad', 7.0);


SELECT restaurant_id, COUNT(*) as rating_count
FROM ratings
GROUP BY restaurant_id;