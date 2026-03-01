from django.db import models
from django.contrib.auth.models import User

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('WISHLIST', 'Wishlist'),
        ('APPLIED', 'Applied'),
        ('INTERVIEWING', 'Interviewing'),
        ('OFFER', 'Offer'),
        ('REJECTED', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job_title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WISHLIST')
    job_description = models.TextField(blank=True)
    match_score = models.IntegerField(default=0)
    applied_at = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.job_title} at {self.company}"

class Interview(models.Model):
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='interviews')
    date = models.DateTimeField()
    round_number = models.IntegerField(default=1)
    feedback_score = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    ai_feedback = models.TextField(blank=True)

    def __str__(self):
        return f"Interview for {self.application}"
