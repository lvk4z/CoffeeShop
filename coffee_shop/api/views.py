from django.shortcuts import render
from rest_framework import generics, status
from .models import Meeting
from .serializers import MeetingSerializer, CreateMeetingSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class MeetingView(generics.ListAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

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
            # poprawić filtrowanie daty
            #client = self.request.session.session_key
            queryset = Meeting.objects.filter(event_date=event_date)
            if queryset.exists():
                meeting = queryset[0]
                meeting.host = host
                meeting.save(update_fields=['host'])
            else:
                meeting = Meeting(event_date=event_date, host=host)
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