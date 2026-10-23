window.NOTE_CFG={me:'faisal',botTo:'للرجيلي',botName:'الرجيلي',other:'nora',names:{faisal:'أبو خالد',nora:'ست الكل'},ph:'اكتب لها رسالة اليوم',btn:'💌 أرسلها لست الكل',empty:'ما وصلت رسالة اليوم من ست الكل للحين… أكيد جاية 💙'};
(function(){
var CFG=window.NOTE_CFG||{},SC=window.NOTE_SYNC||{},ME=CFG.me,OT=CFG.other,NM=CFG.names||{};
var box=document.getElementById('dailyNote');if(!box)return;
var BASE=SC.ns?'https://mantledb.sh/v2/'+encodeURIComponent(SC.ns)+'/':'';
var KEY=SC.key||'';try{var h=location.hash.match(/[#&]nk=([0-9a-f]{32,})/);if(h){localStorage.setItem('ns_key',h[1]);history.replaceState(null,'',location.pathname+location.search)}KEY=localStorage.getItem('ns_key')||KEY}catch(_){}
var P='ns_'+ME+'_';
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(P+k));return v==null?d:v}catch(_){return d}}
function sv(k,v){try{localStorage.setItem(P+k,JSON.stringify(v))}catch(_){}}
var own=ld('own',[]),ownSeen=ld('seen',null),other=ld('other',{notes:[],seen:null}),dirtyOwn=ld('dirty',false),
    reqs=ld('reqs',[]),reqRemote=ld('reqRemote',[]),dirtyReq=ld('dreq',false),reps=ld('reps',{}),seeds=[],lastErr=false;
var tf=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function stamp(ts){var o={};tf.formatToParts(new Date(ts)).forEach(function(p){o[p.type]=p.value});return {date:o.year+'-'+o.month+'-'+o.day,time:o.hour+':'+o.minute}}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function hash(s){var h=5381;for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36)}
function mk(n){return n.from+'|'+(n.date||'')+'|'+n.text}
function merge(a,b){var m={};(a||[]).concat(b||[]).forEach(function(n){if(n&&n.id&&typeof n.text==='string'){var o=m[n.id];m[n.id]=o?Object.assign({},o,n):n}});return Object.keys(m).map(function(k){return m[k]}).sort(function(x,y){return (x.ts||0)-(y.ts||0)})}
function trim(list,max){list=list.slice(-max);while(list.length>1&&JSON.stringify(list).length>52000)list.shift();return list}
// ---- store (MantleDB, key-protected namespace) ----
function api(method,path,body,keep){
 if(!BASE||!KEY)return Promise.resolve({ok:false,status:0});
 var ac=window.AbortController?new AbortController():null,tm=ac&&setTimeout(function(){ac.abort()},12000);
 return fetch(BASE+path,{method:method,headers:{'X-Mantle-Key':KEY,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,cache:'no-store',keepalive:!!keep,signal:ac?ac.signal:undefined})
 .then(function(r){clearTimeout(tm);return r.text().then(function(t){var j=null;try{j=JSON.parse(t)}catch(_){}return {ok:r.ok,status:r.status,json:j}})})
 .catch(function(){clearTimeout(tm);return {ok:false,status:0}})}
var busy=false;
function flushOwn(){if(!dirtyOwn)return Promise.resolve(true);if(busy)return Promise.resolve(false);busy=true;
 return api('GET','notes/'+ME).then(function(r){
  if(!(r.ok||r.status===404))return false;
  var d=(r.ok&&r.json)||{},m=merge(d.notes,own).map(function(n){var c=Object.assign({},n);delete c.p;return c});
  var s=ownSeen,ds=d.seen;if(ds&&(!s||(ds.at||0)>(s.at||0)))s=ds;
  return api('POST','notes/'+ME,{v:1,notes:trim(m,100),seen:s}).then(function(w){
   if(!w.ok)return false;own=m;ownSeen=s;dirtyOwn=false;sv('own',own);sv('seen',ownSeen);sv('dirty',false);return true})})
 .then(function(ok){busy=false;lastErr=!ok;render();return ok})}
function latestOf(list){return list.length?list[list.length-1]:null}
function pollOther(){return api('GET','notes/'+OT).then(function(r){
 if(r.ok&&r.json&&Array.isArray(r.json.notes)){other={notes:r.json.notes.filter(function(n){return n&&n.id&&typeof n.text==='string'}).map(function(n){return Object.assign({from:OT},n)}),seen:r.json.seen||null};sv('other',other);lastErr=false}
 else if(r.status!==404)lastErr=true;else lastErr=false;
 render();markSeen()})}
function markSeen(){if(document.visibilityState!=='visible')return;var l=latestOf(allNotes().filter(function(n){return n.from===OT&&String(n.id).indexOf('seed-')!==0}));
 if(!l||(ownSeen&&ownSeen.id===l.id))return;ownSeen={id:l.id,at:Date.now()};sv('seen',ownSeen);dirtyOwn=true;sv('dirty',true);flushOwn()}
// ---- requests mirror (optional, to the assistant) ----
var busyR=false,rv=0,rp=null,subs=[];
function notify(){subs.forEach(function(f){try{f()}catch(_){}});try{drawAsk()}catch(_){}}
function flushReq(){if(!dirtyReq)return Promise.resolve(true);if(busyR)return rp||Promise.resolve(false);
 busyR=true;var cap=rv;
 rp=api('GET','req/'+ME).then(function(g){
  if(!(g.ok||g.status===404))return false;
  var m=trim(merge((g.ok&&g.json&&g.json.reqs)||[],reqs),60);
  return api('POST','req/'+ME,{v:1,reqs:m},true).then(function(w){
   if(!w.ok)return false;reqRemote=m;reqs=m;sv('reqs',reqs);sv('reqRemote',reqRemote);if(rv===cap){dirtyReq=false;sv('dreq',false)}return true})})
 .then(function(ok){busyR=false;notify();if(ok&&dirtyReq)return flushReq();return ok});
 return rp}
function req(text,src,meta){text=String(text||'').trim().slice(0,1500);if(!text)return null;
 var now=Date.now(),last=reqs[reqs.length-1];if(last&&last.text===text&&now-last.ts<8000)return last.id;
 var s=stamp(now),r={id:uid(),ts:now,date:s.date,time:s.time,text:text,src:src||'ask',from:ME};
 if(meta)['title','ico','ref','sum'].forEach(function(k){if(meta[k])r[k]=String(meta[k]).slice(0,200)});
 reqs.push(r);rv++;sv('reqs',reqs);dirtyReq=true;sv('dreq',true);notify();flushReq();return r.id}
// status of one request: queue (not stored yet) / sent (stored) / ack / prog / done (set by the assistant via the rep/<me> doc)
var RL={queue:'⏳ بانتظار الاتصال',sent:'✓ وصل',ack:'👀 تم الاستلام',prog:'⏳ قيد التنفيذ',done:'✅ تم'};
function status(id){var r=reps[id];if(r&&RL[r.st])return {k:r.st,label:RL[r.st],text:typeof r.text==='string'?r.text:'',at:r.at||0};
 var k=reqRemote.some(function(x){return x.id===id})?'sent':'queue';return {k:k,label:RL[k],text:'',at:0}}
function pollReps(){if(!reqs.some(function(x){var r=reps[x.id];return !(r&&r.st==='done')}))return Promise.resolve();
 return api('GET','rep/'+ME).then(function(r){if(r.ok&&r.json&&r.json.replies&&typeof r.json.replies==='object'){reps=r.json.replies;sv('reps',reps);notify()}})}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="https://wa.me/"]');if(!a||a.id==='fab')return;
 var m=a.href.match(/[?&]text=([^&]+)/);if(!m)return;try{req(decodeURIComponent(m[1]),'link')}catch(_){}},true);
