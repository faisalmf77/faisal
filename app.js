const LK='fhqAppts',locAp=()=>{try{return JSON.parse(localStorage.getItem(LK)||'[]')}catch(e){return[]}},allAp=()=>APPTS.concat(locAp());
const TZ='Asia/Riyadh',$=id=>document.getElementById(id),C=window.HQ_CONFIG||{};
const PRAY={Fajr:'الفجر',Dhuhr:'الظهر',Asr:'العصر',Maghrib:'المغرب',Isha:'العشاء'};
const NA='<div class="na">غير متاح حالياً</div>';
const WMO=c=>c==0?['☀️','صحو']:c<=3?['⛅','غائم جزئياً']:c<=48?['🌫️','ضباب']:c<=67?['🌧️','مطر']:c<=82?['🌦️','زخات']:['⛈️','عاصفة'];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nowR=()=>{const p=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(new Date());const o={};p.forEach(x=>o[x.type]=x.value);return{date:`${o.year}-${o.month}-${o.day}`,min:(+o.hour%24)*60+ +o.minute,sec:+o.second}};
const toMin=t=>{const[h,m]=t.split(':').map(Number);return h*60+m};
const fmt=t=>{let[h,m]=t.split(':').map(Number);const s=h<12?'ص':'م';h=h%12||12;return `${h}:${String(m).padStart(2,'0')} ${s}`};
const rTime=iso=>new Date(iso).toLocaleString('ar-SA-u-nu-latn-ca-gregory',{timeZone:TZ,weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'});
async function getJSON(u,k){try{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw 0;const j=await r.json();localStorage.setItem(k,JSON.stringify(j));return j}catch(e){const c=localStorage.getItem(k);return c?JSON.parse(c):null}}
let APPTS=[],PT=null;
function tick(){const n=nowR(),d=new Date();
 $('clock').textContent=d.toLocaleTimeString('ar-SA-u-nu-latn',{timeZone:TZ,hour:'numeric',minute:'2-digit'});
 $('date').textContent=d.toLocaleDateString('ar-SA-u-ca-islamic-umalqura',{timeZone:TZ,weekday:'long',day:'numeric',month:'long',year:'numeric'})+' • '+d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{timeZone:TZ,day:'numeric',month:'long'});
 const h=n.min/60;$('greet').textContent=(h<12?'صباح الخير':'مساء الخير')+' يا أبو محمد';
 if(PT){const nx=Object.keys(PRAY).map(k=>({k,m:toMin(PT[k])})).find(p=>p.m*60>n.min*60+n.sec)||{k:'Fajr',m:toMin(PT.Fajr)+1440};
  const s=nx.m*60-(n.min*60+n.sec);$('pName').textContent=PRAY[nx.k];$('pCount').textContent='بعد '+[s/3600|0,(s%3600)/60|0,s%60].map(x=>String(x).padStart(2,'0')).join(':')}}
function sched(){const n=nowR(),AL=allAp(),it=AL.filter(a=>a.date===n.date);
 if(PT)Object.keys(PRAY).forEach(k=>it.push({start:PT[k],title:'صلاة '+PRAY[k],pr:1}));it.sort((a,b)=>toMin(a.start)-toMin(b.start));
 $('today').innerHTML=it.map(a=>{const s=toMin(a.start),e=a.end?toMin(a.end):s+(a.pr?20:45),c=n.min>=e?'past':n.min>=s?'now':'';return `<li class="${a.pr?'pr':''} ${c}"><span class="tm">${fmt(a.start)}</span><span>${esc(a.title)}${a.place?' • '+esc(a.place):''}</span>${a.lid?`<button class="del" data-lid="${a.lid}">✕</button>`:''}</li>`}).join('');
 const up=AL.filter(a=>a.date>n.date).sort((x,y)=>(x.date+x.start).localeCompare(y.date+y.start)).slice(0,8);
 $('upcoming').innerHTML=up.map(a=>`<li><span class="tm">${a.date.slice(5)}</span><span>${esc(a.title)} • ${fmt(a.start)}${a.place?' • '+esc(a.place):''}</span>${a.lid?`<button class="del" data-lid="${a.lid}">✕</button>`:''}</li>`).join('')||`<li class="empty">ما فيه مواعيد مسجلة — أرسلها للرجيلي ويرتبها لك</li>`}
const chg=c=>c==null?'<span class="chg">—</span>':`<span class="chg ${c>=0?'up':'dn'}">${c>=0?'▲':'▼'} ${Math.abs(c).toFixed(2)}%</span>`;
const num=(p,cur)=>p==null?'—':(+p).toLocaleString('en-US',{maximumFractionDigits:p<1?4:2})+(cur==='SAR'?' ر.س':cur==='USD'?' $':'');
const upd=j=>j&&j.updated?`آخر تحديث: ${j.updated} (بتوقيت الرياض)`:'';
const news=(el,a)=>{$(el).innerHTML=a&&a.length?a.map(x=>`<li><a href="${esc(x.link)}" target="_blank" rel="noopener">${esc(x.title)}</a><br><small>${esc(x.source)} • ${esc(x.date)}</small></li>`).join(''):`<li>${NA}</li>`};
const TEAM={'Al Nassr':'النصر','Al Hilal':'الهلال','Al Ittihad':'الاتحاد','Al Ahli':'الأهلي'};const tn=t=>TEAM[t]||t;
async function data(){
 const m=await getJSON('data/markets.json','mk');$('markets').innerHTML=m&&m.ok?m.items.map(x=>`<div><span class="lbl">${esc(x.label)}</span><b>${x.err?'غير متاح':num(x.price,x.cur)}</b>${chg(x.chg)}</div>`).join(''):NA;$('mkU').textContent=upd(m);
 const s=await getJSON('data/stocks.json','stk');$('stocks').innerHTML=s&&s.ok?s.items.map(x=>`<li><span class="s">${esc(x.sym)}</span><span class="n">${esc(x.label)}</span><span class="p">${x.err?'غير متاح':num(x.price,x.cur)}</span>${chg(x.chg)}</li>`).join(''):`<li>${NA}</li>`;$('stkU').textContent=upd(s);
 const e=await getJSON('data/econ.json','econ');news('econS',e&&e.ok&&e.saudi);news('econG',e&&e.ok&&e.global);
 const sp=await getJSON('data/spa.json','spa');news('spaL',sp&&sp.ok&&sp.items);$('spaU').textContent=upd(sp);
 const u=await getJSON('data/uqn.json','uqn');news('uqnL',u&&u.ok&&u.items);$('uqnU').textContent=upd(u);
 const r=await getJSON('data/realestate.json','re');$('reS').innerHTML=r&&r.ok?`مؤشرات وزارة العدل (البورصة العقارية): <span class="dn">غير متاحة حالياً</span> — <a href="${r.link}" target="_blank" style="color:var(--gold)">افتح البورصة العقارية</a><br>آخر أخبار السوق العقاري في الرياض:`:NA;news('reL',r&&r.ok&&r.items);
 const f=await getJSON('data/football.json','fb');
 if(f&&f.ok){const N=f.nassr,mt=(x,l)=>x?`<div class="match"><div class="t">${l} • ${rTime(x.date)}</div><div class="sc">${tn(x.home)} ${x.state==='post'?`${x.hs} - ${x.as}`:'×'} ${tn(x.away)}</div></div>`:'';
  $('nassr').innerHTML=`<h3>النصر 💛 ${N.pos?`— المركز ${N.pos.rank} في روشن (${N.pos.points} نقطة من ${N.pos.gamesPlayed} مباريات)`:''}</h3>`+mt(N.next,'المباراة الجاية')+mt(N.last,'آخر نتيجة');
  $('pl').innerHTML=f.pl.length?f.pl.map(x=>`<li><span class="tm">${rTime(x.date).split('،').pop()}</span><span>${esc(x.home)} ${x.state!=='pre'?`<b>${x.hs}-${x.as}</b>`:'×'} ${esc(x.away)}</span></li>`).join(''):'<li class="empty">ما فيه مباريات اليوم</li>';
  $('plT').innerHTML=f.plTop.map(x=>`<tr><td>${x.rank}</td><td>${esc(x.team)}</td><td>${x.gamesPlayed} م</td><td>${x.points}</td></tr>`).join('')}else{$('nassr').innerHTML=NA}
 const a=await getJSON('data/appointments.json','ap');APPTS=(a&&a.items)||[];
 const ad=await getJSON('data/adhkar.json','adh');if(ad){$('adhL').innerHTML=ad.morning.map((x,i)=>`<div class="dk"><b style="color:var(--gold)">${esc(x[0])}</b><div>${esc(x[1])}</div><button data-c="${x[2]||1}">${x[2]||1}</button></div>`).join('');
  $('adhL').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const c=+b.dataset.c-1;b.dataset.c=c;b.textContent=c>0?c:'✓';if(c<=0)b.disabled=true}}
 sched()}
async function wx(){const w=await getJSON('https://api.open-meteo.com/v1/forecast?latitude=24.7136&longitude=46.6753&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FRiyadh','wx');
 if(w){const[i,d]=WMO(w.current.weather_code);$('wTemp').textContent=`${i} ${Math.round(w.current.temperature_2m)}°`;$('wDesc').textContent=`${d} • ${Math.round(w.daily.temperature_2m_min[0])}°–${Math.round(w.daily.temperature_2m_max[0])}°`}else $('wDesc').textContent='غير متاح حالياً'}
async function pt(){const[y,m,d]=nowR().date.split('-');const j=await getJSON(`https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=24.7136&longitude=46.6753&method=4`,'pt');if(j){PT={};Object.keys(PRAY).forEach(k=>PT[k]=j.data.timings[k].slice(0,5))}sched();tick()}
$('noraL').href=C.noraUrl||'#';tick();setInterval(tick,1000);data();wx();pt();
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
