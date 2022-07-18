from django.urls import path, include
from rest_framework.routers import DefaultRouter

from food_ordering_app import views, admin_views, restaurant_manager_views, customer_views

admin_patterns = [
    path('', admin_views.default_path),
    path('add-restaurant', admin_views.add_restaurant),
    path('add-restaurant-manager', admin_views.add_restaurant_manager),
    path('delete-restaurant', admin_views.delete_restaurant)
]

router = DefaultRouter()
router.register(r'restaurant', views.RestaurantViewSet, basename="restaurant")
restaurant_manager_patterns = [
    path('', restaurant_manager_views.default_path),
    path('add-dish', restaurant_manager_views.add_dish),
    path('delete-dish', restaurant_manager_views.delete_dish),
]

customer_patterns = [
    path('', customer_views.default_path),
    path('add-user', customer_views.add_user),
    # path('search-restaurant', customer_views.search_restaurant),
    path('search-restaurant-dish', customer_views.search_dish_by_restaurant),
    path('search-dish', customer_views.search_dish_across_restaurants),
    path('place-order', customer_views.place_order)
]

urlpatterns = [
    # path('', views.food_app_home),
    path('admin/', include(admin_patterns)),
    path('', include(router.urls)),
    path('user/', include(customer_patterns))
]