// ---- rendering (textContent only) ----
var $=function(id){return document.getElementById(id)};
function allNotes(){var seen={},out=[],src=[];seeds.forEach(function(n){src.push(n)});
 other.notes.forEach(function(n){src.push(Object.assign({},n,{from:OT}))});own.forEach(function(n){src.push(Object.assign({},n,{from:ME}))});
 // store versions win over seeds; dedupe by id and by from|date|text
 src.sort(function(a,b){return (String(a.id).indexOf('seed-')===0?0:1)-(String(b.id).indexOf('seed-')===0?0:1)});
 var byK={};src.forEach(function(n){var k=mk(n);if(seen[n.id])return;seen[n.id]=1;if(byK[k]!==undefined){var i=byK[k];if(String(out[i].id).indexOf('seed-')===0){out[i]=n}return}byK[k]=out.length;out.push(n)});
 return out.sort(function(a,b){return (a.ts||0)-(b.ts||0)})}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function whenStr(n){return (n.date||'')+(n.time?' · '+n.time:(n.ts&&n.ts>1e12&&String(n.id).indexOf('seed-')!==0?' · '+stamp(n.ts).time:''))}
function render(){
 var all=allNotes(),m=$('dnMsg'),meta=$('dnMeta'),ul=$('dnHist'),st=$('dnSt');if(!m)return;
 var l=latestOf(all.filter(function(n){return n.from===OT}));
 m.className='dn-msg'+(l?'':' dn-empty');m.textContent=l?l.text:CFG.empty;meta.textContent=l?'— '+(NM[OT]||'')+' · '+whenStr(l):'';
 // seen marker for my notes: other.seen.id is the last of MY notes they opened
 var sn=other.seen&&all.filter(function(n){return n.id===other.seen.id})[0],sts=sn?sn.ts||0:-1;
 ul.textContent='';var rev=all.slice().reverse();
 if(!rev.length)ul.appendChild(el('li','dn-empty','ما فيه رسائل سابقة للحين'));
 rev.forEach(function(n){var li=el('li'),mine=n.from===ME;li.appendChild(el('b',null,NM[n.from]||''));li.appendChild(document.createTextNode(' '));li.appendChild(el('span',null,whenStr(n)));
  if(mine){var seenIt=sn&&(n.ts||0)<=sts;li.appendChild(document.createTextNode(' '));li.appendChild(el('span','dn-tick',n.p?'⏳':(seenIt?'✓✓':'✓')))}
  li.appendChild(el('br'));li.appendChild(document.createTextNode(n.text));ul.appendChild(li)});
 var mine=all.filter(function(n){return n.from===ME}),lm=latestOf(mine),t='';
 if(dirtyOwn&&lm&&lm.p)t='⏳ بانتظار الاتصال — انحفظت في جوالك وتنرسل لحالها';
 else if(lm&&sn&&(lm.ts||0)<=sts)t='✓✓ شافها '+(other.seen.at?'· '+stamp(other.seen.at).time:'');
 else if(lm&&lm.sentNow)t='تم الإرسال ✓';
 else if(lm)t='✓ وصلت — آخر رسالة منك '+(lm.date||'');
 if(lastErr&&!t)t='⚠️ ما قدرت أتصل الحين — بحاول ثاني';
 st.textContent=t}
