from marshmallow import Schema, fields
from models.item_list import ItemListSchema


# user
class UserSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

    user_id = fields.Str(required=True)  # mongo-generated hash string, primary key
    username = fields.Str(required=True)
    shipping_address = fields.Str()
    is_admin = fields.Boolean(default=False)
    is_suspended = fields.Boolean(default=False)

    cart = fields.Nested(ItemListSchema)
    watchlist = fields.Nested(ItemListSchema)
    order_history = fields.List(fields.Nested(ItemListSchema))  # list of carts
    item_history = fields.List(fields.Str())  # list of ItemIds


users_schema = UserSchema(many=True)
user_schema = UserSchema()
