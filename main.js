const LEVELS=["A1","A2","B1","B2","C1","C2"];
const state={level:localStorage.getItem("ruLevel")||"A1",correct:+localStorage.getItem("ruCorrect")||0,attempts:+localStorage.getItem("ruAttempts")||0,xp:+localStorage.getItem("ruXP")||0,streak:+localStorage.getItem("ruStreak")||0,q:null,answered:false};

const DATA={
A1:{label:"Temel",rules:[
["Alfabe & telaffuz","К, м, т gibi ünsüzler; vurgu; ж, ш, щ, ы, й gibi sesler."],
["Cinsiyet","Eril çoğunlukla sessiz/-й; dişil -а/-я; nötr -о/-е. -ь iki cinsiyette olabilir."],
["Şimdiki zaman","Я читаю, ты читаешь, он читает. Fiil kişiye göre çekilir."],
["Temel hâller","İsimler cümledeki görevlerine göre biçim değiştirir. Nominal biçim sözlük biçimidir."],
["Accusative","Doğrudan nesne: Я читаю книгу. Dişil -а → -у, -я → -ю."],
["Prepositional","в/на + nerede? için: в школе, на работе; о + konu: о книге."]
]},
A2:{label:"Temel+",rules:[
["Genitive","Sahiplik, yokluk, miktar: книга брата; нет времени; много людей."],
["Dative","Alıcı/yararlanan: дать другу; yaş: мне 20 лет; нравится мне."],
["Instrumental","Araç/ile: ручкой, с другом; meslek/rol: стать врачом."],
["Hareket","в/на + accusative = nereye?; в/на + prepositional = nerede?"],
["Geçmiş zaman","читать → читал/читала/читали; olmak üzere cinsiyet/çoğul uyumu."],
["Gelecek & görünüş","буду читать (süreç); прочитаю (tamamlanmış sonuç)."]
]},
B1:{label:"Orta",rules:[
["Görünüş (вид)","Imperfective süreç/tekrar; perfective tamamlanmış sonuç/tek olay."],
["Hareket fiilleri","идти/ходить, ехать/ездить: tek yönlü vs alışılmış/çok yönlü."],
["İsim-sıfat uyumu","Синий дом, синяя машина, синее море, синие дома."],
["Zamirler & hâller","я→меня/мне/мной; edatlardan sonra он→у него, к нему."],
["Bağlaçlı cümle","потому что, хотя, если, когда; yan cümlede zaman ve görünüş."],
["Dolaylı anlatım","что, чтобы, ли ile daha karmaşık cümle bağlantıları."]
]},
B2:{label:"Üst orta",rules:[
["Fiil yönetimi","помогать кому; ждать кого/чего; интересоваться чем gibi yönetimler."],
["Hareket + görünüş","при-, у-, пере-, вы- gibi öneklerle yön/sonuç anlamı."],
["Ortaçlar","читающий, прочитанный gibi sıfat-fiil benzeri yapılar."],
["Gerund","читая, сделав: eşzamanlılık veya tamamlanmış önceki eylem."],
["Karmaşık hâl kullanımı","Miktar, olumsuzluk, soyut anlam ve sabit kalıplar."],
["Sözdizimi","Vurgu ve bilgi yapısına göre esnek kelime sırası; anlam korunurken odak değişir."]
]},
C1:{label:"İleri",rules:[
["Stil ve kayıt","Konuşma, nötr, resmî, akademik ve gazetecilik dili arasındaki farklar."],
["İnce görünüş farkları","начинать/начать, продолжать, успеть, привыкнуть vb. bağlama göre seçim."],
["Soyut yönetim","согласно чему, вопреки чему, благодаря чему gibi edat + hâl kalıpları."],
["Partiküller","же, ведь, даже, именно, лишь gibi parçacıkların pragmatik etkisi."],
["Dolaylı anlam","Ироji, varsayım, yumuşatma, ima ve konuşma stratejileri."],
["Metin bağdaşıklığı","Referans, tekrar, bağlaç seçimi, paragraf içi bilgi akışı."]
]},
C2:{label:"Ustalık",rules:[
["Üslup seçimi","Aynı içeriği gündelik, resmî, akademik veya edebî biçimde kurma."],
["Sözcüksel incelik","Yakın anlamlı fiillerin görünüş, yönetim ve kullanım farkları."],
["İleri sözdizimi","Devrik yapı, vurgu, nominalizasyon ve çok katmanlı yan cümleler."],
["İfade doğallığı","Ana dili konuşurunun tercih edeceği kolokasyonları ayırt etme."],
["Pragmatik anlam","Ton, ima, nezaket, mesafe ve konuşma bağlamını yorumlama."],
["Metin üretimi","Argüman, özet, karşılaştırma, açıklama ve stil kontrollü yeniden yazım."]
]}
};