// ---- UI ----
var css=document.createElement('style');css.textContent='.dn-st{font-size:.85em;min-height:1.5em;margin:6px 2px;opacity:.9}.dn-tick{opacity:.9;font-size:.8em}.dn-ta:disabled,.dn-btn:disabled{opacity:.6}';document.head.appendChild(css);
box.textContent='';
box.appendChild(el('h2',null,'💌 رسالة اليوم'));
var m=el('div','dn-msg');m.id='dnMsg';var me=el('div','dn-meta');me.id='dnMeta';
var ta=el('textarea','dn-ta');ta.id='dnTxt';ta.rows=3;ta.maxLength=500;ta.placeholder=CFG.ph;
var bt=el('button','dn-btn',CFG.btn);bt.id='dnSend';bt.type='button';
var st=el('div','dn-st');st.id='dnSt';st.setAttribute('aria-live','polite');
var dt=el('details','dn-hist');dt.appendChild(el('summary',null,'رسائلنا السابقة'));var ul=el('ul');ul.id='dnHist';dt.appendChild(ul);
[m,me,ta,bt,st,dt].forEach(function(x){box.appendChild(x)});
bt.onclick=function(){var t=ta.value.trim();if(!t)return;var now=Date.now(),s=stamp(now);
 own.push({id:uid(),ts:now,date:s.date,time:s.time,text:t.slice(0,500),p:1});sv('own',own);dirtyOwn=true;sv('dirty',true);ta.value='';
 st.textContent='جاري الإرسال…';render();
 flushOwn().then(function(ok){if(ok){var l=latestOf(own);if(l)l.sentNow=1;render()}})};
