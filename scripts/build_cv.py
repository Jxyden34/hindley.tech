"""Rebuild the public CV PDF from the published profile. Requires reportlab."""
from pathlib import Path
import json
from html import escape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

ROOT=Path(__file__).resolve().parents[1]
PROFILE=json.loads((ROOT/'v9/profile.json').read_text(encoding='utf-8'))
OUTPUT=ROOT/'v9/Files/Jayden_Hindley_CV.pdf'
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='CVTitle',fontName='Helvetica-Bold',fontSize=26,leading=30,spaceAfter=8,textColor=colors.HexColor('#1d1d1f')))
styles.add(ParagraphStyle(name='CVBody',fontName='Helvetica',fontSize=11,leading=15,spaceAfter=8,textColor=colors.HexColor('#29292d')))
styles.add(ParagraphStyle(name='CVHeading',fontName='Helvetica-Bold',fontSize=14,leading=18,spaceBefore=16,spaceAfter=9,keepWithNext=True))
styles.add(ParagraphStyle(name='CVRole',fontName='Helvetica-Bold',fontSize=11,leading=15,spaceBefore=8,spaceAfter=4,keepWithNext=True))
styles.add(ParagraphStyle(name='CVSmall',fontName='Helvetica',fontSize=10,leading=13,spaceAfter=6,textColor=colors.HexColor('#52525a')))
story=[]
def p(text,style='CVBody'):story.append(Paragraph(text,styles[style]))
def heading(text):p(text,'CVHeading')
def link(url,label):return '<link href="'+url+'" color="#0066cc">'+escape(label)+'</link>'
def footer(canvas,doc):
 canvas.setFont('Helvetica',9);canvas.setFillColor(colors.HexColor('#52525a'))
 canvas.drawString(48,30,'Jayden Hindley | Infrastructure and automation | November 2026')
 canvas.drawRightString(A4[0]-48,30,str(doc.page))
p('Jayden Hindley','CVTitle')
p('Junior IT Technician | Infrastructure and automation','CVRole')
p('Gomersal, United Kingdom | '+link('mailto:jayden@hindley.tech','jayden@hindley.tech')+'<br/>'+link('https://hindley.tech','hindley.tech')+' | '+link(PROFILE['source'],'linkedin.com/in/jaydenhindley'),'CVSmall')
heading('Profile')
p('Junior IT Technician at the University of Huddersfield, working across technical support, secure infrastructure and automation. Completed the Level 4 DevOps Engineer Apprenticeship with an overall Pass and a Distinction in the professional discussion. Practical work includes PowerShell and Python scripting, monitoring, backups, remote support, documentation and deployments.')
heading('Experience')
for role in PROFILE['experience'][:2]:
 p(escape(role['title'])+' | University of Huddersfield','CVRole')
 p(escape(role['dates']).replace('–','-'),'CVSmall')
 details=role['details']
 if role['title']=='Junior IT Technician':
  p('Build PowerShell and Python automation; support deployments, compatibility testing and user training. Monitor system performance and investigate issues, with secure remote support, backup and recovery work.')
  p('Document infrastructure and procedures, support access controls and data privacy, and contribute to asset audits, equipment planning, vendor coordination and technology workshops.')
 else:p('Supported systems documentation, cybersecurity, backups, monitoring and remote troubleshooting. Contributed to scripts, technology integration, asset audits and user training.')
p('Earlier experience','CVRole')
for r in PROFILE['experience'][2:]:
 p(escape(r['title']+' | '+r['organisation']+' | '+r['dates']).replace('–','-'),'CVSmall')
heading('Practical skills')
p('<b>Work and apprenticeship:</b> PowerShell, Python, technical support, documentation, monitoring, access controls, Microsoft Intune and deployment pipelines.')
p('<b>Personal lab and software:</b> Linux, Proxmox VE, Docker, Bash, rsync, Grafana, Redfish, local AI and MCP integrations. Cloud knowledge includes AZ-400 training; personal projects are distinct from employer deployments.')
story.append(PageBreak())
heading('Selected project evidence')
projects=[
('HPC Monitoring Dashboard','University project: Python and Flask dashboard for lab-machine status, login activity and uptime. Listed in use in a university environment.','hpc-monitoring'),
('Burp Backup System and iDRAC Telegram Bot','Personal infrastructure: separate local and remote backup tiers with rotation and run notifications; Python and Redfish server status, history and guarded power actions.','backup-automation'),
('Engram','Personal software: self-hosted document ingestion, source-aware search, local AI processing and scoped MCP integrations.','engram'),
('Cosmopod OS and Proxmox lab','Personal development and lab work: board-specific Linux images and signed-update tooling; virtual machines, GPU passthrough and automated backups. Cosmopod OS remains in development.','cosmopod-os')]
for title,description,slug in projects:
 p(escape(title),'CVRole');p(escape(description)+' '+link('https://hindley.tech/projects/'+slug,'Read the project evidence'))
heading('Education and training')
for c in PROFILE['credentials']:
 title=c['title'];extra=''
 if title.startswith('BCS Level 4'):
  extra=' Overall Pass; professional discussion Distinction. Firebrand Training, June 2025 - September 2026. Assessment: PowerShell, Intune and deployment pipelines to identify stale profiles and remove legacy Teams installations, with testing, pilot deployment and compliance monitoring.'
 if c['issuer']=='Microsoft':extra=' Training and learning path; not a claim of Microsoft DevOps Expert certification.'
 p('<b>'+escape(title)+'</b> | '+escape(c['issuer'])+' | '+escape(c['date'])+escape(extra))
for edu in PROFILE['education']:
 p(escape(edu['title']+' | '+edu['organisation']+' | '+edu['dates']).replace('–','-'),'CVSmall')
p('Further project scope and current contact details: '+link('https://hindley.tech','hindley.tech'),'CVSmall')
SimpleDocTemplate(str(OUTPUT),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=40,bottomMargin=48,title='Jayden Hindley CV',author='Jayden Hindley').build(story,onFirstPage=footer,onLaterPages=footer)
print(OUTPUT)
