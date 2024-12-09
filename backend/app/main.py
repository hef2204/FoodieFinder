import sys
import os


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app



app = create_app()

@app.route("/test_db")
def test_db():
    from app.models.user import User
    users = User.query.all()
    return {"users": [u.username for u in users]}




if __name__ == '__main__':
    app.run(debug=True)
