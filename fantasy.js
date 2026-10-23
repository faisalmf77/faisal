(function(){
var box=document.getElementById('fpl');if(!box)return;
var TEAM=null,DATA=null,sel=null,tick=null;
var COL={ARS:['#ef0107','#fff'],AVL:['#670e36','#95bfe5'],BOU:['#da291c','#111'],BRE:['#e30613','#fff'],BHA:['#0057b8','#fff'],CHE:['#034694','#fff'],COV:['#59cbe8','#fff'],CRY:['#1b458f','#c4122e'],EVE:['#003399','#fff'],FUL:['#f4f4f4','#111'],HUL:['#f5a12d','#111'],IPS:['#0044aa','#fff'],LEE:['#f4f4f4','#1d428a'],LIV:['#c8102e','#fff'],MCI:['#6cabdd','#fff'],MUN:['#da291c','#fff'],NEW:['#2b2b2b','#fff'],NFO:['#dd0000','#fff'],TOT:['#f4f4f4','#132257'],SUN:['#eb172b','#fff']};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function shirt(club){var c=COL[club]||['#888','#fff'];
 return '<svg viewBox="0 0 44 40" aria-hidden="true"><path d="M14 2 L5 8 L1 18 L9 21 L11 17 L11 38 L33 38 L33 17 L35 21 L43 18 L39 8 L30 2 Q22 9 14 2Z" fill="'+c[0]+'" stroke="rgba(0,0,0,.35)" stroke-width="1"/><path d="M14 2 Q22 9 30 2" fill="none" stroke="'+c[1]+'" stroke-width="2.2"/><path d="M1 18 L9 21 M43 18 L35 21" stroke="'+c[1]+'" stroke-width="2.4"/></svg>'}
function fixOf(p){var d=DATA&&DATA.players&&DATA.players[p.id];
 if(d&&d.fx&&d.fx.length){return {opp:d.fx[0].opp,home:d.fx[0].home,gw:d.fx[0].gw,ko:d.fx[0].kickoff,live:true}}
 return {opp:p.opp,home:p.home,gw:TEAM.gw,ko:null,live:false}}
function flag(p){var d=DATA&&DATA.players&&DATA.players[p.id];if(!d)return '';
 if(d.status==='i'||d.status==='u'||d.status==='s'||d.status==='n')return '<i class="fp-b w">✚</i>';
 if(d.status==='d'||(d.chance!=null&&d.chance<100))return '<i class="fp-b y">!</i>';return ''}
function tile(p,pos){var f=fixOf(p),isC=TEAM.captain===p.id,isV=TEAM.vice===p.id;
 return '<button type="button" class="fp-p'+(sel===p.id?' sel':'')+'" data-id="'+p.id+'">'+
  (pos?'<span class="fp-pos">'+esc(pos)+'</span>':'')+(isC?'<i class="fp-b c">C</i>':isV?'<i class="fp-b v">V</i>':'')+flag(p)+shirt(p.club)+
  '<span class="fp-n">'+esc(p.name)+'</span><span class="fp-f'+(f.home?' h':'')+'">'+esc(f.opp)+' ('+(f.home?'H':'A')+')</span></button>'}
function row(a){return '<div class="fp-row">'+a.map(function(p){return tile(p)}).join('')+'</div>'}
function allP(){return [].concat(TEAM.gk,TEAM.def,TEAM.mid,TEAM.fwd,TEAM.bench)}
function riy(iso){try{return new Intl.DateTimeFormat('ar-SA-u-nu-latn',{timeZone:'Asia/Riyadh',weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',hour12:true}).format(new Date(iso))}catch(e){return iso}}
function detail(id){var p=allP().filter(function(x){return x.id===id})[0];if(!p)return '<span class="m">اضغط على أي لاعب لتفاصيله</span>';
 var d=DATA&&DATA.players&&DATA.players[id],f=fixOf(p),h='<b>'+esc(p.name)+'</b> · '+esc(p.club)+(TEAM.captain===id?' · 👑 كابتن':TEAM.vice===id?' · نائب الكابتن':'')+'<br>';
 h+='المباراة القادمة (الجولة '+esc(f.gw)+'): '+esc(f.opp)+' '+(f.home?'على أرضه':'خارج أرضه');
 if(f.ko)h+='<br><span class="m">'+esc(riy(f.ko))+' بتوقيت الرياض</span>';
 if(d){h+='<br><span class="m">السعر £'+esc(d.price)+'م · الفورم '+esc(d.form)+' · نقاط الموسم '+esc(d.pts)+' · مملوك عند '+esc(d.sel)+'%</span>';
  h+='<br>'+(d.news?'⚠️ '+esc(d.news)+(d.chance!=null?' ('+esc(d.chance)+'%)':''):'✅ جاهز للعب')}
 return h}
function pad(n){return n<10?'0'+n:''+n}
function nextDl(){var now=Date.now(),ev=(DATA&&DATA.events)||[];
 for(var i=0;i<ev.length;i++){if(new Date(ev[i].deadline).getTime()>now)return ev[i]}return null}
function cd(){var el=document.getElementById('fpCd');if(!el)return;var e=nextDl();
 if(!e){el.className='fp-cd late';el.innerHTML='<div class="fp-l">الديدلاين</div><div class="fp-dl">لا يوجد ديدلاين قادم في البيانات</div>';return}
 var ms=new Date(e.deadline).getTime()-Date.now(),s=Math.max(0,Math.floor(ms/1000)),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),sc=s%60;
 el.className='fp-cd'+(ms<3*3600e3?' soon':'');
 el.innerHTML='<div class="fp-l">⏳ الوقت المتبقي على ديدلاين '+esc(e.name.replace('Gameweek','الجولة'))+'</div><div class="fp-cds"><div><b>'+pad(d)+'</b><span>يوم</span></div><div><b>'+pad(h)+'</b><span>ساعة</span></div><div><b>'+pad(m)+'</b><span>دقيقة</span></div><div><b>'+pad(sc)+'</b><span>ثانية</span></div></div><div class="fp-dl">'+esc(riy(e.deadline))+' · بتوقيت الرياض</div>'}
function render(){
 var t=TEAM,a=t.advice||{};
 var h='<h2>⚽ فانتازي · الدوري الإنجليزي</h2><div id="fpCd" class="fp-cd"></div>'+
 '<div class="fp-pitch"><div class="fp-mid"></div>'+row(t.gk)+row(t.def)+row(t.mid)+row(t.fwd)+'</div>'+
 '<div class="fp-bench"><div class="fp-bt">🪑 دكة الاحتياط</div><div class="fp-row">'+t.bench.map(function(p){return tile(p,p.pos)}).join('')+'</div></div>'+
 '<div class="fp-det" id="fpDet">'+detail(sel)+'</div>';
 if(a.points&&a.points.length)h+='<div class="fp-adv"><h3>🧠 '+esc(a.title||'رأي الرجيلي')+'</h3><ul>'+a.points.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>'+
  (a.sources&&a.sources.length?'<div class="fp-src">المصادر: '+a.sources.map(function(s){return '<a href="'+esc(s[1])+'" target="_blank" rel="noopener">'+esc(s[0])+'</a>'}).join('')+'</div>':'')+'</div>';
 h+='<div class="fp-upd">'+(DATA&&DATA.ok?'بيانات الفانتازي الرسمية · تحديث <bdi>'+esc(DATA.updated)+'</bdi>':'بيانات الجدول الحية غير متاحة حالياً — المعروض من تشكيلتك المحفوظة')+'</div>';
 box.innerHTML=h;cd();
 box.onclick=function(e){var b=e.target.closest&&e.target.closest('.fp-p');if(!b)return;sel=+b.dataset.id;render()}}
function load(u){return fetch(u+'?t='+Math.floor(Date.now()/60000),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()})}
Promise.all([load('data/fantasy_team.json'),load('data/fantasy.json').catch(function(){return null})]).then(function(r){TEAM=r[0];DATA=r[1];render();
 clearInterval(tick);tick=setInterval(cd,1000);
 setInterval(function(){load('data/fantasy.json').then(function(d){DATA=d;render()}).catch(function(){})},600000)})
.catch(function(){box.innerHTML='<h2>⚽ فانتازي</h2><div class="na">تعذّر تحميل تشكيلتك</div>'});
})();
