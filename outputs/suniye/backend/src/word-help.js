// Reviewed dictionary definitions are separate from, and never replace, the source.
// No model, translation, inferred intent, dosage advice or omitted source sentences.
const glossary = [
  ['देय', 'देय का मतलब है: जो देना बाकी है।'],
  ['अंतिम तिथि', 'अंतिम तिथि का मतलब है: आखिरी तारीख।'],
  ['दूरभाष', 'दूरभाष का मतलब है: टेलीफ़ोन।'],
  ['कृपया', 'कृपया: विनती करने का शब्द है।'],
  ['पुनः', 'पुनः का मतलब है: फिर से।'],
  ['संलग्न', 'संलग्न का मतलब है: साथ में जोड़ा हुआ।'],
  ['अनिवार्य', 'अनिवार्य का मतलब है: ज़रूरी।'],
  ['वैकल्पिक', 'वैकल्पिक का मतलब है: जिसे चुन सकते हैं; करना ज़रूरी नहीं।'],
  ['प्रेषक', 'प्रेषक का मतलब है: भेजने वाला।'],
  ['प्राप्तकर्ता', 'प्राप्तकर्ता का मतलब है: पाने वाला।'],
  ['due date', 'ड्यू डेट का मतलब है: आखिरी तारीख।'],
  ['total', 'टोटल का मतलब है: कुल।'],
  ['amount', 'अमाउंट का मतलब है: रकम।'],
  ['invoice', 'इनवॉइस का मतलब है: बिल।'],
];
export function wordHelp(source) {
  const definitions=glossary.filter(([term])=>new RegExp(`(?<![\\p{L}\\p{M}\\p{N}_])${term}(?![\\p{L}\\p{M}\\p{N}_])`,'iu').test(source)).map(([,definition])=>definition);
  const intro=definitions.length?'शब्दों की मदद। ये शब्दकोश के सामान्य अर्थ हैं। '+definitions.join(' '):'इस पाठ के लिए शब्दों की मदद उपलब्ध नहीं है।';
  return intro+' मूल पाठ ज्यों का त्यों। '+source;
}
