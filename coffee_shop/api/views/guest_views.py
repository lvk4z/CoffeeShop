from rest_framework import status
from ..models import Guest
from ..serializers import GuestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

class AutoAuthView(APIView):
    def post(self, request):
        serializer = GuestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data.get('username')
        house = serializer.validated_data.get('house', 'H')

        guest, created  = Guest.objects.get_or_create(username=username, defaults={'house': house})
        refresh = RefreshToken.for_user(guest)
        return JsonResponse({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': guest.username,
            'house': guest.house,
            'created': created
        })

class RegisterAsMember(APIView):
    serializer_class = GuestSerializer

    def post(self, request, format=None):
        if not request.session.exists(request.session.session_key):
            request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            house = serializer.validated_data.get('house')

            guest, created = Guest.objects.get_or_create(username=username, house=house)

            request.session['username'] = guest.username

            return JsonResponse(
                {'username': guest.username, 
                'house': guest.house,
                'created': created}, status=status.HTTP_200_OK)

        return JsonResponse({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

class UserInBase(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        username = request.user.username
        try:
            guest = Guest.objects.get(username=username)
        except Guest.DoesNotExist:
            return Response({'error': 'Guest not found'}, status=status.HTTP_404_NOT_FOUND)


        return Response(GuestSerializer(guest).data, status=status.HTTP_200_OK)

class LeaveMeeting(APIView):
    def post(self, request, format=None):
        username = request.user.username
        try:
            guest = Guest.objects.get(username=username)
        except Guest.DoesNotExist:
            return Response({'error': 'Guest not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Message': 'Successfully left the meeting'}, status=status.HTTP_200_OK)