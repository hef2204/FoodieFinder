from app.models.user import User
from app.extensions.database import db
from werkzeug.security import generate_password_hash

def register_user(data):
    user = User(
        username=data['username'],
        email=data['email'],
        role='user'
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return user

def validate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user
    return None
