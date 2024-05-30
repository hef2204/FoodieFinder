CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        full_name TEXT,
                        role TEXT NOT NULL CHECK (role IN ('user', 'manager', 'admin')),
                        phone_number INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS restaurants (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        location TEXT NOT NULL,
                        phone_number TEXT NOT NULL,
                        type TEXT NOT NULL,
                        Kosher TEXT NOT NULL,
                        order_table TEXT NOT NULL,
                        Availability TEXT NOT NULL,
                        discounts TEXT NOT NULL,
                        manager_ids INTEGER,
                        FOREIGN KEY (manager_ids) REFERENCES users (id)
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




INSERT INTO users (username, password, email, full_name, role, phone_number) VALUES ('admin', '1234', 'hhh@.com', 'admin', 'admin', '123456789');

