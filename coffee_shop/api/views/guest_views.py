from rest_framework import status
from ..models import Guest
from ..serializers import GuestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


class AutoAuthView(APIView):
    """
    Passwordless auth: POST {username, house}
    Creates the user on first call, issues JWT on every call.
    Registered users returning → same account, new tokens.
    """
    permission_classes = []

    def post(self, request):
        serializer = GuestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data.get('username', '').strip()
        house = serializer.validated_data.get('house', 'Z')

        if not username:
            return Response({'detail': 'Username cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)
        if house not in ('M', 'Z', 'S', 'K', 'H'):
            return Response({'detail': 'Invalid house value.'}, status=status.HTTP_400_BAD_REQUEST)

        guest, created = Guest.objects.get_or_create(
            username=username,
            defaults={'house': house}
        )
        # Set a unusable password so Django's auth system is satisfied
        if created:
            guest.set_unusable_password()
            guest.save(update_fields=['password'])

        refresh = RefreshToken.for_user(guest)
        return JsonResponse({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': guest.username,
            'house': guest.house,
            'created': created,
        })


# Keep URL backward-compat alias
RegisterAsMember = AutoAuthView


class UserInBase(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        return Response(GuestSerializer(request.user).data, status=status.HTTP_200_OK)


class LeaveMeeting(APIView):
    """Placeholder — logout is handled client-side by deleting tokens."""
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        return Response({'message': 'Logged out'}, status=status.HTTP_200_OK)