from django.urls import path
from .views import MeetingView, CurrentMeetingView, CreateMeetingView, GetMeeting, UserInBase, RegisterAsMember, LeaveMeeting, UpdateMeeting, GuestView, DrinkView, OrdersView, MenuView, GetMenu

urlpatterns = [
    path('meeting', MeetingView.as_view()),
    path('guest', GuestView.as_view()),
    path('drink', DrinkView.as_view()),
    path('orders', OrdersView.as_view()),
    path('menu', MenuView.as_view()),
    path('get-menu', GetMenu.as_view()),
    path('create-meeting', CreateMeetingView.as_view()),
    path('get-meeting', GetMeeting.as_view()),
    path('register-as-member', RegisterAsMember.as_view()),
    path('user-in-base', UserInBase.as_view()),
    path('leave-meeting', LeaveMeeting.as_view()),
    path('update-meeting', UpdateMeeting.as_view()),
    path('current-meeting', CurrentMeetingView.as_view()),
]   