// ---- seeds from the old relay JSON (nothing is lost) ----
function side(from){return String(from||'').indexOf(NM[ME])>-1?ME:(String(from||'').indexOf(NM[OT])>-1?OT:null)}
function seedFrom(d){var list=((d&&d.history)||[]).concat(d&&d.text?[d]:[]);
 seeds=list.map(function(x,i){var s=side(x.from);if(!s||!x.text)return null;var ts=Date.parse((x.date||'1970-01-01')+'T00:00:00+03:00')||0;
  return {id:'seed-'+hash(s+'|'+(x.date||'')+'|'+x.text),ts:ts+i,date:x.date||'',text:x.text,from:s}}).filter(Boolean)}
// ---- sync loop ----
function tick(){if(document.visibilityState==='hidden')return;flushOwn().then(function(){return pollOther()});flushReq().then(pollReps)}
render();
fetch('data/daily_note.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).catch(function(){return {}}).then(function(d){seedFrom(d);render();tick()});
setInterval(tick,60000);addEventListener('focus',tick);addEventListener('online',tick);document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')tick()});
// ---- ask-the-assistant box (no WhatsApp): posts to the store, shows status + the assistant's reply ----
var ab=$('askBtn'),at=$('askText'),askSt=null,askL=null;
function drawAsk(){if(!askL)return;askL.textContent='';
 reqs.filter(function(x){return x.src==='ask'}).slice(-5).reverse().forEach(function(x){var s=status(x.id),li=el('li','rq-i');
  li.appendChild(el('span','rq-t',x.text.length>140?x.text.slice(0,140)+'…':x.text));li.appendChild(el('span','rq-c',s.label));
  li.appendChild(el('div','rq-m',(x.date||'')+(x.time?' · '+x.time:'')));
  if(s.text){var r=el('div','rq-r');r.appendChild(el('b',null,'↩️ '+(CFG.botName||'')+': '));r.appendChild(document.createTextNode(s.text));li.appendChild(r)}
  askL.appendChild(li)})}
if(ab&&at){var rcss=document.createElement('style');rcss.textContent='.rq-st{font-size:.9em;min-height:1.4em;margin:8px 2px}.rq-l{list-style:none;margin:8px 0 0;padding:0}.rq-i{border:1px solid rgba(128,128,128,.35);border-radius:12px;padding:8px 10px;margin-bottom:6px;font-size:.9em;line-height:1.8}.rq-c{display:inline-block;font-size:.8em;border:1px solid currentColor;border-radius:999px;padding:0 8px;margin-inline-start:8px;white-space:nowrap}.rq-m{font-size:.75em;opacity:.7}.rq-r{margin-top:4px;padding:6px 8px;border-radius:8px;background:rgba(128,128,128,.16)}';document.head.appendChild(rcss);
 askSt=el('div','rq-st');askSt.id='askSt';askSt.setAttribute('aria-live','polite');askL=el('ul','rq-l');askL.id='askList';
 ab.insertAdjacentElement('afterend',askL);ab.insertAdjacentElement('afterend',askSt);
 ab.onclick=function(){var t=at.value.trim();if(!t)return;var id=req(t,'ask');if(!id)return;at.value='';askSt.textContent='جاري الإرسال…';
  var done=function(){askSt.textContent=status(id).k==='queue'?'⏳ بانتظار الاتصال — انحفظ في جوالك وينرسل لحاله':'✅ تم إرسال طلبك '+(CFG.botTo||'')+' ✓'};
  (rp||Promise.resolve()).then(done,done)};
 drawAsk()}
var fab=$('fab');if(fab&&ab){fab.removeAttribute('href');fab.removeAttribute('target');fab.setAttribute('role','button');
 fab.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var s=$('ask')||ab;s.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(function(){try{at.focus({preventScroll:true})}catch(_){}},400)},true)}
window.NoteSync={req:req,sync:tick,status:status,onUpdate:function(f){subs.push(f)},botTo:CFG.botTo||'',whenSent:function(){return rp||Promise.resolve()}};
})();
