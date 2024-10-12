from django.contrib import admin

# Register your models here.
from .models import Player, Session, Turn, Drawing

admin.site.register(Player)
admin.site.register(Session)
admin.site.register(Turn)
admin.site.register(Drawing)
