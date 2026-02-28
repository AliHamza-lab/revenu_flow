from django.shortcuts import render, redirect, get_object_or_404
from .models import Video, Category
from django.db.models import Q

def home(request):
    videos = Video.objects.all().order_by('-created_at')
    categories = Category.objects.all()
    trending = Video.objects.all().order_by('-views')[:5]
    return render(request, 'engine/home.html', {
        'videos': videos,
        'categories': categories,
        'trending': trending
    })

def watch(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    # Increment view count
    video.views += 1
    video.save()
    
    related = Video.objects.filter(category=video.category).exclude(id=video.id)[:4]
    return render(request, 'engine/watch.html', {
        'video': video,
        'related': related
    })

def search(request):
    query = request.GET.get('q', '')
    if query:
        videos = Video.objects.filter(
            Q(title__icontains=query) | Q(description__icontains=query)
        )
    else:
        videos = Video.objects.none()
    
    return render(request, 'engine/search_results.html', {
        'videos': videos,
        'query': query
    })

def upload_video(request):
    if request.method == 'POST' and request.FILES.get('video_file'):
        title = request.POST.get('title', 'Untitled Video')
        description = request.POST.get('description', '')
        video_file = request.FILES['video_file']
        thumbnail = request.FILES.get('thumbnail')
        category_id = request.POST.get('category')
        
        category = None
        if category_id:
            category = Category.objects.get(id=category_id)
            
        video = Video.objects.create(
            title=title,
            description=description,
            video_file=video_file,
            thumbnail=thumbnail,
            category=category
        )
        return redirect('watch', video_id=video.id)
        
    categories = Category.objects.all()
    return render(request, 'engine/upload.html', {'categories': categories})

def category_videos(request, category_slug):
    category = get_object_or_404(Category, slug=category_slug)
    videos = category.videos.all().order_by('-created_at')
    return render(request, 'engine/home.html', {
        'videos': videos,
        'category_name': category.name
    })

def delete_video(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    # Optional: Delete actual file from storage
    if video.video_file:
        video.video_file.delete()
    if video.thumbnail:
        video.thumbnail.delete()
    video.delete()
    return redirect('home')
