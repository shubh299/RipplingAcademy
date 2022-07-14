import json
import secrets
from typing import Dict, List

from food_ordering_app.processing_exceptions import BadRequestBody, InsufficientParameters


def get_parameter_dict(request_body: str) -> Dict:
    try:
        parameter_dict = json.loads(request_body)
        return parameter_dict
    except TypeError:
        raise BadRequestBody
    except json.decoder.JSONDecodeError:
        raise BadRequestBody


def check_params(expected_param_list: List[str], received_parameters_dict) -> None:
    """
    :return: True if all required parameters are present
    """
    for param in expected_param_list:
        if param not in received_parameters_dict or len(received_parameters_dict.get(param)) == 0:
            raise InsufficientParameters(f"{param} missing")
