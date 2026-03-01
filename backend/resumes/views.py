from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from ai_engine.services import AICareerEngine

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        resume = self.get_object()
        job_description = request.data.get('job_description', '')
        
        if not job_description:
            return Response({"error": "Job description is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        engine = AICareerEngine()
        analysis = engine.get_ats_score(resume.content_text, job_description)
        
        resume.last_score = analysis['score']
        resume.parsed_data = analysis
        resume.save()
        
        return Response(analysis)
