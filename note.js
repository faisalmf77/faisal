window.NOTE_CFG={ph:'اكتب لها رسالة اليوم',btn:'💌 أرسلها لست الكل',prefix:'رسالة اليوم لست الكل من أبو خالد: ',empty:'ما وصلت رسالة اليوم من ست الكل للحين… أكيد جاية 💙'};
(function(){
var CFG=window.NOTE_CFG;
function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var box=document.getElementById('dailyNote');if(!box)return;
box.innerHTML='<h2>💌 رسالة اليوم</h2><div id="dnMsg" class="dn-msg"></div><div id="dnMeta" class="dn-meta"></div>'+
'<textarea id="dnTxt" class="dn-ta" rows="3" placeholder="'+CFG.ph+'"></textarea><button id="dnSend" class="dn-btn">'+CFG.btn+'</button>'+
'<details class="dn-hist"><summary>رسائلنا السابقة</summary><ul id="dnHist"></ul></details>';
fetch('data/daily_note.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).catch(function(){return {}}).then(function(d){
 var m=document.getElementById('dnMsg'),meta=document.getElementById('dnMeta');
 if(d&&d.text){m.textContent=d.text;meta.textContent='— '+(d.from||'')+(d.date?' · '+d.date:'');}
 else{m.textContent=CFG.empty;m.classList.add('dn-empty');}
 var h=(d&&d.history)||[],ul=document.getElementById('dnHist');
 ul.innerHTML=h.length?h.slice().reverse().map(function(x){return '<li><b>'+esc(x.from)+'</b> <span>'+esc(x.date)+'</span><br>'+esc(x.text)+'</li>'}).join(''):'<li class="dn-empty">ما فيه رسائل سابقة للحين</li>';
});
document.getElementById('dnSend').onclick=function(){var t=document.getElementById('dnTxt').value.trim();if(!t)return;
 window.open('https://wa.me/966590900178?text='+encodeURIComponent(CFG.prefix+t),'_blank');};
})();
