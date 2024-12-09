from app.extensions.database import db 

class Menu(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'), nullable=False)

    item_name = db.Column(db.String(80), nullable=False)

    price = db.Column(db.Float, nullable=False)

    description = db.Column(db.String(200), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "restaurant_id": self.restaurant_id,
            "item_name": self.item_name,
            "price": self.price,
            "description": self.description
        }
