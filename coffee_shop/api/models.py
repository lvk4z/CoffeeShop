from django.db import models
from django.contrib.auth.models import AbstractUser

class Drink(models.Model):
    name = models.CharField(max_length=25)
    description = models.CharField(max_length=200, blank=True, default=" ")
    image = models.ImageField(upload_to='Drink_images/', blank=True, null=True)

    def __str__(self):
        return self.name
    
class Menu(models.Model):
    drinks = models.ManyToManyField(Drink)

class Meeting(models.Model):
    event_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    TOOKPLACE = "TP"
    POSTPONED = "PO"
    PLANNED = "PL"
    STATUS_CHOICES = [
        (TOOKPLACE, "odbyło się"),
        (POSTPONED, "przełożone"),
        (PLANNED, "zaplanowane"),
    ]
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default=PLANNED)
    MICZKI = "M"
    ZEGAROWIE = "Z"
    STASZKI = "S"
    KRAKOWSCY = "K"
    HOST_CHOICES = [
        (MICZKI, "W domu nr 17f"),
        (ZEGAROWIE, "W domu nr 17"),
        (STASZKI, "W domu nr 17a"),
        (KRAKOWSCY, "W domu nr 136a")
    ]
    host = models.CharField(max_length=1, choices=HOST_CHOICES)
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, null=True, blank=True)

class Guest(AbstractUser):
    MICZEK = "M"
    ZEGAR = "Z"
    STASZEK = "S"
    KRAKOWSKI = "K"
    HOUSELESS = "H"
    HOUSES = [
        (MICZEK, "House of M"),
        (ZEGAR, "Hosuse of ZT"),
        (STASZEK, "House of ZS"),
        (KRAKOWSKI, "House of K"),
        (HOUSELESS, "Houseless")
    ]
    house = models.CharField(max_length=1, choices=HOUSES, default=HOUSELESS)

class Orders(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    drink = models.ForeignKey(Drink, on_delete=models.CASCADE)