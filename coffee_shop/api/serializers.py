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
        fields = ('username', 'house')
        # Remove the auto-generated UniqueValidator so returning users
        # can call /api/auth/ again — get_or_create handles deduplication.
        extra_kwargs = {
            'username': {'validators': []},
        }

class DrinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drink
        fields = ('name', 'description', 'image')

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = ('id', 'meeting', 'guest', 'drink', 'done')

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'
    