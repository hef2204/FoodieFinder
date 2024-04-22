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
                    role TEXT NOT NULL DEFAULT 'admin',
                    firstLogin BOOLEAN NOT NULL DEFAULT 1

);


CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    username TEXT,
                    password TEXT,
                    email TEXT,
                    first_name TEXT,
                    last_name TEXT,
                    role TEXT NOT NULL DEFAULT 'user',
                    firstLogin BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS managers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    full_name TEXT,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL,
                    restaurant TEXT NOT NULL,
                    phone_number TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'manager',
                    firstLogin BOOLEAN NOT NULL DEFAULT 1
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




INSERT INTO users (username, password, email, first_name, last_name, role, firstLogin) VALUES ('user1', 'user1', 'sfsdf', 'sdf', 'sdf', 'user', 1);
INSERT INTO users (username, password, email, first_name, last_name, role, firstLogin) VALUES ('user2', 'user2', 'sfsdf', 'sdf', 'sdf', 'user', 1);
INSERT INTO admin (username, password, email, full_name, role, firstLogin) VALUES ('admin1', 'admin1', 'sfsdf', 'sdf', 'admin', 1);
INSERT INTO managers (username, password, email, full_name, restaurant, phone_number, role, firstLogin) VALUES ('manager1', '1234', 'sfsdf', 'sdf', 'sdf', 'sdf', 'manager', 1);
INSERT INTO managers (username, password, email, full_name, restaurant, phone_number, role, firstLogin) VALUES ('manager2', '1234', 'sfsdf', 'sdf', 'sdf', 'sdf', 'manager', 1);
INSERT INTO managers (username, password, email, full_name, restaurant, phone_number, role, firstLogin) VALUES ('manager3', '1234', 'sfsdf', 'sdf', 'sdf', 'sdf', 'manager', 1);



SELECT restaurant_id, COUNT(*) as rating_count
FROM ratings
GROUP BY restaurant_id;