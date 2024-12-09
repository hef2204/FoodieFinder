from app.extensions.database import db

class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100))
    type = db.Column(db.String(50))
    phone_number = db.Column(db.String(15))
    manager_ids = db.Column(db.String(200))  # Comma-separated list of manager IDs
    kosher = db.Column(db.Boolean, nullable=False, default=False)
    order_table = db.Column(db.Boolean, nullable=False, default=False)
    opening_time = db.Column(db.Time, nullable=False)
    closing_time = db.Column(db.Time, nullable=False)
    discounts = db.Column(db.String(100))

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'type': self.type,
            'phone_number': self.phone_number,
            'manager_ids': self.manager_ids,
            'kosher': self.kosher,
            'order_table': self.order_table,
            'opening_time': str(self.opening_time),
            'closing_time': str(self.closing_time),
            'discounts': self.discounts
        }