const CASES=[
["Именительный","кто? что?","Özne / adlandırma","студент, книга"],
["Родительный","кого? чего?","Sahiplik, yokluk, miktar","брата, книги"],
["Дательный","кому? чему?","Alıcı, yöneltilen kişi/şey, yaş","брату, книге"],
["Винительный","кого? что?","Doğrudan nesne; nereye?","брата, книгу"],
["Творительный","кем? чем?","Araç, birlikte, rol/meslek","братом, книгой"],
["Предложный","о ком? о чём?","Nerede? / hakkında; edatla","о брате, о книге"]
];

const BANK=[
{level:"A1",topic:"cases",tr:"Ben kitabı okuyorum.",base:"книга",target:"книгу",case:"Винительный",rule:"книга → книгу: dişil -а ile biten isim, doğrudan nesne olduğunda accusative'de -у alır.",wrong:["книге","книга","книгой"]},
{level:"A1",topic:"cases",tr:"Ben Moskova'da yaşıyorum.",base:"Москва",target:"Москве",case:"Предложный",rule:"в + nerede? sorusu Prepositional ister. Москва → Москве.",wrong:["Москву","Москвы","Москвой"]},
{level:"A1",topic:"cases",tr:"Ben arkadaşla konuşuyorum.",base:"друг",target:"другом",case:"Творительный",rule:"с 'ile/birlikte' anlamında Instrumental ister: друг → другом.",wrong:["друга","друге","другу"]},
{level:"A1",topic:"cases",tr:"Ben arkadaşına kitap veriyorum.",base:"друг",target:"другу",case:"Дательный",rule:"Bir şeyi kime verdiğini sor: кому? → Dative. друг → другу.",wrong:["друга","другом","друге"]},
{level:"A1",topic:"cases",tr:"Masanın üzerinde bir kitap var.",base:"стол",target:"столе",case:"Предложный",rule:"на + nerede? → Prepositional: стол → столе.",wrong:["стол","столу","столом"]},
{level:"A2",topic:"cases",tr:"Benim zamanım yok.",base:"время",target:"времени",case:"Родительный",rule:"нет yokluk bildirir ve ardından Genitive gelir. время → времени; nötr -мя kelimeleri özel çekime sahiptir.",wrong:["время","времению","временем"]},
{level:"A2",topic:"cases",tr:"Ben iki arkadaş görüyorum.",base:"друг",target:"друга",case:"Винительный",rule:"Animate eril isimlerde Accusative, Genitive biçimiyle aynı olur: вижу кого? → друга.",wrong:["друг","другу","другом"]},
{level:"A2",topic:"cases",tr:"Ben üç kitap okuyorum.",base:"книга",target:"книги",case:"Родительный",rule:"2, 3, 4 ile sayılan isim çoğunlukla tekil Genitive alır: три книги.",wrong:["книгу","книга","книгой"]},
{level:"A2",topic:"verbs",tr:"Dün uzun süre çalıştım.",base:"работать",target:"работал",case:"Past",rule:"Geçmiş zamanda eril konuşan kişi için -л biçimi kullanılır: работать → работал. Kadın konuşan için работала olur.",wrong:["работаю","работать","работалa"]},
{level:"A2",topic:"prepositions",tr:"Okula gidiyorum.",base:"школа",target:"школу",case:"Винительный",rule:"в + hareketin hedefi (куда?) → Accusative. школа → школу.",wrong:["школе","школы","школой"]},
{level:"B1",topic:"cases",tr:"Ben kardeşime yardım ediyorum.",base:"брат",target:"брату",case:"Дательный",rule:"помогать fiili Dative yönetir: помогать кому? → брату.",wrong:["брата","братом","брате"]},
{level:"B1",topic:"verbs",tr:"Her gün işe gidiyorum (alışkanlık).",base:"ходить",target:"хожу",case:"Imperfective",rule:"Tekrarlanan/alışkanlık bildiren hareket için çok yönlü ходить kullanılır: я хожу.",wrong:["иду","пойду","ходил"]},
{level:"B1",topic:"verbs",tr:"Şimdi sinemaya gidiyorum (tek yön).",base:"идти",target:"иду",case:"Imperfective motion",rule:"Şu anda tek yönde hareket: идти → я иду. Bu, alışkanlık bildiren хожу'dan farklıdır.",wrong:["хожу","ездил","пошёл"]},
{level:"B1",topic:"adjectives",tr:"Mavi arabayı görüyorum.",base:"синий + машина",target:"синюю",case:"Accusative F",rule:"Sıfat isimle cinsiyet ve hâlde uyum sağlar. синий → синюю; машина → машину.",wrong:["синий","синяя","синей"]},
{level:"B2",topic:"cases",tr:"Onun önerisine rağmen toplantı devam etti.",base:"несмотря на + предложение",target:"предложение",case:"Accusative",rule:"несмотря на sabit olarak Accusative ile kullanılır. предложение nötr olduğu için Nom/Acc biçimi aynıdır.",wrong:["предложении","предложением","предложения"]},
{level:"B2",topic:"prepositions",tr:"Rapora göre karar değişti.",base:"согласно + отчёт",target:"отчёту",case:"Дательный",rule:"согласно edatı standart dilde Dative ister: согласно чему? → отчёту.",wrong:["отчёта","отчётом","отчёте"]},
{level:"C1",topic:"cases",tr:"Onun sayesinde sorun çözüldü.",base:"благодаря + он",target:"ему",case:"Дательный",rule:"благодаря + Dative: благодаря кому? → ему. Üçüncü kişi zamirleri birçok edattan sonra н- alabilir: благодаря ему.",wrong:["его","им","нём"]},
{level:"C1",topic:"verbs",tr:"Sonunda raporu tamamlamayı başardı.",base:"успеть + закончить",target:"успел закончить",case:"Aspect",rule:"успеть ardından tamamlanmış eylem vurgusu için perfective infinitive doğal seçimdir: успел закончить.",wrong:["успел заканчивать","успевал закончить","успевает закончить"]},
{level:"C2",topic:"mixed",tr:"Bu ifade resmî bir metinde kulağa daha doğal gelir.",base:"выражение",target:"это выражение",case:"Style",rule:"C2 düzeyinde yalnızca gramer değil, kayıt ve kolokasyon da değerlendirilir. Resmî bağlamda nötr/standart ifade seçimi önemlidir.",wrong:["эта выражение","этот выражение","эти выражение"]}
];

