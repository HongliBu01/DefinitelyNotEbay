from marshmallow import Schema, fields
from models.bid import BidSchema
from datetime import datetime


#item
class ItemSchema(Schema):
    item_id = fields.Str(required=True)
    name = fields.Str()
    seller_id = fields.Str()  # seller id
    category = fields.List(fields.Str())

    current_price = fields.Float()
    starting_price = fields.Float()
    buy_now_price = fields.Float()

    quantity = fields.Integer()
    report_flag = fields.Boolean()

    start_time = fields.DateTime(default=datetime.now())
    end_time = fields.DateTime()

    bid_history = fields.List(fields.Nested(BidSchema))

    shipping_cost = fields.Float()
    description = fields.Str()


items_schema = ItemSchema(many=True)
item_schema = ItemSchema()
