from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework_mongoengine import viewsets

from food_ordering_app.db_queries import get_user_by_token
from food_ordering_app.models import Restaurant
from food_ordering_app.processing_exceptions import *
from food_ordering_app.serializers import RestaurantSerializer


def check_admin_token(auth_token: str) -> None:
    user = get_user_by_token(auth_token)
    if len(user) == 0 or user[0].user_type != 'app_admin':
        raise InvalidTokenException("wrong token")


def food_app_home(request):
    return HttpResponse("HI")


class RestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantSerializer

    def get_queryset(self):
        queryset = Restaurant.objects()
        restaurant_name = self.request.query_params.get('restaurant-name')
        cuisine = self.request.query_params.get('cuisine')
        if restaurant_name is not None:
            queryset = queryset.filter(name__icontains=restaurant_name)
        if cuisine is not None:
            queryset = queryset.filter(cuisines=cuisine)
        return queryset

    def post(self):
        try:
            auth_token = self.request.query_params.get('auth-token')
            if auth_token is None:
                raise InvalidTokenException("auth token missing")
            check_admin_token(auth_token)
            serializer = RestaurantSerializer(data=self.request.data)
            if not serializer.is_valid():
                raise BadRequestBody("body invalid")
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except InvalidTokenException as error:
            print("Exception:", error)
        except BadRequestBody as error:
            print("Exception:", error)
        return Response("Error", status=status.HTTP_400_BAD_REQUEST)

    def put(self):
        pass
