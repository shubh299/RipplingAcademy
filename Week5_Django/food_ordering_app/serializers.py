from rest_framework_mongoengine import serializers

from food_ordering_app.models import *


class UserSerializer(serializers.DocumentSerializer):
    class Meta:
        model = User
        fields = '__all__'


class RestaurantSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class DishSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Dish
        fields = '__all__'


class OrderSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Order
        fields = '__all__'
