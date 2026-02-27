from django.shortcuts import render, redirect, get_object_or_404
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from .models import AuditSession
from .audit_logic import DataAuditor
import os
import io

def dashboard(request):
    sessions = AuditSession.objects.all().order_by('-created_at')
    return render(request, 'engine/dashboard.html', {'sessions': sessions})

def run_audit_view(request):
    if request.method == 'POST' and request.FILES.get('data_file'):
        uploaded_file = request.FILES['data_file']
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        file_path = fs.path(filename)

        auditor = DataAuditor(file_path)
        report = auditor.run_audit()

        if report:
            session = AuditSession.objects.create(
                file_name=uploaded_file.name,
                row_count=report['summary']['row_count'],
                error_count=report['summary']['error_count'],
                health_score=report['summary']['health_score'],
                json_report=report
            )
            return redirect('audit_result', session_id=session.id)
    
    return redirect('dashboard')

def audit_result(request, session_id):
    session = get_object_or_404(AuditSession, id=session_id)
    return render(request, 'engine/result.html', {'session': session})

def download_cleaned_view(request, session_id):
    session = get_object_or_404(AuditSession, id=session_id)
    
    # In a real app we'd store the file path, for now we re-read the original if it exists
    # or simulate the cleaning for the download
    fs = FileSystemStorage()
    file_path = fs.path(session.file_name) # This is a bit naive but works for the MVP
    
    if not os.path.exists(file_path):
        return HttpResponse("File missing", status=404)

    auditor = DataAuditor(file_path)
    auditor.run_audit()
    cleaned_df = auditor.get_cleaned_data()

    output = io.BytesIO()
    if session.file_name.endswith('.csv'):
        cleaned_df.to_csv(output, index=False)
        content_type = 'text/csv'
    else:
        cleaned_df.to_excel(output, index=False)
        content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    
    output.seek(0)
    response = HttpResponse(output, content_type=content_type)
    response['Content-Disposition'] = f'attachment; filename="cleaned_{session.file_name}"'
    return response

def historical_view(request):
    sessions = AuditSession.objects.all().order_by('-created_at')
    return render(request, 'engine/historical.html', {'sessions': sessions})
