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

class DrinkView(generics.CreateAPIView):
    queryset = Drink.objects.all()
    serializer_class = DrinkSerializer

class OrdersView(generics.CreateAPIView):
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
                drinks = meeting.menu.drinks.all() 
                drinks_data = DrinkSerializer(drinks, many=True).data
                return Response(drinks_data, status=status.HTTP_200_OK)
            else:
                drinks = Menu.objects.first().drinks.all()
                drinks_data = DrinkSerializer(drinks, many=True).data
                return Response(drinks_data, status=status.HTTP_200_OK)
        
        return Response({'error': 'ID parameter not provided'}, status=status.HTTP_400_BAD_REQUEST)

    
class RegisterAsMember(APIView):
    serializer_class = GuestSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if  serializer.is_valid():
            coname = serializer.data.get('coname')
            house = serializer.data.get('house')
            guest = Guest.objects.get_or_create(coname=coname, house=house)
            self.request.session['coname'] = coname
            return JsonResponse({'coname': guest.coname, 'house': guest.house}, status=status.HTTP_200_OK)
        return JsonResponse({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

class CreateMeetingView(APIView):
    serializer_class = CreateMeetingSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            event_date = serializer.validated_data.get('event_date')
            host = serializer.validated_data.get('host')

            menu = Menu.objects.first()
            print(menu)
            meeting, created = Meeting.objects.get_or_create(
                event_date=event_date,
                defaults={"host": host, "menu": menu}
            )

            if not created:
                # Jeśli spotkanie już istnieje, zmieniamy tylko menu
                meeting.menu = menu
                meeting.save(update_fields=['menu'])

            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserInBase(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        
        coname =  self.request.session.get('coname')
        
        try:
            guest = Guest.objects.get(coname=coname)
        except Guest.DoesNotExist:
            return Response({'error': 'Guest not found'}, status=status.HTTP_404_NOT_FOUND)


        return Response(GuestSerializer(guest).data, status=status.HTTP_200_OK)
    
class LeaveMeeting(APIView):
    def post(self, request, format=None):
        if 'coname' in self.request.session:
            self.request.session.pop('coname')
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
            user_id = self.request.session.get('coname')
            if user_id != "admin":
                return Response({'msg': 'You are not allowed to perform this action'}, status=status.HTTP_403_FORBIDDEN)
            
            # Update the meeting details
            meeting.event_date = event_date
            meeting.host = host
            meeting.save(update_fields=['event_date', 'host'])
            print(event_date,host,id,queryset[0].host)

            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
        
        return Response({'msg': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)
    
class CurrentMeetingView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        queryset = Meeting.objects.all()
        if queryset.exists():
            meeting = queryset[queryset.count()-1]
            return Response({'id': meeting.id, 'host':meeting.host}, status=status.HTTP_200_OK)
        return Response({'Not found' : 'doesnt exist'},status=status.HTTP_404_NOT_FOUND)

class CreateOrderView(APIView):
    serializer_class = OrdersSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        coname = self.request.session.get('coname')
        quantity = request.data.get('quantity')
        drink_name = request.data.get('drink_name')

        try:
            drink = Drink.objects.get(name=drink_name)
        except Drink.DoesNotExist:
            return Response({'msg': 'Drink not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            guest = Guest.objects.get(coname=coname)
        except Drink.DoesNotExist:
            return Response({'msg': 'Drink not found'}, status=status.HTTP_404_NOT_FOUND)
        
        meeting = Meeting.objects.all()
        if meeting.exists():
            meeting = meeting[meeting.count()-1]
            for _ in range(quantity):
                order = Orders(meeting=meeting, guest=guest, drink=drink)
                order.save()
            return Response({'msg': 'Order created'}, status=status.HTTP_200_OK)
        return Response({'msg': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetGuestOrdersView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        coname = self.request.session.get('coname')
        if not coname:
            return Response({'error': 'Guest not logged in'}, status=status.HTTP_403_FORBIDDEN)

        try:
            guest = Guest.objects.get(coname=coname)
        except Guest.DoesNotExist:
            return Response({'error': 'Guest not found'}, status=status.HTTP_404_NOT_FOUND)

        orders = Orders.objects.filter(guest=guest)
        drinks = []
        for order in orders:
            drink = order.drink
            drink_data = DrinkSerializer(drink).data
            drinks.append(drink_data)
        

        return JsonResponse({'userName': coname, 'orders': drinks}, status=status.HTTP_200_OK)