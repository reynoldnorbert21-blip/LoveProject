// subtitles_ml-en.srt from the same timing rule the picture uses
import fs from 'fs';
import { LINES, DUR } from './timeline.js';
const env = JSON.parse(fs.readFileSync(new URL('./audio/env.json', import.meta.url)));
const ts = s => { const ms = Math.round(s * 1000), h = ms / 3600000 | 0, m = ms / 60000 % 60 | 0, se = ms / 1000 % 60 | 0; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(se).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
let out = '';
LINES.forEach(([id, , t0, ml, en], i) => { const next = i + 1 < LINES.length ? LINES[i + 1][2] - .1 : DUR; const t1 = Math.min(next, Math.max(t0 + env[id].dur + .45, t0 + 1.7)); out += `${i + 1}\n${ts(t0 - .1)} --> ${ts(t1)}\n${ml}\n${en}\n\n`; });
fs.writeFileSync(new URL('./subtitles_ml-en.srt', import.meta.url), out);
console.log('subtitles_ml-en.srt', LINES.length, 'cues');
