import json
from typing import Dict

from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view
from rest_framework.response import Response

from food_ordering_app.constants import AUTH_TOKEN_LENGTH
from food_ordering_app.db_queries import *
from food_ordering_app.models import User, Order
from food_ordering_app.processing_exceptions import *
from food_ordering_app.serializers import RestaurantSerializer, DishSerializer, OrderSerializer
from food_ordering_app.utility_functions import get_parameter_dict, check_params


def process_user_params(parameters: Dict) -> User:
    expected_parameters = ["user-email", "user-type"]
    check_params(expected_parameters, parameters)

    user_email = parameters.get("user-email")
    user_type = parameters.get("user-type")

    user_in_db = get_user_from_db_by_email(user_email)

    if len(user_in_db) != 0:
        raise UserExistsException("Email already registered")

    if user_type != "customer":
        raise WrongParameter("wrong parameters")

    new_user = User()
    new_user.email = user_email
    new_user.user_type = user_type
    new_user.auth_token = get_random_string(length=AUTH_TOKEN_LENGTH)
    return new_user


def process_order_params(parameters: Dict) -> Order:
    expected_parameters = ["restaurant-id", "dishes"]

    check_params(expected_parameters, parameters)

    restaurant = get_restaurant_by_id(parameters.get("restaurant-id"))

    if len(restaurant) == 0:
        raise RestaurantNotFoundException("restaurant id not in db")

    restaurant = restaurant[0]

    # checking dish ids
    dish_id_list = parameters.get("dishes").keys()
    dishes_from_db = get_dishes_by_id(dish_id_list)
    for dish in dishes_from_db:
        if dish.restaurant_from != restaurant:
            raise DishNotFoundException("dish does not exist for this restaurant")

    new_order = Order(
        restaurant=restaurant,
        dishes_ordered=parameters.get("dishes")
    )

    return new_order


"""
views start here
"""


def default_path(request):
    print(request)
    return HttpResponse("Hi")


@csrf_exempt
@require_POST
def add_user(request):
    try:
        parameters = get_parameter_dict(request.body)
        new_user = process_user_params(parameters)
        new_user.save()
        return HttpResponse(json.dumps({"auth-token": new_user.auth_token}))
    except InsufficientParameters as insufficient_parameters:
        print("Exception:", insufficient_parameters)
    except WrongParameter as wrong_parameters:
        print("Exception:", wrong_parameters)
    except UserExistsException as error:
        print("Exception:", error)
        return HttpResponseBadRequest("User Exists")
    except BadRequestBody as error:
        print("Exception:", error)
    return HttpResponseBadRequest("Wrong parameters/parameters missing")


@api_view(('GET',))
def search_restaurant(request):
    restaurant_name = request.GET.get('name', '')
    cuisines = request.GET.get('cuisines', list())
    restaurants = get_restaurant_by_filter(restaurant_name, cuisines)
    serializer = RestaurantSerializer(restaurants, many=True)
    return Response(serializer.data)


@api_view(('GET',))
def search_dish_by_restaurant(request):
    if 'restaurant-id' not in request.GET:
        return HttpResponseBadRequest('No restaurant asked')
    restaurant_id = request.GET['restaurant-id']
    dishes = get_dishes_by_restaurant_name(restaurant_id)
    serializer = DishSerializer(dishes, many=True)
    return Response(serializer.data)


@api_view(('GET',))
def search_dish_across_restaurants(request):
    if 'dish-name' not in request.GET:
        return HttpResponseBadRequest('No dishes asked')
    dish_name = request.GET['dish-name']
    dishes = get_dishes_by_name(dish_name)
    serializer = DishSerializer(dishes, many=True)
    return Response(serializer.data)


@csrf_exempt
@api_view(('POST',))
def place_order(request):
    try:
        auth_token = request.query_params['auth-token']
        user = get_user_by_token(auth_token)
        if len(user) == 0 or user[0].user_type != "customer":
            return HttpResponseBadRequest("Wrong auth token")
        user = user[0]
        parameters = get_parameter_dict(request.body)
        new_order = process_order_params(parameters)
        new_order.ordered_by = user
        new_order.save()
        order_serializer = OrderSerializer(new_order, many=False)
        return Response(order_serializer.data)
    except InsufficientParameters as error:
        print("Exception:", error)
    except RestaurantNotFoundException as error:
        print("Exception:", error)
    except DishNotFoundException as error:
        print("Exception:", error)
    except BadRequestBody as error:
        print("Exception:", error)
    return HttpResponseBadRequest("Wrong parameters/parameters missing")
