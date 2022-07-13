from django.urls import path, include

from food_ordering_app import views, admin_views

admin_patterns = [
    path('', admin_views.default_path),
    path('add-restaurant', admin_views.add_restaurant),
    path('add-restaurant-manager', admin_views.add_restaurant_manager)
]

urlpatterns = [
    path('', views.food_app_home),
    path('admin/', include(admin_patterns))
]
