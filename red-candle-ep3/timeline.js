// Red Candle · Episode 3 "The Grind" — 60-second Instagram Reel. Single source of truth for picture, subtitles and mix.
export const W = 1080, H = 1920, DUR = 60.0, FPS = 30, TRANS = .5;
export const SHOTS = [
  ['title', 0.0], ['warehouse', 2.4], ['lunch', 5.4], ['class', 10.2], ['breach', 14.4], ['floor', 17.6], ['audit', 21.6], ['rules', 25.6],
  ['seasons', 30.6], ['payout', 34.2], ['payface', 36.3], ['repay', 37.4], ['anoop', 39.6], ['arrivals', 41.8], ['veranda', 48.6], ['msg', 50.2],
  ['veranda2', 52.8], ['end', 55.0],
];
export const shotAt = t => { let k = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i][1]) k = i; return k; };
export const shotRange = id => { const i = SHOTS.findIndex(s => s[0] === id); return [SHOTS[i][1], i + 1 < SHOTS.length ? SHOTS[i + 1][1] : DUR]; };
export const LINES = [
  ['f02', 'NIK', 5.6, 'അപ്പോഴാണ് പ്രോപ്പ് ഫേം എന്ന വാക്ക് കേൾക്കുന്നത്. സ്വന്തം കാശ് വേണ്ട.', "That's when I heard the words 'prop firm'. No need for your own money."],
  ['f03', 'MEN', 10.4, 'മാർക്കറ്റ് പ്രവചിക്കാനല്ല നമ്മൾ ഇവിടെ. റിസ്ക് നിയന്ത്രിക്കാനാണ്.', "We're not here to predict the market. We're here to control risk."],
  ['f05', 'AMM', 17.8, 'മോനേ, നിന്നെ ഓർത്ത് അച്ഛൻ ഇന്ന് അമ്പലത്തിൽ പോയി.', 'Son, Achan went to the temple for you today.'],
  ['f06', 'NIK', 21.8, 'മാർക്കറ്റ് അല്ല എന്നെ തോൽപ്പിച്ചത്. ഞാൻ തന്നെ ആയിരുന്നു.', "The market didn't beat me. I did."],
  ['f07', 'NIK', 25.8, 'അച്ചടക്കം. റിസ്ക് മാനേജ്മെന്റ്. ഒരു മെക്കാനിക്കൽ സ്ട്രാറ്റജി. വേറൊന്നും ഇല്ല.', 'Discipline. Risk management. A mechanical strategy. Nothing else.'],
  ['f08', 'NIK', 30.8, 'ബോറിങ് ആയിരുന്നു. പക്ഷേ ഒരിക്കലും നിയമം തെറ്റിച്ചില്ല.', 'It was boring. But I never broke a rule.'],
  ['f09', 'NIK', 35.4, 'ആദ്യത്തെ പേഔട്ട്.', 'The first payout.'],
  ['f10', 'NIK', 37.6, 'ഓരോരുത്തർക്കും മുഴുവനും തിരിച്ചു കൊടുത്തു. എനിക്ക് കിട്ടാത്ത 500 ഉൾപ്പെടെ.', 'I paid everyone back in full. Even the 500 I never got.'],
  ['f11', 'AMM', 42.0, 'മോനേ, നീ എന്തെങ്കിലും കഴിച്ചോ?', 'Son, did you eat?'],
  ['f12', 'NIK', 44.6, 'ഇല്ല അമ്മേ. അമ്മയുടെ ചോറ് കഴിക്കാൻ വന്നതാ.', 'No, Amma. I came home to eat your food.'],
  ['f13', 'JIT', 48.8, 'Bro, എന്റെ ജോലി പോയി. നീ എന്നെ ട്രേഡിങ് പഠിപ്പിക്ക്. പിള്ളേരുടെ കയ്യിൽ നിന്ന് വീണ്ടും കാശ് എടുക്കാം, പഴയ പോലെ.', "Bro, I lost my job. Teach me trading. Let's collect from the guys again, like old times."],
  ['f14', 'NIK', 55.2, 'മാർക്കറ്റ് റിസ്കിനെ ശിക്ഷിക്കില്ല. നിയമമില്ലാത്ത റിസ്കിനെയാണ്.', "The market doesn't punish risk. It punishes risk without rules."],
];
export const ONSCREEN = { f03: 'mentor', f11: 'amma', f12: 'nik' };
export const HIT = { title: .2, beep1: 3.4, beep2: 4.5, breach: 14.6, approved: 35.9, sent: 37.9, hug: 41.9, buzz: 49.0, photo: 52.2, facedown: 53.8, candle: 55.4, redcandle: 56.8 };
export const CARDS = [
  { t0: 2.7, t1: 5.4, top: 1640, size: 56, html: '8 months later' },
  { t0: 58.0, t1: 60, top: 1700, size: 40, html: 'A story about discipline. Not financial advice.' },
];
export const SUBTOP = [[50.2, 52.8, 1560]];
