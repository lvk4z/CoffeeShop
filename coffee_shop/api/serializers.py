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

class GuestSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    house = serializers.ChoiceField(choices=Guest.HOUSES, required=False)
    phone = serializers.CharField(required=False, allow_blank=True)

    def create_or_get_guest(self, validated_data):
        username = validated_data['username']
        guest, created = Guest.objects.get_or_create(username=username)
        if created:
            guest.house = validated_data.get('house', 'H')
            guest.phone = validated_data.get('phone', '')
            guest.set_unusable_password()
            guest.save()
        return guest

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
    