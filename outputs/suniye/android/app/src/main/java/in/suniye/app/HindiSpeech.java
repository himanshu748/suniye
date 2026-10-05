package in.suniye.app;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
/** Pronunciation only. Source text and numeric date order are retained. */
public final class HindiSpeech {
    private HindiSpeech() {}
    private static final String[] WORDS = {"शून्य", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस", "बीस", "इक्कीस", "बाईस", "तेईस", "चौबीस", "पच्चीस", "छब्बीस", "सत्ताईस", "अट्ठाईस", "उनतीस", "तीस", "इकतीस", "बत्तीस", "तैंतीस", "चौंतीस", "पैंतीस", "छत्तीस", "सैंतीस", "अड़तीस", "उनतालीस", "चालीस", "इकतालीस", "बयालीस", "तैंतालीस", "चवालीस", "पैंतालीस", "छियालीस", "सैंतालीस", "अड़तालीस", "उनचास", "पचास", "इक्यावन", "बावन", "तिरपन", "चौवन", "पचपन", "छप्पन", "सत्तावन", "अट्ठावन", "उनसठ", "साठ", "इकसठ", "बासठ", "तिरसठ", "चौंसठ", "पैंसठ", "छियासठ", "सड़सठ", "अड़सठ", "उनहत्तर", "सत्तर", "इकहत्तर", "बहत्तर", "तिहत्तर", "चौहत्तर", "पचहत्तर", "छिहत्तर", "सतहत्तर", "अठहत्तर", "उनासी", "अस्सी", "इक्यासी", "बयासी", "तिरासी", "चौरासी", "पचासी", "छियासी", "सत्तासी", "अट्ठासी", "नवासी", "नब्बे", "इक्यानवे", "बानवे", "तिरानवे", "चौरानवे", "पचानवे", "छियानवे", "सत्तानवे", "अट्ठानवे", "निन्यानवे"};
    static boolean isNumberWord(String word){return java.util.Arrays.asList(WORDS).contains(word)||java.util.Arrays.asList("सौ","हजार","हज़ार","लाख","करोड़","पांच","छः","डेढ़","ढाई","सवा","साढ़े","पौने").contains(word);}
    private static final String D="[0-9०-९]";
    private static final String MONEY="(?:[+−-]₹\\s*|₹[+−-]?\\s*|(?:Rs\\.?|INR|रु\\.?)\\s*(?:[+−-](?=[0-9०-९]))?)"+D+"+(?:,"+D+"+)*(?:\\."+D+"+)?(?:\\s*/-)?";
    private static final Pattern TOKEN=Pattern.compile("https?://[^\\s]+|www\\.[^\\s]+|[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}|"+MONEY+"|(?:\\+91[ -]?)?[6-9६-९]"+D+"{4}[ -]?"+D+"{5}|[+−-]?"+D+"+(?:[/:−-]"+D+"+){1,2}|[+−-]?"+D+"+(?:,"+D+"+)*(?:\\."+D+"+)?",Pattern.CASE_INSENSITIVE);
    private static final Pattern GROUPING=Pattern.compile("(?:[0-9]{1,3}(?:,[0-9]{3})+|[0-9]{1,2}(?:,[0-9]{2})*,[0-9]{3})(?:\\.[0-9]+)?");
    private static final Pattern IDENTIFIER=Pattern.compile("(?<![\\p{L}\\p{M}])(?:OTP|PIN|ID|code|number|फोन|फ़ोन|मोबाइल|खाता|कोड|ओटीपी|पिन|नंबर|नं)\\s*(?:नंबर|number)?\\s*(?:है)?\\s*[:=]?\\s*$",Pattern.CASE_INSENSITIVE);
    private static final Pattern ID_AFTER=Pattern.compile("^\\s*(?:is\\s+your\\s+(?:code|OTP|PIN)|(?:आपका\\s+)?(?:OTP|PIN|कोड|ओटीपी|पिन))",Pattern.CASE_INSENSITIVE);
    private static boolean isMoney(String s){return Pattern.compile("^[+−-]?\\s*₹|^(?:Rs\\.?|INR|रु\\.?)",Pattern.CASE_INSENSITIVE).matcher(s).find();}
    private static String ascii(String s){StringBuilder out=new StringBuilder();for(char c:s.toCharArray())out.append(c>='०'&&c<='९'?(char)('0'+c-'०'):c);return out.toString();}
    private static String digits(String s){StringBuilder out=new StringBuilder();for(char c:s.toCharArray()){if(out.length()>0)out.append(' ');out.append(WORDS[c-'0']);}return out.toString();}
    private static String cardinal(long n){if(n<100)return WORDS[(int)n];long[] units={10000000,100000,1000,100};String[] names={"करोड़","लाख","हज़ार","सौ"};for(int i=0;i<units.length;i++)if(n>=units[i])return cardinal(n/units[i])+" "+names[i]+(n%units[i]>0?" "+cardinal(n%units[i]):"");throw new IllegalArgumentException();}
    private static String numeric(String s,boolean forceDigits){
        String sign=s.startsWith("-")||s.startsWith("−")?"माइनस ":s.startsWith("+")?"प्लस ":"";s=s.replaceFirst("^[+−-]","");
        if(s.contains(",")&&!GROUPING.matcher(s).matches()){StringBuilder out=new StringBuilder(sign);for(String part:s.split(",")){if(out.length()>sign.length())out.append(" कॉमा ");out.append(numeric(part,true));}return out.toString();}
        String[] parts=s.replace(",","").split("\\.",-1);String whole=parts[0];
        String head=forceDigits||whole.length()>9||(whole.length()>1&&whole.charAt(0)=='0')?digits(whole):cardinal(Long.parseLong(whole));
        return sign+head+(parts.length>1?" दशमलव "+digits(parts[1]):"");
    }
    private static String currency(String token){String number=ascii(token).replaceFirst("\\s*/-$","").trim().replaceFirst("^([+−-]?)\\s*₹\\s*","$1").replaceFirst("(?i)^(?:Rs\\.?|INR|रु\\.?)\\s*","").replace(" ","");String[] parts=number.split("\\.",-1);
        boolean valid=number.matches("[+−-]?(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+|[0-9]{1,2}(?:,[0-9]{2})*,[0-9]{3})(?:\\.[0-9]+)?");
        String whole=parts[0].replace(",","").replaceFirst("^[+−-]","");boolean one=valid&&whole.matches("0*1"),zero=valid&&whole.matches("0+");String unit=one?" रुपया":" रुपये";
        if(valid&&parts.length>1&&parts[1].length()<=2){int paise=Integer.parseInt(parts[1].length()==1?parts[1]+"0":parts[1]);if(zero&&paise>0)return (number.startsWith("-")||number.startsWith("−")?"माइनस ":number.startsWith("+")?"प्लस ":"")+cardinal(paise)+" पैसे";return numeric(parts[0],false)+unit+(paise>0?" "+cardinal(paise)+" पैसे":"");}
        return numeric(number,false)+(parts.length>1&&parts[1].length()>2?" रुपये":unit);
    }
    private static boolean adjacent(int codepoint){return Character.isLetterOrDigit(codepoint)||Character.getType(codepoint)==Character.NON_SPACING_MARK||Character.getType(codepoint)==Character.COMBINING_SPACING_MARK||Character.getType(codepoint)==Character.ENCLOSING_MARK||Character.getType(codepoint)==Character.OTHER_NUMBER||Character.getType(codepoint)==Character.LETTER_NUMBER||codepoint=='_';}

    private static final Pattern CONTEXT=Pattern.compile("https?://[^\\s]+|www\\.[^\\s]+|[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}|(?<![\\p{L}\\p{M}\\p{N}_+−.\\-])(?:"+MONEY+"\\s*(?:रुपये|रुपया)|"+D+"{1,2}(?::"+D+"{2})?\\s*(?:AM|PM|बजे)|[+−-]?"+D+"+(?:,"+D+"+)*(?:\\."+D+"+)?\\s*(?:mg|mcg|kg|ml|g|l|%|रुपये|रुपया))(?![\\p{L}\\p{M}\\p{N}_])",Pattern.CASE_INSENSITIVE);
    private static String contextual(String text){Matcher match=CONTEXT.matcher(text);StringBuffer out=new StringBuffer();while(match.find()){
        String token=match.group(),replacement=token,value=ascii(token);
        if(!token.matches("(?i)^(?:https?:|www\\.).*")&&!token.contains("@")){
            Matcher clock=Pattern.compile("^(\\d{1,2})(?::(\\d{2}))?\\s*(AM|PM|बजे)$",Pattern.CASE_INSENSITIVE).matcher(value);
            Matcher measure=Pattern.compile("^([+−-]?[0-9]+(?:,[0-9]+)*(?:\\.[0-9]+)?)\\s*(mg|mcg|kg|ml|g|l|%|रुपये|रुपया)$",Pattern.CASE_INSENSITIVE).matcher(value);
            if(isMoney(token)){replacement=currency(token.replaceFirst("\\s*(?:रुपये|रुपया)$",""));}
            else if(clock.matches()){int h=Integer.parseInt(clock.group(1)),m=clock.group(2)==null?0:Integer.parseInt(clock.group(2));String part=clock.group(3).toUpperCase(java.util.Locale.ROOT);
                if(m<=59&&h<=23&&(part.equals("बजे")||(h>=1&&h<=12))){String period=part.equals("AM")?(h==12||h<4?"रात ":"सुबह "):part.equals("PM")?(h==12||h<4?"दोपहर ":h<8?"शाम ":"रात "):"";replacement=period+cardinal(h)+(m>0?" बजकर "+cardinal(m)+" मिनट":" बजे");}
            }else if(measure.matches()){String unit=switch(measure.group(2).toLowerCase(java.util.Locale.ROOT)){case "mg"->"मिलीग्राम";case "mcg"->"माइक्रोग्राम";case "kg"->"किलोग्राम";case "ml"->"मिलिलीटर";case "g"->"ग्राम";case "l"->"लीटर";case "%"->"प्रतिशत";default->measure.group(2);};replacement=unit.startsWith("रुप")?currency("₹"+measure.group(1)):numeric(measure.group(1),false)+" "+unit;}
        }match.appendReplacement(out,Matcher.quoteReplacement(replacement));
    }match.appendTail(out);return out.toString();}

    public static String format(String text){text=contextual(text);Matcher matcher=TOKEN.matcher(text);StringBuffer out=new StringBuffer();while(matcher.find()){
        String token=matcher.group(),replacement=token;
        if(!token.matches("(?i)^(?:https?:|www\\.).*")&&!token.contains("@")&&((token.contains("₹")&&!token.matches("^[+−-]₹.*"))||(!(matcher.start()>0&&adjacent(text.codePointBefore(matcher.start())))&&!(matcher.end()<text.length()&&adjacent(text.codePointAt(matcher.end())))))){
            if(isMoney(token))replacement=currency(token);
            else{
                String value=ascii(token),before=text.substring(Math.max(0,matcher.start()-40),matcher.start()),after=text.substring(matcher.end(),Math.min(text.length(),matcher.end()+40));boolean identifier=IDENTIFIER.matcher(before).find()||ID_AFTER.matcher(after).find();
                if(value.matches("(?:\\+91[ -]?)?[6-9][0-9]{4}[ -]?[0-9]{5}")&&(identifier||value.startsWith("+91")||!value.matches(".*[ -].*")))replacement=(value.startsWith("+")?"प्लस ":"")+digits(value.replaceAll("[^0-9]",""));
                else if(!identifier&&value.matches("[6-9][0-9]{4} [0-9]{5}")){String[] parts=value.split(" ");replacement=numeric(parts[0],false)+" "+numeric(parts[1],false);}
                else if(value.substring(1).matches(".*[/:−-].*")){
                    String sign=value.startsWith("-")||value.startsWith("−")?"माइनस ":value.startsWith("+")?"प्लस ":"";value=value.replaceFirst("^[+−-]","");Matcher fields=Pattern.compile("([/:−-])").matcher(value);StringBuilder spoken=new StringBuilder(sign);int end=0;
                    while(fields.find()){String part=value.substring(end,fields.start());spoken.append(numeric(!identifier&&part.length()<=2?part.replaceFirst("^0+(?=[0-9])",""):part,identifier||part.length()>=7));String sep=fields.group();spoken.append(sep.equals("/")?" स्लैश ":sep.equals(":")?" कोलन ":" डैश ");end=fields.end();}
                    String part=value.substring(end);spoken.append(numeric(!identifier&&part.length()<=2?part.replaceFirst("^0+(?=[0-9])",""):part,identifier||part.length()>=7));replacement=spoken.toString();
                }else{String whole=value.replaceFirst("^[+−-]","").replace(",","").split("\\.")[0];replacement=numeric(value,identifier||(!value.contains(",")&&whole.length()>=7));}
            }
        }
        matcher.appendReplacement(out,Matcher.quoteReplacement(replacement));
    }matcher.appendTail(out);return out.toString().replace("[अस्पष्ट शब्द]","अस्पष्ट शब्द").replace("[अस्पष्ट संख्या]","अस्पष्ट संख्या").replace("["," खुला कोष्ठक ").replace("]"," बंद कोष्ठक ");}
    public static String currencyHint(String text){Matcher m=Pattern.compile(MONEY,Pattern.CASE_INSENSITIVE).matcher(text);StringBuilder out=new StringBuilder();int count=0;while(m.find()){
        if((!m.group().contains("₹")||m.group().matches("^[+−-]₹.*"))&&((m.start()>0&&adjacent(text.codePointBefore(m.start())))||(m.end()<text.length()&&adjacent(text.codePointAt(m.end())))))continue;
        count++;if(count<=3){if(out.length()>0)out.append(" • ");out.append(currency(m.group()));}
    }if(count>3)out.append(" • और रकम भी हैं।");return out.toString();}
}
