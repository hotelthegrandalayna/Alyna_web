/**
 * The line the bot says when it steps aside and gives the guest to a person.
 *
 * These are written by hand on purpose. A guest who has asked ten questions is a
 * serious guest — handing them over should not cost another AI call, and the
 * wording should never vary. Edit these freely; keep them short.
 */
const RECEPTION_PHONE = "+8801883352526";

const LINES = {
  bangla: [
    `আপনার ব্যাপারটা আমি রিসেপশনে দিয়ে দিচ্ছি, একজন এখনই আপনাকে এখানে মেসেজ করবেন।`,
    `তাড়া থাকলে সরাসরি কল করতে পারেন — ${RECEPTION_PHONE}`,
  ],
  banglish: [
    `Apnar bishoyta ami reception e diye dicchi, ekjon ekhoni apnake ekhane message korbe.`,
    `Tara thakle direct call korte paren — ${RECEPTION_PHONE}`,
  ],
  english: [
    `Let me get someone from reception on this — they'll message you here shortly.`,
    `If you're in a hurry you can call us directly — ${RECEPTION_PHONE}`,
  ],
};

export function handoverLines(language) {
  return LINES[language] || LINES.bangla; // "mixed" and unknown fall back to Bangla
}
