from django.shortcuts import render
from rest_framework import generics, status
from .models import Meeting, Guest, Orders, Menu, Drink
from .serializers import MeetingSerializer, CreateMeetingSerializer, UpdateMeetingSerializer, OrdersSerializer, GuestSerializer, DrinkSerializer, MenuSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class MeetingView(generics.ListAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

class GuestView(generics.ListAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

class DrinkView(generics.ListAPIView):
    queryset = Drink.objects.all()
    serializer_class = DrinkSerializer

class OrdersView(generics.ListAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer

class MenuView(generics.ListAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

class GetMeeting(APIView):
    serializer_class = MeetingSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id != None:
            meeting = Meeting.objects.filter(id=id)
            if len(meeting) > 0:
                data = MeetingSerializer(meeting[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Not found' : 'doesnt exist'},status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad request' : ' bad parameters'},status=status.HTTP_400_BAD_REQUEST)
    
class GetMenu(APIView):
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id is not None:
            try:
                meeting = Meeting.objects.get(id=id)
            except Meeting.DoesNotExist:
                return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)
            
            if meeting.menu:
                drinks = meeting.menu.drinks.all()  # Access drinks through the menu
                drinks_data = DrinkSerializer(drinks, many=True).data
                return Response(drinks_data, status=status.HTTP_200_OK)
            else:
                drinks = Menu.objects.first().drinks.all()
                drinks_data = DrinkSerializer(drinks, many=True).data
                return Response(drinks_data, status=status.HTTP_200_OK)
        
        return Response({'error': 'ID parameter not provided'}, status=status.HTTP_400_BAD_REQUEST)

    
class RegisterAsMember(APIView):
    lookup_url_kwarg = 'coffee_name'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        name = request.data.get(self.lookup_url_kwarg)
        if name is not None:
            self.request.session['coffee_name'] = name
            return JsonResponse({'coffee_name': name}, status=status.HTTP_200_OK)
        return JsonResponse({'error': 'Invalid coffee name'}, status=status.HTTP_400_BAD_REQUEST)


    
    
class CreateMeetingView(APIView):
    serializer_class = CreateMeetingSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            event_date = serializer.data.get('event_date')
            host = serializer.data.get('host')
            menu_id = serializer.data.get('menu')
            menu = Menu.objects.all()
            print(serializer.data)
            queryset = Meeting.objects.filter(event_date=event_date)
            if queryset.exists():
                meeting = queryset[0]
                meeting.host = host
                meeting.menu = menu[3]
                meeting.save(update_fields=['host','menu'])
            else:
                meeting = Meeting(event_date=event_date, host=host, menu=menu[3])
                meeting.save()
            
            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)

class UserInBase(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'coffee_name': self.request.session.get('coffee_name')
        }

        return JsonResponse(data, status=status.HTTP_200_OK)
    
class LeaveMeeting(APIView):
    def post(self, request, format=None):
        if 'coffee_name' in self.request.session:
            self.request.session.pop('coffee_name')
            #usunać typa z ordersów
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

class UpdateMeeting(APIView):
    serializer_class = UpdateMeetingSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            event_date = serializer.data.get('event_date')
            host = serializer.data.get('host')
            id = serializer.data.get('id')
            
            queryset = Meeting.objects.filter(event_date=event_date)
            if not queryset.exists():
                print("nasxnianx")
                print(event_date,host,id,queryset)
                return Response({'msg': 'Meeting not found'}, status=status.HTTP_400_BAD_REQUEST)
            
            meeting = queryset.first()
            user_id = self.request.session.get('coffee_name')
            if user_id != "admin":
                return Response({'msg': 'You are not allowed to perform this action'}, status=status.HTTP_403_FORBIDDEN)
            
            # Update the meeting details
            meeting.event_date = event_date
            meeting.host = host
            meeting.save(update_fields=['event_date', 'host'])
            print(event_date,host,id,queryset[0].host)

            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
        
        return Response({'msg': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)