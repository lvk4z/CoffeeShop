from django.urls import path
from .views.views import MeetingView, GuestView, DrinkView, OrdersView, MenuView
from .views.meeting_views import GetMeeting, CreateMeetingView, UpdateMeeting, GetMenu, CurrentMeetingView
from .views.guest_views import RegisterAsMember, UserInBase, LeaveMeeting, AutoAuthView
from .views.orders_view import CreateOrderView, GetGuestOrdersView, GetMeetingOrdersView, ToggleOrderDoneView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('auth/', AutoAuthView.as_view(), name='auto_auth'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('meeting/', MeetingView.as_view()),
    path('guest/', GuestView.as_view()),
    path('drink/', DrinkView.as_view()),
    path('orders/', OrdersView.as_view()),
    path('menu/', MenuView.as_view()),
    path('get-menu/', GetMenu.as_view()),
    path('create-meeting/', CreateMeetingView.as_view()),
    path('get-meeting/', GetMeeting.as_view()),
    path('register-as-member/', RegisterAsMember.as_view()),
    path('user-in-base/', UserInBase.as_view()),
    path('leave-meeting/', LeaveMeeting.as_view()),
    path('update-meeting/', UpdateMeeting.as_view()),
    path('current-meeting/', CurrentMeetingView.as_view()),
    path('create-order/', CreateOrderView.as_view()),
    path('get-guest-orders/', GetGuestOrdersView.as_view()),
    path('meeting-orders/', GetMeetingOrdersView.as_view()),
    path('toggle-order/<int:order_id>/', ToggleOrderDoneView.as_view()),
]