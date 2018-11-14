#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import datetime
import config
from bson.objectid import ObjectId
from bson import json_util
from flask import Flask, render_template, request
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

from flask import current_app, Blueprint, flash, redirect
from flask_login import login_required, login_user, logout_user
from models.user import User
import forms


class JSONEncoder(json.JSONEncoder):
    ''' extend json-encoder class'''

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


app = Flask(__name__)

# add mongo url to flask config, so that flask_pymongo can use it to make connection
app.config['MONGO_URI'] = config.DB
app.config['SECRET_KEY'] = config.SECRET_KEY
mongo = PyMongo(app)

# Flask BCrypt will be used to salt the user password
flask_bcrypt = Bcrypt(app)

# Associate Flask-Login manager with current app
login_manager = LoginManager()
login_manager.init_app(app)


auth_flask_login = Blueprint('auth_flask_login', __name__, template_folder='templates')


@auth_flask_login.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST" and "email" in request.form:
        email = request.form["email"]
        userData = mongo.db.users.find_one({"email": email})
        user = User(**userData)
        if user and flask_bcrypt.check_password_hash(user.password, request.form["password"]) and user.is_active:
            print("success")
            remember = request.form.get("remember", "no") == "yes"

            if login_user(user, remember=remember):
                print(user)
                flash("Logged in!")
                return redirect('/')
            else:
                flash("unable to log you in")

    return render_template("login.html")


@auth_flask_login.route("/register", methods=["GET", "POST"])
def register():
    registerForm = forms.SignupForm(request.form)
    current_app.logger.info(request.form)

    if request.method == 'POST' and registerForm.validate() is False:
        current_app.logger.info(registerForm.errors)
        return "uhoh registration error"

    elif request.method == 'POST' and registerForm.validate():
        email = request.form['email']

        # generate password hash
        password_hash = flask_bcrypt.generate_password_hash(request.form['password'])

        # prepare User
        user = {"email": email, "password": password_hash}

        try:
            mongo.db.users.insert_one(user)
            if login_user(user, remember=False):
                flash("Logged in!")
                return redirect('/')
            else:
                flash("unable to log you in")

        except:
            flash("unable to register with that email address")
            current_app.logger.error("Error on registration - possible duplicate emails")

    # prepare registration form
    # registerForm = RegisterForm(csrf_enabled=True)
    templateData = {

        'form': registerForm
    }

    return render_template("register.html", **templateData)


@auth_flask_login.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Logged out.")
    return redirect('/login')


@login_manager.unauthorized_handler
def unauthorized_callback():
    return redirect('/login')


@login_manager.user_loader
def load_user(id):
    if not id or id is None or id == "None":
        redirect('/login')
    else:
        user = mongo.db.users.find_one({"id": ObjectId(id)})
        return user


app.register_blueprint(auth_flask_login)


@app.route("/")
def index():
    return render_template('index.html')


# USER STUFF
@app.route('/api/users', methods=['GET'])
def findAllUsers():
    users = []
    for user in mongo.db.users.find():
        users.append(user)
    return json.dumps(users, default=json_util.default)


@app.route("/api/users", methods=['POST'])
def createUser():
  userData = request.get_json(force=True)
  mongo.db.users.insert_one(userData)
  return 'OK'


@app.route('/api/users/<user_id>', methods=['GET', 'PUT', 'DELETE'])
def handleUser(user_id):

  if request.method == 'GET':
    user = mongo.db.users.find_one_or_404({"_id": ObjectId(user_id)})
    return json.dumps(user, default=json_util.default)

  if request.method == 'PUT':
    newUser = request.get_json(force=True)
    user = mongo.db.users.find_one_and_update({"_id": ObjectId(user_id)}, {"$set": newUser})
    return 'OK'

  if request.method == 'DELETE':
    mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    return 'OK'


# ITEM STUFF
@app.route("/api/items", methods=['GET'])
def findAllItems():
    items = []
    for item in mongo.db.items.find():
        items.append(item)
    return json.dumps(items, default=json_util.default)

@app.route("/api/items", methods=['POST'])
def createItem():
    itemData = request.get_json(force=True)
    mongo.db.items.insert_one(itemData)
    return json.dumps(itemData, default=json_util.default)

@app.route("/api/items/<item_id>", methods=['GET', 'PUT', 'DELETE'])
def handleItem(item_id):
    if request.method == 'GET':
        itemData = mongo.db.items.find_one_or_404({"_id": ObjectId(item_id)})
        return json.dumps(itemData, default=json_util.default)

    if request.method == 'PUT':
      newItem = request.get_json(force=True)
      item = mongo.db.items.find_one_and_update({"_id": ObjectId(item_id)}, {"$set": newItem})
      return 'OK'

    if request.method == 'DELETE':
        mongo.db.items.delete_one({"_id": ObjectId(item_id)})
        return 'OK'


# BID STUFF
@app.route('/api/items/<item_id>/bid', methods=['POST'])
def bid(item_id):
    new_bid = request.get_json(force=True)
    item = mongo.db.items.find_one({"_id": ObjectId(item_id)})
    item["bid_history"].append(new_bid)
    mongo.db.items.find_one_and_update({"_id": ObjectId(item_id)}, {"$set": item})
    return "OK"


# CART STUFF
@app.route('/api/users/<user_id>/cart', methods=['GET', 'POST'])
def cart(user_id):
    if request.method == 'GET':
        cart = mongo.db.users.find_one({"_id": ObjectId(user_id)})['cart']
        print(cart)
        return json.dumps(cart, default=json_util.default)

    elif request.method == 'POST':
        new_cart = request.get_json(force=True)
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        print(user)
        user['cart'] = new_cart
        mongo.db.users.find_one_and_update({"_id": ObjectId(user_id)}, {"$set": new_cart})
        return "OK"


# WATCHLIST
@app.route('/api/users/<user_id>/watchlist', methods=['GET', 'POST'])
def watchlist(user_id):
    if request.method == 'GET':
        watchlist = mongo.db.users.find_one({"_id": ObjectId(user_id)})['watchlist']
        return json.dumps(watchlist, default=json_util.default)

    elif request.method == 'POST':
        new_watchlist = request.get_json(force=True)
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        user["watchlist"] = new_watchlist
        mongo.db.users.find_one_and_update({"_id": ObjectId(user_id)}, {"$set": new_watchlist})
        return "OK"

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
