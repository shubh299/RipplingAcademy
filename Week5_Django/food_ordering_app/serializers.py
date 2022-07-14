from rest_framework_mongoengine import serializers

from food_ordering_app.models import Restaurant


class RestaurantSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'
