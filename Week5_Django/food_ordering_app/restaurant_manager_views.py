from typing import Dict

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from food_ordering_app.db_queries import get_restaurant_from_db, search_dish_in_restaurant, get_user_by_token
from food_ordering_app.models import Dish, User
from food_ordering_app.processing_exceptions import *
from food_ordering_app.serializers import DishSerializer

from food_ordering_app.utility_functions import check_params, get_parameter_dict


def get_restaurant_manager_token(request: Request) -> User:
    try:
        auth_token = request.query_params['auth-token']
    except KeyError:
        raise InvalidTokenException("auth token missing")
    user = get_user_by_token(auth_token)
    if len(user) == 0 or user[0].user_type != 'restaurant_manager':
        raise InvalidTokenException("wrong token")

    return user[0]


def process_add_dish_params(parameters: Dict, manager: User) -> Dish:
    expected_parameters = ["restaurant-name", "restaurant-address",
                           "dish-name", "dish-description", "dish-image", "cuisine"]
    check_params(expected_parameters, parameters)

    restaurant_name = parameters.get("restaurant-name")
    restaurant_address = parameters.get("restaurant-address")

    restaurant_in_db = get_restaurant_from_db(restaurant_name, restaurant_address)
    if len(restaurant_in_db) == 0:
        raise RestaurantNotFoundException("restaurant does not exist")
    restaurant_in_db = restaurant_in_db[0]

    if restaurant_in_db.manager != manager:
        raise InvalidTokenException("wrong manager token")

    # TODO add cuisine check here

    dish_name = parameters.get("dish-name")
    dish_in_db = search_dish_in_restaurant(restaurant_in_db, dish_name)

    if len(dish_in_db) != 0:
        raise DishExistsError("Dish exists for this restaurant")

    new_dish = Dish(
        name=dish_name,
        description=parameters.get("dish-description"),
        dish_image=parameters.get("dish-image"),
        is_veg=parameters.get("dish-is-veg"),
        cuisine=parameters.get("cuisine"),
        availability=parameters.get("dish-availability"),
        restaurant_from=restaurant_in_db
    )

    return new_dish


def process_delete_dish_params(parameters: Dict, manager: User) -> Dish:
    expected_params = ["restaurant-name", "restaurant-address", "dish-name"]
    check_params(expected_params, parameters)

    restaurant_name = parameters.get("restaurant-name")
    restaurant_address = parameters.get("restaurant-address")
    restaurant = get_restaurant_from_db(restaurant_name, restaurant_address)

    if len(restaurant) == 0:
        raise RestaurantNotFoundException("restaurant not found")

    if restaurant[0].manager != manager:
        raise InvalidTokenException("Wrong manager token")

    dish_name = parameters.get("dish-name")
    dish = search_dish_in_restaurant(restaurant[0], dish_name)
    if len(dish) == 0:
        raise DishNotFoundException(f"{dish_name} not in db")

    return dish[0]


"""
views start here
"""


def default_path(request):
    print(request)
    return Response("Hi", status=200)


@api_view(('POST',))
def add_dish(request):
    try:
        manager = get_restaurant_manager_token(request)
        parameters = get_parameter_dict(request.body)
        new_dish = process_add_dish_params(parameters, manager)
        new_dish.save()
        dish_serializer = DishSerializer(new_dish)
        return Response(dish_serializer.data)
    except InsufficientParameters as insufficient_parameters:
        print("Exception:", insufficient_parameters)
    except WrongParameter as wrong_parameters:
        print("Exception:", wrong_parameters)
    except RestaurantNotFoundException as error:
        print("Exception:", error)
    except DishExistsError as restaurant_found:
        print("Exception:", restaurant_found)
        return Response("Dish already created", status=400)
    except BadRequestBody as error:
        print("Exception:", error)
    except InvalidTokenException as error:
        print("Exception:", error)
    return Response("Wrong parameters/parameters missing", status=400)


@api_view(('POST',))
def update_dish(request):
    # TODO work on updating dish
    print(request)
    return Response("request received", status=200)


@api_view(('POST',))
def delete_dish(request):
    try:
        manager = get_restaurant_manager_token(request)
        parameters = get_parameter_dict(request.body)
        dish = process_delete_dish_params(parameters, manager)
        dish.delete()
        dish_serializer = DishSerializer(dish)
        return Response(dish_serializer.data)
    except InsufficientParameters as insufficient_parameters:
        print("Exception:", insufficient_parameters)
    except WrongParameter as wrong_parameters:
        print("Exception:", wrong_parameters)
    except DishNotFoundException as error:
        print("Exception:", error)
    except RestaurantNotFoundException as error:
        print("Exception:", error)
    except BadRequestBody as error:
        print("Exception:", error)
    except InvalidTokenException as error:
        print("Exception:", error)
    return Response("Wrong parameters/parameters missing", status=400)
