// Red Candle · Episode 1 — 60-second Instagram Reel cut. Single source of truth for picture, subtitles and mix.
export const W = 1080, H = 1920;
export const DUR = 60.0;
export const FPS = 30;

// shots: id, start (s). Each ends where the next begins. Every cut is a palette-knife paint-over (TRANS seconds).
export const TRANS = .5;
export const SHOTS = [
  ['cold', 0.0], ['face', 1.7], ['title', 5.0], ['airport', 7.6], ['manc', 11.6], ['kitchen', 15.8], ['call', 19.4],
  ['office', 24.8], ['pub', 29.8], ['research', 33.8], ['bath', 37.9], ['canteen', 41.3],
  ['resign', 45.5], ['walk', 50.0], ['laptop', 53.2], ['ep2', 56.8],
];
export const shotAt = t => { let k = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i][1]) k = i; return k; };
export const shotRange = id => { const i = SHOTS.findIndex(s => s[0] === id); return [SHOTS[i][1], i + 1 < SHOTS.length ? SHOTS[i + 1][1] : DUR]; };

// dialogue: id (voice/<id>.wav), who, start, Malayalam, English
export const LINES = [
  ['l01', 'NIK', 0.5, 'എല്ലാവരും പച്ച കാൻഡിൽ മാത്രമേ കാണൂ. ചുവപ്പ് ആരും കാണാറില്ല.', 'Everyone sees only the green candles. Nobody sees the red.'],
  ['l02', 'ACH', 8.0, 'നന്നായി പഠിക്കണം, മോനേ.', 'Study well, son.'],
  ['l04', 'NIK', 11.9, 'മാഞ്ചസ്റ്റർ. തണുപ്പിനേക്കാൾ വലുതായിരുന്നു ഫീസിന്റെ കണക്ക്.', 'Manchester. The fees were colder than the weather.'],
  ['l05', 'NIK', 16.1, 'രാത്രി പാത്രം കഴുകൽ. പകൽ ക്ലാസ്.', 'Dishes by night. Classes by day.'],
  ['l07', 'AMM', 19.7, 'മോനേ, നീ എന്തെങ്കിലും കഴിച്ചോ?', 'Son, did you eat?'],
  ['l08', 'NIK', 22.2, 'കഴിച്ചു, അമ്മേ.', 'I ate, Amma.'],
  ['l09', 'NIK', 25.1, 'രണ്ട് വർഷം കഴിഞ്ഞ് ഒരു IT ജോലി. ആദ്യമായി ഒരു സമാധാനം.', 'Two years later, an IT job. Peace, for the first time.'],
  ['l10', 'JIT', 30.1, 'ഡാ, ഇത് നോക്ക്. ഒരു ദിവസം കൊണ്ട് 200 പൗണ്ട്.', 'Bro, look at this. 200 pounds in one day.'],
  ['l11', 'NIK', 34.1, 'അന്ന് രാത്രി ഉറങ്ങിയില്ല. ചാർട്ടുകൾ ഒരു പുതിയ ഭാഷ പോലെ.', "I didn't sleep that night. Charts felt like a new language."],
  ['l12', 'NIK', 38.2, 'ശമ്പളം ഇട്ടു. ലാഭം വന്നു. പിന്നെയും വന്നു.', 'I put in my salary. Profit came. And came again.'],
  ['l13', 'JIT', 41.6, 'നിനക്ക് ഇത് പറ്റും ഡാ. റിസ്ക് എടുക്കാതെ ഒന്നും നടക്കില്ല.', 'You can do this, bro. Nothing happens without risk.'],
  ['l14', 'NIK', 45.7, 'അവൻ എന്നെ ധൈര്യപ്പെടുത്തി. പക്ഷേ അവൻ സ്വന്തം ജോലി വിട്ടില്ല.', 'He gave me courage. But he never left his own job.'],
  ['l15', 'NIK', 50.3, 'അന്ന് ഞാൻ വിചാരിച്ചു, ഞാൻ ജയിച്ചു എന്ന്.', 'That day I thought I had won.'],
];
// on-screen speakers (whose mouth moves); voice-over lines move nobody
export const ONSCREEN = { l02: 'achan', l07: 'amma', l08: 'nik', l10: 'jithin', l13: 'jithin' };

// key events (s) shared by picture and mix
export const HIT = {
  titleCandle: 5.0, titleText: 5.45, years: 6.2,
  watchClick: 9.3, chime: 19.45, reveal: 23.2,
  pulseIn: 29.8, ping1: 38.9, ping2: 40.1, pat: 42.1, envelope: 45.8, rack: 47.4, sip: 48.3,
  box: 50.1, silence: 54.7, drop: 55.4, ep2: 57.0,
};
