import json
from typing import Dict

from django.http import HttpResponseNotAllowed, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from mongoengine import Q

from food_ordering_app.models import Restaurant, User
from food_ordering_app.processing_exceptions import InsufficientParameters, WrongParameter, UserExistsException, \
    RestaurantExistsException
from food_ordering_app.utility_functions import get_random_password

# TODO: make process functions shorter
# TODO: check for authentication


def process_manager_parameters(parameters: Dict) -> User:
    manager_parameters = ['manager-email', 'user-type']

    for param in manager_parameters:
        if param not in parameters or len(parameters.get(param)) == 0:
            raise InsufficientParameters(f"{param} missing")

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


def process_restaurant_parameters(parameters: Dict) -> Restaurant:
    restaurant_params = ["restaurant-name", "restaurant-address", "restaurant-cuisines", "restaurant-manager-email",
                         "restaurant-logo"]

    for param in restaurant_params:
        if param not in parameters or len(parameters.get(param)) == 0:
            raise InsufficientParameters(f"{param} missing")

    if isinstance(parameters.get("restaurant-cuisines"), list):
        raise WrongParameter("cuisines not a list")

    manager_email = parameters.get("restaurant-manager-email")
    manager_in_db = User.objects(Q(type="restaurant_manager") & Q(email=manager_email))
    if len(manager_in_db) == 0:
        raise WrongParameter("manager not in db")

    restaurant_name = parameters.get("restaurant-name")
    restaurant_address = parameters.get("restaurant-address")
    restaurant_in_db = Restaurant.objects(Q(name=restaurant_name) & Q(address=restaurant_address))
    if len(restaurant_in_db) == 0:
        raise RestaurantExistsException("Restaurant already exists")

    new_restaurant = Restaurant()
    new_restaurant.name = parameters.get("restaurant-name")
    new_restaurant.address = parameters.get("restaurant-address")
    new_restaurant.cuisines = parameters.get("restaurant-cuisines")
    new_restaurant.logo = parameters.get("restaurant-logo")
    new_restaurant.manager = manager_email
    return new_restaurant


def default_path(request):
    print(request)
    return HttpResponse("admin_home")


@csrf_exempt
def add_restaurant_manager(request):
    if request.method == 'POST':
        try:
            parameters = json.loads(request.body)
            new_manager = process_manager_parameters(parameters)
            new_manager.save()
        except InsufficientParameters as insufficient_parameters:
            print("Error:", insufficient_parameters)
        except WrongParameter as wrong_parameters:
            print("Error:", wrong_parameters)
        return HttpResponse("Got new manager request")
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
def add_restaurant(request):
    if request.method == 'POST':
        try:
            parameters = json.loads(request.body)
            new_restaurant = process_restaurant_parameters(parameters)
            new_restaurant.save()
        except InsufficientParameters as insufficient_parameters:
            print("Exception", insufficient_parameters)
        except WrongParameter as wrong_parameters:
            print("Exception", wrong_parameters)
        except RestaurantExistsException as restaurant_found:
            print("Exception", restaurant_found)
        return HttpResponse("Got new  request")
    else:
        return HttpResponseNotAllowed(['POST'])

