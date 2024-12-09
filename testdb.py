from psycopg2 import connect

db = connect("postgresql://postgres:postgres@localhost:5432/foodie_finder")
cursor = db.cursor()
cursor.execute("CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, password_hash VARCHAR(128) NOT NULL, role VARCHAR(10) NOT NULL DEFAULT 'user')")
db.commit()
