from marshmallow import Schema, fields
from datetime import datetime


# bid
class BidSchema(Schema):
    bid_id = fields.Str(required=True)
    buyer_id = fields.Str()
    item_id = fields.Str()
    bid_amount = fields.Float()
    timestamp = fields.DateTime(default=datetime.now())
