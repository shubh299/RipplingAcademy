import json
import secrets
from typing import Dict

from food_ordering_app.processing_exceptions import BadRequestBody


def get_random_password():
    return secrets.token_urlsafe(8)


def get_parameter_dict(request_body: str) -> Dict:
    try:
        parameter_dict = json.loads(request_body)
        return parameter_dict
    except TypeError:
        raise BadRequestBody
    except json.decoder.JSONDecodeError:
        raise BadRequestBody
