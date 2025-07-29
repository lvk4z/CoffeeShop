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
    
    def validate_username(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Username cannot be empty")
        return value.strip()
    
    def validate_house(self, value):
        valid_houses = ['M', 'Z', 'S', 'K']  
        if value not in valid_houses:
            raise serializers.ValidationError(f"House must be one of: {valid_houses}")
        return value

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
    