// Run the real filter script against minimal DOM fixtures, including URL/back navigation.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../v9/project.html'),'utf8');
function element(dataset){return {dataset,hidden:false,attrs:{},events:{},classList:{toggle(){}},setAttribute(n,v){this.attrs[n]=v},addEventListener(n,fn){this.events[n]=fn}}}
const cards=[...html.matchAll(/<article\b[^>]*class="project-card"[^>]*>/g)].map(m=>element({category:m[0].match(/data-category="([^"]+)"/)[1]}));
const buttons=[...html.matchAll(/<button\b[^>]*data-filter="([^"]+)"[^>]*>/g)].map(m=>element({filter:m[1]}));
const count={textContent:''};const events={};
const location={href:'https://hindley.tech/project?category=monitoring',search:'?category=monitoring'};
const context={URL,URLSearchParams,location,history:{pushState(_s,_t,url){location.href=url.href;location.search=url.search}},window:{addEventListener(n,fn){events[n]=fn}},document:{querySelectorAll(s){return s==='.project-card'?cards:buttons},getElementById(){return count},addEventListener(_n,fn){fn()}}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../v9/js/projects.js'),'utf8'),context);
assert.equal(cards.length,22);assert.equal(cards.filter(c=>!c.hidden).length,5);
assert.equal(count.textContent,'Showing 5 monitoring projects');
buttons.find(b=>b.dataset.filter==='ai').events.click();assert.equal(cards.filter(c=>!c.hidden).length,9);assert.equal(location.search,'?category=ai');
buttons.find(b=>b.dataset.filter==='all').events.click();assert.equal(cards.filter(c=>!c.hidden).length,22);assert.equal(location.search,'');
location.search='?category=web';events.popstate();assert.equal(cards.filter(c=>!c.hidden).length,2);
location.search='?category=unknown';events.popstate();assert.equal(cards.filter(c=>!c.hidden).length,22);
console.log('PASS: Monitoring/AI/Web filters, All reset, shareable URL, history navigation and invalid category fallback.');
