from mongoengine import Q, QuerySet

from food_ordering_app.models import User, Restaurant


def search_dish_in_restaurant(restaurant_name, restaurant_address):

    pass


def get_restaurant_from_db(restaurant_name: str, restaurant_address: str) -> QuerySet:
    restaurant_in_db = Restaurant.objects(Q(name=restaurant_name) & Q(address=restaurant_address))
    return restaurant_in_db


def get_user_from_db_by_email(email: str) -> QuerySet:
    users_in_db = User.objects(email=email)
    print(type(users_in_db))
    return users_in_db
