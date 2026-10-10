document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('chatbot-toggle');
  const panel = document.getElementById('chatbot-container');
  const messages = document.getElementById('chatbot-messages');
  const input = document.getElementById('user-input');
  const send = document.getElementById('send-btn');
  const footer = document.getElementById('chat-mode');
  let busy = false;

  function setOpen(open) {
    panel.hidden = !open;
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close portfolio assistant' : 'Open portfolio assistant');
    if (open) input.focus(); else toggle.focus();
  }
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  document.getElementById('chatbot-close').addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); }
  });
  function append(sender, text, links = []) {
    const el = document.createElement('div');
    el.className = `message ${sender}`;
    el.textContent = text;
    for (const link of links) {
      if (!/^\/(?:about|skills|project|security|contact|projects\/[a-z-]+)$/.test(link.href)) continue;
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.label;
      el.appendChild(a);
    }
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || busy) return;
    if (text.length > 2000) { input.setCustomValidity('Keep your question under 2,000 characters.'); input.reportValidity(); return; }
    input.setCustomValidity('');
    busy = true;
    send.disabled = true;
    document.getElementById('chat-suggestions').hidden = true;
    append('user', text);
    input.value = '';
    const pending = append('bot', 'Finding an answer…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: text}), signal: controller.signal
      });
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (typeof data.reply !== 'string') throw new Error('Unexpected response');
      pending.remove();
      append('bot', data.reply, data.links || []);
      footer.textContent = data.mode === 'ai' ? 'AI-assisted answer. Check important details with Jayden.' : 'Portfolio guide · answers from the public site.';
    } catch {
      pending.remove();
      append('bot', 'The assistant is unavailable right now. You can still browse the projects or email Jayden directly.', [{href:'/project',label:'Browse projects'},{href:'/contact',label:'Contact Jayden'}]);
    } finally {
      clearTimeout(timeout);
      busy = false;
      send.disabled = false;
      if (!panel.hidden) input.focus();
    }
  }
  send.addEventListener('click', sendMessage);
  input.addEventListener('input', () => input.setCustomValidity(''));
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); sendMessage(); } });
  document.querySelectorAll('[data-chat-question]').forEach(button => button.addEventListener('click', () => {
    input.value = button.dataset.chatQuestion;
    sendMessage();
  }));
});
