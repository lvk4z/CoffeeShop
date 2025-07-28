from django.shortcuts import render
from rest_framework import generics, status
from ..models import Meeting, Guest, Orders, Menu, Drink
from ..serializers import MeetingSerializer, CreateMeetingSerializer, UpdateMeetingSerializer, OrdersSerializer, GuestSerializer, DrinkSerializer, MenuSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class MeetingView(generics.CreateAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

class GuestView(generics.CreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

class DrinkView(generics.CreateAPIView):
    queryset = Drink.objects.all()
    serializer_class = DrinkSerializer

class OrdersView(generics.CreateAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer

class MenuView(generics.CreateAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer