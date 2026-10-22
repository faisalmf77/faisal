(function(){
var box=document.getElementById('fun');if(!box)return;
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var DEF={updated:'',jokes:[
{text:'قال المعلم للطالب: وش أصعب مادة عندكم؟ قال: مادة الصحيان قبل الدوام.',source:'الرجيلي · مختارات'},
{text:'سألوا واحد كسلان: وش هوايتك؟ قال: النوم. قالوا: ومتى تمارسها؟ قال: بعد الظهر، وبعد العصر، وبعد المغرب.',source:'الرجيلي · مختارات'},
{text:'واحد راح للدكتور وقال: كل ما أشرب شاهي يوجعني عيني. قال الدكتور: جرّب تشيل الملعقة من الكوب.',source:'الرجيلي · مختارات'}],
riddles:[{q:'ما هو الشيء الذي له أسنان ولا يعض؟',a:'المشط',source:'الرجيلي · مختارات'},{q:'ما هو الشيء الذي يكتب ولا يقرأ؟',a:'القلم',source:'الرجيلي · مختارات'}]};
function src(x){var s=esc(x.source||'');return '<div class="fn-src">'+(x.url?'<a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+s+' ↗</a>':s)+'</div>'}
function render(d){
 var h='<h2>😄 ألغاز ونكت</h2><div class="upd" id="fnU">'+(d.updated?'آخر تحديث: '+esc(d.updated):'')+'</div>';
 h+='<h3>😂 نكت اليوم</h3><ul class="fn-list">'+(d.jokes||[]).map(function(j){return '<li class="fn-item"><div class="fn-t">'+esc(j.text)+'</div>'+src(j)+'</li>'}).join('')+'</ul>';
 h+='<h3>🧩 ألغاز اليوم</h3><ul class="fn-list">'+(d.riddles||[]).map(function(r,i){return '<li class="fn-item"><div class="fn-t">'+esc(r.q)+'</div><button class="fn-btn" data-i="'+i+'" aria-expanded="false">اعرف الإجابة</button><div class="fn-ans" hidden>✅ '+esc(r.a)+'</div>'+src(r)+'</li>'}).join('')+'</ul>';
 box.innerHTML=h;
 box.querySelectorAll('.fn-btn').forEach(function(b){b.onclick=function(){var a=b.nextElementSibling,o=a.hidden;a.hidden=!o;b.setAttribute('aria-expanded',o);b.textContent=o?'إخفاء الإجابة':'اعرف الإجابة'}});
}
render(DEF);
fetch('data/fun.json?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
 if(d&&d.jokes&&d.jokes.length){try{localStorage.setItem('fun',JSON.stringify(d))}catch(e){}render(d)}else throw 0;
}).catch(function(){try{var c=JSON.parse(localStorage.getItem('fun')||'null');if(c&&c.jokes)render(c)}catch(e){}});
})();
