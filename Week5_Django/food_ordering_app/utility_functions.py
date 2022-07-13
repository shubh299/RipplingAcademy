import secrets


def get_random_password():
    return secrets.token_urlsafe(8)
