from django.http import JsonResponse
from django.shortcuts import redirect, render
from .models import Room
from django.contrib.auth.models import Group
from account.models import User
from account.forms import AddUserForm
from django.contrib.auth.decorators import login_required
from django.contrib import  messages
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

  if room.status == Room.WAITING:
    room.status = Room.ACTIVE
    room.agent = request.user
    room.save()


  return render(request , 'chat/room.html',{'room':room})



@login_required
def user_details(request ,uuid):
  user =User.objects.get(pk = uuid)
  rooms = user.Rooms.all()
  return render(request , "chat/user_details.html",{"user":user,"rooms":rooms})




@login_required
def add_user(request):

  if request.user.has_perm("user.add_user"):
    if request.method == "POST" :
      form =AddUserForm(request.POST)
      if form.is_valid():
        user = form.save(commit=False)
        user.is_staff = True
        user.set_password(request.POST.get('password'))
        user.save()

        if user.role ==User.MANAGER:
          group  = Group.objects.get(name = 'managers')
          group.user_set.add(user)
        messages.success(request, " The user is created")
        return redirect('/chat-admin/')  

    else:
      form = AddUserForm()
      print("from add_user")
      return render(request , "chat/add_user.html",{
    'form' :form
  })
  else:
    messages.error(request , "YOU dont have access to create")

  return redirect('/chat-admin/')



