(function(){
var box=document.getElementById('wedWx');if(!box)return;
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function dayN(s){var p=String(s).split('-');return Date.UTC(+p[0],+p[1]-1,+p[2])/864e5}
function today(){try{var p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());return dayN(p)}catch(e){var d=new Date(Date.now()+10800000);return Math.floor(d/864e5)}}
function fmt(s){var p=String(s).split('-');return +p[2]+' '+MON[+p[1]-1]+' '+p[0]}
function cd(d){var t=today(),f=d.forecast_date&&dayN(d.forecast_date)-t,w=d.wedding_date&&dayN(d.wedding_date)-t,h='';
 if(f!=null&&d.forecast_date){h+='<div class="wx-cd"><b>'+(f>0?f:0)+'</b><span>'+(f>0?'يوم على التوقع الحقيقي ('+fmt(d.forecast_date)+' تقريبًا)':'التوقع الحقيقي صار متاح، راجعوه')+'</span></div>'}
 if(w!=null&&d.wedding_date){h+='<div class="wx-cd"><b>'+(w>0?w:0)+'</b><span>'+(w>0?'يوم على ليلة الزفاف ('+fmt(d.wedding_date)+')':(w===0?'اليوم ليلة الزفاف':'الله يبارك لكم'))+'</span></div>'}
 return h}
function big(src){var o=document.createElement('div');o.className='wx-ov';
 o.innerHTML='<button type="button" class="wx-x" aria-label="إغلاق">✕</button><img src="'+esc(src)+'" alt="">';
 o.onclick=function(e){if(e.target.tagName!=='IMG')document.body.removeChild(o)};document.body.appendChild(o)}
var DEF={week:'',summary:[],images:{},updated:'',forecast_date:'2027-03-11',wedding_date:'2027-03-25',source:'المصدر: NASA POWER',disclaimer:'نمط سابق وليس توقعًا لعام 2027'};
function render(d){d=Object.assign({},DEF,d||{});var v=encodeURIComponent(d.updated||d.week||'');
 var im=d.images||{},h='<h2>🌤️ طقس ليلة الزفاف · الدرعية</h2>';
 if(d.week)h+='<div class="wx-week">'+esc(d.week)+'</div>';
 h+='<ul class="wx-sum">'+(d.summary||[]).map(function(l){return '<li>'+esc(l)+'</li>'}).join('')+'</ul>';
 h+='<div class="wx-cds">'+cd(d)+'</div>';
 var pics=['a','b'].filter(function(k){return im[k]});
 if(pics.length){h+='<div class="wx-imgs">'+pics.map(function(k){var s=im[k]+'?v='+v;return '<a href="'+esc(s)+'" class="wx-im" data-s="'+esc(s)+'"><img loading="lazy" src="'+esc(s)+'" alt="'+(k==='a'?'الشبكة الملونة':'بطاقة الملخص')+'"><span>اضغط لفتح الصورة كاملة</span></a>'}).join('')+'</div>'}
 h+='<div class="wx-src">'+esc(d.source)+' · '+esc(d.disclaimer)+'</div>';
 if(d.updated)h+='<div class="upd wx-upd">آخر تحديث: '+esc(d.updated)+'</div>';
 box.innerHTML=h;
 box.querySelectorAll('.wx-im').forEach(function(a){a.onclick=function(e){e.preventDefault();big(a.getAttribute('data-s'))}})}
render(DEF);
fetch('data/weather_report.json?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
 if(d&&d.summary&&d.summary.length){try{localStorage.setItem('wedwx',JSON.stringify(d))}catch(e){}render(d)}else throw 0;
}).catch(function(){try{var c=JSON.parse(localStorage.getItem('wedwx')||'null');if(c&&c.summary)render(c)}catch(e){}});
})();
