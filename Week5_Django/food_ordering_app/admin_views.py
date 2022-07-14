import json
from typing import Dict

from django.http import HttpResponseNotAllowed, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from mongoengine import Q

from food_ordering_app.models import Restaurant, User
from food_ordering_app.processing_exceptions import *
from food_ordering_app.utility_functions import get_random_password, get_parameter_dict, check_params


# TODO: make process functions shorter
# TODO: check for authentication
# TODO: remove csrf exempt decorator


def process_manager_parameters(parameters: Dict) -> User:
    expected_manager_parameters = ['manager-email', 'user-type']

    check_params(expected_manager_parameters, parameters)

    manager_email = parameters.get("manager-email")
    user_in_db = User.objects(email=manager_email)

    if len(user_in_db) != 0:
        raise UserExistsException("manager email already exists")

    user_type = parameters.get("user-type")
    if user_type != "restaurant_manager":
        raise WrongParameter(f"wrong user type: expected restaurant_manager, got {user_type}")

    new_manager = User(user_type="restaurant_manager")
    new_manager.email = manager_email
    new_manager.password = get_random_password()

    return new_manager


def search_restaurant_in_db(restaurant_name: str, restaurant_address: str) -> Restaurant:
    restaurant_in_db = Restaurant.objects(Q(name=restaurant_name) & Q(address=restaurant_address))
    if len(restaurant_in_db) == 0:
        return None
    return restaurant_in_db[0]


def process_new_restaurant_parameters(parameters: Dict) -> Restaurant:
    expected_restaurant_params = ["restaurant-name", "restaurant-address", "restaurant-cuisines",
                                  "restaurant-manager-email", "restaurant-logo"]

    check_params(expected_restaurant_params, parameters)

    if not isinstance(parameters.get("restaurant-cuisines"), list):
        raise WrongParameter("cuisines not a list")

    manager_email = parameters.get("restaurant-manager-email")
    manager_in_db = User.objects(Q(user_type="restaurant_manager") & Q(email=manager_email))
    if len(manager_in_db) == 0:
        raise WrongParameter("manager not in db")

    restaurant_name = parameters.get("restaurant-name")
    restaurant_address = parameters.get("restaurant-address")
    restaurant_in_db = search_restaurant_in_db(restaurant_name, restaurant_address)
    if restaurant_in_db is not None:
        raise RestaurantExistsException("Restaurant already exists")

    new_restaurant = Restaurant()
    new_restaurant.name = parameters.get("restaurant-name")
    new_restaurant.address = parameters.get("restaurant-address")
    new_restaurant.cuisines = parameters.get("restaurant-cuisines")
    new_restaurant.logo = parameters.get("restaurant-logo")
    new_restaurant.manager = manager_in_db[0]
    return new_restaurant


def get_restaurant(parameters: Dict) -> Restaurant:
    expected_restaurant_parameters = ["restaurant-name", "restaurant-address"]

    check_params(expected_restaurant_parameters, parameters)

    restaurant_name = parameters.get("restaurant-name")
    restaurant_address = parameters.get("restaurant-address")
    restaurant_in_db = search_restaurant_in_db(restaurant_name, restaurant_address)
    if restaurant_in_db is None:
        raise RestaurantNotFoundException("Restaurant not found")
    return restaurant_in_db


def default_path(request):
    print(request)
    return HttpResponse("admin_home")


"""
views start here
"""


@csrf_exempt
def add_restaurant_manager(request):
    if request.method == 'POST':
        try:
            parameters = get_parameter_dict(request.body)
            new_manager = process_manager_parameters(parameters)
            new_manager.save()
            return HttpResponse(json.dumps({"password": new_manager.password}))
        except InsufficientParameters as insufficient_parameters:
            print("Exception:", insufficient_parameters)
        except WrongParameter as wrong_parameters:
            print("Exception:", wrong_parameters)
        except UserExistsException as error:
            print("Exception:", error)
            return HttpResponseBadRequest("User Exists")
        return HttpResponseBadRequest("Wrong parameters/parameters missing")
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
def add_restaurant(request):
    if request.method == 'POST':
        try:
            parameters = get_parameter_dict(request.body)
            new_restaurant = process_new_restaurant_parameters(parameters)
            new_restaurant.save()
            return HttpResponse("Got new restaurant request")
        except InsufficientParameters as insufficient_parameters:
            print("Exception:", insufficient_parameters)
        except WrongParameter as wrong_parameters:
            print("Exception:", wrong_parameters)
        except RestaurantExistsException as restaurant_found:
            print("Exception:", restaurant_found)
        except BadRequestBody as error:
            print("Exception:", error)
        return HttpResponseBadRequest("Wrong parameters/parameters missing")
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
def delete_restaurant(request):
    if request.method == 'POST':
        try:
            parameters = get_parameter_dict(request.body)
            restaurant = get_restaurant(parameters)
            restaurant.delete()
            return HttpResponse("deleted restaurant")
        except InsufficientParameters as error:
            print("Exception:", error)
        except RestaurantNotFoundException as error:
            print("Exception:", error)
            return HttpResponseBadRequest("Restaurant Not Found")
        except BadRequestBody as error:
            print("Exception:", error)
        return HttpResponseBadRequest("Wrong parameters/parameters missing")
    else:
        return HttpResponseNotAllowed(['POST'])
