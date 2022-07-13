from django.http import HttpResponse


def food_app_home(request):
    return HttpResponse("HI")
