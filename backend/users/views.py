from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Count, Avg, Max
from django.utils import timezone
from datetime import timedelta
from .models import Profile
from .serializers import ProfileSerializer
from resumes.models import Resume
from tracking.models import JobApplication, Interview
from tracking.serializers import RecentApplicationSerializer


class SignupView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('firstName', '')
        last_name = request.data.get('lastName', '')

        if not username or not password or not email:
            return Response({'error': 'Please provide username, email and password'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })


class DashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # ── Core counts ─────────────────────────────────────────────────────────
        resume_count = Resume.objects.filter(user=user).count()
        app_count = JobApplication.objects.filter(user=user).count()
        interview_count = Interview.objects.filter(application__user=user).count()

        # ── Intelligence Score: average of last 3 resume scores (0–100) ─────────
        recent_scores = (
            Resume.objects.filter(user=user, last_score__gt=0)
            .order_by('-updated_at')
            .values_list('last_score', flat=True)[:3]
        )
        if recent_scores:
            intel_score = round(sum(recent_scores) / len(recent_scores), 1)
        else:
            intel_score = 0.0

        # ── Top resume score ─────────────────────────────────────────────────────
        top_resume_agg = Resume.objects.filter(user=user).aggregate(top=Max('last_score'))
        top_resume_score = top_resume_agg['top'] or 0

        # ── Application status breakdown ─────────────────────────────────────────
        status_qs = (
            JobApplication.objects.filter(user=user)
            .values('status')
            .annotate(count=Count('id'))
        )
        status_breakdown = {
            'WISHLIST': 0, 'APPLIED': 0, 'INTERVIEWING': 0, 'OFFER': 0, 'REJECTED': 0
        }
        for entry in status_qs:
            status_breakdown[entry['status']] = entry['count']

        # ── Success rate: (OFFER count / total apps) × 100 ──────────────────────
        offer_count = status_breakdown.get('OFFER', 0)
        success_rate = round((offer_count / app_count) * 100, 1) if app_count > 0 else 0.0

        # ── Weekly activity: applications per day for last 7 days ────────────────
        today = timezone.now().date()
        weekly_activity = []
        day_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            count = JobApplication.objects.filter(
                user=user,
                created_at__date=day
            ).count()
            weekly_activity.append({
                'day': day_labels[day.weekday()],
                'date': str(day),
                'count': count,
            })

        # ── Recent applications (last 5) ─────────────────────────────────────────
        recent_apps_qs = (
            JobApplication.objects.filter(user=user)
            .order_by('-created_at')[:5]
        )
        recent_apps_data = RecentApplicationSerializer(recent_apps_qs, many=True).data

        return Response({
            'resumeCount': resume_count,
            'applicationCount': app_count,
            'interviewCount': interview_count,
            'intelligenceScore': intel_score,
            'topResumeScore': top_resume_score,
            'successRate': success_rate,
            'statusBreakdown': status_breakdown,
            'weeklyActivity': weekly_activity,
            'recentApplications': recent_apps_data,
        })


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

