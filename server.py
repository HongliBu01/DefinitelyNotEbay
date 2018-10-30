#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import datetime
import config
from bson.objectid import ObjectId
from flask import Flask, render_template
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


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000))