function normalize(s){return s.toLowerCase().trim().replace(/[ё]/g,"е").replace(/[«»"'.!,?;:()]/g,"").replace(/\s+/g," ");}
function candidates(q){
  const arr=[q.target];
  if(q.level==="A1" && q.topic==="cases") arr.push(q.target);
  return arr.map(normalize);
}
function eligible(){
  const max=LEVELS.indexOf(state.level);
  let pool=BANK.filter(q=>LEVELS.indexOf(q.level)<=max);
  const topic=document.getElementById("topic").value;
  if(topic!=="mixed"){const t=pool.filter(q=>q.topic===topic); if(t.length) pool=t;}
  return pool;
}
function pick(){const pool=eligible(); state.q=pool[Math.floor(Math.random()*pool.length)]; state.answered=false; renderQuestion();}
function renderQuestion(){
  const q=state.q; document.getElementById("trPrompt").textContent=q.tr;
  document.getElementById("ruBase").textContent=q.base;
  document.getElementById("hint").textContent=`Hedef: ${q.case}`;
  document.getElementById("questionMeta").textContent=`${q.level} • ${q.topic} • hedef biçim: ${q.case}`;
  document.getElementById("answer").value="";
  document.getElementById("answer").focus();
  const f=document.getElementById("feedback"); f.className="feedback";
}
function check(){
  if(state.answered)return;
  const q=state.q, user=normalize(document.getElementById("answer").value);
  const ok=candidates(q).includes(user);
  state.answered=true; state.attempts++;
  if(ok){state.correct++;state.xp+=10+LEVELS.indexOf(q.level)*5;state.streak++}
  else state.streak=0;
  save(); updateStats();
  const f=document.getElementById("feedback"); f.className="feedback show "+(ok?"good":"bad");
  document.getElementById("feedbackTitle").textContent=ok?"✅ Doğru!":"❌ Bu cevap neden olmadı?";
  let why=ok
    ? `<b>Neden doğru?</b> ${q.rule}`
    : `<b>Neden yanlış?</b> Yazdığın cevap <span class="token">${document.getElementById("answer").value||"(boş)"}</span> hedeflenen gramer görevini karşılamıyor. <br><br><b>Kural:</b> ${q.rule}`;
  if(q.wrong.includes(user)) why+=`<br><br><b>Bu biçim nerede kullanılabilir?</b> ${contextForWrong(q,user)}`;
  document.getElementById("explain").innerHTML=why;
  document.getElementById("correctAnswer").innerHTML=`<b>Beklenen:</b> <span class="token">${q.target}</span> &nbsp; <span class="meta">Sözlük/temel biçim: ${q.base}</span>`;
}
function contextForWrong(q,u){
  const map={
    "книге":"книга → книге: Dative veya Prepositional bağlamı.",
    "книга":"книга Nom; özne/adlandırma için.",
    "книгой":"книга → книгой: Instrumental; 'kitapla/kitap aracılığıyla'.",
    "друга":"друг → друга: Genitive veya animate masculine Accusative.",
    "друге":"друг → друге: Prepositional, örn. о друге.",
    "другу":"друг → другу: Dative, örn. дать другу.",
    "столе":"стол → столе: Prepositional, örn. на столе.",
    "столу":"стол → столу: Dative.",
    "столом":"стол → столом: Instrumental.",
    "школе":"школа → школе: Prepositional/Dative.",
    "школы":"школа → школы: Genitive.",
    "школой":"школа → школой: Instrumental."
  };
  return map[u]||"Bu biçim başka bir gramer bağlamında kullanılabilir; önemli olan burada istenen soru/edat/fiil yönetimidir.";
}
function save(){localStorage.setItem("ruLevel",state.level);localStorage.setItem("ruCorrect",state.correct);localStorage.setItem("ruAttempts",state.attempts);localStorage.setItem("ruXP",state.xp);localStorage.setItem("ruStreak",state.streak)}
function updateStats(){
  document.getElementById("correct").textContent=state.correct;document.getElementById("attempts").textContent=state.attempts;
  document.getElementById("accuracy").textContent=(state.attempts?Math.round(state.correct/state.attempts*100):0)+"%";
  document.getElementById("xp").textContent=state.xp;document.getElementById("streakText").textContent="Seri: "+state.streak;
  const pct=Math.min(100,(state.correct%20)*5);document.getElementById("progressBar").style.width=pct+"%";
}
function renderLevels(){
  const box=document.getElementById("levels");box.innerHTML="";
  LEVELS.forEach(l=>{const d=document.createElement("button");d.className="level"+(state.level===l?" active":"");d.innerHTML=`<b>${l}</b><small>${DATA[l].label}</small>`;d.onclick=()=>{state.level=l;save();renderLevels();renderGrammar(l);pick()};box.appendChild(d)})
}
function renderGrammar(level){
  const tabs=document.getElementById("grammarTabs");tabs.innerHTML="";
  LEVELS.forEach(l=>{const b=document.createElement("button");b.className="btn tab"+(l===level?" active":"");b.textContent=l;b.onclick=()=>renderGrammar(l);tabs.appendChild(b)});
  document.getElementById("grammar").innerHTML=DATA[level].rules.map(r=>`<div class="rule"><b>${r[0]}</b><span>${r[1]}</span></div>`).join("");
}
function renderCases(){document.getElementById("caseBody").innerHTML=CASES.map(c=>`<tr><td><b>${c[0]}</b></td><td>${c[1]}</td><td>${c[2]}<br><span class="meta">${c[3]}</span></td></tr>`).join("")}
function speak(){if(!state.q)return;const u=new SpeechSynthesisUtterance(state.q.target);u.lang="ru-RU";u.rate=.82;speechSynthesis.speak(u)}
document.getElementById("checkBtn").onclick=check;document.getElementById("newBtn").onclick=pick;document.getElementById("nextBtn").onclick=pick;document.getElementById("soundBtn").onclick=speak;
document.getElementById("answer").addEventListener("keydown",e=>{if(e.key==="Enter")check()});
document.getElementById("resetBtn").onclick=()=>{if(confirm("İlerleme sıfırlansın mı?")){state.correct=state.attempts=state.xp=state.streak=0;save();updateStats()}};
renderLevels();renderGrammar(state.level);renderCases();updateStats();pick();
