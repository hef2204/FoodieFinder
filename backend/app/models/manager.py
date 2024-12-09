from app.extensions.database import db
from app.models.user import User

class Manager(User):
    __tablename__ = 'managers'

    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    assigned_restaurants = db.relationship('Restaurant', backref='manager', lazy=True)

    def serialize(self):
        base_data = super().serialize()
        base_data['assigned_restaurants'] = [restaurant.id for restaurant in self.assigned_restaurants.all()]
        return base_data
