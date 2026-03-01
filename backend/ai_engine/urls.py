from django.urls import path
from .views import LinkedInOptimizeView, ATSScoreView

urlpatterns = [
    path('linkedin-optimize/', LinkedInOptimizeView.as_view(), name='linkedin-optimize'),
    path('ats-score/', ATSScoreView.as_view(), name='ats-score'),
]
