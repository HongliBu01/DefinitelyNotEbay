#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import datetime
import config
from bson.objectid import ObjectId
from flask import Flask, render_template, request
from flask_pymongo import PyMongo


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
mongo = PyMongo(app)


@app.route("/")
def index():
    return render_template('index.html')


# display all users
@app.route('/users', methods=['GET'])
def find_all_user():
    users = mongo.db.users.find()
    for user in users:
        print(user)
    return "OK"


@app.route('/users', methods=['POST'])
def new_user():
    user_data = request.get_json(force=True)
    mongo.db.users.insert_one(user_data)
    return "OK"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000))
