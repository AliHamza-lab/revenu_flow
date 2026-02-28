import multiprocessing

# Gunicorn configuration for AWS EC2 (Ubuntu 24.04)
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
threads = 2
timeout = 120
accesslog = "-"
errorlog = "-"
loglevel = "info"
wsgi_app = "dataaudit.wsgi:application"
