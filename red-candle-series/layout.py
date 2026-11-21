# Lays out each episode from the real voice-line lengths -> epN/timeline.js and audio/epN/env.json.
# Each shot: (id, [(line, gap_before), ...], tail_hold, min_duration, {event: offset_from_shot_start})
import json, os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))

L = {  # id: (who, Malayalam, English)
 'a01': ('NIK', 'എല്ലാവരും പച്ച കാൻഡിൽ മാത്രമേ കാണൂ. ചുവപ്പ് ആരും കാണാറില്ല.', 'Everyone sees only the green candles. Nobody sees the red.'),
 'a02': ('AMM', 'ഇത് മാങ്ങാ അച്ചാറാ. അവിടെ ഇത് കിട്ടില്ല.', "This is mango pickle. You won't get this there."),
 'a03': ('NIK', 'അമ്മേ, അവിടെയും അച്ചാറ് കിട്ടും.', 'Amma, they have pickle there too.'),
 'a04': ('AMM', 'എന്റെ അച്ചാറ് കിട്ടുമോ?', 'Will you get MY pickle?'),
 'a05': ('ACH', 'ഇത് എന്റെ അച്ഛൻ എനിക്ക് തന്നതാ. ഇനി ഇത് നിന്റെ കയ്യിൽ ഇരിക്കട്ടെ.', 'My father gave this to me. Now let it stay on your wrist.'),
 'a06': ('ACH', 'നന്നായി പഠിക്കണം. സമയം കളയരുത്.', "Study well. Don't waste time."),
 'a07': ('AMM', 'ദിവസവും വിളിക്കണം ട്ടോ.', 'Call every day, okay?'),
 'a08': ('NIK', 'ആ വാച്ചിൽ സമയം മാത്രമല്ല. അവരുടെ ലോൺ, അവരുടെ സ്വപ്നം, എല്ലാം ഉണ്ടായിരുന്നു.', 'That watch held more than time. Their loan, their dream, everything.'),
 'a09': ('NIK', 'മാഞ്ചസ്റ്റർ. തണുപ്പിനേക്കാൾ വലുതായിരുന്നു ഫീസിന്റെ കണക്ക്.', 'Manchester. The fees were colder than the weather.'),
 'a10': ('NIK', 'രാത്രി പാത്രം കഴുകൽ. പകൽ ക്ലാസ്. ഉറക്കം എന്നൊന്ന് ഉണ്ടായിരുന്നില്ല.', "Dishes by night. Classes by day. Sleep didn't exist."),
 'a11': ('NIK', 'ഓരോ ഇമെയിലും ഒരു പേടി ആയിരുന്നു. വീട്ടിൽ ചോദിക്കാൻ പറ്റില്ല. അവർ എല്ലാം തന്നു കഴിഞ്ഞിരുന്നു.', "Every email was a fear. I couldn't ask home. They had already given everything."),
 'a12': ('AMM', 'മോനേ, നീ എന്തെങ്കിലും കഴിച്ചോ?', 'Son, did you eat anything?'),
 'a13': ('NIK', 'കഴിച്ചു അമ്മേ, കഴിച്ചു. നല്ല ചോറും മീൻകറിയും ഒക്കെ.', 'I ate, Amma, I did. Rice and fish curry and all.'),
 'a14': ('AMM', 'നീ ആകെ മെലിഞ്ഞല്ലോ.', "You've become so thin."),
 'a15': ('NIK', 'അത് ക്യാമറയുടെ കുഴപ്പമാ അമ്മേ.', "That's the camera, Amma."),
 'a16': ('NIK', 'രണ്ട് വർഷം കഴിഞ്ഞ് ഒരു IT ജോലി. ആദ്യമായി, മാസാവസാനം പേടിയില്ലാതെ ഉറങ്ങി.', 'Two years later, an IT job. For the first time, I slept at month-end without fear.'),
 'a17': ('JIT', 'ഡാ, ഇത് നോക്ക്. ഒരു ദിവസം കൊണ്ട് 200 പൗണ്ട്.', 'Bro, look at this. 200 pounds in one day.'),
 'a18': ('NIK', 'ഇത് ചൂതാട്ടം അല്ലേ?', "Isn't this gambling?"),
 'a19': ('JIT', 'ചൂതാട്ടം അല്ലെടാ, ട്രേഡിങ്. നീ എത്ര കാലം വേറൊരുത്തന് വേണ്ടി പണിയെടുക്കും?', "It's trading, not gambling. How long will you work for someone else?"),
 'a20': ('NIK', 'അന്ന് രാത്രി ഉറങ്ങിയില്ല. ചാർട്ടുകൾ ഒരു പുതിയ ഭാഷ പോലെ.', "I didn't sleep that night. Charts felt like a new language."),
 'a21': ('NIK', 'ശമ്പളം ഇട്ടു. ലാഭം വന്നു. പിന്നെയും വന്നു.', 'I put in my salary. Profit came. And came again.'),
 'a22': ('JIT', 'നിനക്ക് ഇത് പറ്റും ഡാ. നിനക്ക് കഴിവുണ്ട്.', "You can do this, bro. You've got the talent."),
 'a23': ('NIK', 'ജോലി വിട്ടാൽ... വീട്ടിൽ അറിഞ്ഞാൽ...', 'If I quit... if they find out at home...'),
 'a24': ('JIT', 'റിസ്ക് എടുക്കാതെ ആരും ഒന്നും നേടിയിട്ടില്ല.', 'Nobody ever won anything without risk.'),
 'a25': ('NIK', 'അവൻ എന്നെ ധൈര്യപ്പെടുത്തി. പക്ഷേ അവൻ സ്വന്തം ജോലി വിട്ടില്ല.', 'He gave me courage. But he never left his own job.'),
 'a26': ('ACH', 'മോനേ, ജോലിയൊക്കെ എങ്ങനെ പോകുന്നു?', "Son, how's work going?"),
 'a27': ('NIK', '...നന്നായി പോകുന്നു അച്ഛാ.', "...It's going well, Achan."),
 'a28': ('NIK', 'അന്ന് ഞാൻ വിചാരിച്ചു, ഞാൻ ജയിച്ചു എന്ന്.', 'That day, I thought I had won.'),
 'b01': ('JIT', 'നമ്മുടെ പിള്ളേരുടെ കയ്യിൽ നിന്ന് കാശ് എടുക്കാം. നീ ട്രേഡ് ചെയ്യ്. ലാഭം പകുതി പകുതി.', "Let's take money from our guys. You trade. We split the profit."),
 'b02': ('NIK', 'നീ എന്തിനാ പിന്നിൽ നിൽക്കുന്നത്?', 'Why are you staying behind?'),
 'b03': ('JIT', 'എന്റെ പേര് പറയണ്ട. അവർക്ക് നിന്നെയാ വിശ്വാസം.', "Don't say my name. It's you they trust."),
 'b04': ('ANO', 'നിന്നെ വിശ്വസിച്ചാ ഡാ ഇടുന്നത്. കല്യാണത്തിന് മാറ്റി വെച്ച കാശാ.', "I'm putting it in because I trust you. It's the money I saved for my wedding."),
 'b05': ('JIT', 'എന്നാ ഞാനും ഇടാം കുറച്ച്.', "Then I'll put in a little too."),
 'b06': ('NIK', 'ആദ്യത്തെ ആഴ്ചകൾ എല്ലാം പച്ച. ഗ്രൂപ്പിൽ ഞാനായിരുന്നു ഹീറോ.', 'The first weeks were all green. In the group, I was the hero.'),
 'b07': ('NIK', 'പിന്നെ ആദ്യത്തെ വലിയ നഷ്ടം. ഒറ്റ രാത്രി കൊണ്ട് മൂന്ന് മാസത്തെ ലാഭം പോയി. ഞാൻ ആരോടും പറഞ്ഞില്ല.', 'Then the first big loss. Three months of profit gone in one night. I told no one.'),
 'b08': ('NIK', 'നഷ്ടം തിരിച്ചു പിടിക്കണം. അത് മാത്രമായിരുന്നു മനസ്സിൽ. ലോട്ട് കൂട്ടി. പിന്നെയും കൂട്ടി.', 'I had to win it back. Nothing else was in my head. I raised the lot size. Again.'),
 'b09': ('NIK', 'ലോൺ. ക്രെഡിറ്റ് കാർഡ്. എല്ലാം അതിലേക്ക്.', 'A loan. Credit cards. Everything went in.'),
 'b10': ('NIK', 'ഡാ, എല്ലാം പോകുന്നു. ഞാൻ എന്താ ചെയ്യണ്ടത്?', "Bro, everything's going. What do I do?"),
 'b11': ('JIT', 'ടെൻഷൻ ആവണ്ട ഡാ. മാർക്കറ്റ് തിരിച്ചു വരും. ഒന്നൂടെ ഇട്.', "Don't stress, bro. The market will come back. Put in more."),
 'b12': ('JIT', 'ഞാൻ അവനോട് പറഞ്ഞതാ, all-in പോവരുതെന്ന്.', 'I told him not to go all-in.'),
 'b13': ('ANO', 'എന്റെ കല്യാണത്തിന്റെ കാശാ ഡാ അത്! ഞാൻ ജിതിന് 5000 പൗണ്ട് അയച്ചതാ!', 'That was my wedding money! I sent Jithin 5,000 pounds!'),
 'b14': ('NIK', 'അയ്യായിരം? എനിക്ക് കിട്ടിയത് നാലായിരത്തി അഞ്ഞൂറ് ആയിരുന്നു.', 'Five thousand? I only got four thousand five hundred.'),
 'b15': ('NIK', 'ഞാൻ ഒന്നും പറഞ്ഞില്ല. പറഞ്ഞാലും ആരും വിശ്വസിക്കില്ലായിരുന്നു.', 'I said nothing. Nobody would have believed me anyway.'),
 'b16': ('JIT', 'സാരമില്ല ഡാ. എല്ലാം ശരിയാകും.', "Never mind, bro. It'll all be fine."),
 'b17': ('AMM', 'മോനേ, കഴിച്ചോ?', 'Son, did you eat?'),
 'b18': ('NIK', 'കഴിച്ചു... അമ്മേ.', 'I ate... Amma.'),
 'b19': ('AMM', 'നിന്റെ ശബ്ദം എന്താ ഇങ്ങനെ?', 'Why does your voice sound like that?'),
 'b20': ('NIK', 'ജലദോഷമാ അമ്മേ. ഇവിടെ നല്ല തണുപ്പാ.', "It's a cold, Amma. It's very cold here."),
 'b21': ('NIK', 'ആകെ കടം... മുപ്പതിനായിരത്തി അറുന്നൂറ് പൗണ്ട്.', 'Total debt... thirty thousand six hundred pounds.'),
 'b22': ('NIK', 'ജോലിയില്ല. പേരില്ല. ബാക്കി ഉണ്ടായിരുന്നത് അച്ഛന്റെ ആ വാച്ച് മാത്രം.', "No job. No name. All I had left was Achan's watch."),
 'c01': ('NIK', 'എട്ട് മാസം. നൂറ്റിയിരുപത് അപേക്ഷകൾ. ഒടുവിൽ ഒരു വെയർഹൗസിൽ രാത്രി ജോലി.', 'Eight months. A hundred and twenty applications. Finally, a night job in a warehouse.'),
 'c02': ('NIK', 'ഓരോ മാസവും അഞ്ഞൂറ് പൗണ്ട് കടം വീട്ടും. ബാക്കി കൊണ്ട് ജീവിക്കും.', 'Every month, five hundred pounds to the debt. I lived on what was left.'),
 'c03': ('NIK', 'അപ്പോഴാണ് പ്രോപ്പ് ഫേം എന്ന വാക്ക് കേൾക്കുന്നത്. സ്വന്തം കാശ് വേണ്ട.', "That's when I heard the words 'prop firm'. No need for your own money."),
 'c04': ('MEN', 'നിങ്ങളിൽ എത്ര പേർ അക്കൗണ്ട് പൊട്ടിച്ചിട്ടുണ്ട്?', 'How many of you have blown an account?'),
 'c05': ('MEN', 'മാർക്കറ്റ് പ്രവചിക്കാനല്ല നമ്മൾ ഇവിടെ. റിസ്ക് നിയന്ത്രിക്കാനാണ്.', "We're not here to predict the market. We're here to control risk."),
 'c06': ('NIK', 'ഞാൻ എഴുതിയെടുത്തു. പക്ഷേ മനസ്സിൽ കയറിയില്ല.', "I wrote it down. But it didn't go in."),
 'c07': ('NIK', 'കടം വേഗം തീർക്കണം. ആ ഒറ്റ ചിന്ത. ബ്രീച്ച്. വീണ്ടും വാങ്ങി. വീണ്ടും ബ്രീച്ച്.', 'Clear the debt fast. That one thought. Breached. Bought again. Breached again.'),
 'c08': ('AMM', 'മോനേ, നിന്നെ ഓർത്ത് അച്ഛൻ ഇന്ന് അമ്പലത്തിൽ പോയി. നീ ഒന്നും പേടിക്കണ്ട ട്ടോ. ഞങ്ങൾ ഉണ്ട്.', "Son, Achan went to the temple for you today. Don't be afraid of anything. We're here."),
 'c09': ('NIK', 'അന്നാണ് ഞാൻ ആദ്യമായി എന്റെ ഓരോ ട്രേഡും വായിച്ചത്. മാർക്കറ്റ് അല്ല എന്നെ തോൽപ്പിച്ചത്. ഞാൻ തന്നെ ആയിരുന്നു.', "That day, for the first time, I read every one of my trades. The market didn't beat me. I did."),
 'c10': ('NIK', 'അച്ചടക്കം. റിസ്ക് മാനേജ്മെന്റ്. ഒരു മെക്കാനിക്കൽ സ്ട്രാറ്റജി. വേറൊന്നും ഇല്ല.', 'Discipline. Risk management. A mechanical strategy. Nothing else.'),
 'c11': ('NIK', 'ബോറിങ് ആയിരുന്നു. ഒരു ദിവസം ഒരു ട്രേഡ്. ചെറിയ ലാഭം, ചെറിയ നഷ്ടം. പക്ഷേ ഒരിക്കലും നിയമം തെറ്റിച്ചില്ല.', 'It was boring. One trade a day. Small wins, small losses. But I never broke a rule.'),
 'c12': ('NIK', 'ആദ്യത്തെ പേഔട്ട്.', 'The first payout.'),
 'c13': ('NIK', 'ഓരോരുത്തർക്കും മുഴുവനും തിരിച്ചു കൊടുത്തു. എനിക്ക് കിട്ടാത്ത 500 ഉൾപ്പെടെ.', 'I paid everyone back in full. Even the 500 I never got.'),
 'c14': ('ANO', 'സോറി ഡാ.', 'Sorry, bro.'),
 'c15': ('AMM', 'മോനേ, നീ എന്തെങ്കിലും കഴിച്ചോ?', 'Son, did you eat anything?'),
 'c16': ('NIK', 'ഇല്ല അമ്മേ. അമ്മയുടെ ചോറ് കഴിക്കാൻ വന്നതാ.', 'No, Amma. I came home to eat your food.'),
 'c17': ('ACH', 'സമയം കളഞ്ഞില്ലല്ലോ?', "You didn't waste time, did you?"),
 'c18': ('NIK', 'കളഞ്ഞു അച്ഛാ. പക്ഷേ തിരിച്ചു പിടിച്ചു.', 'I did, Achan. But I won it back.'),
 'c19': ('JIT', 'Bro, എന്റെ ജോലി പോയി. നീ എന്നെ ട്രേഡിങ് പഠിപ്പിക്ക്. പിള്ളേരുടെ കയ്യിൽ നിന്ന് വീണ്ടും കാശ് എടുക്കാം, പഴയ പോലെ.', "Bro, I lost my job. Teach me trading. Let's collect from the guys again, like old times."),
 'c20': ('NIK', 'മാർക്കറ്റ് റിസ്കിനെ ശിക്ഷിക്കില്ല. നിയമമില്ലാത്ത റിസ്കിനെയാണ്.', "The market doesn't punish risk. It punishes risk without rules."),
}
EP = {
 1: [('cold', [], 0, 3.6, {}), ('face', [('a01', .9)], 2.2, 0, {}),
     ('title', [], 0, 6.0, {'titleCandle': .15, 'presents': .3, 'titleText': 1.4, 'years': 3.4}),
     ('home', [('a02', 1.6), ('a03', .5), ('a04', 1.2)], 2.6, 0, {}),
     ('airport', [('a05', 1.4), ('a06', .9), ('a07', 1.0)], .4, 0, {'watchClick': 2.6}),
     ('watch', [('a08', .6)], 1.6, 0, {}),
     ('manc', [('a09', 1.2)], 1.4, 0, {}), ('kitchen', [('a10', .7)], 1.2, 0, {}),
     ('bunk', [('a11', .9)], 1.4, 0, {'emailBuzz': .4}),
     ('call', [('a12', 1.1), ('a13', .5), ('a14', .7), ('a15', .5)], .6, 0, {'chime': .2}),
     ('callEnd', [], 0, 4.8, {'hangup': .1}),
     ('office', [('a16', .9)], 1.2, 0, {}), ('pub', [('a17', 1.0), ('a18', .5), ('a19', .4)], 1.1, 0, {}),
     ('research', [('a20', .7)], 1.4, 0, {}), ('bath', [('a21', .5)], 1.8, 0, {'ping1': .9, 'ping2': 2.5}),
     ('canteen', [('a22', .9), ('a23', .5), ('a24', .5)], 1.2, 0, {'pat': 1.0}),
     ('resign', [('a25', .7)], 1.6, 0, {'envelope': .4, 'rack': 2.4, 'sip': 3.4}),
     ('walk', [('a26', 1.5), ('a27', 1.2), ('a28', 1.3)], 1.2, 0, {'box': .1, 'ring': .6}),
     ('laptop', [], 0, 6.6, {'silence': 3.6, 'drop': 4.3}), ('ep2', [], 0, 5.2, {'ep2': .3}), ('brand', [], 0, 4.6, {'brand': .2})],
 2: [('title', [], 0, 5.8, {'presents': .3, 'title': 1.3}),
     ('onam', [('b01', 1.2), ('b02', .6), ('b03', .5)], 1.2, 0, {}),
     ('sadya', [('b04', 1.2), ('b05', .8)], 1.4, 0, {}),
     ('transfer', [], 0, 2.4, {'ping1': .5}), ('transfer2', [], 0, 2.6, {'ping2': .5}),
     ('green', [('b06', .6)], 1.2, 0, {'chatPop': .7}), ('loss', [('b07', .6)], 1.4, 0, {}),
     ('revenge', [('b08', .4)], .8, 0, {'lot': 1.4}), ('ignore', [], 0, 3.8, {'buzz': .3, 'facedown': 2.5}),
     ('loan', [('b09', .4)], .8, 0, {'loanOk': 1.0}), ('split', [('b10', .7), ('b11', .5)], .8, 0, {}),
     ('margin', [], 0, 4.4, {'silence': 0, 'heart1': .8, 'heart2': 1.6, 'crack': 2.9}),
     ('chat', [('b12', 1.8)], 1.2, 0, {'flood': .2, 'jitMsg': 1.5}),
     ('anoop', [('b13', .7)], .5, 0, {}), ('realise', [('b14', .5), ('b15', 1.0)], 1.0, 0, {}),
     ('leave', [('b16', .7)], 2.2, 0, {'door': 2.6}),
     ('bus', [('b17', 1.4), ('b18', .9), ('b19', .9), ('b20', .7)], 2.4, 0, {}),
     ('notebook', [('b21', .9), ('b22', 1.2)], 1.0, 0, {'circle': 1.6}), ('ep3', [], 0, 5.2, {'ep3': .3}), ('brand', [], 0, 4.6, {'brand': .2})],
 3: [('title', [], 0, 6.0, {'presents': .3, 'title': 1.3, 'months': 3.2}),
     ('warehouse', [('c01', .8), ('c02', .7)], .9, 0, {'beep1': .9, 'beep2': 4.0}),
     ('lunch', [('c03', .5)], 1.0, 0, {}),
     ('class', [('c04', .9), ('c05', 1.8), ('c06', .9)], 1.0, 0, {}),
     ('breach', [('c07', .3)], .6, 0, {'breach': .3}),
     ('floor', [('c08', 1.1)], 3.4, 0, {}), ('audit', [('c09', .5)], 1.0, 0, {}),
     ('rules', [('c10', .5)], 1.2, 0, {}), ('seasons', [('c11', .6)], 1.8, 0, {'comeback': 0}),
     ('payout', [], 0, 3.6, {'approved': 2.4}), ('payface', [('c12', .8)], 2.2, 0, {}),
     ('repay', [('c13', .4)], .8, 0, {'sent': 1.0}), ('anoop', [('c14', 1.4)], 1.4, 0, {'typed': 1.0}),
     ('arrivals', [('c15', 1.2), ('c16', .6), ('c17', 1.1), ('c18', .7)], 2.2, 0, {'hug': .4}),
     ('veranda', [], 0, 2.8, {'buzz': .7}), ('msg', [('c19', .3)], .6, 0, {}),
     ('veranda2', [], 0, 4.4, {'photo': .2, 'facedown': 1.4}),
     ('end', [('c20', 1.6)], 3.2, 0, {'candle': .6}), ('brand', [], 0, 5.0, {'brand': .2})],
}
SPK = {'NIK': 'nik', 'JIT': 'jithin', 'AMM': 'amma', 'ACH': 'achan', 'ANO': 'anoop', 'MEN': 'mentor'}
ONSCREEN = {1: ['a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a12', 'a13', 'a14', 'a15', 'a17', 'a18', 'a19', 'a22', 'a23', 'a24', 'a27'],
            2: ['b01', 'b02', 'b03', 'b04', 'b05', 'b10', 'b11', 'b13', 'b16', 'b18', 'b20'],
            3: ['c04', 'c05', 'c15', 'c16', 'c17', 'c18']}
