from django.urls import path
from .views import MeetingView, CreateMeetingView, GetMeeting, UserInBase, RegisterAsMember, LeaveMeeting, UpdateMeeting

urlpatterns = [
    path('meeting', MeetingView.as_view()),
    path('create-meeting', CreateMeetingView.as_view()),
    path('get-meeting', GetMeeting.as_view()),
    path('register-as-member', RegisterAsMember.as_view()),
    path('user-in-base', UserInBase.as_view()),
    path('leave-meeting', LeaveMeeting.as_view()),
    path('update-meeting', UpdateMeeting.as_view(), name='update-meeting'),
]   