from mongoengine import *

user_types = ('app_admin', 'restaurant_manager', 'customer')


class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    type = StringField(choices=user_types)


class Restaurant(Document):
    name = StringField(required=True)
    address = StringField(required=True)
    cuisines = ListField()
    logo = ImageField()  # this needs to be changed to url or storage location for future
    manager = ReferenceField(User, reverse_delete_rule=CASCADE)


dish_category = ()


class Dish(Document):
    name = StringField(required=True)
    description = StringField()
    dish_image = ImageField()
    is_veg = BooleanField()
    category = StringField(choices=dish_category)
    availability = BooleanField(default=False)
    restaurant_from = ReferenceField(Restaurant)
    # availability_duration = ListField()


class Order(Document):
    order_id = SequenceField(unique=True)
    restaurant_name = ReferenceField(Restaurant)
    dishes_ordered = DictField()  # format --> dish_name : quantity
    ordered_by = ReferenceField(User)
