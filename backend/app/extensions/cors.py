from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def enable_cors(app):
    # Get the frontend URL from the .env file
    frontend_url = os.getenv("FLASK_FRONTEND_URL", "*")  # Default to '*' if not set

    # Configure CORS with the frontend URL
    CORS(app, resources={r"/*": {"origins": frontend_url}})