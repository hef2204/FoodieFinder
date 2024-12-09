from flask import Flask
from app.extensions.cors import enable_cors
from app.extensions.database import init_db
from app.extensions.jwt import init_jwt
from app.routes.auth_routes import auth_routes
from app.routes.user_routes import user_routes
from app.routes.admin_routes import admin_routes
from app.routes.restaurant_routes import restaurant_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')  # Load configuration


    # Initialize extensions
    init_db(app)
    init_jwt(app)
    enable_cors(app)

    # Register blueprints
    app.register_blueprint(auth_routes)
    app.register_blueprint(user_routes)
    app.register_blueprint(admin_routes)
    app.register_blueprint(restaurant_routes)

    

    return app
