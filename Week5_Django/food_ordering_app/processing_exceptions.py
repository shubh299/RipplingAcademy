class InsufficientParameters(Exception):
    pass


class WrongParameter(Exception):
    pass


class UserNotFoundException(Exception):
    pass


class UserExistsException(Exception):
    pass


class RestaurantExistsException(Exception):
    pass


class RestaurantNotFoundException(Exception):
    pass


class BadRequestBody(Exception):
    pass


class DishExistsError(Exception):
    pass


class DishNotFoundException(Exception):
    pass
