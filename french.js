(function(){
var box=document.getElementById('french');if(!box)return;
var CFG=Object.assign({theme:'f',intro:'',finish:'🎉 أحسنت! خلصت درس اليوم',foot:''},window.FR_CFG||{});
box.classList.add('fr-'+CFG.theme);
var HAS_TTS=('speechSynthesis' in window)&&('SpeechSynthesisUtterance' in window);
if(!HAS_TTS)box.classList.add('fr-nosp');
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function dayN(s){var p=String(s).split('-');return Math.floor(Date.UTC(+p[0],+p[1]-1,+p[2])/864e5)}
function todayStr(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(e){return new Date(Date.now()+10800000).toISOString().slice(0,10)}}
function ls(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var D=null,cur=0,tIdx=0,done=ls('frDone',{}),best=ls('frBest',{}),answered={},msg='';
function streak(){var days={},k;for(k in done)days[done[k]]=1;var t=todayStr(),n=dayN(t),c=0;
 if(!days[t])n-=1;
 while(true){var d=new Date(n*864e5).toISOString().slice(0,10);if(days[d]){c++;n--}else break}return c}
function doneCount(){return Object.keys(done).length}
// ---- speech
var voice=null;
function pickVoice(){try{var vs=speechSynthesis.getVoices()||[];voice=vs.filter(function(v){return /^fr[-_]FR/i.test(v.lang)})[0]||vs.filter(function(v){return /^fr/i.test(v.lang)})[0]||null}catch(e){}}
if(HAS_TTS){pickVoice();try{speechSynthesis.addEventListener('voiceschanged',pickVoice)}catch(e){}}
function clean(t){return String(t).replace(/\(e\)/g,'').replace(/…/g,', ').replace(/\s*\/\s*/g,', ').replace(/\s+/g,' ')}
function say(t,btn){
 if(!HAS_TTS){return}
 try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(clean(t));u.lang='fr-FR';u.rate=.85;if(voice)u.voice=voice;
  if(btn){btn.classList.add('on');u.onend=u.onerror=function(){btn.classList.remove('on')}}
  speechSynthesis.speak(u)}catch(e){}}
// ---- render
function item(x){return '<div class="fr-it"><div class="fr-tx"><span class="fr-f">'+esc(x.fr)+'</span><span class="fr-p">'+esc(x.pr)+'</span><span class="fr-m">'+esc(x.ar)+'</span></div><button type="button" class="fr-sp" data-s="'+esc(x.fr)+'" aria-label="استمع">🔊</button></div>'}
function render(){
 var L=D.lessons,n=L.length,l=L[cur],isToday=cur===tIdx,dn=!!done[l.n],h='<h2>'+(CFG.title||'🇫🇷 دروس الفرنسي')+'</h2>';
 if(CFG.intro)h+='<div class="fr-hint">'+esc(CFG.intro)+'</div>';
 h+='<div class="fr-stats"><span class="fr-chip">'+(CFG.theme==='n'?'🩵':'🔥')+' '+streak()+' يوم متتالي</span><span class="fr-chip">✔ '+doneCount()+' من '+n+' درس</span></div>';
 h+='<div class="fr-bar"><i style="width:'+Math.round(doneCount()/n*100)+'%"></i></div>';
 h+='<div class="fr-nav"><button type="button" id="frPrev"'+(cur<=0?' disabled':'')+'>→ الدرس السابق</button><button type="button" id="frTod" class="fr-today">درس اليوم</button><button type="button" id="frNext"'+(cur>=n-1?' disabled':'')+'>الدرس التالي ←</button></div>';
 h+='<div class="fr-head"><span class="fr-no">الدرس '+l.n+' من '+n+'</span>'+(isToday?'<span class="fr-badge">درس اليوم</span>':'')+(dn?'<span class="fr-badge ok">✔ مكتمل</span>':'')+'<div class="fr-title">'+esc(l.title)+'</div></div>';
 h+='<div class="fr-hint">النطق بالحروف العربية تقريبي، اضغط 🔊 وتسمع النطق الأصلي.</div>';
 h+='<h3>📝 كلمات الدرس</h3>'+l.words.map(item).join('');
 h+='<h3>💬 جمل نطبقها</h3>'+l.sents.map(item).join('');
 h+='<h3>🗣️ حوار صغير</h3><div class="fr-dl"><div class="fr-lb">يقولون لك:</div>'+item(l.dlg.say)+'<div class="fr-lb">ترد:</div>'+item(l.dlg.reply).replace('border-bottom','border-bottom')+'</div>';
 h+='<h3>🎯 اختبر نفسك</h3><div id="frQz">'+l.quiz.map(function(q,qi){
  return '<div class="fr-q" data-qi="'+qi+'"><div class="fr-qt">'+(qi+1)+'. '+esc(q.q)+'</div>'+q.o.map(function(o,oi){return '<button type="button" class="fr-o'+(/^[A-Za-z]/.test(o)?' fo':'')+'" data-oi="'+oi+'">'+esc(o)+'</button>'}).join('')+'<div class="fr-fb"></div></div>'}).join('')+'<div id="frSc"></div></div>';
 h+='<button type="button" id="frDone" class="fr-done'+(dn?' dn':'')+'">'+(dn?'✔ خلصت هذا الدرس':'✔ خلصت الدرس')+'</button><div class="fr-msg" id="frMsg">'+esc(msg)+'</div>';
 if(CFG.foot)h+='<div class="fr-foot">'+esc(CFG.foot)+'</div>';
 box.innerHTML=h;
 if(answered[l.n])Object.keys(answered[l.n]).forEach(function(qi){mark(qi,answered[l.n][qi],true)});
 bind();
}
function mark(qi,oi,silent){
 var l=D.lessons[cur],q=l.quiz[qi],qe=box.querySelector('.fr-q[data-qi="'+qi+'"]');if(!qe)return;
 var bs=qe.querySelectorAll('.fr-o');
 bs.forEach(function(b,i){b.disabled=true;if(i===q.a)b.classList.add('good');else if(i===+oi)b.classList.add('bad')});
 qe.querySelector('.fr-fb').textContent=(+oi===q.a?q.ok:q.no);
 score(l)}
function score(l){
 var a=answered[l.n]||{},k=Object.keys(a);if(k.length<l.quiz.length)return;
 var s=0;k.forEach(function(qi){if(+a[qi]===l.quiz[qi].a)s++});
 var t=l.quiz.length,m=s===t?(CFG.theme==='n'?'ما شاء الله عليك، كلها صح 🩵':'ممتاز! كلها صح 🌟'):s>=2?'حلو، قريبة من الكمال 👏':'ولا يهمك، عيد الدرس وجرب مرة ثانية 💪';
 var el=box.querySelector('#frSc');if(el)el.innerHTML='<div class="fr-score">نتيجتك '+s+' من '+t+' · '+m+'</div>';
 if(!(best[l.n]>=s)){best[l.n]=s;lsSet('frBest',best)}}
function bind(){
 var l=D.lessons[cur],n=D.lessons.length;
 box.querySelectorAll('.fr-sp').forEach(function(b){b.onclick=function(){say(b.getAttribute('data-s'),b)}});
 box.querySelectorAll('.fr-o').forEach(function(b){b.onclick=function(){var qe=b.closest('.fr-q'),qi=qe.getAttribute('data-qi');
  answered[l.n]=answered[l.n]||{};if(answered[l.n][qi]!=null)return;answered[l.n][qi]=+b.getAttribute('data-oi');mark(qi,answered[l.n][qi])}});
 function go(i){cur=Math.max(0,Math.min(n-1,i));msg='';render();box.scrollIntoView({behavior:'smooth',block:'start'})}
 box.querySelector('#frPrev').onclick=function(){go(cur-1)};
 box.querySelector('#frNext').onclick=function(){go(cur+1)};
 box.querySelector('#frTod').onclick=function(){go(tIdx)};
 box.querySelector('#frDone').onclick=function(){
  if(!done[l.n]){done[l.n]=todayStr();lsSet('frDone',done);msg=CFG.finish+' · '+(streak())+' '+(streak()===1?'يوم':'يوم متتالي')}
  else msg='سبق وخلصت هذا الدرس ✔';
  render()}
}
function start(d){D=d;var n=d.lessons.length,diff=dayN(todayStr())-dayN(d.start);tIdx=diff<0?0:diff%n;cur=tIdx;render()}
box.innerHTML='<h2>'+(CFG.title||'🇫🇷 دروس الفرنسي')+'</h2><div class="fr-hint">…</div>';
fetch('data/french.json?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
 if(d&&d.lessons&&d.lessons.length){try{localStorage.setItem('frData',JSON.stringify(d))}catch(e){}start(d)}else throw 0;
}).catch(function(){var c=ls('frData',null);if(c&&c.lessons)start(c);else box.innerHTML='<h2>🇫🇷 دروس الفرنسي</h2><div class="na" style="color:#d9534f;text-align:center;padding:8px">تعذّر تحميل الدروس، جرّب بعد شوي</div>'});
})();
