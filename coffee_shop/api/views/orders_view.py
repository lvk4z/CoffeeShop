from rest_framework import status
from ..models import Orders, Menu, Drink
from ..serializers import OrdersSerializer, MenuSerializer, DrinkSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        username = request.user.username

        quantity = request.data.get('quantity')
        drink_name = request.data.get('drink_name')

        if not quantity or not drink_name:
            return Response({'error': 'Quantity and drink name are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            drink = Drink.objects.get(name=drink_name)
        except Drink.DoesNotExist:
            return Response({'msg': 'Drink not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            guest = Guest.objects.get(username=username)
        except Guest.DoesNotExist:
            return Response({'msg': 'Guest not found'}, status=status.HTTP_404_NOT_FOUND)

        meeting = Meeting.objects.last()
        if meeting:
            for _ in range(quantity):
                Orders.objects.create(meeting=meeting, guest=guest, drink=drink)
            return Response({'msg': 'Order created'}, status=status.HTTP_200_OK)
        return Response({'msg': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

class GetGuestOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        username = request.user.username
        try:
            guest = Guest.objects.get(username=username)
        except Guest.DoesNotExist:
            return Response({'error': 'Guest not found'}, status=status.HTTP_404_NOT_FOUND)

        orders = Orders.objects.filter(guest=guest).select_related('drink')
        drinks = DrinkSerializer([order.drink for order in orders], many=True).data

        return JsonResponse({'userName': username, 'orders': drinks}, status=status.HTTP_200_OK)