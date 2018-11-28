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
from flask_socketio import SocketIO


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
socketio = SocketIO(app)
mongo = PyMongo(app)


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
  res = mongo.db.users.insert_one(userData)
  return json.dumps(res.inserted_id, default=json_util.default)


@app.route('/api/users/<user_id>', methods=['GET', 'PUT', 'DELETE'])
def handleUser(user_id):

  if request.method == 'GET':
    user = mongo.db.users.find_one({"_id": user_id})
    return json.dumps(user, default=json_util.default)

  if request.method == 'PUT':
    newUser = request.get_json(force=True)
    user = mongo.db.users.find_one_and_update({"_id": user_id}, {"$set": newUser})
    return json.dumps(user, default=json_util.default)

  if request.method == 'DELETE':
    res = mongo.db.users.delete_one({"_id": user_id})
    return json.dumps(res, default=json_util.default)


# ITEM STUFF
@app.route("/api/items", methods=['GET'])
def findAllItems():
    items = []
    # TODO: Check if time period has ended. If true, move item to last bidder's cart with type "bid" and mark not active
    for item in mongo.db.items.find():
        items.append(item)
    return json.dumps(items, default=json_util.default)

@app.route("/api/items", methods=['POST'])
def createItem():
    itemData = request.get_json(force=True)
    mongo.db.items.insert_one(itemData)
    # TODO: append _id.$oid into itemData.seller's listings
    return json.dumps(itemData, default=json_util.default)

@app.route("/api/items/<item_id>", methods=['GET', 'PUT', 'DELETE'])
def handleItem(item_id):
    if request.method == 'GET':
        itemData = mongo.db.items.find_one_or_404({"_id": ObjectId(item_id)})
        return json.dumps(itemData, default=json_util.default)

    if request.method == 'PUT':
      newItem = request.get_json(force=True)
      item = mongo.db.items.find_one_and_update({"_id": ObjectId(item_id)}, {"$set": newItem})
      return json.dumps(item, default=json_util.default)

    if request.method == 'DELETE':
        res = mongo.db.items.delete_one({"_id": ObjectId(item_id)})
        # return json.dumps(res, default=json_util.default)
        print(res)


# BID STUFF
@app.route('/api/items/<item_id>/bid', methods=['POST'])
def bid(item_id):
    new_bid = request.get_json(force=True)
    item = mongo.db.items.find_one({"_id": ObjectId(item_id)})
    # TODO: Store bid in user's bid history
    # Append {bidAmount, _id, timestamp}
    if "bid_history" not in item:
        item["bid_history"] = [new_bid]
    else:
        item["bid_history"].append(new_bid)
    mongo.db.items.find_one_and_update({"_id": ObjectId(item_id)}, {"$set": item})
    return json.dumps(new_bid, default=json_util.default)


# CART STUFF
# TODO: Add edit functionality if it was buyNow type
@app.route('/api/users/<user_id>/cart', methods=['GET', 'POST'])
def cart(user_id):
    if request.method == 'GET':
        cart = mongo.db.users.find_one({"_id": user_id})['cart']
        print(cart)
        return json.dumps(cart, default=json_util.default)

    elif request.method == 'POST':
        new_cart_item = request.get_json(force=True)
        user = mongo.db.users.find_one({"_id": user_id})
        if "cart" not in user:
            user["cart"] = [new_cart_item]
        else:
            user["cart"].append(new_cart_item)
        res = mongo.db.users.find_one_and_update({"_id": user_id}, {"$set": {"cart": user["cart"]}})
        return json.dumps(res, default=json_util.default)


# WATCHLIST
@app.route('/api/users/<user_id>/watchlist', methods=['GET', 'POST'])
def watchlist(user_id):
    if request.method == 'GET':
        watchlist = mongo.db.users.find_one({"_id": user_id})['watchlist']
        return json.dumps(watchlist, default=json_util.default)

    elif request.method == 'POST':
        new_watchlist_item = request.get_json(force=True)
        user = mongo.db.users.find_one({"_id": user_id})
        if "watchlist" not in user:
            user["watchlist"] = [new_watchlist_item]
        else:
            if new_watchlist_item not in user["watchlist"]: # can't add same item to watchlist again
                user["watchlist"].append(new_watchlist_item)
        res = mongo.db.users.find_one_and_update({"_id": user_id}, {"$set": {"watchlist": user["watchlist"]}})
        return json.dumps(res, default=json_util.default)

@app.route('/api/categories', methods=['GET', 'POST'])
def categories():
    if request.method == 'GET':
        categories = mongo.db.misc.find_one_or_404({"name": "categories"})
        return json.dumps(categories, default=json_util.default)

    elif request.method == 'POST':
        category = request.get_json(force=True)
        current_categories = mongo.db.misc.find_one_or_404({"name": "categories"})
        current_categories["data"].append(category)
        res = mongo.db.misc.find_one_and_update({"name": "categories"}, {"$set": {"data": current_categories["data"]}})
        return json.dumps(res, default=json_util.default)

@socketio.on('seller alert')
def handle_seller_alert(json):
    print('Received json: ' + str(json))

@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')



if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
