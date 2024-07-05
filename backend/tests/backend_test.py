from db import get_db
from main import app

app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this to your actual secret key

def test_add_manager_route():
    client = app.test_client()
    new_manager_data = {
        'username': "test_manager1",
        'full_name': "Ofer Sadan",
        'password': "fadsjdfhlsdh",
        'email': "example@email.com",
        'phone_number': "923492364",
    }
    response = client.post('/admin/add_manager', json=new_manager_data)
    assert response.status_code == 401
    with app.app_context():
        get_db().cursor().execute("DELETE FROM users WHERE username = 'test_manager1'").connection.commit()


def test_login_bad_route():
    client = app.test_client()
    login_data = {
        'username': "test_manager1",
        'password': "fadsjdfhlsdh",
    }
    response = client.post('/login', json=login_data)
    assert response.status_code == 401


def test_login_good_route():
    client = app.test_client()
    login_data = {
        'username': "admin",
        'password': "1234",
    }
    response = client.post('/login', json=login_data)
    assert response.status_code == 200


def test_login_bad_password_route():
    client = app.test_client()
    login_data = {
        'username': "admin",
        'password': "12yy34",
    }
    response = client.post('/login', json=login_data)
    assert response.status_code == 401


def test_add_another_restaurant():
    client = app.test_client()
    new_restaurant_data = {
        'name': "test_restaurant1",
        'location': "test_address1",
        'phone_number': "123456789",
        'manager_ids': 1,
        "type": "test_type1",
        "kosher": "test_kosher1",
        "order_table": "test_order_table1",
        "opening time": "test_opening_time1",
        "closing time": "test_closing_time1",
        "discounts": "test_discount1",
    }
    response = client.post('/manager/add_restaurant', json=new_restaurant_data)
    assert response.status_code == 401
    with app.app_context():
        get_db().cursor().execute("DELETE FROM restaurants WHERE name = 'test_restaurant1'").connection.commit()

