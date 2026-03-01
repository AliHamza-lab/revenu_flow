from rest_framework import serializers
from .models import JobApplication, Interview

class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    interviews = InterviewSerializer(many=True, read_only=True)

    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['user']

class RecentApplicationSerializer(serializers.ModelSerializer):
    """Lightweight serializer used exclusively by the dashboard stats endpoint."""
    class Meta:
        model = JobApplication
        fields = ['id', 'company', 'job_title', 'status', 'match_score', 'applied_at', 'created_at']
