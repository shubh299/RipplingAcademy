from typing import Dict

from django.http import HttpResponseNotAllowed, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

from food_ordering_app.db_queries import get_restaurant_from_db, search_dish_in_restaurant
from food_ordering_app.models import Dish
from food_ordering_app.processing_exceptions import *

from food_ordering_app.utility_functions import check_params, get_parameter_dict


def process_add_dish_params(parameters: Dict) -> Dish:
    expected_parameters = ["restaurant-name", "restaurant-address",
                           "dish-name", "dish-description", "dish-image", "cuisine"]
    check_params(expected_parameters, parameters)

    restaurant_name = parameters.get("restaurant-name")
    restaurant_address = parameters.get("restaurant-address")

    restaurant_in_db = get_restaurant_from_db(restaurant_name, restaurant_address)
    if len(restaurant_in_db) == 0:
        raise RestaurantNotFoundException("restaurant does not exist")
    restaurant_in_db = restaurant_in_db[0]

    # TODO add cuisine check here

    dish_name = parameters.get("dish-name")
    dish_in_db = search_dish_in_restaurant(restaurant_in_db, dish_name)

    if len(dish_in_db) != 0:
        raise DishExistsError("Dish exists for this restaurant")

    new_dish = Dish(name=dish_name)
    new_dish.description = parameters.get("dish-description")
    new_dish.dish_image = parameters.get("dish-image")
    new_dish.is_veg = parameters.get("dish-is-veg")
    new_dish.cuisine = parameters.get("cuisine")
    new_dish.availability = parameters.get("dish-availability")
    new_dish.restaurant_from = restaurant_in_db
    return new_dish


def process_delete_dish_params(parameters: Dict) -> Dish:
    expected_params = ["restaurant-name", "restaurant-address", "dish-name"]
    check_params(expected_params, parameters)

    restaurant_name = parameters.get("restaurant-name")
    restaurant_address = parameters.get("restaurant-address")
    restaurant = get_restaurant_from_db(restaurant_name, restaurant_address)

    if len(restaurant) == 0:
        raise RestaurantNotFoundException("restaurant not found")

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
    return HttpResponse("Hi")


@csrf_exempt
def add_dish(request):
    if request.method == 'POST':
        try:
            parameters = get_parameter_dict(request.body)
            new_dish = process_add_dish_params(parameters)
            new_dish.save()
            return HttpResponse("dish added")
        except InsufficientParameters as insufficient_parameters:
            print("Exception:", insufficient_parameters)
        except WrongParameter as wrong_parameters:
            print("Exception:", wrong_parameters)
        except RestaurantNotFoundException as error:
            print("Exception:", error)
        except DishExistsError as restaurant_found:
            print("Exception:", restaurant_found)
            return HttpResponseBadRequest("Dish already created")
        except BadRequestBody as error:
            print("Exception:", error)
        return HttpResponseBadRequest("Wrong parameters/parameters missing")

    else:
        return HttpResponseNotAllowed(['POST'])


def update_dish(request):
    # TODO work on updating dish
    pass


@csrf_exempt
def delete_dish(request):
    if request.method == 'POST':
        try:
            parameters = get_parameter_dict(request.body)
            dish = process_delete_dish_params(parameters)
            dish.delete()
            return HttpResponse("dish deleted")
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
        return HttpResponseBadRequest("Wrong parameters/parameters missing")

    else:
        return HttpResponseNotAllowed(['POST'])
