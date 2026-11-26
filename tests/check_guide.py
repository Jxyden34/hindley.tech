"""Run against the checkout or staged release with its Flask environment."""
from pathlib import Path
import importlib.util
site=Path(__file__).resolve().parents[1]/'v9'
spec=importlib.util.spec_from_file_location('portfolio_guide',site/'API/app.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
client=module.app.test_client()
for question,expected in [
 ('Can I download your CV?','current CV'),
 ("What is Jayden's current job?",'Junior IT Technician'),
 ('Tell me about the Intune assessment','stale user profiles'),
 ('What qualifications does Jayden have?','overall Pass'),
 ('Tell me about education','professional discussion'),
 ('What projects has Jayden built?','Six project stories'),
 ('Tell me about Engram','self-hosted memory'),
 ('Tell me about Cosmopod OS','in development'),
 ('What tools does he use?','evidence matrix')]:
 r=client.post('/api/chat',json={'message':question})
 assert r.status_code==200,(question,r.status_code)
 assert expected in r.json['reply'],(question,r.json)
 assert r.json['mode']=='portfolio-guide'
for bad in [None,[],{}, {'message':''},{'message':17},{'message':'x'*2001}]:
 assert client.post('/api/chat',json=bad).status_code==400,bad
print('PASS: CV, career, assessment, qualifications, education, six stories, new projects, skills and invalid input.')
