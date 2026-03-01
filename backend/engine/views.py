from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .models import Video, Category
from django.db.models import Q

from django.contrib import messages

def home(request):
    return render(request, 'index.html')
        
    videos = Video.objects.all().order_by('-created_at')
    categories = Category.objects.all()
    trending = Video.objects.all().order_by('-views')[:5]
    return render(request, 'engine/home.html', {
        'videos': videos,
        'categories': categories,
        'trending': trending
    })

def login_view(request):
    if request.method == 'POST':
        u = request.POST.get('username')
        p = request.POST.get('password')
        user = authenticate(username=u, password=p)
        if user:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, "Invalid username or password.")
    return render(request, 'engine/login.html')

def signup_view(request):
    if request.method == 'POST':
        u = request.POST.get('username')
        p = request.POST.get('password')
        if not u or not p:
            messages.error(request, "Username and password are required.")
        elif User.objects.filter(username=u).exists():
            messages.error(request, "This username is already taken.")
        else:
            user = User.objects.create_user(username=u, password=p)
            login(request, user)
            messages.success(request, f"Welcome to Vortex, {u}!")
            return redirect('home')
    return render(request, 'engine/signup.html')

def logout_view(request):
    logout(request)
    messages.success(request, "Successfully logged out.")
    return redirect('home')

def watch(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    video.views += 1
    video.save()
    related = Video.objects.filter(category=video.category).exclude(id=video.id)[:4]
    return render(request, 'engine/watch.html', {'video': video, 'related': related})

def search(request):
    query = request.GET.get('q', '')
    videos = Video.objects.filter(Q(title__icontains=query) | Q(description__icontains=query)) if query else Video.objects.none()
    return render(request, 'engine/search_results.html', {'videos': videos, 'query': query})

@login_required
def upload_video(request):
    if request.method == 'POST' and request.FILES.get('video_file'):
        title = request.POST.get('title', 'Untitled Video')
        description = request.POST.get('description', '')
        video_file = request.FILES['video_file']
        thumbnail = request.FILES.get('thumbnail')
        category_id = request.POST.get('category')
        
        category = Category.objects.get(id=category_id) if category_id else None
            
        video = Video.objects.create(
            title=title,
            description=description,
            video_file=video_file,
            thumbnail=thumbnail,
            category=category,
            uploader=request.user
        )
        return redirect('watch', video_id=video.id)
        
    categories = Category.objects.all()
    return render(request, 'engine/upload.html', {'categories': categories})

@login_required
def category_videos(request, category_slug):
    category = get_object_or_404(Category, slug=category_slug)
    videos = category.videos.all().order_by('-created_at')
    categories = Category.objects.all()
    return render(request, 'engine/home.html', {
        'videos': videos,
        'categories': categories,
        'category_name': category.name
    })

@login_required
def delete_video(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    # Ensure ONLY the uploader or a superuser can delete
    if video.uploader == request.user or request.user.is_superuser:
        if video.video_file: video.video_file.delete()
        if video.thumbnail: video.thumbnail.delete()
        video.delete()
    return redirect('home')
