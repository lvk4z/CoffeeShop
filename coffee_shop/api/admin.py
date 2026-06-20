from django.contrib import admin
from .models import Guest, Drink, Menu, Meeting, Orders


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ('username', 'house', 'is_staff', 'date_joined')
    list_filter = ('house',)
    search_fields = ('username',)


@admin.register(Drink)
class DrinkAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    filter_horizontal = ('drinks',)


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('id', 'event_date', 'host', 'status', 'menu')
    list_filter = ('host', 'status')


@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = ('meeting', 'guest', 'drink')
    list_filter = ('meeting', 'guest')
