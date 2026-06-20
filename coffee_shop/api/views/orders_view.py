from rest_framework import status
from ..models import Orders, Menu, Drink, Guest, Meeting
from ..serializers import OrdersSerializer, MenuSerializer, DrinkSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from collections import defaultdict
from .meeting_views import get_current_meeting

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

        meeting = get_current_meeting()
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

        meeting = get_current_meeting()
        orders = Orders.objects.filter(guest=guest, meeting=meeting).select_related('drink') if meeting else []
        drinks = DrinkSerializer([order.drink for order in orders], many=True).data

        return JsonResponse({'userName': username, 'orders': drinks}, status=status.HTTP_200_OK)


class GetMeetingOrdersView(APIView):
    """Host-only: all orders for the current meeting, grouped by guest."""
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        meeting = get_current_meeting()
        if not meeting:
            return Response({'error': 'No meeting'}, status=status.HTTP_404_NOT_FOUND)
        if request.user.house != meeting.host:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        orders = (
            Orders.objects
            .filter(meeting=meeting)
            .select_related('guest', 'drink')
            .order_by('guest__username', 'id')
        )

        grouped = defaultdict(lambda: {'house': '', 'orders': []})
        for order in orders:
            key = order.guest.username
            grouped[key]['house'] = order.guest.house
            grouped[key]['orders'].append({
                'id': order.id,
                'drink': order.drink.name,
                'done': order.done,
            })

        result = [
            {'guest': guest, 'house': data['house'], 'orders': data['orders']}
            for guest, data in grouped.items()
        ]
        return Response({'guests': result})


class ToggleOrderDoneView(APIView):
    """Host-only: toggle done status of a single order."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_id, format=None):
        meeting = get_current_meeting()
        if not meeting or request.user.house != meeting.host:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        try:
            order = Orders.objects.get(id=order_id)
        except Orders.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        order.done = not order.done
        order.save(update_fields=['done'])
        return Response({'id': order.id, 'done': order.done})
