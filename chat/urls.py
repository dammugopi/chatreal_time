from django.urls import path

from . import views

app_name = "chat"

urlpatterns = [
    path('create_room/<str:uuid>/',views.create_room, name = "create_room"),
    path("chat-admin/",views.admin ,name= 'admin' ),
    path("chat-admin/add_user/",views.add_user,name = "add_user"),
    path("chat-admin/user/<uuid:uuid>",views.user_details ,name="user_details"),

    # remember to write the input values at the end ot he url because it matches with the pattern
    path("chat-admin/<str:uuid>/",views.room ,name= 'room' ),
    
]