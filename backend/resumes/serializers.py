from rest_framework import serializers
from .models import Resume, ResumeVersion

class ResumeVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeVersion
        fields = ['version_number', 'score', 'changes_analysis', 'created_at']

class ResumeSerializer(serializers.ModelSerializer):
    versions = ResumeVersionSerializer(many=True, read_only=True)

    class Meta:
        model = Resume
        fields = ['id', 'file', 'content_text', 'parsed_data', 'last_score', 'versions', 'created_at']
