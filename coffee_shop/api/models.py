from django.db import models

# Create your models here.
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