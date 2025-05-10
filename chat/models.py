from django.db import models

# Create your models here.
from account.models import User

class Messages(models.Model):
  body = models.TextField(default='')
  sent_by = models.CharField(max_length= 255)
  created_at = models.DateTimeField(auto_now_add=True)
  created_by = models.ForeignKey(User,blank = True ,null=True, on_delete= models.SET_NULL)


  class Meta :
    ordering = ["created_at"]
  

  def __str__(self):
    return f'{self.sent_by}'
  

class Room(models.Model):

  WAITING  = 'Waiting'
  ACTIVE = "active"
  CLOSED = "Closed"

  CHOICES_STATUS = (
    (WAITING , 'waiting'),
    (ACTIVE , 'Active'),
    (CLOSED , 'Closed'),
  )

  uuid = models.CharField(max_length=255)
  client = models.CharField(max_length=255)
  agent = models.ForeignKey(User ,related_name= "Rooms" , blank =True , null= True ,on_delete=models.SET_NULL)
  messages = models.ManyToManyField(Messages,blank=True)
  url = models.CharField(max_length=255 , blank= True, null= True)
  status = models.CharField(max_length=20 ,choices= CHOICES_STATUS,default=WAITING)
  created_at = models.DateTimeField(auto_now_add=True)


  
  class Meta :
    ordering = ["-created_at"]
  

  def __str__(self):
    return f'{self.client} - {self.uuid}'



