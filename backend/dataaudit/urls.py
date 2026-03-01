"""
URL configuration for dataaudit project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from engine import views as engine_views
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Static Assets serving (Prioritize over SPA)
    path('assets/<path:path>', serve, {
        'document_root': os.path.join(settings.BASE_DIR, '..', 'frontend', 'dist', 'assets'),
    }),
    path('vite.svg', serve, {
        'document_root': os.path.join(settings.BASE_DIR, '..', 'frontend', 'dist'),
        'path': 'vite.svg'
    }),

    # API Routes
    path('api/v1/users/', include('users.urls')),
    path('api/v1/resumes/', include('resumes.urls')),
    path('api/v1/tracking/', include('tracking.urls')),
    path('api/v1/ai/', include('ai_engine.urls')),
    
    # Specific engine routes
    path('engine/', include('engine.urls')),
    
    # Root SPA (Landing Page)
    path('', engine_views.home, name='home'),
    
    # Catch-all for SPA navigation (Dashboard, etc.)
    re_path(r'^.*$', engine_views.home, name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
