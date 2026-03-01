import urllib.request
import json

BASE = 'http://localhost:8000/api/v1'

# Step 1: Get token
print("Step 1: Login...")
req = urllib.request.Request(
    f'{BASE}/users/login/',
    data=json.dumps({'username': 'hamza_test', 'password': 'TestPassword123'}).encode(),
    headers={'Content-Type': 'application/json'}
)
with urllib.request.urlopen(req, timeout=10) as r:
    data = json.loads(r.read())

token = data.get('token', '')
print(f"Token: {token[:20]}...")

# Step 2: Create job application
print("Step 2: Creating application...")
req2 = urllib.request.Request(
    f'{BASE}/tracking/',
    data=json.dumps({'company': 'OpenAI', 'job_title': 'Senior AI Research Engineer', 'status': 'APPLIED'}).encode(),
    headers={'Content-Type': 'application/json', 'Authorization': f'Token {token}'}
)
with urllib.request.urlopen(req2, timeout=10) as r2:
    result = json.loads(r2.read())

print("SUCCESS! Application created:")
print(json.dumps(result, indent=2))
