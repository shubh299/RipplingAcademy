from mongoengine import *

user_types = ('app_admin', 'restaurant_manager', 'customer')


class User(Document):
    email = EmailField(required=True, unique=True)
    auth_token = StringField(required=True)
    user_type = StringField(choices=user_types)


class Restaurant(Document):
    name = StringField(required=True)
    address = StringField(required=True)
    cuisines = ListField(StringField())
    logo = StringField()  # this needs to be changed to url or storage location for future
    manager = ReferenceField(User, reverse_delete_rule=CASCADE, required=True)


class Dish(Document):
    name = StringField(required=True)
    description = StringField()
    dish_image = StringField()
    is_veg = BooleanField()
    cuisine = StringField()
    availability = BooleanField(default=True)
    restaurant_from = ReferenceField(Restaurant)
    # availability_duration = ListField()


class Order(Document):
    restaurant = ReferenceField(Restaurant)
    dishes_ordered = DictField()  # format --> dish_name : quantity
    ordered_by = ReferenceField(User)
