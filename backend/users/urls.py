from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, SignupView, LoginView, DashboardStatsView

router = DefaultRouter()
router.register(r'profile', ProfileViewSet)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]
