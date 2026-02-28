from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('watch/<int:video_id>/', views.watch, name='watch'),
    path('search/', views.search, name='search'),
    path('upload/', views.upload_video, name='upload_video'),
    path('category/<slug:category_slug>/', views.category_videos, name='category_videos'),
    path('delete-video/<int:video_id>/', views.delete_video, name='delete_video'),
]
