from django.db import models

class AuditSession(models.Model):
    file_name = models.CharField(max_length=255)
    row_count = models.IntegerField(default=0)
    error_count = models.IntegerField(default=0)
    health_score = models.FloatField(default=0.0)
    json_report = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_name} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
