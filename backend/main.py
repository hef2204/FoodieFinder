from models import User, Manager, Restaurant
from flask import Flask, request, make_response, Response
from dotenv import load_dotenv


load_dotenv()
app = Flask(__name__)


@app.route('/')
def root():
    response = make_response("Hello from the backend!")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/users')
