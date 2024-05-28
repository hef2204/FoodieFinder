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




INSERT INTO admin (username, password, email, full_name, role) VALUES ('admin', '1234', 'sfsdf', 'sdf', 'admin');

