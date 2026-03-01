from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .services import AICareerEngine

class LinkedInOptimizeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_profile = request.data.get('current_profile', '')
        if not current_profile:
            return Response({"error": "Profile text is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        engine = AICareerEngine()
        optimization = engine.optimize_linkedin(current_profile)
        return Response(optimization)

class ATSScoreView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_text = request.data.get('resume_text', '')
        job_description = request.data.get('job_description', '')
        
        if not resume_text or not job_description:
            return Response({"error": "Resume and Job Description are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        engine = AICareerEngine()
        analysis = engine.get_ats_score(resume_text, job_description)
        return Response(analysis)
