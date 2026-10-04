// Pronunciation only: never replace the original or infer a date's calendar format.
const WORDS = ["शून्य", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस", "बीस", "इक्कीस", "बाईस", "तेईस", "चौबीस", "पच्चीस", "छब्बीस", "सत्ताईस", "अट्ठाईस", "उनतीस", "तीस", "इकतीस", "बत्तीस", "तैंतीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अड़तीस", "उनतालीस", "चालीस", "इकतालीस", "बयालीस", "तैंतालीस", "चवालीस", "पैंतालीस", "छियालीस", "सैंतालीस", "अड़तालीस", "उनचास", "पचास", "इक्यावन", "बावन", "तिरपन", "चौवन", "पचपन", "छप्पन", "सत्तावन", "अट्ठावन", "उनसठ", "साठ", "इकसठ", "बासठ", "तिरसठ", "चौंसठ", "पैंसठ", "छियासठ", "सड़सठ", "अड़सठ", "उनहत्तर", "सत्तर", "इकहत्तर", "बहत्तर", "तिहत्तर", "चौहत्तर", "पचहत्तर", "छिहत्तर", "सतहत्तर", "अठहत्तर", "उनासी", "अस्सी", "इक्यासी", "बयासी", "तिरासी", "चौरासी", "पचासी", "छियासी", "सत्तासी", "अट्ठासी", "नवासी", "नब्बे", "इक्यानवे", "बानवे", "तिरानवे", "चौरानवे", "पचानवे", "छियानवे", "सत्तानवे", "अट्ठानवे", "निन्यानवे"];
const D='[0-9०-९]';
const MONEY=`(?:[+−-]₹\\s*|₹[+−-]?\\s*|(?:Rs\\.?|INR|रु\\.?)\\s*(?:[+−-](?=[0-9०-९]))?)${D}+(?:,${D}+)*(?:\\.${D}+)?(?:\\s*/-)?`;
const PHONE=`(?:\\+91[ -]?)?[6-9६-९]${D}{4}[ -]?${D}{5}`;
const TOKEN=new RegExp(`https?://[^\\s]+|www\\.[^\\s]+|[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}|${MONEY}|${PHONE}|[+−-]?${D}+(?:[/:−-]${D}+){1,2}|[+−-]?${D}+(?:,${D}+)*(?:\\.${D}+)?`,'giu');
const ID_BEFORE=/(?<![\p{L}\p{M}])(?:OTP|PIN|ID|code|number|फोन|फ़ोन|मोबाइल|खाता|कोड|ओटीपी|पिन|नंबर|नं)\s*(?:नंबर|number)?\s*(?:है)?\s*[:=]?\s*$/iu;
const ID_AFTER=/^\s*(?:is\s+your\s+(?:code|OTP|PIN)|(?:आपका\s+)?(?:OTP|PIN|कोड|ओटीपी|पिन))/iu;
const isMoney=s=>/^[+−-]?\s*₹|^(?:Rs\.?|INR|रु\.?)/iu.test(s);
const ascii=s=>s.replace(/[०-९]/gu,d=>String(d.charCodeAt(0)-0x966));
const digits=s=>[...s].map(c=>WORDS[Number(c)]).join(' ');
function cardinal(n){
  if(n<100)return WORDS[n];
  for(const [unit,name] of [[10000000,'करोड़'],[100000,'लाख'],[1000,'हज़ार'],[100,'सौ']]){
    if(n>=unit)return `${cardinal(Math.floor(n/unit))} ${name}${n%unit?' '+cardinal(n%unit):''}`;
  }
}
function numeric(s,forceDigits=false){
  const sign=s.startsWith('-')||s.startsWith('−')?'माइनस ':s.startsWith('+')?'प्लस ':'';
  s=s.replace(/^[+−-]/u,'');
  // Malformed grouping is read literally; it is never silently repaired.
  if(s.includes(',')&&!/^(?:[0-9]{1,3}(?:,[0-9]{3})+|[0-9]{1,2}(?:,[0-9]{2})*,[0-9]{3})(?:\.[0-9]+)?$/u.test(s))return sign+s.split(',').map(x=>numeric(x,true)).join(' कॉमा ');
  const [whole,fraction]=s.replaceAll(',','').split('.');
  const value=Number(whole);
  const head=forceDigits||whole.length>9||(whole.length>1&&whole[0]==='0')||value>999999999?digits(whole):cardinal(value);
  return sign+head+(fraction!==undefined?' दशमलव '+digits(fraction):'');
}
function currency(token){
  const number=ascii(token).replace(/\s*\/-$/u,'').trim().replace(/^([+−-]?)\s*₹\s*/u,'$1').replace(/^(?:Rs\.?|INR|रु\.?)\s*/iu,'').replaceAll(' ','');
  const valid=/^[+−-]?(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+|[0-9]{1,2}(?:,[0-9]{2})*,[0-9]{3})(?:\.[0-9]+)?$/u.test(number);
  const [whole,fraction]=number.split('.');
  const rupees=Number(whole.replaceAll(',','').replace(/^[+−-]/u,''));
  const unit=valid&&rupees===1?' रुपया':' रुपये';
  if(valid&&fraction!==undefined&&fraction.length<=2){
    const paise=Number(fraction.padEnd(2,'0'));
    if(rupees===0&&paise>0)return (/^[-−]/u.test(number)?'माइनस ':number.startsWith('+')?'प्लस ':'')+cardinal(paise)+' पैसे';
    return numeric(whole)+unit+(paise?' '+cardinal(paise)+' पैसे':'');
  }
  return numeric(number)+(fraction!==undefined&&fraction.length>2?' रुपये':unit);
}
export function hindiSpeech(text){
  return text.replace(TOKEN,(token,offset)=>{
    if(/^(?:https?:|www\.)/iu.test(token)||token.includes('@'))return token;
    const before=text.slice(0,offset),after=text.slice(offset+token.length);
    if((!token.includes('₹')||/^[+−-]₹/u.test(token))&&(/[\p{L}\p{M}\p{N}_]$/u.test(before)||/^[\p{L}\p{M}\p{N}_]/u.test(after)))return token;
    if(isMoney(token))return currency(token);
    const value=ascii(token);
    const identifier=ID_BEFORE.test(before.slice(-40))||ID_AFTER.test(after.slice(0,40));
    if(/^(?:\+91[ -]?)?[6-9][0-9]{4}[ -]?[0-9]{5}$/u.test(value)&&(identifier||value.startsWith('+91')||!/[ -]/u.test(value)))return (value.startsWith('+')?'प्लस ':'')+digits(value.replace(/[^0-9]/gu,''));
    if(!identifier&&!value.startsWith('+91')&&/^[6-9][0-9]{4} [0-9]{5}$/u.test(value))return value.split(' ').map(x=>numeric(x)).join(' ');
    if(/[/:−-]/u.test(value.slice(1))){
      // Read fields in their written order, without guessing DD/MM or MM/DD.
      const sign=(value.startsWith('-')||value.startsWith('−'))?'माइनस ':value.startsWith('+')?'प्लस ':'';
      const fields=value.replace(/^[+−-]/u,'');
      return sign+fields.split(/([/:−-])/u).map((x,i)=>i%2?({'/':' स्लैश ',':':' कोलन ','-':' डैश ','−':' डैश '}[x]):numeric(!identifier&&x.length<=2?x.replace(/^0+(?=[0-9])/u,''):x,identifier||x.length>=7)).join('');
    }
    return numeric(value,identifier||(!value.includes(',')&&value.replace(/^[+−-]/u,'').split('.')[0].length>=7));
  }).replaceAll('[',' खुला कोष्ठक ').replaceAll(']',' बंद कोष्ठक ');
}
export function currencyHint(text){
  const matches=[...text.matchAll(new RegExp(MONEY,'giu'))].filter(m=>(m[0].includes('₹')&&!/^[+−-]₹/u.test(m[0]))||(!/[\p{L}\p{M}\p{N}_]$/u.test(text.slice(0,m.index))&&!/^[\p{L}\p{M}\p{N}_]/u.test(text.slice(m.index+m[0].length))));
  return matches.slice(0,3).map(m=>currency(m[0])).join(' • ')+(matches.length>3?' • और रकम भी हैं।':'');
}
