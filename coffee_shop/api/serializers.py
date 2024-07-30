from rest_framework import serializers
from .models import Meeting, Guest, Drink, Orders, Menu

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ('id', 'event_date', 'status', 'host', 'menu')

class CreateMeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ('event_date', 'host')

class UpdateMeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ('id','event_date', 'host')

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ('coname', 'house')
class DrinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drink
        fields = ('name', 'description', 'image')

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = ('meeting', 'guest', 'drink')

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'
    