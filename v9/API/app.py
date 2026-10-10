"""Portfolio guide: answers from public site content, without an AI provider."""
from pathlib import Path
from html.parser import HTMLParser
import re
import json
from flask import Flask, request, jsonify

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024
SITE = Path(__file__).resolve().parent.parent

class PublicContent(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skills = []
        self.text = []
        self.omit = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'): self.omit += 1
        if tag == 'button' and 'skill-button' in attrs.get('class', '').split():
            self.skills.append((attrs.get('data-name',''), attrs.get('data-description',''), attrs.get('data-related','/project')))
    def handle_endtag(self, tag):
        if tag in ('script', 'style') and self.omit: self.omit -= 1
    def handle_data(self, data):
        if not self.omit and data.strip(): self.text.append(data.strip())

def page_content(name):
    parser = PublicContent()
    parser.feed((SITE / name).read_text(encoding='utf-8'))
    return parser

def answer(message):
    q = message.casefold()
    links = []
    # Shared public profile facts keep career answers consistent with the About page.
    if any(word in q for word in ('experience', 'career', 'education', 'about jayden', 'who is', 'job', 'role', 'qualification', 'certificate', 'certification', 'credential', 'apprentice', 'training', 'intune', 'stale profile', 'teams installation')):
        profile = json.loads((SITE / 'profile.json').read_text(encoding='utf-8'))
        if any(word in q for word in ('intune', 'stale profile', 'teams installation')):
            reply = profile['education'][0]['details'][2]
        elif any(word in q for word in ('qualification', 'certificate', 'certification', 'credential', 'training')):
            reply = 'Jayden completed the BCS Level 4 DevOps Engineer Apprenticeship in September 2026 (overall Pass; professional discussion Distinction). His listed qualifications and training also include BCS data privacy, governance and policy in AI, CCSK v5 Plus, Microsoft AZ-400 training, and Cisco Computer Hardware and Introduction to Cybersecurity. The ISC2 Candidate entry expired in May 2025; it is candidate status. The About page has dates and available credential links.'
        elif any(word in q for word in ('education', 'apprentice')):
            reply = 'Jayden completed the Level 4 DevOps Engineer Apprenticeship with Firebrand Training, June 2025–September 2026: overall Pass, with a Distinction in the professional discussion. His assessment project automated stale-profile and legacy Teams remediation using PowerShell, Microsoft Intune and deployment pipelines. Earlier education includes T-level Computer Science at Leeds City College (2021–2023) and GCSE studies at BBG Academy (2016–2021).'
        else:
            reply = f"Jayden is a {profile['role']} at {profile['employer']} (since {profile['role_since']}). He was an Apprentice IT Technician there from August 2023 to July 2025, and previously volunteered in IT support. His work includes documentation, cybersecurity, monitoring, backups, remote support, PowerShell and Python automation, deployments, user training and asset management. Earlier experience includes Copy Concept retail work, Cub Scout volunteering and freelance penetration testing."
        return reply, [{'href':'/about','label':'Explore experience and qualifications'},{'href':'/skills','label':'Browse professional skills'}]
    if any(word in q for word in ('contact','email','hire','collaborat','speaking','get in touch')):
        return "You can email Jayden at jayden@hindley.tech about infrastructure, automation or a technical project. The Contact page opens a draft in your email app so you can review and send it. The portfolio says he usually replies within 24–48 hours.", [{'href':'/contact','label':'Contact Jayden'}]
    if any(word in q for word in ('backup','burp','rsync','pigz','recovery')):
        return "Jayden's Burp Backup System combines Bash, rsync and pigz with rotation, Telegram notifications, and separate local and remote backup tiers. It keeps run results visible and provides more than one place to recover a copy.", [{'href':'/projects/backup-automation','label':'Read the backup case study'}]
    if any(word in q for word in ('idrac','redfish','dell','power action')):
        return "The iDRAC Telegram Bot brings Dell server management into chat using Python and Redfish APIs. It includes server status, graphs, history and safe power actions. It is listed as an ongoing project.", [{'href':'/projects/idrac-automation','label':'Read the iDRAC case study'}]
    if any(word in q for word in ('hpc','lab machine','flask','uptime dashboard')):
        return "The HPC Monitoring Dashboard is a Python and Flask application that pings lab machines, parses login logs, and shows status and uptime in one web dashboard. The portfolio lists it as in use in a university environment.", [{'href':'/projects/hpc-monitoring','label':'Read the HPC case study'}]
    if any(word in q for word in ('skills','toolkit','tech stack','tools','technologies')):
        return "Jayden's toolkit spans infrastructure (Linux, Proxmox and Docker), automation (PowerShell, Python and Bash), security and networking, and local AI and observability. The Skills page groups the tools and includes a short description of each.", [{'href':'/skills','label':'Explore the skills'},{'href':'/project','label':'See the projects'}]
    if any(word in q for word in ('project','built','portfolio','examples','work on')):
        return "Three featured builds are the HPC Monitoring Dashboard, the Burp Backup System and the iDRAC Telegram Bot. Other projects cover 3D printing automation, local AI, Proxmox, n8n and more. The featured case studies explain the problem, the build and what it enables.", [{'href':'/project','label':'Browse all projects'}]
    for name, description, related in page_content('skills.html').skills:
        # Match actual tool names, not substrings inside unrelated words.
        if re.search(r'(?<!\w)' + re.escape(name.casefold()) + r'(?!\w)', q):
            return f"{name}: {description}\n\nYou can explore the related work in the portfolio.", [{'href':related,'label':'Explore related work'},{'href':'/skills','label':'Browse skills'}]
    if any(word in q for word in ('security','fail2ban','honeypot','ban','threat')):
        return "The Security page shows recorded Fail2Ban bans and honeypot activity. Counts cover records retained by the collector, not a fixed 24-hour window. The page checks every 60 seconds; timestamps use Europe/London time and IP geolocation is approximate.", [{'href':'/security','label':'View the security dashboard'}]
    if any(word in q for word in (' ai','ai ','ollama','model','comfy','localai')):
        return "Jayden's AI projects include a local AI stack, ComfyUI workflows and n8n automation. This chat is a portfolio guide, so it answers from the public site rather than a generative AI model.", [{'href':'/project','label':'Explore AI projects'}]
    return "I'm a guide to Jayden's public portfolio. I can help with projects, skills, experience or contact details. Try asking about HPC monitoring, backup automation or the iDRAC bot. For details that aren't published here, contact Jayden directly.", [{'href':'/project','label':'Explore projects'},{'href':'/contact','label':'Contact Jayden'}]

@app.post('/api/chat')
def chat():
    data = request.get_json(silent=True)
    if not isinstance(data, dict): return jsonify(error='Send a JSON question.'), 400
    if 'error_log' in data:
        # Legacy telemetry client acknowledgement; no visitor-supplied log storage.
        return jsonify(reply='Acknowledged',mode='portfolio-guide')
    message = data.get('message')
    if not isinstance(message,str) or not message.strip() or len(message)>2000:
        return jsonify(error='Use a question between 1 and 2,000 characters.'), 400
    try:
        reply,links=answer(message.strip())
    except (OSError,ValueError):
        reply='The portfolio content is temporarily unavailable. Please use the Contact page to reach Jayden.'
        links=[{'href':'/contact','label':'Contact Jayden'}]
    return jsonify(reply=reply,links=links,mode='portfolio-guide')

@app.errorhandler(413)
def too_large(_error):
    return jsonify(error='That question is too long.'),413

if __name__=='__main__':
    app.run(host='127.0.0.1',port=5000)
