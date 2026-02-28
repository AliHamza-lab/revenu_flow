from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('audit/', views.run_audit_view, name='run_audit'),
    path('result/<int:session_id>/', views.audit_result, name='audit_result'),
    path('download/<int:session_id>/', views.download_cleaned_view, name='download_cleaned'),
    path('re-run/<int:session_id>/', views.re_run_audit_view, name='re_run_audit'),
    path('historical/', views.historical_view, name='historical'),
    path('delete/<int:session_id>/', views.delete_session_view, name='delete_session'),
]
