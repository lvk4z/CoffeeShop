from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('register', index),
    path('orders', index),
    path('create', index),
    path('meeting/<str:meetingID>', index)
]
