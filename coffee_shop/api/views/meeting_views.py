from rest_framework import status
from ..models import Meeting, Menu
from ..serializers import MeetingSerializer, DrinkSerializer, CreateMeetingSerializer, UpdateMeetingSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone


def get_current_meeting():
    """
    Returns the nearest upcoming PLANNED meeting.
    Auto-marks past PLANNED meetings as TOOKPLACE first.
    Falls back to the most recent meeting if none are planned.
    """
    now = timezone.now()
    # Auto-update past planned meetings to "took place"
    Meeting.objects.filter(status=Meeting.PLANNED, event_date__lt=now).update(status=Meeting.TOOKPLACE)
    # Nearest upcoming planned meeting
    meeting = (
        Meeting.objects
        .filter(status=Meeting.PLANNED, event_date__gte=now)
        .order_by('event_date')
        .first()
    )
    if not meeting:
        # Fallback: most recent meeting overall
        meeting = Meeting.objects.order_by('-event_date').first()
    return meeting

class GetMeeting(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MeetingSerializer

    def get(self, request, format=None):
        meeting_id = request.GET.get('id')
        if not meeting_id:
            return Response({'error': 'ID parameter not provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            meeting = Meeting.objects.get(id=meeting_id)
            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
        except Meeting.DoesNotExist:
            return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

class GetMenu(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        meeting_id = request.GET.get('id')
        if meeting_id is not None:
            try:
                meeting = Meeting.objects.get(id=meeting_id)
            except Meeting.DoesNotExist:
                return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)
            
            if meeting.menu:
                drinks = meeting.menu.drinks.all() 
            else:
                drinks = Menu.objects.first().drinks.all()

            return Response(DrinkSerializer(drinks, many=True).data, status=status.HTTP_200_OK)
        return Response({'error': 'ID parameter not provided'}, status=status.HTTP_400_BAD_REQUEST)

class CreateMeetingView(APIView):
    serializer_class = CreateMeetingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
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
                meeting.menu = menu
                meeting.save(update_fields=['menu'])

            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateMeeting(APIView):
    serializer_class = UpdateMeetingSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            event_date = serializer.data.get('event_date')
            host = serializer.data.get('host')
            meeting_id = serializer.data.get('id')
            
            try:
                meeting = Meeting.objects.get(id=meeting_id)
            except Meeting.DoesNotExist:
                return Response({'msg': 'Meeting not found'}, status=status.HTTP_400_BAD_REQUEST)

            if not request.user.is_staff:
                return Response({'msg': 'You are not allowed to perform this action'}, status=status.HTTP_403_FORBIDDEN)
           
            meeting.event_date = event_date
            meeting.host = host
            meeting.save(update_fields=['event_date', 'host'])

            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
        
        return Response({'msg': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

class CurrentMeetingView(APIView):
    def get(self, request, format=None):
        meeting = get_current_meeting()
        if meeting:
            return Response({'id': meeting.id, 'host': meeting.host}, status=status.HTTP_200_OK)
        return Response({'Not found': 'doesnt exist'}, status=status.HTTP_404_NOT_FOUND)