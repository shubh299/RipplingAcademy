from rest_framework_mongoengine import serializers

from food_ordering_app.models import Restaurant, Dish


class RestaurantSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class DishSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Dish
        fields = '__all__'
