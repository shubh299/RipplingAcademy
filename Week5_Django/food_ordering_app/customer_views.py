import json
from typing import Dict

from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.utils.crypto import get_random_string

from food_ordering_app.constants import AUTH_TOKEN_LENGTH
from food_ordering_app.db_queries import get_user_from_db_by_email
from food_ordering_app.models import User
from food_ordering_app.processing_exceptions import *
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


@require_GET
def search_restaurant(request):
    print(request)
    pass
