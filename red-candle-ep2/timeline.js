// Red Candle · Episode 2 "The Fall" — 60-second Instagram Reel. Single source of truth for picture, subtitles and mix.
export const W = 1080, H = 1920, DUR = 60.0, FPS = 30, TRANS = .5;
export const SHOTS = [
  ['title', 0.0], ['onam', 2.4], ['transfer', 9.8], ['transfer2', 11.4], ['green', 13.0], ['loss', 16.8], ['revenge', 21.4], ['loan', 25.0],
  ['split', 28.0], ['margin', 34.4], ['chat', 37.6], ['anoop', 41.0], ['leave', 44.6], ['bus', 49.0], ['notebook', 54.1],
];
export const shotAt = t => { let k = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i][1]) k = i; return k; };
export const shotRange = id => { const i = SHOTS.findIndex(s => s[0] === id); return [SHOTS[i][1], i + 1 < SHOTS.length ? SHOTS[i + 1][1] : DUR]; };
export const LINES = [
  ['e01', 'JIT', 2.6, 'നമ്മുടെ പിള്ളേരുടെ കയ്യിൽ നിന്ന് കാശ് എടുക്കാം. നീ ട്രേഡ് ചെയ്യ്. പക്ഷേ എന്റെ പേര് പറയണ്ട.', "Let's take money from our guys. You trade. But don't say my name."],
  ['e03', 'NIK', 13.2, 'ആദ്യ ആഴ്ചകൾ എല്ലാം പച്ച. എല്ലാവരും എന്നെ വിശ്വസിച്ചു.', 'The first weeks were all green. Everyone trusted me.'],
  ['e04', 'NIK', 17.0, 'പിന്നെ ആദ്യത്തെ വലിയ നഷ്ടം. ഞാൻ ആരോടും പറഞ്ഞില്ല.', 'Then the first big loss. I told no one.'],
  ['e05', 'NIK', 21.6, 'നഷ്ടം തിരിച്ചുപിടിക്കാൻ ഞാൻ ലോട്ട് കൂട്ടി. പിന്നെയും കൂട്ടി. ലോൺ. ക്രെഡിറ്റ് കാർഡ്. എല്ലാം അതിലേക്ക്.', 'To win it back, I raised the lot size. Again. A loan. Credit cards. Everything went in.'],
  ['e06', 'JIT', 28.2, 'ടെൻഷൻ ആവണ്ട ഡാ. മാർക്കറ്റ് തിരിച്ചു വരും. ഒന്നൂടെ ഇട്.', "Don't stress, bro. The market will come back. Put in more."],
  ['e07', 'JIT', 37.9, 'ഞാൻ അവനോട് പറഞ്ഞതാ, all-in പോവരുതെന്ന്.', 'I told him not to go all-in.'],
  ['e08', 'ANO', 41.1, 'ഞാൻ ജിതിന് 5000 പൗണ്ട് ആണ് അയച്ചത്!', 'I sent Jithin 5,000 pounds!'],
  ['e09', 'NIK', 44.8, 'ഞാൻ ഒന്നും പറഞ്ഞില്ല. പറഞ്ഞാലും ആരും വിശ്വസിക്കില്ലായിരുന്നു.', 'I said nothing. Nobody would have believed me anyway.'],
  ['e10', 'AMM', 49.2, 'മോനേ, കഴിച്ചോ?', 'Son, did you eat?'],
  ['e11', 'NIK', 51.1, 'കഴിച്ചു, അമ്മേ.', 'I ate, Amma.'],
  ['e12', 'NIK', 54.3, 'ജോലിയില്ല. പേരില്ല. ബാക്കി ഉണ്ടായിരുന്നത് അച്ഛന്റെ ആ വാച്ച് മാത്രം.', "No job. No name. All I had left was Achan's watch."],
];
export const ONSCREEN = { e01: 'jithin', e06: 'jithin', e08: 'anoop', e11: 'nik' };
export const HIT = { title: .2, ping1: 10.2, ping2: 11.8, chatPop: 13.6, lossRed: 17.2, lot: 22.6, loanOk: 25.6, silence: 34.4, heart1: 35.0, heart2: 35.8, crack: 36.9, flood: 37.6, jitMsg: 38.6, circle: 55.6, ep3: 57.4 };
export const CARDS = [{ t0: 57.4, t1: 60, top: 1640, size: 50, html: 'Episode 3 · <span style="font-style:normal;font-weight:700;letter-spacing:.06em">THE GRIND</span><br><span style="font-size:32px;color:#c8b89a">Not financial advice.</span>' }];
export const SUBTOP = [[9.8, 13.0, 1500], [13.0, 16.8, 1560], [37.6, 41.0, 1560], [28.0, 34.4, 900], [54.1, 60, 230]];
