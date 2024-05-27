import pytest
from main import app
from db import get_db, close_db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['DATABASE'] = ':memory:'  # Use in-memory SQLite database for tests

    with app.app_context():
        db = get_db()
        with open('schema.sql', 'r') as f:
            db.executescript(f.read())
        yield app.test_client()
        close_db()

def test_register(client):
    # Test data
    user_data = {
        'username': 'testuser',
        'password': 'testpassword',
        'email': 'testemail@example.com',
        'first_name': 'Test',
        'last_name': 'User'
    }

    # Send a POST request to the /register route with the test data
    response = client.post('/register', json=user_data)

    # Check the response status code and data
    assert response.status_code == 200
    assert response.get_json() == {"message": "User added successfully"}

def test_register_existing_username(client):
    # Pre-populate the database with an existing user
    db = get_db()
    db.execute(
        "INSERT INTO users (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
        ('existingusername', 'hashedpassword', 'existingemail@example.com', 'Existing', 'User')
    )
    db.commit()

    # Test data
    user_data = {
        'username': 'existingusername',  # username that already exists in the database
        'password': 'testpassword',
        'email': 'testemail2@example.com',
        'first_name': 'Test',
        'last_name': 'User'
    }

    # Send a POST request to the /register route with the test data
    response = client.post('/register', json=user_data)

    # Check the response status code and data
    assert response.status_code == 409
    assert response.get_json() == {"message": "Username already taken"}

def test_register_existing_email(client):
    # Pre-populate the database with an existing user
    db = get_db()
    db.execute(
        "INSERT INTO users (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
        ('existinguser', 'hashedpassword', 'existingemail@example.com', 'Existing', 'User')
    )
    db.commit()

    # Test data
    user_data = {
        'username': 'newuser',
        'password': 'testpassword',
        'email': 'existingemail@example.com',  # email that already exists in the database
        'first_name': 'Test',
        'last_name': 'User'
    }

    # Send a POST request to the /register route with the test data
    response = client.post('/register', json=user_data)

    # Check the response status code and data
    assert response.status_code == 410
    assert response.get_json() == {"message": "Email already taken"}

def test_register_missing_fields(client):
    # Test data with missing password
    user_data = {
        'username': 'testuser2',
        'password': '',
        'email': 'testemail2@example.com',
        'first_name': 'Test2',
        'last_name': 'User2'
    }

    # Send a POST request to the /register route with the test data
    response = client.post('/register', json=user_data)

    # Check the response status code and data
    assert response.status_code == 400
    assert response.get_json() == {"message": "Invalid request"}
