from marshmallow import Schema, fields


# cart, watchlist, history
class ItemListSchema(Schema):
    updated_time = fields.DateTime()
    items = fields.List(fields.Str())


item_lists_schema = ItemListSchema(many=True)
item_list_schema = ItemListSchema()
