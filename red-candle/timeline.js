// Red Candle · Episode 1 — the single source of truth for picture, subtitles and mix.
export const W = 1080, H = 1920;
export const DUR = 133.0;

// shots: id, start (s). Each ends where the next begins.
export const SHOTS = [
  ['cold', 0.0], ['title', 8.0], ['airport', 13.0], ['manc', 23.0], ['kitchen', 31.0], ['bunk', 38.0],
  ['call', 45.0], ['office', 55.0], ['pub', 63.0], ['research', 73.0], ['bath', 82.0], ['canteen', 90.0],
  ['resign', 100.0], ['walk', 110.0], ['laptop', 117.0], ['ep2', 123.5], ['end', 128.5],
];
export const shotAt = t => { let k = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i][1]) k = i; return k; };
export const shotRange = id => { const i = SHOTS.findIndex(s => s[0] === id); return [SHOTS[i][1], i + 1 < SHOTS.length ? SHOTS[i + 1][1] : DUR]; };

// dialogue: id (voice/<id>.wav), who, start, Malayalam, English
export const LINES = [
  ['l01', 'NIK', 1.6, 'എല്ലാവരും പച്ച കാൻഡിൽ മാത്രമേ കാണൂ. ചുവപ്പ് ആരും കാണാറില്ല.', 'Everyone sees only the green candles. Nobody sees the red.'],
  ['l02', 'ACH', 14.2, 'നന്നായി പഠിക്കണം, മോനേ.', 'Study well, son.'],
  ['l03', 'NIK', 18.0, 'ആ വാച്ചിൽ സമയം മാത്രമല്ല, അവരുടെ സ്വപ്നം കൂടി ഉണ്ടായിരുന്നു.', 'That watch held more than time. It held their dream.'],
  ['l04', 'NIK', 24.4, 'മാഞ്ചസ്റ്റർ. തണുപ്പിനേക്കാൾ വലുതായിരുന്നു ഫീസിന്റെ കണക്ക്.', 'Manchester. The fees were colder than the weather.'],
  ['l05', 'NIK', 32.2, 'രാത്രി പാത്രം കഴുകൽ. പകൽ ക്ലാസ്.', 'Dishes by night. Classes by day.'],
  ['l06', 'NIK', 40.2, 'ഓരോ ഇമെയിലും ഒരു പേടി ആയിരുന്നു.', 'Every email was a fear.'],
  ['l07', 'AMM', 46.0, 'മോനേ, നീ എന്തെങ്കിലും കഴിച്ചോ?', 'Son, did you eat?'],
  ['l08', 'NIK', 50.2, 'കഴിച്ചു, അമ്മേ.', 'I ate, Amma.'],
  ['l09', 'NIK', 56.2, 'രണ്ട് വർഷം കഴിഞ്ഞ് ഒരു IT ജോലി. ആദ്യമായി ഒരു സമാധാനം.', 'Two years later, an IT job. Peace, for the first time.'],
  ['l10', 'JIT', 64.4, 'ഡാ, ഇത് നോക്ക്. ഒരു ദിവസം കൊണ്ട് 200 പൗണ്ട്.', 'Bro, look at this. 200 pounds in one day.'],
  ['l11', 'NIK', 74.4, 'അന്ന് രാത്രി ഉറങ്ങിയില്ല. ചാർട്ടുകൾ ഒരു പുതിയ ഭാഷ പോലെ.', "I didn't sleep that night. Charts felt like a new language."],
  ['l12', 'NIK', 83.4, 'ശമ്പളം ഇട്ടു. ലാഭം വന്നു. പിന്നെയും വന്നു.', 'I put in my salary. Profit came. And came again.'],
  ['l13', 'JIT', 91.4, 'നിനക്ക് ഇത് പറ്റും ഡാ. റിസ്ക് എടുക്കാതെ ഒന്നും നടക്കില്ല.', 'You can do this, bro. Nothing happens without risk.'],
  ['l14', 'NIK', 101.4, 'അവൻ എന്നെ ധൈര്യപ്പെടുത്തി. പക്ഷേ അവൻ സ്വന്തം ജോലി വിട്ടില്ല.', 'He gave me courage. But he never left his own job.'],
  ['l15', 'NIK', 111.0, 'അന്ന് ഞാൻ വിചാരിച്ചു, ഞാൻ ജയിച്ചു എന്ന്.', 'That day I thought I had won.'],
];
// on-screen speakers (whose mouth moves); voice-over lines move nobody
export const ONSCREEN = { l02: 'achan', l07: 'amma', l08: 'nik', l10: 'jithin', l13: 'jithin' };

// key events (s) shared by picture and mix
export const HIT = {
  titleCandle: 8.0, titleText: 9.0, years: 10.4,
  watchClick: 16.2, emailBuzz: 39.0, chime: 45.3, reveal: 52.6,
  pulseIn: 63.0, ping1: 84.1, ping2: 85.7, pat: 92.2, envelope: 102.0, sip: 104.4,
  box: 110.2, silence: 120.6, drop: 121.6, ep2: 123.9, end: 128.9,
};
