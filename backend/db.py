import sqlite3
from pathlib import Path

from flask import g

CURRENT_DIR = Path(__file__).parent
DATABASE = CURRENT_DIR / "database.db"


def get_db():
    #Connect to the SQLite database, and return the connection object
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE, timeout=10)
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None) -> None:
    #Close the connection to the SQLite database
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    #Create the tables in the SQLite database
    SCHEMA_PATH = CURRENT_DIR / "schema.sql"
    db = sqlite3.connect(DATABASE)
    db_schema = SCHEMA_PATH.read_text()
    cursor = db.cursor()
    cursor.executescript(db_schema)
    db.commit()
    db.close()



if __name__ == "__main__":
    init_db()








                    




