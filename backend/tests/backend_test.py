import pytest
from unittest.mock import patch
from main import app
from db import init_db, get_db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            init_db()
        yield client

@patch('backend.main.add_manager')
def test_admin_add_manager(mock_add_manager, client):
    mock_add_manager.return_value = {'status': 'success'}
    data = {'username': 'new_manager', 'password': 'password123'}
    response = client.post('/admin/add_manager', json=data)
    assert response.status_code == 200
    assert b'success' in response.data

@patch('backend.main.add_restaurant')
def test_manager_manager_add_restaurantt(mock_add_restaurant, client):
    mock_add_restaurant.return_value = {'status': 'success'}
    data = {'name': 'New Restaurant', 'location': '123 Main St'}
    response = client.post('/manager/add_restaurant', json=data)
    assert response.status_code == 200
    assert b'success' in response.data

def test_db_connection(client):
    with app.app_context():
        db = get_db()
        assert db is not None
