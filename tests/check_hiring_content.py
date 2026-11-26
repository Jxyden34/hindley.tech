"""Run with Python; HTML checks use BeautifulSoup, JS checks use Node."""
from pathlib import Path
from urllib.parse import urlsplit,unquote
from collections import Counter
import json,subprocess,os,sys
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'v9'
pages=['index.html','about.html','skills.html','project.html','contact.html']+[f'projects/{name}.html' for name in ['hpc-monitoring','backup-automation','idrac-automation','engram','cosmopod-os','proxmox']]
docs={name:BeautifulSoup((SITE/name).read_text(encoding='utf-8'),'html.parser') for name in pages}
node=os.environ.get('NODE_BINARY','node')
for name,s in docs.items():
 assert len(s.select('h1'))==1,name
 assert s.select_one('main#main-content') and s.select_one('a.skip-link'),name
 ids=[tag['id'] for tag in s.select('[id]')];assert len(ids)==len(set(ids)),name
 assert s.select_one('.nav-links a[download]') and s.select_one('.nav-links a[href="/contact"]'),name
 assert s.select_one('.footer-inner a[href="mailto:jayden@hindley.tech"]'),name
 assert s.select_one('#chatbot-container[hidden]'),name
 assert s.select_one('link[href^="/css/hiring.css?v="]'),name
 for i,script in enumerate(s.select('script:not([src])')):
  subprocess.run([node,'--check'],input=script.get_text(),text=True,check=True,capture_output=True)
 for tag,attr in [('a','href'),('img','src'),('script','src'),('link','href')]:
  for element in s.select(f'{tag}[{attr}]'):
   u=urlsplit(element[attr])
   if u.scheme or u.netloc or not u.path.startswith('/'):continue
   path=unquote(u.path).lstrip('/') or 'index.html'
   target=SITE/path
   if not target.is_file():target=SITE/(path+'.html')
   assert target.is_file(),(name,element[attr])
   if u.fragment and target.suffix=='.html':
    linked=BeautifulSoup(target.read_text(encoding='utf-8'),'html.parser')
    assert linked.find(id=unquote(u.fragment)),(name,element[attr])
home=docs['index.html']
assert home.select_one('.hero-visual img')['src']=='/images/HPC.png'
assert home.select_one('.studio-intro a[download]') and home.select_one('.studio-intro a[href="mailto:jayden@hindley.tech"]')
assert 'AI-generated illustration' not in home.main.get_text()
projects=docs['project.html'];cards=projects.select('.project-card')
assert len(cards)==22 and len(projects.select('.project-scope'))==22
assert len({c.h2.get_text(strip=True).casefold() for c in cards})==22
assert len(projects.select('.project-cta[href^="/projects/"]'))==6
assert projects.select_one('[data-filter="monitoring"]')
for name in pages[5:]:
 s=docs[name]
 assert len(s.select('.case-sections > section'))==4,name
 assert s.select_one('#next') and s.select_one('.case-summary') and s.select_one('.project-tags'),name
about=docs['about.html']
titles=[h.get_text(' ',strip=True) for h in about.select('.credential-card h3')]
assert len(titles)==len(set(titles))==6
assert not any('ISC2' in title for title in titles)
assert about.select_one('.earlier-learning') and not about.select_one('#courses-heading')
assert len(about.select('.profile-entry'))==8
assert about.select_one('#qualification-devops')
profile=json.loads((SITE/'profile.json').read_text(encoding='utf-8'))
assert len(profile['education'])==2 and len(profile['credentials'])==6
assert len(profile['earlier_learning'])==1 and profile['courses']==[]
skills=docs['skills.html']
assert len(skills.select('.skills-matrix tbody tr'))==5
assert len(skills.select('button.skill-button'))==35
for name in ['common','projects','skills','chatbot']:
 subprocess.run([node,'--check',str(SITE/'js'/f'{name}.js')],check=True,capture_output=True)
print('PASS: 11 page shells; internal files and anchors; six stories; 22 outcomes; credential deduplication; 35 native skill controls; JavaScript syntax.')
