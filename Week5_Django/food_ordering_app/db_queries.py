from typing import List

from mongoengine import Q, QuerySet

from food_ordering_app.models import User, Restaurant, Dish


def get_restaurant_from_db(restaurant_name: str, restaurant_address: str) -> QuerySet:
    restaurant_in_db = Restaurant.objects(
        Q(name__iwholeword=restaurant_name) & Q(address__iwholeword=restaurant_address))
    return restaurant_in_db


def search_dish_in_restaurant(restaurant: Restaurant, dish_name: str):
    dish = Dish.objects(Q(name__iwholeword=dish_name) & Q(restaurant_from=restaurant))
    return dish


def get_user_from_db_by_email(email: str) -> QuerySet:
    users_in_db = User.objects(email__iwholeword=email)
    return users_in_db


def get_restaurant_by_filter(restaurant_name: str, cuisine: List) -> QuerySet:
    if restaurant_name == '' and len(cuisine) == 0:
        return Restaurant.objects.all()
    if restaurant_name == '':
        return Restaurant.objects(Q(cuisines=cuisine))
    if len(cuisine) == 0:
        return Restaurant.objects(Q(name__icontains=restaurant_name))

    return Restaurant.objects(Q(name__icontains=restaurant_name) & Q(cuisines=cuisine))


def get_restaurant_by_id(restaurant_id: str) -> QuerySet:
    return Restaurant.objects(id=restaurant_id)


def get_dishes_by_restaurant_name(restaurant_id: str) -> QuerySet:
    return Dish.objects(restaurant_from=restaurant_id)


def get_dishes_by_name(dish_name: str) -> QuerySet:
    return Dish.objects(Q(name__icontains=dish_name) | Q(description__icontains=dish_name))


def get_user_by_token(auth_token: str) -> QuerySet:
    return User.objects(auth_token=auth_token)


def get_dishes_by_id(dish_id_list: List) -> QuerySet:
    return Dish.objects(Q(id__in=dish_id_list))
