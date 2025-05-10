from django.http import JsonResponse
from django.shortcuts import render
from .models import Room
from account.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
# @csrf_exempt//
@require_POST
def create_room(request,uuid):
  print(f"Received POST to create room: uuid={uuid}")
  name = request.POST.get('name',"")
  url = request.POST.get("url","")

  Room.objects.create(uuid = uuid , client = name,url = url)
  return JsonResponse( { 'message' : "roomCreated"})


@login_required
def admin(request):
  rooms = Room.objects.all()
  users = User.objects.filter(is_staff=True)

  return render(request ,'chat/admin.html', {
    'rooms':rooms,
    'users':users
  })


@login_required
def room(request,uuid):
  room = Room.objects.get(uuid = uuid)

  return render(request , 'chat/room.html',{'room':room})


