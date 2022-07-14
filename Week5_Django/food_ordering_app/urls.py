from django.urls import path, include

from food_ordering_app import views, admin_views, restaurant_manager_views, customer_views

admin_patterns = [
    path('', admin_views.default_path),
    path('add-restaurant', admin_views.add_restaurant),
    path('add-restaurant-manager', admin_views.add_restaurant_manager),
    path('delete-restaurant', admin_views.delete_restaurant)
]

restaurant_manager_patterns = [
    path('', restaurant_manager_views.default_path),
    path('add-dish', restaurant_manager_views.add_dish),
    path('delete-dish', restaurant_manager_views.delete_dish),
]

customer_patterns = [
    path('', customer_views.default_path),
    path('add-user', customer_views.add_user),
    path('search', customer_views.search_restaurant),
]

urlpatterns = [
    path('', views.food_app_home),
    path('admin/', include(admin_patterns)),
    path('restaurant/', include(restaurant_manager_patterns)),
    path('user/', include(customer_patterns))
]
