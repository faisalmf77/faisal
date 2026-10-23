(function(){
var box=document.getElementById('concierge');if(!box)return;
var CFG=Object.assign({theme:'f',bot:'الرجيلي',prefix:'طلب للرجيلي (صفحتي): ',wa:'966590900178',tripDate:'2027-03-26',
 title:'🛎️ الكونسيرج',intro:'',rule:'',payNote:'',send:'أرسل للرجيلي 🛎️',me:'FAISAL MOHAMMED F ALMOAMMAR',
 pax:[{n:'FAISAL MOHAMMED F ALMOAMMAR',l:'فيصل'},{n:'NORAH SULAIMAN A AL THUNAYYAN',l:'نورة'}],hmBoth:true},window.CG_CFG||{});
if(window.HQ_CONFIG&&window.HQ_CONFIG.tripDate&&!(window.CG_CFG&&window.CG_CFG.tripDate))CFG.tripDate=window.HQ_CONFIG.tripDate;
box.classList.add('cgt-'+CFG.theme);
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ls(k,d){try{var v=JSON.parse(localStorage.getItem('cg_'+k));return v==null?d:v}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem('cg_'+k,JSON.stringify(v))}catch(e){}}
function todayStr(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(e){return new Date(Date.now()+10800000).toISOString().slice(0,10)}}
var AM=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
var WD=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
function fmtDate(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');if(!m)return s||'';var d=new Date(+m[1],+m[2]-1,+m[3]);return s+' ('+WD[d.getDay()]+')'}
var ST=[['new','جديد','🆕'],['prog','قيد التنفيذ','⏳'],['done','تم الحجز','✅']];
var QD=[['أسبن (Aspen)','🏔️',CFG.tripDate],['ميامي (Miami)','🌴',''],['نيويورك (New York)','🗽','']];
var SEATS=['عادي','VIP','ضيافة','أفضل متاح','الأرخص'];
var URG={k:'urg',l:'الأولوية',t:'chips',o:['عادي','مستعجل ⚡'],def:'عادي'};
var CATS=[
{k:'flight',ico:'✈️',t:'طيران',d:'ذهاب وعودة، درجة، مسافرين',title:'حجز طيران',sum:['from','to','dep'],f:[
 {k:'trip',l:'نوع الرحلة',t:'chips',o:['ذهاب وعودة','ذهاب فقط','وجهات متعددة'],def:'ذهاب وعودة'},
 {k:'from',l:'من',t:'text',req:1,ph:'مثال: الرياض',def:'الرياض (RUH)'},
 {k:'to',l:'إلى',t:'text',req:1,ph:'المدينة أو المطار',quick:1},
 {k:'dep',l:'تاريخ الذهاب',t:'date',req:1,qd:1},
 {k:'ret',l:'تاريخ العودة',t:'date',min:'dep',req:1,show:function(v){return v.trip==='ذهاب وعودة'}},
 {k:'legs',l:'تفاصيل المسارات',t:'area',req:1,ph:'مثال: الرياض ← نيويورك 1 مارس، نيويورك ← ميامي 5 مارس...',show:function(v){return v.trip==='وجهات متعددة'}},
 {k:'flex',l:'مرونة التواريخ',t:'chips',o:['تواريخ ثابتة','± يوم','± 3 أيام'],def:'تواريخ ثابتة'},
 {k:'cabin',l:'الدرجة',t:'chips',o:['اقتصادي','اقتصادي مميز','رجال أعمال','درجة أولى']},
 {k:'pax',l:'المسافرون',t:'pax',req:1},
 {k:'pref',l:'تفضيلات',t:'multi',o:['طيران مباشر','أقل سعر','أفضل توقيت','شنطة إضافية','مقاعد جنب بعض','وجبة خاصة']},
 {k:'air',l:'شركة طيران مفضلة (اختياري)',t:'text',ph:'مثال: Delta، السعودية'},
 {k:'bud',l:'الميزانية (اختياري)',t:'text',ph:'مثال: حتى 30,000 ريال للشخصين'},
 {k:'note',l:'ملاحظات',t:'area',ph:'أي شي ثاني تبي ينتبه له'},URG]},
{k:'hotel',ico:'🏨',t:'فنادق',d:'مدينة، تواريخ، ضيوف، فخامة',title:'حجز فندق',sum:['city','cin','cout'],f:[
 {k:'city',l:'المدينة / الوجهة',t:'text',req:1,ph:'مثال: أسبن',quick:1},
 {k:'name',l:'فندق محدد (اختياري)',t:'text',ph:'مثال: The Little Nell'},
 {k:'cin',l:'تسجيل الدخول',t:'date',req:1,qd:1},
 {k:'cout',l:'تسجيل الخروج',t:'date',min:'cin',req:1},
 {k:'guests',l:'عدد الضيوف',t:'num',min:1,max:12,def:2},
 {k:'rooms',l:'عدد الغرف',t:'num',min:1,max:6,def:1},
 {k:'style',l:'النوع والفخامة',t:'chips',o:['فخم 5 نجوم','بوتيك','منتجع','شقق فندقية','اقتصادي']},
 {k:'must',l:'لازم يكون فيه',t:'multi',o:['فطور','إطلالة','سبا','مسبح','قريب من المطار','سرير كينغ','غرف متصلة','وصول متأخر','موقف سيارة']},
 {k:'pax',l:'اسم النزيل (اختياري)',t:'pax'},
 {k:'bud',l:'الميزانية لليلة (اختياري)',t:'text',ph:'مثال: حتى 2,500 ريال لليلة'},
 {k:'note',l:'ملاحظات',t:'area',ph:'مناسبة، ديكور، طلب خاص...'},URG]},
{k:'rest',ico:'🍽️',t:'مطاعم',d:'مدينة، وقت، عدد، مناسبة',title:'حجز مطعم',sum:['name','city','date','time'],f:[
 {k:'city',l:'المدينة',t:'text',req:1,ph:'مثال: الرياض',def:'الرياض',quick:1},
 {k:'name',l:'مطعم محدد (اختياري)',t:'text',ph:'اتركه فاضي وأنا أرشح لك'},
 {k:'date',l:'التاريخ',t:'date',req:1},
 {k:'time',l:'الوقت',t:'time',req:1,def:'20:00'},
 {k:'party',l:'عدد الأشخاص',t:'num',min:1,max:30,def:2},
 {k:'cui',l:'نوع المطبخ',t:'multi',o:['سعودي','إيطالي','ياباني / سوشي','مشاوي / ستيك','فرنسي','هندي','مأكولات بحرية','أي شي']},
 {k:'occ',l:'المناسبة',t:'chips',o:['عشاء رومانسي','عيد ميلاد','ذكرى','اجتماع عمل','عادي']},
 {k:'seat',l:'الجلسة',t:'chips',o:['داخلي','خارجي','زاوية هادئة','غرفة خاصة']},
 {k:'note',l:'ملاحظات',t:'area',ph:'حساسية أكل، كيك، ترتيب خاص...'},URG]},
{k:'ride',ico:'🚗',t:'مشاوير وسيارات',d:'سائق، تأجير، ليموزين',title:'مشوار / تأجير سيارة',sum:['kind','from','date'],f:[
 {k:'kind',l:'نوع الخدمة',t:'chips',o:['سيارة مع سائق','تأجير سيارة','ليموزين المطار','VIP / سيارة فخمة'],def:'سيارة مع سائق'},
 {k:'from',l:'موقع الاستلام',t:'text',req:1,ph:'الحي / الفندق / المطار'},
 {k:'to',l:'الوجهة',t:'text',req:1,ph:'إلى وين',show:function(v){return v.kind!=='تأجير سيارة'}},
 {k:'date',l:'التاريخ',t:'date',req:1},
 {k:'time',l:'الوقت',t:'time',req:1,def:'18:00'},
 {k:'ret',l:'تاريخ الإرجاع',t:'date',min:'date',req:1,show:function(v){return v.kind==='تأجير سيارة'}},
 {k:'party',l:'عدد الأشخاص',t:'num',min:1,max:12,def:2},
 {k:'car',l:'نوع السيارة',t:'chips',o:['سيدان','SUV','فان','فخمة']},
 {k:'note',l:'ملاحظات',t:'area',ph:'شنط، كرسي طفل، رقم رحلة...'},URG]},
{k:'tix',ico:'🎟️',t:'تذاكر وفعاليات',d:'مباريات، حفلات، عروض',title:'تذاكر وفعاليات',sum:['kind','event','date'],f:[
 {k:'kind',l:'النوع',t:'chips',o:['مباراة','حفلة','عرض / مسرح','فعالية','ترفيه']},
 {k:'event',l:'الحدث',t:'text',req:1,ph:'مثال: مباراة النصر في الرياض'},
 {k:'city',l:'المدينة',t:'text',ph:'مثال: الرياض'},
 {k:'date',l:'التاريخ (إذا معروف)',t:'date'},
 {k:'qty',l:'عدد التذاكر',t:'num',min:1,max:20,def:2},
 {k:'seat',l:'الفئة',t:'chips',o:SEATS},
 {k:'bud',l:'الميزانية (اختياري)',t:'text',ph:'مثال: حتى 1,500 ريال للتذكرة'},
 {k:'note',l:'ملاحظات',t:'area',ph:'جنب بعض، بوابة معينة...'},URG]},
{k:'trip',ico:'🧳',t:'باقة رحلة كاملة',d:'طيران + فندق + تنقلات + فعاليات',title:'باقة رحلة كاملة',sum:['dest','start','end'],f:[
 {k:'dest',l:'الوجهة',t:'text',req:1,ph:'مثال: أسبن',quick:1},
 {k:'start',l:'تاريخ السفر',t:'date',req:1,qd:1},
 {k:'end',l:'تاريخ العودة',t:'date',min:'start',req:1},
 {k:'pax',l:'المسافرون',t:'pax',req:1},
 {k:'occ',l:'المناسبة',t:'chips',o:['شهر العسل','ذكرى','إجازة','عمل']},
 {k:'parts',l:'وش تبي أرتب؟',t:'multi',o:['✈️ طيران','🏨 فندق','🚗 تنقلات','🍽️ مطاعم','🎟️ فعاليات','🛂 تأشيرة / تأمين'],def:['✈️ طيران','🏨 فندق','🚗 تنقلات']},
 {k:'style',l:'الأسلوب',t:'chips',o:['فخم','مريح','اقتصادي','مغامرة','رومانسي']},
 {k:'bud',l:'الميزانية الإجمالية (اختياري)',t:'text',ph:'مثال: 100,000 ريال'},
 {k:'note',l:'ملاحظات',t:'area',ph:'أمور تحبونها أو تتجنبونها'},URG]},
{k:'special',ico:'💎',t:'تجربة خاصة / هدية',d:'مفاجأة، هدية، ترتيب مناسبة',title:'تجربة خاصة / هدية',sum:['kind','for','date'],f:[
 {k:'kind',l:'النوع',t:'chips',o:['هدية','مفاجأة','تجربة خاصة','ترتيب مناسبة','كيك / حلا']},
 {k:'for',l:'لمين؟',t:'text',ph:'الاسم أو الصلة'},
 {k:'date',l:'التاريخ المطلوب',t:'date',req:1},
 {k:'city',l:'المدينة / عنوان التوصيل',t:'text'},
 {k:'idea',l:'وش الفكرة؟',t:'area',req:1,ph:'اوصف اللي في بالك، وإذا ما عندك فكرة أرشح لك'},
 {k:'bud',l:'الميزانية (اختياري)',t:'text'},
 {k:'note',l:'ملاحظات',t:'area'},URG]},
{k:'free',ico:'✍️',t:'طلب حر',d:'أي شي ثاني تبيه',title:'طلب حر',sum:['text'],f:[
 {k:'text',l:'اكتب طلبك',t:'area',req:1,ph:'اكتب أي طلب أو حجز بالتفصيل'},URG]}
];
function cat(k){for(var i=0;i<CATS.length;i++)if(CATS[i].k===k)return CATS[i]}
// ---------------- state
var view='home',cur=null,vals={},refId='',err='',toastT=null,BK=null;
function newRef(){var d=todayStr().replace(/-/g,'').slice(2);return 'CG-'+d+'-'+Math.random().toString(36).slice(2,5).toUpperCase()}
function paxAll(){var c=ls('pax',[]);return CFG.pax.map(function(p){return {n:p.n,l:p.l,c:0}}).concat(c.map(function(n){return {n:n,l:n,c:1}}))}
function defVals(c,pre){var v={};c.f.forEach(function(f){
 if(f.t==='pax')v[f.k]=(f.req?[CFG.me]:[]);
 else if(f.t==='multi')v[f.k]=(f.def||[]).slice();
 else if(f.t==='num')v[f.k]=f.def;
 else v[f.k]=f.def||''});
 for(var k in (pre||{}))v[k]=pre[k];return v}
function visible(f){return !f.show||f.show(vals)}
// ---------------- field html
function chipsH(f){var cur=vals[f.k],mu=f.t==='multi';
 return '<div class="cg-chips" data-k="'+f.k+'" data-m="'+(mu?1:0)+'">'+f.o.map(function(o){var on=mu?cur.indexOf(o)>-1:cur===o;
  return '<button type="button" class="cg-chip'+(on?' on':'')+'" data-v="'+esc(o)+'">'+esc(o)+'</button>'}).join('')+'</div>'}
function paxH(f){var sel=vals[f.k]||[];
 return '<div class="cg-chips cg-pax" data-k="'+f.k+'">'+paxAll().map(function(p){var on=sel.indexOf(p.n)>-1;
  return '<span class="cg-pw"><button type="button" class="cg-chip cg-px'+(on?' on':'')+'" data-v="'+esc(p.n)+'">'+esc(p.l)+(p.c?'':'<small>'+esc(p.n)+'</small>')+'</button>'+(p.c?'<button type="button" class="cg-pxx" data-v="'+esc(p.n)+'" aria-label="حذف">✕</button>':'')+'</span>'}).join('')+
  '</div><div class="cg-padd"><input type="text" dir="ltr" class="cg-pin" placeholder="NAME AS IN PASSPORT" autocapitalize="characters" autocomplete="off"><button type="button" class="cg-pxa">＋ أضف اسم</button></div><div class="cg-hint">الأسماء الجديدة تنحفظ في هذا الجهاز فقط</div>'}
function fieldH(f){var v=vals[f.k],h='<div class="cg-f" data-f="'+f.k+'"'+(visible(f)?'':' hidden')+'><label>'+esc(f.l)+(f.req?' <b class="cg-rq">*</b>':'')+'</label>';
 if(f.t==='text')h+='<input type="text" class="cg-in" data-k="'+f.k+'" value="'+esc(v)+'" placeholder="'+esc(f.ph||'')+'" autocomplete="off">';
 else if(f.t==='area')h+='<textarea class="cg-in" rows="3" data-k="'+f.k+'" placeholder="'+esc(f.ph||'')+'">'+esc(v)+'</textarea>';
 else if(f.t==='date')h+='<input type="date" class="cg-in" data-k="'+f.k+'" value="'+esc(v)+'" min="'+todayStr()+'">';
 else if(f.t==='time')h+='<input type="time" class="cg-in" data-k="'+f.k+'" value="'+esc(v)+'">';
 else if(f.t==='num')h+='<div class="cg-num" data-k="'+f.k+'"><button type="button" class="cg-st" data-d="-1" aria-label="أقل">−</button><b>'+v+'</b><button type="button" class="cg-st" data-d="1" aria-label="أكثر">＋</button></div>';
 else if(f.t==='chips'||f.t==='multi')h+=chipsH(f);
 else if(f.t==='pax')h+=paxH(f);
 if(f.quick)h+='<div class="cg-chips cg-q" data-q="'+f.k+'">'+QD.map(function(q,i){return '<button type="button" class="cg-chip cg-qc" data-i="'+i+'">'+q[1]+' '+esc(q[0].split(' (')[0])+'</button>'}).join('')+'</div>';
 return h+'</div>'}
// ---------------- message
function build(){var c=cur,L=[];
 c.f.forEach(function(f){if(!visible(f))return;var v=vals[f.k],s;
  if(f.t==='pax'){if(!v||!v.length)return;s=v.length===1?v[0]:'\n'+v.map(function(n,i){return (i+1)+'. '+n}).join('\n')+'\n(العدد: '+v.length+')'}
  else if(f.t==='multi'){if(!v||!v.length)return;s=v.join('، ')}
  else if(f.t==='num')s=String(v);
  else if(f.t==='date')s=v?fmtDate(v):'';
  else s=String(v||'').trim();
  if(!s||(f.k==='urg'&&s==='عادي'))return;
  if(f.k==='urg')s='مستعجل ⚡';
  L.push('• '+f.l.replace(/ \(.*?\)$/,'')+':'+(s[0]==='\n'?'':' ')+s)});
 var t=CFG.prefix+c.ico+' '+c.title+'\n🔖 رقم الطلب: '+refId+'\n──────────\n'+L.join('\n')+'\n──────────\n📌 '+CFG.payNote;
 return t}
function summary(){var c=cur,p=[];c.sum.forEach(function(k){var f=null;c.f.forEach(function(x){if(x.k===k)f=x});var v=vals[k];if(!v||!f||!visible(f))return;
 p.push(f.t==='date'?(+v.slice(8))+' '+AM[+v.slice(5,7)-1]:String(v).split('\n')[0].slice(0,40))});return p.join(' · ')||c.title}
function waUrl(t){return 'https://wa.me/'+CFG.wa+(t?'?text='+encodeURIComponent(t):'')}
// ---------------- views
function homeH(){var h='<h2>'+esc(CFG.title)+'</h2><div class="cg-hint">'+esc(CFG.intro)+'</div><div class="cg-rule">📌 '+esc(CFG.rule)+'</div>';
 h+='<div class="cg-hm"><div class="cg-sec">💙 شهر العسل — اختصار سريع</div><div class="cg-chips">'+
  QD.map(function(q,i){return '<button type="button" class="cg-chip cg-hmc" data-i="'+i+'">'+q[1]+' '+esc(q[0].split(' (')[0])+(q[2]?' · 26 مارس 2027':'')+'</button>'}).join('')+'</div></div>';
 h+='<div class="cg-cats">'+CATS.map(function(c){return '<button type="button" class="cg-cat" data-k="'+c.k+'"><span class="cg-ci">'+c.ico+'</span><b>'+esc(c.t)+'</b><small>'+esc(c.d)+'</small></button>'}).join('')+'</div>';
 h+='<a class="cg-direct" href="'+waUrl('')+'" target="_blank" rel="noopener">💬 محادثة مباشرة مع '+esc(CFG.bot)+' على واتساب</a>';
 h+='<div class="cg-sec" id="cgHT">🧾 طلباتي</div><div id="cgHist"></div><div class="cg-sec">📒 حجوزاتي</div><div id="cgBk"></div>';
 return h}
function formH(){var c=cur;
 return '<button type="button" class="cg-back">→ رجوع للخدمات</button><div class="cg-ft">'+c.ico+' '+esc(c.title)+'</div><div class="cg-ref">🔖 '+refId+'</div>'+
 '<div class="cg-fields">'+c.f.map(fieldH).join('')+'</div><div class="cg-err" id="cgErr" hidden></div>'+
 '<details class="cg-prev"><summary>👁️ معاينة الرسالة</summary><pre id="cgPrev"></pre></details>'+
 '<div class="cg-act"><button type="button" class="cg-send">'+esc(CFG.send)+'</button><button type="button" class="cg-copy">📋 نسخ فقط</button></div>'+
 '<div class="cg-hint">ينفتح واتساب والرسالة جاهزة، وتنسخ تلقائيًا احتياطًا. اضغط إرسال هناك.</div><div class="cg-rule">📌 '+esc(CFG.rule)+'</div>'}
function render(){
 box.innerHTML=(view==='home'?homeH():formH())+'<div class="cg-toast" id="cgToast" hidden></div>';
 document.body.classList.toggle('cg-formopen',view==='form');
 if(view==='home'){drawHist();drawBk()}else{drawPrev();applyShow()}}
function drawPrev(){var p=document.getElementById('cgPrev');if(p)p.textContent=build()}
function applyShow(){cur.f.forEach(function(f){var e=box.querySelector('[data-f="'+f.k+'"]');if(e)e.hidden=!visible(f)})}
function toast(m){var t=document.getElementById('cgToast');if(!t)return;t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},3500)}
function open(k,pre){cur=cat(k);vals=defVals(cur,pre);refId=newRef();view='form';render();box.scrollIntoView({block:'start'})}
function home(){view='home';render();box.scrollIntoView({block:'start'})}
// ---------------- history
function hist(){return ls('hist',[])}
function drawHist(){var e=document.getElementById('cgHist');if(!e)return;var H=hist();
 if(!H.length){e.innerHTML='<div class="cg-empty">ما أرسلت طلبات من هنا للحين. اختر خدمة من فوق 👆</div>';return}
 e.innerHTML=H.map(function(r,i){var s=ST.filter(function(x){return x[0]===r.st})[0]||ST[0];
  return '<div class="cg-h" data-i="'+i+'"><div class="cg-hh"><span class="cg-hi">'+r.ico+'</span><div class="cg-ht"><b>'+esc(r.title)+'</b><small>'+esc(r.sum)+'</small><small class="cg-hd">'+esc(r.ref)+' · '+esc(r.when)+'</small></div>'+
  '<button type="button" class="cg-stc s-'+s[0]+'" title="غيّر الحالة">'+s[2]+' '+s[1]+'</button></div>'+
  '<div class="cg-ha"><button type="button" class="cg-rs">🔁 فتح واتساب</button><button type="button" class="cg-cp">📋 نسخ</button><button type="button" class="cg-dl">🗑️</button></div></div>'}).join('')+
  '<div class="cg-hint">اضغط على الحالة لتغييرها بنفسك. هذي حالات محفوظة في جهازك فقط.</div>'}