PAD = {1: .3, 2: 1.25, 3: 1.45}
for ep, shots in EP.items():
    env = {}; t = 0.0; S = []; LN = []; HIT = {}
    for sid, lines, tail, mind, hits in shots:
        a = t; cur = a
        for lid, gap in lines:
            x, sr = sf.read(f'{HERE}/voice/ep{ep}/{lid}.wav'); d = len(x) / sr
            hop = sr // 50; r = [float(np.sqrt(np.mean(x[j:j + hop] ** 2))) for j in range(0, len(x), hop)]; m = max(r)
            env[lid] = {'dur': d, 'env': [round(min(1, v / m * 1.3), 2) for v in r]}
            LN.append([lid, L[lid][0], round(cur + gap, 2), L[lid][1], L[lid][2]]); cur = cur + gap + d
        b = max(cur + tail + (PAD[ep] if lines else 0), a + mind)
        for k, off in hits.items(): HIT[k] = round(a + off, 2)
        S.append([sid, round(a, 2)]); t = b
    DUR = round(t, 2)
    on = {lid: SPK[L[lid][0]] for lid in ONSCREEN[ep]}
    os.makedirs(f'{HERE}/audio/ep{ep}', exist_ok=True); json.dump(env, open(f'{HERE}/audio/ep{ep}/env.json', 'w'))
    js = f"""// Red Candle · Episode {ep} — generated by layout.py from the voice-line lengths. Do not edit by hand.
export const EP = {ep}, W = 1080, H = 1920, FPS = 30, TRANS = .55, DUR = {DUR};
export const ENV = 'audio/ep{ep}/env.json';
export const SHOTS = {json.dumps(S)};
export const shotAt = t => {{ let k = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i][1]) k = i; return k; }};
export const shotRange = id => {{ const i = SHOTS.findIndex(s => s[0] === id); return [SHOTS[i][1], i + 1 < SHOTS.length ? SHOTS[i + 1][1] : DUR]; }};
export const LINES = {json.dumps(LN, ensure_ascii=False, indent=0)};
export const ONSCREEN = {json.dumps(on)};
export const HIT = {json.dumps(HIT)};
"""
    open(f'{HERE}/ep{ep}/timeline.js', 'w').write(js)
    print(f'ep{ep}: {DUR:.1f} s, {len(S)} shots, {len(LN)} lines')
