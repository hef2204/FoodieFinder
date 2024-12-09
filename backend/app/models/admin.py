from app.extensions.database import db
from app.models.user import User

class Admin(User):
    __tablename__ = 'admins'

    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    def serialize(self):
        return super().serialize()