function nowStr(){try{return new Intl.DateTimeFormat('ar-SA-u-nu-latn',{timeZone:'Asia/Riyadh',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date())}catch(e){return todayStr()}}
function copy(t){return new Promise(function(res){
 try{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(function(){res(true)},function(){res(fb())});return}}catch(e){}
 res(fb());
 function fb(){try{var a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;top:0;opacity:0';document.body.appendChild(a);a.focus();a.select();var ok=document.execCommand('copy');document.body.removeChild(a);return ok}catch(e){return false}}})}
// ---------------- bookings (published by the assistant)
var BI={flight:'✈️',hotel:'🏨',restaurant:'🍽️',ride:'🚗',ticket:'🎟️',trip:'🧳',special:'💎'};
function drawBk(){var e=document.getElementById('cgBk');if(!e)return;
 if(BK===null){e.innerHTML='<div class="cg-empty">…</div>';return}
 var it=(BK.items||[]).slice().sort(function(a,b){return String(a.date||'9').localeCompare(String(b.date||'9'))});
 if(!it.length){e.innerHTML='<div class="cg-empty">ما فيه حجوزات منشورة للحين. أول ما يتأكد أي حجز ينزل هنا 🙌</div>';return}
 var t=todayStr();
 e.innerHTML=it.map(function(b){var past=b.date&&b.date<t,sl=b.status==='confirmed'?'✅ مؤكد':b.status==='pending'?'⏳ بانتظار الدفع':esc(b.status||'');
  return '<div class="cg-b'+(past?' past':'')+'"><span class="cg-hi">'+(BI[b.type]||'📌')+'</span><div class="cg-ht"><b>'+esc(b.title||'')+'</b>'+(b.subtitle?'<small>'+esc(b.subtitle)+'</small>':'')+
  '<small class="cg-hd">'+(b.date?esc(fmtDate(b.date)):'')+(b.time?' · '+esc(b.time):'')+(b.ref?' · '+esc(b.ref):'')+'</small>'+
  (b.details&&b.details.length?'<ul>'+b.details.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul>':'')+
  (b.link?'<a href="'+esc(b.link)+'" target="_blank" rel="noopener">🔗 فتح</a>':'')+'</div><span class="cg-stc s-'+(b.status==='confirmed'?'done':'prog')+'">'+sl+'</span></div>'}).join('')+
  (BK.updated?'<div class="cg-hint">آخر تحديث: '+esc(BK.updated)+'</div>':'')}
function loadBk(){fetch('data/bookings.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():{items:[]}}).then(function(j){BK=j||{items:[]};drawBk()}).catch(function(){BK={items:[]};drawBk()})}
// ---------------- validate/send
function validate(){var c=cur,bad=[];
 c.f.forEach(function(f){if(!visible(f)||!f.req)return;var v=vals[f.k];if(f.t==='pax'?!(v&&v.length):!String(v||'').trim())bad.push(f)});
 var m=null;
 c.f.forEach(function(f){if(f.min&&visible(f)&&vals[f.k]&&vals[f.min]&&vals[f.k]<vals[f.min])m='تاريخ «'+f.l+'» قبل تاريخ البداية'});
 box.querySelectorAll('.cg-f.bad').forEach(function(e){e.classList.remove('bad')});
 bad.forEach(function(f){var e=box.querySelector('[data-f="'+f.k+'"]');if(e)e.classList.add('bad')});
 var e=document.getElementById('cgErr');
 if(bad.length||m){e.textContent=bad.length?'كمّل الحقول المعلّمة بـ * : '+bad.map(function(f){return f.l}).join('، '):m;e.hidden=false;
  var x=bad.length?box.querySelector('[data-f="'+bad[0].k+'"]'):null;if(x)x.scrollIntoView({block:'center',behavior:'smooth'});return false}
 e.hidden=true;return true}
function send(){if(!validate())return;var t=build(),H=hist();
 H.unshift({ref:refId,ico:cur.ico,title:cur.title,sum:summary(),text:t,st:'new',when:nowStr()});lsSet('hist',H.slice(0,50));
 copy(t).then(function(ok){view='home';render();toast(ok?'✅ انحفظ الطلب ونُسخ، وينفتح واتساب الحين':'✅ انحفظ الطلب، وينفتح واتساب الحين');
  setTimeout(function(){location.href=waUrl(t)},350)})}
// ---------------- events
box.addEventListener('click',function(ev){var t=ev.target,b=t.closest('button,a,summary');if(!b||!box.contains(b))return;
 if(b.classList.contains('cg-cat'))return open(b.dataset.k);
 if(b.classList.contains('cg-hmc')){var q=QD[+b.dataset.i],both=CFG.pax.map(function(p){return p.n}),pre={dest:q[0],occ:'شهر العسل',pax:both,parts:['✈️ طيران','🏨 فندق','🚗 تنقلات','🍽️ مطاعم','🎟️ فعاليات'],style:'رومانسي'};
  if(q[2])pre.start=q[2];return open('trip',pre)}
 if(b.classList.contains('cg-back'))return home();
 if(b.classList.contains('cg-send'))return send();
 if(b.classList.contains('cg-copy')){if(!validate())return;return copy(build()).then(function(ok){toast(ok?'📋 اننسخت الرسالة':'ما قدرت أنسخ، انسخها من المعاينة')})}
 if(b.classList.contains('cg-qc')){var f0=cur.f.filter(function(x){return x.quick})[0],q2=QD[+b.dataset.i];vals[f0.k]=q2[0];
  var qd=cur.f.filter(function(x){return x.qd})[0];if(q2[2]&&qd&&!vals[qd.k])vals[qd.k]=q2[2];
  box.querySelector('[data-k="'+f0.k+'"].cg-in').value=q2[0];if(qd){var di=box.querySelector('[data-k="'+qd.k+'"].cg-in');if(di)di.value=vals[qd.k]||''}return drawPrev()}
 if(b.classList.contains('cg-st')&&b.closest('.cg-num')){var n=b.closest('.cg-num'),k=n.dataset.k,f=cur.f.filter(function(x){return x.k===k})[0];
  vals[k]=Math.max(f.min,Math.min(f.max,vals[k]+ +b.dataset.d));n.querySelector('b').textContent=vals[k];return drawPrev()}
 if(b.classList.contains('cg-pxa')){var inp=box.querySelector('.cg-pin'),nm=inp.value.trim().replace(/\s+/g,' ');if(!nm)return;
  var all=paxAll().map(function(p){return p.n.toUpperCase()});if(all.indexOf(nm.toUpperCase())<0){var c2=ls('pax',[]);c2.push(nm);lsSet('pax',c2)}
  var pf=cur.f.filter(function(x){return x.t==='pax'})[0];var ex=paxAll().filter(function(p){return p.n.toUpperCase()===nm.toUpperCase()})[0];if(ex&&vals[pf.k].indexOf(ex.n)<0)vals[pf.k].push(ex.n);
  box.querySelector('[data-f="'+pf.k+'"]').outerHTML=fieldH(pf);return drawPrev()}
 if(b.classList.contains('cg-pxx')){var nm2=b.dataset.v;lsSet('pax',ls('pax',[]).filter(function(x){return x!==nm2}));
  var pf2=cur.f.filter(function(x){return x.t==='pax'})[0];vals[pf2.k]=vals[pf2.k].filter(function(x){return x!==nm2});
  box.querySelector('[data-f="'+pf2.k+'"]').outerHTML=fieldH(pf2);return drawPrev()}
 if(b.classList.contains('cg-chip')){var w=b.closest('.cg-chips'),k2=w.dataset.k;if(!k2)return;var arr=vals[k2];
  if(w.dataset.m==='1'||w.classList.contains('cg-pax')){var v=b.dataset.v,i=arr.indexOf(v);if(i>-1)arr.splice(i,1);else arr.push(v);b.classList.toggle('on')}
  else{var v2=b.dataset.v;vals[k2]=vals[k2]===v2?'':v2;w.querySelectorAll('.cg-chip').forEach(function(x){x.classList.toggle('on',x.dataset.v===vals[k2])})}
  applyShow();return drawPrev()}
 var h=b.closest('.cg-h');if(h){var i2=+h.dataset.i,H=hist(),r=H[i2];if(!r)return;
  if(b.classList.contains('cg-stc')){var ix=0;ST.forEach(function(s,j){if(s[0]===r.st)ix=j});r.st=ST[(ix+1)%ST.length][0];lsSet('hist',H);return drawHist()}
  if(b.classList.contains('cg-rs')){return copy(r.text).then(function(){location.href=waUrl(r.text)})}
  if(b.classList.contains('cg-cp'))return copy(r.text).then(function(ok){toast(ok?'📋 اننسخ الطلب':'ما قدرت أنسخ')});
  if(b.classList.contains('cg-dl')){if(confirm('تحذف هذا الطلب من السجل؟')){H.splice(i2,1);lsSet('hist',H);drawHist()}return}}
});
box.addEventListener('input',function(ev){var t=ev.target;if(!t.dataset||!t.dataset.k||!t.classList.contains('cg-in'))return;vals[t.dataset.k]=t.value;
 cur.f.forEach(function(f){if(f.min===t.dataset.k){var e=box.querySelector('[data-k="'+f.k+'"].cg-in');if(e&&t.value)e.min=t.value}});
 var f=t.closest('.cg-f');if(f)f.classList.remove('bad');applyShow();drawPrev()});
box.addEventListener('keydown',function(ev){if(ev.key==='Enter'&&ev.target.classList.contains('cg-pin')){ev.preventDefault();var b=box.querySelector('.cg-pxa');if(b)b.click()}});
render();loadBk();
window.CG_DEBUG={open:open,vals:function(){return vals},build:function(){return build()}};
})();
