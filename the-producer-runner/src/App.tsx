import { useState, useEffect, useRef } from "react";

/* =====================================================================
   THE PRODUCER
   The town has already priced every movie. Most of the time the town
   is right. Your edge is what people tell you, your discipline is how
   you size the position, and your enemy is the auction.
   Run $10M into $250M and found your own studio.
   ===================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Limelight&family=Libre+Franklin:wght@400;600;700;800&family=Courier+Prime:wght@400;700&display=swap');
:root{
  --ink:#15131c; --panel:#211d2c; --panel2:#2a2439; --line:#3a3352;
  --paper:#f5efe0; --gold:#e2b04a; --gold2:#f4d58a; --green:#4fc98b; --red:#e2685a; --dim:#a094c0; --ivory:#f2ecdf;
}
*{box-sizing:border-box; -webkit-tap-highlight-color:transparent}
.pr{min-height:100vh;background:radial-gradient(1000px 420px at 50% -160px,#2c2440 0%,var(--ink) 60%);
  color:var(--ivory);font-family:'Libre Franklin',sans-serif;padding-bottom:110px;}
.pr .top{border-bottom:2px solid var(--gold);padding:16px 14px 12px;text-align:center;background:#1a1626}
.pr h1.title{font-family:'Limelight',cursive;font-weight:400;font-size:clamp(22px,6vw,32px);margin:0;color:var(--gold);letter-spacing:.05em}
.pr .subhead{color:var(--dim);font-size:11px;letter-spacing:.24em;text-transform:uppercase;margin-top:4px}
.pr .statbar{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:10px 12px 4px}
.pr .stat{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:7px 12px;min-width:92px;text-align:center}
.pr .stat .k{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim)}
.pr .stat .v{font-family:'Courier Prime',monospace;font-weight:700;font-size:16px;margin-top:2px}
.pr .v.pos{color:var(--green)} .pr .v.neg{color:var(--red)} .pr .v.gold{color:var(--gold)}
.pr .tabs{display:flex;gap:6px;overflow-x:auto;padding:12px 12px 2px;scrollbar-width:none}
.pr .tabs::-webkit-scrollbar{display:none}
.pr .tab{flex:0 0 auto;border:1px solid var(--line);background:var(--panel);color:var(--dim);border-radius:999px;
  padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.pr .tab.on{background:var(--gold);color:#241c07;border-color:var(--gold)}
.pr .tab .n{font-family:'Courier Prime',monospace;font-weight:700;margin-left:4px}
.pr .wrap{padding:12px;max-width:740px;margin:0 auto}
.pr .card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;margin-bottom:12px}
.pr .lbl{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin:0 0 8px}
.pr .row{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.pr .btn{border:none;border-radius:10px;padding:9px 13px;font-weight:700;font-size:13px;cursor:pointer;font-family:'Libre Franklin',sans-serif}
.pr .btn.gold{background:var(--gold);color:#241c07}
.pr .btn.green{background:var(--green);color:#0b2417}
.pr .btn.ghost{background:transparent;color:var(--dim);border:1px solid var(--line)}
.pr .btn:disabled{opacity:.35;cursor:not-allowed}
.pr .actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.pr .kv{display:flex;flex-wrap:wrap;gap:5px 14px;margin-top:6px;font-size:12.5px;color:var(--dim)}
.pr .kv b{color:var(--ivory);font-family:'Courier Prime',monospace}
.pr .deal{background:var(--paper);color:#2a2318;border:1px solid #d8cba6;border-radius:6px;
  font-family:'Courier Prime',monospace;box-shadow:3px 3px 0 rgba(0,0,0,.35);padding:14px;margin-bottom:14px}
.pr .deal .from{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#7a6a3e;border-bottom:1px dashed #c9ba90;padding-bottom:6px;margin-bottom:8px}
.pr .deal .t{font-weight:700;font-size:15.5px;text-transform:uppercase}
.pr .deal .meta{font-size:12.5px;margin-top:4px;color:#5a4f34}
.pr .deal .body{font-size:13px;margin-top:8px;line-height:1.5}
.pr .consensus{background:#eae2cb;border:1px solid #cbbd92;border-radius:4px;padding:9px 11px;margin-top:10px;font-size:12.5px;line-height:1.5}
.pr .consensus .h{font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:.08em;color:#7a6a3e}
.pr .signal{border-left:3px solid #8a6a1e;padding:7px 10px;margin-top:8px;font-size:12.5px;line-height:1.5;font-style:italic;background:#efe7cf}
.pr .signal .who{font-style:normal;font-size:11px;color:#7a6a3e;margin-top:3px}
.pr .deal .btn.ghost{color:#6a5c38;border-color:#c9ba90}
.pr .struct{border:1px solid #c9ba90;border-radius:6px;padding:10px;margin-top:8px;cursor:pointer;background:#f0e9d4}
.pr .struct:active{background:#e8dfc2}
.pr .struct .nm{font-weight:700;font-size:13px}
.pr .struct .dt{font-size:12px;color:#5a4f34;margin-top:3px}
.pr .struct.off{opacity:.4;cursor:not-allowed}
.pr .news{border-left:3px solid var(--gold);padding:8px 12px;margin-bottom:8px;background:var(--panel);border-radius:0 10px 10px 0}
.pr .news .d{font-size:10px;color:var(--dim);letter-spacing:.14em;text-transform:uppercase}
.pr .news .h{font-size:13.5px;margin-top:2px;line-height:1.4}
.pr .news.good{border-color:var(--green)} .pr .news.bad{border-color:var(--red)}
.pr table{width:100%;border-collapse:collapse;font-family:'Courier Prime',monospace;font-size:12px}
.pr td,.pr th{padding:6px 3px;border-bottom:1px solid var(--line);text-align:right}
.pr td:first-child,.pr th:first-child{text-align:left}
.pr .endmonth{position:fixed;left:0;right:0;bottom:0;padding:12px;display:flex;justify-content:center;
  background:linear-gradient(180deg,rgba(21,19,28,0),rgba(21,19,28,.95) 40%);z-index:40}
.pr .endmonth button{width:min(560px,94%);padding:15px;border-radius:14px;border:none;cursor:pointer;
  font-family:'Limelight',cursive;font-size:18px;letter-spacing:.06em;color:#241c07;
  background:radial-gradient(circle at 50% 20%,#f2d894,#e2b04a 70%);box-shadow:0 0 22px rgba(226,176,74,.4)}
.pr .endmonth button:disabled{filter:grayscale(.7);box-shadow:none}
.pr .overlay{position:fixed;inset:0;background:rgba(9,8,14,.82);z-index:60;display:flex;align-items:flex-end;justify-content:center}
@media(min-width:640px){.pr .overlay{align-items:center}}
.pr .modal{background:var(--panel2);border:1px solid var(--line);border-radius:18px 18px 0 0;width:100%;max-width:560px;
  max-height:88vh;overflow-y:auto;padding:18px}
@media(min-width:640px){.pr .modal{border-radius:18px}}
.pr .modal h3{font-family:'Limelight',cursive;font-weight:400;color:var(--gold);margin:0 0 4px;font-size:19px}
.pr .modal .sub{color:var(--dim);font-size:13px;margin-bottom:14px;line-height:1.5}
.pr .pick{border:1px solid var(--line);border-radius:12px;padding:11px;margin-bottom:8px;cursor:pointer;background:var(--panel)}
.pr .pick.sel{border:2px solid var(--gold);background:#3a2e10;box-shadow:0 0 0 1px rgba(230,180,74,.25) inset}
.pr .pick.sel .nm{color:var(--gold2)}
.pr .pick.busy{opacity:.45;cursor:not-allowed}
.pr .pick .nm{font-weight:700;font-size:14px}
.pr .pick .dt{color:var(--dim);font-size:12px;margin-top:3px;font-family:'Courier Prime',monospace}
.pr .relbar{height:6px;background:#2e2841;border-radius:3px;margin-top:8px;overflow:hidden}
.pr .relbar i{display:block;height:100%;background:linear-gradient(90deg,#77571f,var(--gold));border-radius:3px}
.pr .bignum{font-family:'Courier Prime',monospace;font-weight:700;font-size:clamp(30px,9vw,48px);margin:8px 0;text-align:center}
.pr .verdictline{font-family:'Limelight',cursive;font-size:clamp(18px,5.5vw,26px);text-align:center;margin:8px 0 2px}
.pr .ledger{background:var(--paper);color:#2a2318;border-radius:6px;font-family:'Courier Prime',monospace;padding:14px;margin-top:12px}
.pr .ledger .ln{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px dotted #cbbd92}
.pr .ledger .ln.net{border-top:2px solid #2a2318;border-bottom:none;font-weight:700;font-size:14.5px;margin-top:6px;padding-top:8px}
.pr .empty{color:var(--dim);text-align:center;padding:24px 10px;font-size:13.5px;line-height:1.6}
.pr .saved{position:fixed;top:8px;right:10px;font-size:10px;color:var(--dim);letter-spacing:.12em;z-index:50}
.pr input[type=text]{width:100%;background:var(--panel);border:1px solid var(--line);color:var(--ivory);
  border-radius:10px;padding:10px;font-size:14px;font-family:inherit}
.pr input[type=range]{width:100%;accent-color:var(--gold)}
`;

/* ---------------- helpers ---------------- */
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const uid = () => Math.random().toString(36).slice(2, 9);
const fmtM = (n) => {
  const neg = n < 0 ? "-" : "";
  const v = Math.abs(n);
  if (v >= 1000) return neg + "$" + (v / 1000).toFixed(2) + "B";
  if (v < 1) return neg + "$" + (v * 1000).toFixed(0) + "K";
  return neg + "$" + v.toFixed(1) + "M";
};
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const dateLabel = (t) => MONTHS[t % 12] + " " + (2026 + Math.floor(t / 12));

const FIRST = ["Marla","Dex","Juno","Harlan","Sadie","Vincent","Priya","Cole","Ingrid","Theo","Bianca","Ray","Odette","Marcus","Lena","Gwen","Amos","Rosa","Kit","Delia","Nash","Yuki","Omar","Cleo","Petra","Silas","Nadia"];
const LAST = ["Voss","Calloway","Reyes","Okafor","Lindqvist","Marchetti","Blackwood","Tanaka","Duval","Hargrove","Quintero","Ash","Weller","Fontaine","Beaumont","Ochoa","Sterling","Kovac","Marsh","Huxley","Novak","Whitfield","Crane"];
const mkName = () => pick(FIRST) + " " + pick(LAST);

const T_A = { action:["Iron","Zero","Night","Steel","Vengeance","Black"], scifi:["Signal","Void","Neon","Echo","Titan"], comedy:["Awkward","Big","Accidental","Total","Bad"], thriller:["Silent","Cold","Glass","Vanishing","Midnight"], horror:["Pale","Hollow","Crimson","Wither","Vigil"], drama:["Quiet","Winter","Honest","Borrowed","Small"], family:["Lucky","Maple","Rocket","Whistle","Star"], romance:["Paper","Summer","Golden","Second","Late"] };
const T_B = { action:["Protocol","Reckoning","Strike","Run","Extraction"], scifi:["Horizon","Drift","Paradox","Vector","Relay"], comedy:["Wedding","Reunion","Roommates","Vacation","Heist"], thriller:["Witness","Alibi","Passenger","Ledger","Motive"], horror:["Harvest","Lullaby","Ritual","House","Woods"], drama:["Harbour","Orchard","Mercy","Testimony","Daughters"], family:["Adventure","Dragon","Parade","Detectives","Holiday"], romance:["Letters","Vineyard","Bookshop","Detour","Promise"] };
const mkTitle = (g) => (chance(0.5) ? "The " : "") + pick(T_A[g]) + " " + pick(T_B[g]);

/* ---------------- outcome model: fat tails ---------------- */
/* Buckets of net profit as a multiple of budget. Most films fail or tread water. */
const BUCKETS = [
  { id: 0, label: "A bomb",          k: [-0.85, -0.5] },
  { id: 1, label: "Underperformed",  k: [-0.38, -0.05] },
  { id: 2, label: "Did fine",        k: [-0.05, 0.35] },
  { id: 3, label: "A hit",           k: [0.35, 1.1] },
  { id: 4, label: "A smash",         k: [1.1, 2.2] },
  { id: 5, label: "A phenomenon",    k: [4.0, 12.0] },
];
const TIERS = {
  indie: { label: "Platform indie", B: [4, 16],  w: [27, 32, 24, 11, 5, 1],   rel: "platform" },
  mid:   { label: "Mid-budget",     B: [22, 65], w: [21, 34, 28, 13, 3.7, 0.3], rel: "moderate-to-wide" },
  tent:  { label: "Tentpole",       B: [95, 210],w: [20, 34, 29, 13.5, 3.5, 0], rel: "wide" },
};
function drawBucket(weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < weights.length; i++) { roll -= weights[i]; if (roll <= 0) return i; }
  return 2;
}
function consensusEV(tier, B) {
  const w = TIERS[tier].w;
  const total = w.reduce((s, x) => s + x, 0);
  let ev = 0;
  w.forEach((x, i) => { ev += (x / total) * ((BUCKETS[i].k[0] + BUCKETS[i].k[1]) / 2); });
  return +(ev * B).toFixed(1);
}

/* ---------------- mark-to-market ---------------- */
function shiftWeights(w, n) {
  const v = [...w];
  const step = (f) => {
    if (n > 0) { for (let i = v.length - 2; i >= 0; i--) { const mv = v[i] * 0.35 * f; v[i] -= mv; v[i + 1] += mv; } }
    else { for (let i = 1; i < v.length; i++) { const mv = v[i] * 0.35 * f; v[i] -= mv; v[i - 1] += mv; } }
  };
  const whole = Math.floor(Math.abs(n));
  const frac = Math.abs(n) - whole;
  for (let x = 0; x < whole; x++) step(1);
  if (frac > 0.001) step(frac);
  return v;
}
const bMid = (i) => (BUCKETS[i].k[0] + BUCKETS[i].k[1]) / 2;
function expFromWeights(w) {
  const tot = w.reduce((a, b) => a + b, 0);
  let kE = 0, pE = 0;
  w.forEach((x, i) => { kE += (x / tot) * bMid(i); pE += (x / tot) * Math.max(0, bMid(i) + 0.35); });
  return { kE, pE };
}
function baseWeights(d) {
  const brandPart = d.brandLvl != null ? Math.max(0, (d.brandLvl - 1) * 0.6) : (d.brand ? 1 : 0);
  const lvl = brandPart + (d.pkgShift || 0);
  return lvl > 0 ? shiftWeights(TIERS[d.tier].w, lvl) : TIERS[d.tier].w;
}
function markPosition(d, g) {
  if (d.exited || (d.share <= 0 && d.pts <= 0)) return 0;
  const base = g ? shiftWeights(baseWeights(d), zgMod(d, g)) : baseWeights(d);
  const w = shiftWeights(base, d.news || 0);
  const { kE, pE } = expFromWeights(w);
  const equity = d.share > 0 ? d.share * d.B * (1 + kE) : 0;
  const points = d.pts > 0 ? (d.pts / 100) * d.B * pE : 0;
  return Math.max(0, +(equity + points).toFixed(1));
}
const NEWS_UP = [
  "Tracking comes in hot on \"{T}\". The town revises upward.",
  "The trailer for \"{T}\" goes viral overnight.",
  "Festival buzz starts building around \"{T}\".",
  "Exhibitors quietly ask for more screens for \"{T}\".",
  "A glowing set report on \"{T}\" makes the rounds.",
];
const NEWS_DOWN = [
  "Tracking comes in soft on \"{T}\". The town revises down.",
  "\"{T}\" shuffles its release date. Never a good sign.",
  "Bad word leaks out of a rough-cut screening of \"{T}\".",
  "The lead of \"{T}\" is in the tabloids for all the wrong reasons.",
  "Marketing on \"{T}\" goes suspiciously quiet.",
];

/* signals: what people whisper, keyed to direction */
const SIG_UP = [
  "Between us, the dailies are electric. The crew stays late to watch them.",
  "The lead is suddenly everywhere online. Tracking has not caught up yet.",
  "The test screening in the valley went through the roof. They are hiding the scores.",
  "The composer played me twenty minutes. I got chills in a parking lot.",
  "Exhibitors are quietly asking for more screens. They never do that.",
];
const SIG_DOWN = [
  "The director's cut is a mess. They are three editors deep and hiding it.",
  "The two leads are not speaking. You can feel it in the footage.",
  "The reshoots ran long and the money is gone. Corners got cut where it shows.",
  "Tracking is soft and the studio knows it. Watch how quiet the marketing gets.",
  "A friend saw a rough cut. Their exact word was: oof.",
];


/* ---------------- story hooks: fictionalized industry lore ----------------
   Each deal can carry a story. Stories rhyme with outcomes about 60% of the
   time. The other times, the town's pattern-matching is exactly wrong. */
const HOOKS = [
  /* patterns that historically preceded miracles (tilt +1) */
  { tilt: 1, tiers: ["mid","tent"], txt: "The creature rig breaks every single day, so the director is cutting around it and leaning on dread instead. Half the town calls it a sinking ship. The editor quietly calls it the scariest footage she has ever cut." },
  { tilt: 1, tiers: ["indie","mid"], txt: "The writer refuses to sell unless they play the lead, which is why every studio passed. They will shoot it in a month for scraps. There is something raw in the pages that money usually sands off." },
  { tilt: 1, tiers: ["mid","tent"], txt: "The director is so convinced it will bomb that they booked a beach holiday for opening weekend. Meanwhile the effects team keeps sneaking people into the screening room, and those people come out changed." },
  { tilt: 1, tiers: ["indie"], txt: "A genre quickie: tiny budget, a mask from a costume shop, a score the director hummed into a keyboard over a weekend. Nothing about it should work. The pacing is surgical." },
  { tilt: 1, tiers: ["indie"], txt: "The director funded it moonlighting in an emergency room and shot the road stunts without permits. No names in the cast. The stunt reel makes grown executives grab their armrests." },
  { tilt: 1, tiers: ["indie","mid"], txt: "The test screenings were so bad the producers joked about burning the negative for the insurance. But watch the two leads together for thirty seconds. That kind of chemistry does not test. It spreads." },
  { tilt: 1, tiers: ["mid"], txt: "A rival studio shut this down over a petty budget dispute, so it can be picked up for a song. It is a simple family comedy with one kid at the centre of it, and the kid is lightning." },
  { tilt: 1, tiers: ["indie","mid"], txt: "Every major passed on the script, calling it too wacky and too violent. It is a nonlinear crime picture where people talk about breakfast between the gunfire. The dialogue is already being quoted around town." },
  { tilt: 1, tiers: ["mid"], txt: "The studio has so little faith they quietly sold off their distribution exposure. What they missed: the ending. Test audiences walk out, sit in their cars, and then buy another ticket to watch it again knowing." },
  { tilt: 1, tiers: ["indie"], txt: "Shot on consumer cameras for pocket change. The marketing plan is the movie: convince the internet the footage is real. If the trick lands, the budget is a rounding error." },
  { tilt: 1, tiers: ["indie"], txt: "Nobody would finance it unless the writer changed the family at the centre of the story. She refused, and a very famous couple is quietly backing her instead. It will never win a weekend. It might never leave theatres." },
  { tilt: 1, tiers: ["indie"], txt: "Made by college friends for the cost of a nice car. No plot to speak of, no stars, just a tone so specific it feels like a password. Festival kids are already quoting it in the lobby." },
  { tilt: 1, tiers: ["indie","mid"], txt: "The distributor collapsed a month before release and the picture is a signature away from being dumped straight to video. Whoever grabs it at the eleventh hour gets a finished film for pennies. The finished film is joyous." },
  { tilt: 1, tiers: ["indie"], txt: "Shot in the director's own house in a week for the price of a used sedan, then shelved for two years. The studio bought it planning a glossy remake, but the remake test screening lost to the original in the same room." },
  { tilt: 1, tiers: ["mid"], txt: "The town wrote it off as video-shelf filler for an action star everyone says is finished. Then you see the choreography. The stunt team built a whole grammar of violence, and the star trained for a year to speak it." },
  { tilt: 1, tiers: ["indie","mid"], txt: "A director the town buried is self-financing to keep final cut, and the lead performance is a genuine tour de force. There is also, reportedly, a final scene people will not shut up about." },
  { tilt: 1, tiers: ["indie","mid"], txt: "A sketch comedian directing satirical horror about the thing nobody wants to talk about. The pairing gets laughs at lunches all over town. The cut does not get laughs. It gets silence, and then applause." },
  { tilt: 1, tiers: ["mid"], txt: "There are maybe forty spoken lines in the whole picture, and the studio is terrified mainstream audiences will revolt. But in the test theatre, six hundred strangers held their breath together for ninety minutes. You could hear it." },
  { tilt: 1, tiers: ["indie"], txt: "On paper it is unreleasable: a multiverse family drama with absurdist detours and a tax audit at its emotional core. The directors refused every note. The cut is unlike anything, and word of mouth loves unlike anything." },
  { tilt: 1, tiers: ["indie","mid"], txt: "Greenlit as streaming filler, but the test screenings ran so hot the studio is considering a theatrical pivot, and the marketing team has a genuinely unhinged guerrilla campaign ready. Sometimes the machine catches its own surprise." },
  { tilt: 1, tiers: ["indie","mid"], txt: "A foreign production made for a tenth of what the majors spend on the same monster. It puts the human drama first and the spectacle second, and the spectacle is still better. The town keeps underestimating pictures with subtitles." },
  { tilt: 1, tiers: ["indie"], txt: "Crowdfunded gore with a villain designed to become a Halloween costume. People reportedly faint at screenings, which sounds like a problem and is actually the entire marketing plan. The dare factor is real." },
  { tilt: 1, tiers: ["indie","mid"], txt: "The campaign hides the star's face completely: cryptic ads, coded messages, an urban legend built one billboard at a time. If the mystique holds until opening day, the movie almost does not matter. It happens to be good too." },
  { tilt: 1, tiers: ["tent"], txt: "A toy-brand adaptation the whole town expects to be a two-hour commercial. Except the director is an auteur with a subversive streak and, apparently, total creative control. Either the brand swallows her or she swallows the brand." },
  { tilt: 1, tiers: ["indie","mid"], txt: "Shelved in a corporate merger and rescued by crowdfunding, with a pay-it-forward ticketing scheme that bypasses the whole distribution machine. The town is not built to see an audience the town does not attend." },
  /* patterns that historically preceded catastrophes (tilt -1) */
  { tilt: -1, tiers: ["tent"], txt: "The prestige epic to end all prestige epics. The lead's illness has already moved production across an ocean once, the sets have been rebuilt twice, and the budget has gone up tenfold. The studio says it is too big to fail now." },
  { tilt: -1, tiers: ["mid","tent"], txt: "The director just won every award that exists and has been handed total creative freedom. They are currently on week two of waiting for the correct cloud formations, and they had a finished street set torn down because it felt wrong." },
  { tilt: -1, tiers: ["mid","tent"], txt: "Two of the biggest stars alive, a brilliant comedy director, and a desert shoot. The leads are already feuding, the location is unstable, and the director is famous for shooting fifty takes of someone crossing a street." },
  { tilt: -1, tiers: ["tent"], txt: "The backers are betting everything on single-handedly reviving a genre that has been dead for decades. They have already fired the original lead mid-shoot and the script is being rewritten at night. The word around town is: lifeboats." },
  { tilt: -1, tiers: ["mid","tent"], txt: "The star is directing themselves in a three-hour post-collapse epic about restoring civilization. It is described, by the star, as their most personal work. Three-hour personal epics have a track record, and it is not a good one." },
  { tilt: -1, tiers: ["mid","tent"], txt: "A megastar is using every ounce of leverage to force through an adaptation of their favourite novel. Nobody in the building believes in it, and nobody in the building will say so to their face. That silence is the budget line to worry about." },
  { tilt: -1, tiers: ["mid"], txt: "The pitch is the casting: a celebrity couple at the absolute peak of tabloid frenzy. The tone has already flipped once mid-shoot from crime drama to romantic comedy. The public loves reading about them. Watching is a different transaction." },
  { tilt: -1, tiers: ["mid","tent"], txt: "An iconic character, a bankable star, and a script that fundamentally misunderstands why anyone loved the character. The villain's scheme involves skincare. Nobody on the call seems to think this is a problem." },
  { tilt: -1, tiers: ["tent"], txt: "An auteur has been handed a nine-figure budget and everyone expects sweeping battles and awards. The auteur is quietly making a three-hour psychological study instead. Somebody is going to be very surprised, and it will not be the auteur." },
  { tilt: -1, tiers: ["mid","tent"], txt: "A high-concept actioner about a rogue artificial intelligence, sold on the director's last franchise hit. The plot is a photocopy and the effects house is behind schedule. Loud and generic is the most expensive combination there is." },
  { tilt: -1, tiers: ["tent"], txt: "The source material invented the entire genre a century ago, which is exactly the problem: every film it inspired got there first. Marketing cannot explain what it is in one sentence, and they have stopped trying." },
  { tilt: -1, tiers: ["tent"], txt: "It is an adaptation of a board game. That is the pitch. That is the whole pitch. The budget assumes the formula from the toy-robot franchise transfers to naval grid coordinates. The audience can smell the spreadsheet." },
  { tilt: -1, tiers: ["tent"], txt: "The studio reunited the exact creative team behind their biggest franchise, expecting lightning twice. Production is months behind, the budget has exploded, and the tone changes depending on which day's footage you watch." },
  { tilt: -1, tiers: ["mid","tent"], txt: "It started as a modest period piece. Then the studio mandated fantasy reshoots to justify the budget, and now it is two half-films stapled together, too foreign for one audience and too compromised for the other." },
  { tilt: -1, tiers: ["tent"], txt: "A wholly original space opera with a mythology so dense the marketing department has filed a formal complaint. The release date already slipped once, and whatever momentum existed is gone. Originality is not the problem. Legibility is." },
  { tilt: -1, tiers: ["mid","tent"], txt: "This is the launchpad for a planned six-film universe in a genre the audience is visibly exhausted by. The director's hyper-kinetic style fights the classical material in every frame. Universes announced before movie one rarely reach movie two." },
  { tilt: -1, tiers: ["mid"], txt: "The concept came from an executive's four-year-old, and it shows. Finance is reportedly preparing the write-down before the release date. When the accountants move first, believe the accountants." },
  { tilt: -1, tiers: ["mid","tent"], txt: "The entire campaign is one legendary producer's name above the title. No stars, a predictable script, and a spectacular world nobody asked to visit. A famous mentor is not a famous movie." },
  { tilt: -1, tiers: ["mid","tent"], txt: "A beloved stage musical, an all-star cast, an award-winning director, and a digital fur technology that makes test audiences deeply, physically uncomfortable. The uncanny valley does not care about pedigree." },
  { tilt: -1, tiers: ["tent"], txt: "The grand finale of a decades-long franchise, except the third act was reshot wholesale to avoid resembling a rival's picture, and the seams show. Finales carry the whole saga's expectations and none of its surprise." },
  { tilt: -1, tiers: ["mid","tent"], txt: "A superstar's first big swing after leaving the franchise that made them, and the shoot has already been through two directors and a month of reshoots. There is a scene involving a dragon that people describe only with a pause." },
  { tilt: -1, tiers: ["tent"], txt: "A legacy sequel to a generation-defining classic, made by a returning creator who, by all accounts, resents being asked. The film openly mocks its own audience, and it opens day-and-date on streaming. Nostalgia does not survive contempt." },
  { tilt: -1, tiers: ["mid"], txt: "The animation is gorgeous, the reviews will be kind, and the marketing budget has mysteriously evaporated. A beautiful picture nobody hears about is a write-down with good production design." },
  { tilt: -1, tiers: ["tent"], txt: "The studio is calling it one of the greatest superhero films ever made, which is what studios say when the lead is drowning in controversies, the effects are unfinished, and the multiverse premise has been done to death this same year." },
  { tilt: -1, tiers: ["tent"], txt: "The sequel to a billion-dollar phenomenon, with total creative autonomy for a director who now openly despises what audiences loved about the original. It is, reportedly, a courtroom musical. Betting against the audience is a position too." },
];


function mkSignals(g, e, n) {
  const agents = g.contacts.filter((c) => c.kind === "agent");
  const signals = [];
  for (let i = 0; i < n && agents.length; i++) {
    const src = agents[i % agents.length];
    const truthful = chance(0.72);
    let dir;
    if (truthful) dir = e > 0 ? 1 : e < 0 ? -1 : (chance(0.5) ? 1 : -1) * (chance(0.4) ? 1 : 0);
    else dir = chance(0.5) ? 1 : -1;
    if (dir === 0) continue;
    signals.push({ txt: dir > 0 ? pick(SIG_UP) : pick(SIG_DOWN), who: src.name, dir });
  }
  return signals;
}

/* ---------------- the ladder ---------------- */
const LADDER = [
  { min: 0,  name: "Gun for Hire" },
  { min: 35, name: "Backend Player" },
  { min: 50, name: "Franchise Steward" },
  { min: 65, name: "Overall Dealmaker" },
  { min: 80, name: "Kingmaker" },
];
const ladderIdx = (rep) => { let i = 0; LADDER.forEach((l, j) => { if (rep >= l.min) i = j; }); return i; };

/* ---------------- term sheet negotiation ---------------- */
const PROFILES = {
  cashpoor:  { cF: 4.5, cP: 0.85, cS: 1.5, cEq: -1.2, decay: 0.93,
    tell: "Word around town is the studio's slate has them stretched painfully thin this quarter." },
  backend:   { cF: 1.5, cP: 2.2,  cS: 2.1, cEq: 2.2,  decay: 0.93,
    tell: "This studio is famous for guarding every point of gross like a firstborn child." },
  franchise: { cF: 2.5, cP: 1.1,  cS: 4.5, cEq: 1.5,  decay: 0.93,
    tell: "They see this as the first film of a universe. They will not share the future cheaply." },
  closer:    { cF: 2.5, cP: 1.2,  cS: 1.5, cEq: 1.5,  decay: 0.8,
    tell: "The executive running this one hates long negotiations. Speed is currency with them." },
};
const PROFILE_IDS = Object.keys(PROFILES);
const LEVER_STEPS = { fee: 0.25, pts: 1, sq: 1, eq: 5 };

function askValue(prof, ask) {
  const p = PROFILES[prof];
  return ask.fee * p.cF + ask.pts * p.cP + ask.sq * p.cS + (ask.eq / 10) * p.cEq;
}
function mkNego(g, deal) {
  const r = g.career && g.career.restrictions;
  let profile = deal.tell ? deal.tell.trueProf : pick(PROFILE_IDS);
  if (r && r.investorConservatism && chance(r.investorConservatism)) profile = "cashpoor";
  let R = +(14 + (g.rep - 25) / 8 - deal.heat * 1.5 + (deal.firstLook ? 2.5 : 0) + rnd(-2, 2)).toFixed(1);
  if (r && r.starsRareMult) R *= r.starsRareMult;
  let maxEq = deal.tier === "tent" ? 30 : 40;
  if (r && r.noEquityAbove) maxEq = Math.min(maxEq, Math.round(r.noEquityAbove * 100));
  return { profile, R: Math.max(5, R), round: 0, counter: null, maxEq };
}
function mkCounter(deal, nego, ask, factor) {
  /* they scale back your ask, cutting their most expensive levers hardest */
  const p = PROFILES[nego.profile];
  const c = { fee: ask.fee, pts: ask.pts, sq: ask.sq, eq: Math.min(ask.eq, nego.maxEq) };
  const target = nego.R * (factor || 0.9);
  const unit = (lv) => lv === "fee" ? p.cF * LEVER_STEPS.fee : lv === "pts" ? p.cP : lv === "sq" ? p.cS : p.cEq / 2;
  let guard = 0;
  while (askValue(nego.profile, c) > target && guard < 200) {
    guard++;
    const cuttable = ["fee","pts","sq","eq"].filter((lv) => c[lv] > 0 && unit(lv) > 0);
    if (!cuttable.length) break;
    cuttable.sort((a, b) => unit(b) - unit(a));
    const lv = cuttable[0];
    c[lv] = +Math.max(0, c[lv] - LEVER_STEPS[lv]).toFixed(2);
  }
  /* cash-poor studios sweeten by inviting more of your money in */
  if (p.cEq < 0 && c.eq < nego.maxEq) c.eq = Math.min(nego.maxEq, c.eq + 5);
  return c;
}
function counterText(ask, c, prof) {
  const cuts = [];
  if (c.fee < ask.fee) cuts.push("shave the fee to " + fmtM(c.fee));
  if (c.pts < ask.pts) cuts.push("pull your points back to " + c.pts);
  if (c.sq < ask.sq) cuts.push(c.sq === 0 ? "strike the sequel participation entirely" : "cut sequel participation to " + c.sq);
  const adds = [];
  if (c.eq > ask.eq) adds.push("they would welcome you up to " + c.eq + "% of the financing");
  let t = cuts.length ? "They " + cuts.join(", ") + "." : "They barely touch your numbers.";
  if (adds.length) t += " Notably, " + adds.join(" and ") + ".";
  t += " What they protected tells you what they value.";
  return t;
}

/* ---------------- market zeitgeist ----------------
   A genre trend shifts every six months. Your Chief of Staff reads it for
   you, calibrated by how good your agent relationships are, and the read
   can simply be wrong. The real trend always drives the odds; the read
   only drives what you are told. */
const ZG_GENRES = ["action","scifi","comedy","thriller","horror","drama","family","romance"];
const ZG_SENT = ["Cold","Cooling","Neutral","Bullish","Euphoric"];
function truthSkill(g) {
  const agents = g.contacts.filter((c) => c.kind === "agent");
  const avg = agents.length ? agents.reduce((s, c) => s + c.rel, 0) / agents.length : 40;
  return clamp(0.45 + avg / 250, 0.45, 0.85);
}
function mkZeitgeist(t, skill) {
  const trend = pick(ZG_GENRES);
  const reliable = chance(skill);
  return {
    trend, sentiment: pick(["Neutral","Bullish","Bullish","Cooling"]), since: t, nextAt: t + 6,
    read: reliable ? trend : pick(ZG_GENRES.filter((x) => x !== trend)),
    confidence: reliable ? pick(["High","Medium"]) : pick(["Low","Medium"]),
  };
}
function shiftZeitgeist(g) {
  if (!g.zeitgeist) { g.zeitgeist = mkZeitgeist(g.t, truthSkill(g)); return g.zeitgeist; }
  if (g.t < g.zeitgeist.nextAt) return g.zeitgeist;
  const skill = truthSkill(g);
  const trend = pick(ZG_GENRES.filter((x) => x !== g.zeitgeist.trend));
  const sentiment = pick(ZG_SENT);
  const reliable = chance(skill);
  g.zeitgeist = { trend, sentiment, since: g.t, nextAt: g.t + 6, read: reliable ? trend : pick(ZG_GENRES.filter((x) => x !== trend)), confidence: reliable ? pick(["High","Medium"]) : pick(["Low","Medium"]) };
  return g.zeitgeist;
}
function zgMod(d, g) {
  const z = g.zeitgeist;
  if (!z || !d.genre) return 0;
  const heat = z.sentiment === "Euphoric" ? 1 : z.sentiment === "Bullish" ? 0.65 : z.sentiment === "Cooling" ? -0.35 : z.sentiment === "Cold" ? -0.65 : 0;
  if (d.genre === z.trend) return heat;
  if (heat > 0 && (d.tier === "tent" || d.tier === "mid")) return -0.15;
  return 0;
}

/* ---------------- talent farm (light, playable) ----------------
   A prospect is cheap genre talent the player can discover, sign, and
   attach to a specific deal for a small real odds bump. Signing is a
   multi-picture contract; when it runs out, the prospect needs a new,
   pricier deal or drifts back onto the open market. */
const PROSPECT_FIRST = ["Marlowe","Odessa","Reyes","Vance","Wren","Calder","Ines","Sable","Boone","Nakamura","Osei","Delgado","Faye","Quill","Rourke","Nash"];
const PROSPECT_LAST = ["Cho","Dubois","Ferro","Hallett","Ibarra","Jansen","Kilbride","Larkspur","Moreau","Okafor","Pryce","Solano","Tran","Vasquez","Whitlock"];
const PROSPECT_GENRES = ["horror","drama","comedy","thriller","action","scifi","romance","family"];
function mkProspectName() { return pick(PROSPECT_FIRST) + " " + pick(PROSPECT_LAST); }

function mkProspect(role, genrePool, discoveredByScenario) {
  const potential = ri(20, 95);
  const noisy = chance(0.7);
  const trueGrade = potential >= 78 ? "A" : potential >= 55 ? "B" : "C";
  const visibleGrade = noisy ? trueGrade : pick(["C","B","A"].filter((x) => x !== trueGrade));
  const tier = 3;
  const costPerFilm = +clamp(0.15 + potential / 260, 0.15, 0.8).toFixed(2);
  return {
    id: uid(), name: mkProspectName(), role, tier, potential, visibleGrade, costPerFilm,
    genreAffinity: pick(genrePool || PROSPECT_GENRES),
    signed: false, contract: null, discoveredByScenario: !!discoveredByScenario,
    breakoutStatus: "unknown",
  };
}

function scoutProspects(g, n) {
  const sc = g.career ? scenarioById(g.career.scenarioId) : null;
  const pool = sc && sc.talentPool ? sc.talentPool : null;
  const found = [];
  for (let i = 0; i < (n || 1); i++) {
    const role = pool ? pick(pool.roles) : pick(["director","actor","writer"]);
    const genrePool = pool ? pool.genres : null;
    found.push(mkProspect(role, genrePool, !!pool));
  }
  return found;
}

function signProspect(g, prospectId, films, feeMult) {
  const p = (g.talentProspects || []).find((x) => x.id === prospectId);
  if (!p || p.signed || typeof p.costPerFilm !== "number" || Number.isNaN(p.costPerFilm)) return false;
  const signingFee = +(p.costPerFilm * 2 * (feeMult || 1)).toFixed(2);
  if (!(signingFee >= 0) || g.cash < signingFee) return false;
  g.cash = +(g.cash - signingFee).toFixed(2);
  p.signed = true;
  p.contract = { filmsRemaining: films || 3, costPerFilm: +(p.costPerFilm * (feeMult || 1)).toFixed(2), lockedUntilTier: Math.max(1, p.tier - 1) };
  return true;
}

function attachProspectToDeal(g, dealId, prospectId) {
  const d = g.deals.find((x) => x.id === dealId);
  const p = (g.talentProspects || []).find((x) => x.id === prospectId);
  if (!d || !p || !p.signed || !p.contract || p.contract.filmsRemaining <= 0) return false;
  if (typeof p.contract.costPerFilm !== "number" || Number.isNaN(p.contract.costPerFilm) || g.cash < p.contract.costPerFilm) return false;
  g.cash = +(g.cash - p.contract.costPerFilm).toFixed(2);
  const match = d.genre === p.genreAffinity;
  const gradeBoost = p.visibleGrade === "A" ? 0.5 : p.visibleGrade === "B" ? 0.3 : 0.15;
  d.pkgShift = (d.pkgShift || 0) + (match ? gradeBoost : gradeBoost * 0.25);
  d.attachedProspectId = p.id;
  d.attachedProspectName = p.name;
  return true;
}

function resolveProspectOutcome(g, d, bucket) {
  if (!d.attachedProspectId) return;
  const p = (g.talentProspects || []).find((x) => x.id === d.attachedProspectId);
  if (!p || !p.contract) return;
  p.contract.filmsRemaining = Math.max(0, p.contract.filmsRemaining - 1);
  const order = ["unknown","rising","breakout","star"];
  const idx = order.indexOf(p.breakoutStatus);
  if (bucket >= 4 && idx < order.length - 1) { p.breakoutStatus = order[idx + 1]; addLog(g, p.name + " is turning into someone the town talks about: " + p.breakoutStatus + ".", "good"); }
  else if (bucket <= 1 && idx > 0) { p.breakoutStatus = order[Math.max(0, idx - 1)]; }
  if (p.contract.filmsRemaining <= 0) {
    p.signed = false;
    p.contractExpired = true;
    p.costPerFilm = +(p.costPerFilm * 1.6).toFixed(2);
    addLog(g, p.name + "'s contract runs out. Word is out on them now, the next deal will not be this cheap.", "");
  }
}

/* ---------------- hard assets / balance sheet (architecture + real cash effect) ----------------
   Deliberately thin. Income and cost hit the books every month for real,
   and anything sellable can be sold. Lease-back and scenario turnarounds
   are future hooks, not implemented this pass. */
function mkHardAsset(opts) {
  return {
    id: uid(), name: opts.name, type: opts.type, value: opts.value,
    monthlyIncome: opts.monthlyIncome || 0, monthlyCost: opts.monthlyCost || 0,
    canSell: opts.canSell !== false, canLeaseBack: !!opts.canLeaseBack,
    scenarioLocked: !!opts.scenarioLocked,
  };
}
function applyHardAssetCashflow(g) {
  const assets = g.hardAssets || [];
  if (!assets.length) return 0;
  const net = assets.reduce((s, a) => s + (a.monthlyIncome || 0) - (a.monthlyCost || 0), 0);
  if (net) g.cash = +(g.cash + net).toFixed(2);
  return net;
}
function sellHardAsset(g, assetId) {
  const a = (g.hardAssets || []).find((x) => x.id === assetId);
  if (!a || !a.canSell) return false;
  const proceeds = +(a.value * 0.85).toFixed(1);
  g.cash = +(g.cash + proceeds).toFixed(1);
  g.hardAssets = (g.hardAssets || []).filter((x) => x.id !== assetId);
  addLog(g, "You sell " + a.name + " for " + fmtM(proceeds) + ". The monthly " + (a.monthlyIncome > a.monthlyCost ? "income" : "upkeep") + " is gone with it.", "");
  return true;
}

/* ---------------- meta progression: trophy room ----------------
   Lives outside any single game save. Passive and visible only, per the
   current pass; Sandbox is not rebalanced around it yet. */
const GRADE_ORDER = ["D","C","C+","B","B+","A","A+"];
function gradeAtLeast(grade, floor) { return GRADE_ORDER.indexOf(grade) >= GRADE_ORDER.indexOf(floor); }
function computeEarnedUnlocks(sc, grade) {
  if (!sc.sandboxUnlocks) return [];
  return sc.sandboxUnlocks.filter((u) => gradeAtLeast(grade, u.requiresGrade));
}
function mergeMetaProgress(meta, scenarioId, grade, earnedUnlocks) {
  const m = meta ? JSON.parse(JSON.stringify(meta)) : { completedScenarios: {}, sandboxUnlocks: [] };
  const prevBest = m.completedScenarios[scenarioId];
  if (!prevBest || gradeAtLeast(grade, prevBest)) m.completedScenarios[scenarioId] = grade;
  earnedUnlocks.forEach((u) => { if (!m.sandboxUnlocks.some((x) => x.id === u.id)) m.sandboxUnlocks.push({ id: u.id, name: u.name, description: u.description, earnedFrom: scenarioId }); });
  return m;
}

/* ---------------- black swan ---------------- */
function applyBlackSwan(g, d, b) {
  if (!chance(0.04)) return { b, hit: false };
  if (b >= 3) {
    addLog(g, `"${d.title}" was a lock on paper. A real-world story breaks the same week and the audience simply is not there. Nobody saw it coming, because nobody could have.`, "bad");
    return { b: Math.max(0, b - 3), hit: true };
  } else {
    addLog(g, `"${d.title}" catches fire for a reason nobody can name. Sometimes the culture just decides.`, "good");
    return { b: Math.min(d.tier === "tent" ? 4 : 5, b + 3), hit: true };
  }
}

/* ---------------- career mode: scenario engine ----------------
   A scenario is data, not a fork of the game. Restrictions are read at
   runtime by mkDeal, tierFor, commitDeal, and refreshOffers. Objectives
   are checked every month by checkCareerProgress. New scenarios only
   need an entry in SCENARIOS, nothing else in the engine changes. */
const SCENARIOS = [
  {
    id: "horror", name: "The Horror Factory", difficulty: "Moderate", startYear: 2026,
    startCash: 10, startRep: 25, estLength: "6 to 9 years",
    desc: "Build the world's premier horror studio. Small budgets, thin margins, and a genre the town still underrates.",
    goal: "Produce 25 horror films, reach Brand Power 90, and bank $500M in lifetime profit, without ever going bankrupt.",
    restrictions: { maxBudget: 15, allowedGenres: ["horror"], investorConservatism: 0.7, streamingFocus: true, forceTier: "indie", starsRareMult: 0.6 },
    talentPool: { roles: ["director","actor","director","actor"], genres: ["horror"] },
    hardAssets: [ { name: "Practical Effects Shop", type: "production_facility", value: 4, monthlyIncome: 0, monthlyCost: 0.02, canSell: true, canLeaseBack: false, scenarioLocked: false } ],
    rivalStudioLogic: [ { id: "cheapscares", name: "CheapScares Pictures", style: "release_window_attack", aggression: 0.6, cash: 8, activeFromAct: 2, description: "A rival horror label that floods the calendar with quick, disposable slashers. Data hook only this pass, no active AI yet." } ],
    sandboxUnlocks: [ { id: "microbudget-horror", name: "Microbudget Horror Specialist", description: "A trophy for the Sandbox Trophy Room, earned by mastering the horror factory. Passive for now: it does not yet change Sandbox odds or costs.", requiresGrade: "A" } ],
    victory: [
      { id: "films", label: "25 horror films produced", check: (g) => g.career.filmsInGenre >= 25, target: 25, prog: (g) => g.career.filmsInGenre },
      { id: "brand", label: "Brand Power 90", check: (g) => g.career.brandPower >= 90, target: 90, prog: (g) => Math.round(g.career.brandPower) },
      { id: "profit", label: "$80M lifetime profit", check: (g) => g.career.lifetimeProfit >= 80, target: 80, prog: (g) => Math.round(g.career.lifetimeProfit) },
    ],
    acts: [
      { title: "Act I: Prove the genre pays", objective: "Produce 5 horror films without going broke." },
      { title: "Act II: The town takes notice", objective: "Reach Brand Power 50. Rivals start chasing your slot in the release calendar." },
      { title: "Act III: The genre's home address", objective: "Push to 25 films and $80M lifetime profit. This is the whole mountain." },
    ],
  },
  {
    id: "indie", name: "The Indie Auteur", difficulty: "Hard", startYear: 2026,
    startCash: 9, startRep: 20, estLength: "5 to 8 years",
    desc: "No A-list stars, no budget above $5M, and box office is not how you keep score. Festivals and critics decide if you matter.",
    goal: "Reach Reputation 85 through acclaim, having produced at least 12 films, all of them under $5M.",
    restrictions: { maxBudget: 5, allowedGenres: ["drama","thriller","horror","comedy","romance"], investorConservatism: 0.9, streamingFocus: false, forceTier: "indie", starsRareMult: 0.3, noEquityAbove: 0.35 },
    talentPool: { roles: ["director","writer","director","writer","actor"], genres: ["drama","thriller","romance"] },
    rivalStudioLogic: [ { id: "lumenfilm", name: "Lumen Film Collective", style: "overpay_scripts", aggression: 0.5, cash: 6, activeFromAct: 2, description: "A prestige distributor that outbids everyone for the same festival scripts. Data hook only this pass, no active AI yet." } ],
    sandboxUnlocks: [ { id: "festival-scout", name: "Festival Scout", description: "A trophy for the Sandbox Trophy Room, earned by building a career on acclaim instead of box office. Passive for now: it does not yet change Sandbox mechanics.", requiresGrade: "A" } ],
    victory: [
      { id: "rep", label: "Reputation 85", check: (g) => g.rep >= 85, target: 85, prog: (g) => g.rep },
      { id: "films", label: "12 films produced under $5M", check: (g) => g.career.filmsInGenre >= 12, target: 12, prog: (g) => g.career.filmsInGenre },
    ],
    acts: [
      { title: "Act I: Nobody owes you a seat", objective: "Produce 4 films and survive on scraps." },
      { title: "Act II: The festival circuit notices", objective: "Reach Reputation 55. Acclaim is starting to open doors money never could." },
      { title: "Act III: The auteur's reputation", objective: "Reach Reputation 85 across at least 12 films. This was never about the money." },
    ],
  },
];
const failureCommon = [
  { id: "bankrupt", label: "Bankruptcy", check: (g) => g.over },
];

function scenarioById(id) { return SCENARIOS.find((s) => s.id === id); }

function newCareerGame(name, scenarioId) {
  const sc = scenarioById(scenarioId);
  const g = newGame(name, "producer");
  g.mode = "career";
  g.cash = sc.startCash;
  g.rep = sc.startRep;
  g.career = {
    scenarioId, title: sc.name, act: 0, brandPower: 0, filmsInGenre: 0, lifetimeProfit: 0,
    restrictions: sc.restrictions, log: [], result: null,
  };
  g.deals = []; g.offers = [];
  g.talentProspects = scoutProspects(g, 3);
  if (sc.hardAssets) g.hardAssets = sc.hardAssets.map((a) => mkHardAsset(a));
  refreshDesk(g);
  refreshOffers(g);
  addLog(g, `Career begins: ${sc.name}. ${sc.goal}`, "good");
  addLog(g, sc.acts[0].title + " -- " + sc.acts[0].objective);
  return g;
}

/* deals are reshaped to respect a scenario's restrictions right after mkDeal builds them */
function applyCareerRestrictions(g, d) {
  const r = g.career && g.career.restrictions;
  if (!r) return d;
  if (r.allowedGenres && !r.allowedGenres.includes(d.genre)) d.genre = pick(r.allowedGenres);
  if (r.maxBudget && d.B > r.maxBudget) {
    d.B = Math.max(2, Math.round(r.maxBudget * rnd(0.7, 1)));
    d.tier = d.B <= 16 ? "indie" : d.B <= 65 ? "mid" : "tent";
    const fee = +clamp(d.B * 0.012, 0.2, 1.5).toFixed(1);
    d.fee = fee;
    d.structures = [
      { id: "fee", label: "Producer credit, fee only", fee, pts: 0, maxShare: 0 },
      { id: "points", label: "Smaller fee plus backend points", fee: +(fee * 0.45).toFixed(1), pts: ri(4, 7), maxShare: 0 },
    ];
    if (!r.investorConservatism || chance(1 - r.investorConservatism)) d.structures.push({ id: "coown", label: "Co-finance for equity", fee: +(fee * 0.35).toFixed(1), pts: 0, maxShare: Math.min(r.noEquityAbove || 1, d.tier === "tent" ? 0.25 : 0.5) });
    d.structures.push({ id: "own", label: "Finance it yourself, own it all", fee: 0, pts: 0, maxShare: 1 });
    d.consensusNet = consensusEV(d.tier, d.B);
  }
  if (r.investorConservatism) {
    d.structures = d.structures.filter((st) => st.id !== "coown" || chance(1 - r.investorConservatism * 0.6));
    d.structures.forEach((st) => { if (st.maxShare) st.maxShare = Math.min(st.maxShare, r.noEquityAbove || 1); });
  }
  return d;
}

/* tracks the meters every scenario's victory conditions actually read */
function trackCareerOutcome(g, d, net) {
  if (!g.career) return;
  const r = g.career.restrictions;
  g.career.lifetimeProfit = +(g.career.lifetimeProfit + net).toFixed(1);
  const inGenre = !r.allowedGenres || r.allowedGenres.includes(d.genre);
  if (inGenre) {
    g.career.filmsInGenre += 1;
    if (net > 0.5) g.career.brandPower = Math.min(100, +(g.career.brandPower + rnd(3, 7)).toFixed(1));
    else if (net < -0.5) g.career.brandPower = Math.max(0, +(g.career.brandPower - rnd(2, 5)).toFixed(1));
  }
}

function careerScore(g) {
  const sc = scenarioById(g.career.scenarioId);
  const financial = clamp(30 + g.career.lifetimeProfit / 10, 0, 100);
  const reputation = clamp(g.rep, 0, 100);
  const brand = clamp(g.career.brandPower, 0, 100);
  const relAvg = g.contacts.length ? g.contacts.reduce((s, c) => s + c.rel, 0) / g.contacts.length : 40;
  const relationships = clamp(relAvg, 0, 100);
  const riskAvg = g.stats.done ? clamp(100 - (g.stats.losses / g.stats.done) * 140, 0, 100) : 50;
  const longevity = clamp(g.t / 1.2, 0, 100);
  const legacy = clamp(g.career.filmsInGenre * 4, 0, 100);
  const dims = [
    { label: "Financial Success", v: financial },
    { label: "Critical Reputation", v: reputation },
    { label: "Brand Power", v: brand },
    { label: "Talent Relationships", v: relationships },
    { label: "Risk Management", v: riskAvg },
    { label: "Longevity", v: longevity },
    { label: "Studio Legacy", v: legacy },
  ];
  const overall = dims.reduce((s, d) => s + d.v, 0) / dims.length;
  const grade = overall >= 90 ? "A+" : overall >= 82 ? "A" : overall >= 74 ? "B+" : overall >= 65 ? "B" : overall >= 55 ? "C+" : overall >= 45 ? "C" : "D";
  return { dims, overall: Math.round(overall), grade };
}

function checkCareerProgress(g) {
  if (!g.career || g.career.result) return;
  const sc = scenarioById(g.career.scenarioId);
  const won = sc.victory.every((v) => v.check(g));
  if (won) {
    const score = careerScore(g);
    g.career.result = { victory: true, score, earnedUnlocks: computeEarnedUnlocks(sc, score.grade) };
    addLog(g, `Every objective of "${sc.name}" is met. ${sc.goal}`, "good");
    return;
  }
  if (g.over) {
    const score = careerScore(g);
    g.career.result = { victory: false, score, earnedUnlocks: computeEarnedUnlocks(sc, score.grade) };
    return;
  }
  /* act advancement: purely narrative, checked against simple milestones per act */
  const act = g.career.act;
  if (act === 0 && g.career.filmsInGenre >= (sc.id === "horror" ? 5 : 4)) {
    g.career.act = 1;
    addLog(g, sc.acts[1].title + " -- " + sc.acts[1].objective, "good");
  } else if (act === 1) {
    const gate = sc.id === "horror" ? g.career.brandPower >= 50 : g.rep >= 55;
    if (gate) { g.career.act = 2; addLog(g, sc.acts[2].title + " -- " + sc.acts[2].objective, "good"); }
  }
}

/* ---------------- contacts ---------------- */
const ROLES = [
  { kind: "packager", label: "Producer / packager", gives: "Brings you deals. Warm packagers bring first looks with no rivals." },
  { kind: "agent",    label: "Talent agent", gives: "Feeds you signals from inside productions." },
  { kind: "streamer", label: "Streamer executive", gives: "Shows up mid-production with buyout offers." },
  { kind: "studio",   label: "Studio executive", gives: "Opens the door to bigger-budget deals." },
];
function mkContact(kind, rel) {
  const role = ROLES.find((r) => r.kind === kind);
  return { id: uid(), name: mkName(), kind, label: role.label, gives: role.gives, rel: rel != null ? rel : ri(25, 40) };
}

/* ---------------- deal generation ---------------- */
function tierFor(g) {
  if (g.career && g.career.restrictions && g.career.restrictions.forceTier) return g.career.restrictions.forceTier;
  const r = Math.random();
  if (g.rep >= 55 && r < 0.22) return "tent";
  if (g.rep >= 30 && r < 0.55) return "mid";
  return chance(0.55) ? "mid" : "indie";
}

function mkDeal(g, opts) {
  opts = opts || {};
  const tier = opts.tier || tierFor(g);
  const tinfo = TIERS[tier];
  const genre = tier === "tent" ? pick(["action","scifi","family"]) : tier === "indie" ? pick(["drama","horror","comedy","romance","thriller"]) : pick(["comedy","thriller","action","drama","horror","romance"]);
  const B = +rnd(tinfo.B[0], tinfo.B[1]).toFixed(0);
  /* hidden edge: how wrong the town is about this one */
  const eRoll = Math.random();
  const e = eRoll < 0.08 ? -2 : eRoll < 0.30 ? -1 : eRoll < 0.70 ? 0 : eRoll < 0.92 ? 1 : 2;
  const packagers = g.contacts.filter((c) => c.kind === "packager");
  const packager = opts.packagerId ? g.contacts.find((c) => c.id === opts.packagerId) : pick(packagers);
  const firstLook = !!opts.firstLook;
  const heat = firstLook ? 0 : ri(0, 3);

  /* signals: your agent relationships decide how much you hear */
  const agents = g.contacts.filter((c) => c.kind === "agent" && c.rel >= 45);
  const nSignals = Math.min(2, agents.length >= 2 && chance(0.7) ? 2 : agents.length >= 1 && chance(0.75) ? 1 : 0);
  const signals = mkSignals(g, e, nSignals);

  /* story hook: rhymes with the truth ~60% of the time, traps ~22% */
  let hook = null;
  if (chance(0.78)) {
    const fits = (h) => h.tiers.includes(tier);
    const aligned = HOOKS.filter((h) => fits(h) && (e !== 0 ? h.tilt === Math.sign(e) : true));
    const opposite = HOOKS.filter((h) => fits(h) && e !== 0 && h.tilt === -Math.sign(e));
    const r = Math.random();
    let pool = null;
    if (e !== 0) pool = r < 0.6 ? aligned : r < 0.82 ? opposite : null;
    else pool = r < 0.6 ? aligned : null;
    if (pool && pool.length) { const h = pick(pool); hook = { txt: h.txt, tilt: h.tilt }; }
  }

  const fee = +clamp(B * 0.012, 0.2, 1.5).toFixed(1);
  const structures = [
    { id: "fee", label: "Producer credit, fee only", fee, pts: 0, maxShare: 0 },
    { id: "points", label: "Smaller fee plus backend points", fee: +(fee * 0.45).toFixed(1), pts: ri(4, 7), maxShare: 0 },
  ];
  if (chance(0.75) || firstLook) structures.push({ id: "coown", label: "Co-finance for equity", fee: +(fee * 0.35).toFixed(1), pts: 0, maxShare: tier === "tent" ? 0.25 : 0.5 });
  if (tier === "indie" && chance(0.4)) structures.push({ id: "own", label: "Finance it yourself, own it all", fee: 0, pts: 0, maxShare: 1 });

  const termSheet = tier === "tent" || (tier === "mid" && (heat >= 2 || firstLook));
  let tell = null;
  if (termSheet && chance(0.6)) {
    const trueProf = pick(PROFILE_IDS);
    const shownProf = chance(0.7) ? trueProf : pick(PROFILE_IDS.filter((x) => x !== trueProf));
    tell = { txt: PROFILES[shownProf].tell, trueProf };
  }
  const built = {
    id: uid(), title: mkTitle(genre), genre, tier, B, e, heat, firstLook,
    termSheet, tell, nego: null, sq: 0,
    packagerId: packager ? packager.id : null, packagerName: packager ? packager.name : "an open assignment",
    hook, signals, structures, fee,
    consensusNet: consensusEV(tier, B),
    status: "offered", struct: null, invested: 0, myFee: 0, pts: 0, share: 0,
    sweetened: false, exited: false, exitPay: 0, fixPaid: false, news: 0, mark: 0,
    releaseAt: 0, result: null,
  };
  return g.career ? applyCareerRestrictions(g, built) : built;
}

/* ---------------- game state ---------------- */
function newGame(name, mode, studioName) {
  const contacts = [
    mkContact("packager", 45), mkContact("packager", 32),
    mkContact("agent", 50), mkContact("agent", 34),
    mkContact("streamer", 35), mkContact("studio", 30),
  ];
  const g = {
    name, t: 0, cash: 10, rep: 25, contacts,
    deals: [], pipeline: [], closed: [], log: [], queue: [],
    offers: [], franchise: null, overall: null, kingmakerAt: 12, lastLadder: 0,
    studioMode: false, studioName: null, ownStake: 1, receivables: [], library: [], ips: [], sequelPipe: [], lastInflow: 0, retired: null,
    talentReneg: [], zeitgeist: null, insurance: null, oldStudios: [],
    talentProspects: [], hardAssets: [],
    stats: { done: 0, wins: 0, losses: 0, bestNet: 0, worstNet: 0, exits: 0, exitRegret: 0 },
    over: false, won: false,
  };
  if (mode === "studio") {
    g.studioMode = true;
    g.studioName = (studioName || "").trim() || (name.split(" ")[0] + " Pictures");
    g.cash = 300;
    g.rep = 55;
    g.won = true;
    addLog(g, `${g.studioName} opens its gates with ${fmtM(g.cash)} and a chairman the town already respects. You produce, you own, you build.`);
  } else {
    addLog(g, `${name} hangs a shingle: a phone, a couch, and ${fmtM(g.cash)}. The town has already priced everything. Prove it wrong.`);
  }
  refreshDesk(g);
  refreshOffers(g);
  return g;
}
function addLog(g, txt, kind) {
  g.log.unshift({ d: dateLabel(g.t), txt, kind: kind || "" });
  if (g.log.length > 80) g.log.length = 80;
}
const byId = (g, id) => g.contacts.find((c) => c.id === id);
const plateCap = (g) => (g.studioMode ? 9 : 6);
const commitCap = (g) => (g.studioMode ? 3 : 2);
const relMove = (g, id, amt) => { const c = byId(g, id); if (c) c.rel = clamp(c.rel + amt, 0, 100); };

function mkSequelDeal(g, sq) {
  const d = mkDeal(g, { tier: sq.tier });
  d.title = sq.title; d.genre = sq.genre; d.B = sq.B;
  d.brand = true; d.firstLook = true; d.heat = 0; d.termSheet = true; d.hook = null; d.tell = null;
  d.packagerId = sq.packagerId; d.packagerName = sq.packagerName;
  /* the budget changed after the fee and structures were rolled: recompute them for real */
  const fee = +clamp(d.B * 0.012, 0.2, 1.5).toFixed(1);
  d.fee = fee;
  d.structures = [
    { id: "fee", label: "Producer credit, fee only", fee, pts: 0, maxShare: 0 },
    { id: "points", label: "Smaller fee plus backend points", fee: +(fee * 0.45).toFixed(1), pts: ri(4, 7) + (sq.ptsBump || 0), maxShare: 0 },
  ];
  d.structures.push({ id: "coown", label: "Co-finance for equity", fee: +(fee * 0.35).toFixed(1), pts: 0, maxShare: d.tier === "tent" ? 0.25 : 0.5 });
  d.consensusNet = consensusEV(sq.tier, sq.B);
  /* a career's restrictions apply to sequels too: a hit does not buy its way out of the budget cap */
  return g.career ? applyCareerRestrictions(g, d) : d;
}
function refreshDesk(g) {
  g.deals = [];
  /* sequels to your smashes arrive first-look, but talent leverage must be settled first */
  if (g.sequelPipe && g.sequelPipe.length) {
    const sq = g.sequelPipe.shift();
    if (sq.renegId) g.queue.push({ type: "reneg", sq, renegId: sq.renegId });
    else g.deals.push(mkSequelDeal(g, sq));
  }
  const warmPackagers = g.contacts.filter((c) => c.kind === "packager" && c.rel >= 62);
  /* first looks from packagers who trust you: exclusive, no rivals */
  warmPackagers.forEach((p) => { if (chance(0.5)) g.deals.push(mkDeal(g, { packagerId: p.id, firstLook: true })); });
  const openN = ri(2, 3);
  for (let i = 0; i < openN; i++) g.deals.push(mkDeal(g));
  if (g.deals.length > 4) g.deals = g.deals.slice(0, 4);
}

/* ---------------- committing to a deal ---------------- */
function commitDeal(g, deal, structId, sharePct) {
  const st = deal.structures.find((s) => s.id === structId);
  if (!st) return null;
  if ((g.committedThisMonth || 0) >= commitCap(g)) return { full: true };
  if (g.pipeline.filter((x) => x.status === "pipeline").length >= plateCap(g)) return { full: true };
  const rr = g.career && g.career.restrictions;
  if (rr && rr.maxBudget && deal.B > rr.maxBudget) return { blocked: true };
  deal.struct = structId;
  deal.myFee = st.fee;
  deal.pts = st.pts;
  deal.share = structId === "own" ? 1 : structId === "coown" ? clamp(sharePct, 0.05, st.maxShare) : 0;
  deal.invested = +(deal.B * deal.share).toFixed(1);
  if (deal.invested > g.cash + st.fee) return null;
  /* rival check: contested deals can force your hand */
  if (deal.heat > 0 && chance(deal.heat * 0.28)) {
    return { rival: true };
  }
  finalizeCommit(g, deal);
  return { rival: false };
}

function finalizeCommit(g, deal, sweetened) {
  if (sweetened) {
    deal.sweetened = true;
    deal.myFee = +(deal.myFee * 0.55).toFixed(1);
    deal.pts = Math.max(0, deal.pts - 2);
    deal.invested = +(deal.invested * 1.08).toFixed(1);
  }
  g.cash = +(g.cash - deal.invested + deal.myFee).toFixed(1);
  g.committedThisMonth = (g.committedThisMonth || 0) + 1;
  if (g.overall) g.overall.lastBoard = g.t;
  deal.status = "pipeline";
  deal.news = 0;
  deal.mark = markPosition(deal, g);
  deal.releaseAt = g.t + ri(3, 6);
  g.pipeline.push(deal);
  g.deals = g.deals.filter((d) => d.id !== deal.id);
  const stLabel = deal.struct === "fee" ? "fee only" : deal.struct === "points" ? `fee plus ${deal.pts} points` : deal.struct === "own" ? "fully financed" : `${Math.round(deal.share * 100)}% equity`;
  addLog(g, `You board "${deal.title}" (${fmtM(deal.B)} ${deal.tier === "tent" ? "tentpole" : deal.tier === "indie" ? "indie" : "mid-budget"}): ${stLabel}${sweetened ? ", after sweetening to beat a rival" : ""}. Releases ${dateLabel(deal.releaseAt)}.`);
  if (deal.packagerId) relMove(g, deal.packagerId, 3);
}

function loseDeal(g, deal) {
  g.deals = g.deals.filter((d) => d.id !== deal.id);
  addLog(g, `A rival closes "${deal.title}" overnight. The town moves fast when it smells the same thing you do.`, "bad");
}

function walkDeal(g, deal) {
  g.deals = g.deals.filter((d) => d.id !== deal.id);
  if (deal.packagerId) relMove(g, deal.packagerId, -5);
}

/* ---------------- franchise machinery ---------------- */
function boardFranchiseFilm(g) {
  const f = g.franchise;
  const idx = f.filmIdx;
  const B = Math.round(f.baseB * (1 + 0.3 * (idx - 1)));
  const terms = f.baseTerms;
  const fee = +(terms.fee * (1 + 0.25 * (idx - 1))).toFixed(1);
  const pts = terms.pts > 0 ? terms.pts + (idx - 1) : 0;
  let eq = terms.eq;
  let invested = +(B * eq / 100).toFixed(1);
  if (invested > g.cash + fee) { eq = 0; invested = 0; }
  const e = (() => { const r = Math.random(); return r < 0.08 ? -2 : r < 0.3 ? -1 : r < 0.7 ? 0 : r < 0.92 ? 1 : 2; })();
  const d = {
    id: uid(), title: f.titleBase + " " + ["", "II", "III"][idx - 1], genre: f.genre, tier: "tent", B, e,
    heat: 0, firstLook: true, termSheet: false, tell: null, nego: null,
    packagerId: f.studioId, packagerName: f.studioName, hook: null, signals: [],
    structures: [], fee, consensusNet: consensusEV("tent", B),
    status: "pipeline", struct: eq > 0 ? "coown" : pts > 0 ? "points" : "fee",
    invested, myFee: fee, pts, sq: terms.sq, share: eq / 100,
    sweetened: false, exited: false, exitPay: 0, fixPaid: false, news: 0, mark: 0,
    releaseAt: g.t + ri(4, 6), result: null, brand: true, franchiseIdx: idx,
  };
  d.mark = markPosition(d, g);
  g.cash = +(g.cash - invested + fee).toFixed(1);
  g.pipeline.push(d);
  f.pendingAt = null;
  addLog(g, `Chapter ${idx} of the "${f.titleBase}" saga goes before cameras: ${fmtM(B)}, your fee ${fmtM(fee)}${pts ? ", " + pts + " points" : ""}${eq ? ", " + eq + "% of the financing" : eq !== terms.eq ? " (you could not fund your equity share this time, so the studio carried it)" : ""}.`, "good");
}


/* ---------------- sandbox owned-property market ---------------- */
const GENRE_LABEL = { action:"Action", scifi:"Sci-Fi", comedy:"Comedy", thriller:"Thriller", horror:"Horror", drama:"Drama", family:"Family", romance:"Romance" };
const GENRE_SWEET = { action:90, scifi:100, comedy:35, thriller:45, horror:20, drama:28, family:70, romance:25 };
const RELEASE_LABEL = { platform:"Platform", moderate:"Moderate", wide:"Wide", streamer:"Streamer pre-buy" };
const FRANCHISE_LABEL = { standalone:"Standalone", sequel:"Sequel option", trilogy:"Trilogy plan", backtoback:"Back-to-back gamble" };
const FINANCE_LABEL = { self:"Self-financed", partner:"Partner covers 45%", streamer:"Streamer pre-buy" };
const PROPERTY_KINDS = [
  { source:"idea",       kind:"Original idea",          action:"Buy the pitch",      ask:[0.2, 1.2], brand:[0.4, 0.9], fp:[0.4, 1.2], lib:[0.6, 1.0], awards:[0.6, 1.3], genres:ZG_GENRES, note:"A writer has a clean hook and no buyer yet. Cheap, early, and yours if you want to develop it." },
  { source:"script",     kind:"Spec script",            action:"Acquire script",     ask:[1.0, 5.5], brand:[0.5, 1.1], fp:[0.5, 1.5], lib:[0.7, 1.1], awards:[0.7, 1.4], genres:ZG_GENRES, note:"A finished spec is making the rounds. Buy it now, put it in the vault, decide later whether it deserves real money." },
  { source:"book",       kind:"Book rights",            action:"Option rights",      ask:[1.5, 8],   brand:[0.8, 1.8], fp:[0.6, 1.8], lib:[0.9, 1.5], awards:[0.9, 1.7], genres:["thriller","drama","romance","family"], note:"The author wants a serious screen partner, not just a cheque. Built-in readers, fragile trust." },
  { source:"comic",      kind:"Comic IP",               action:"Buy the IP",         ask:[5, 22],    brand:[1.0, 2.6], fp:[1.4, 2.6], lib:[1.0, 1.6], awards:[0.3, 0.8], genres:["action","scifi"], note:"Characters, lore, and a fanbase that will either crown you or eat you alive." },
  { source:"game",       kind:"Video game IP",          action:"Buy adaptation rights", ask:[4, 18], brand:[1.0, 2.5], fp:[1.2, 2.4], lib:[0.8, 1.3], awards:[0.2, 0.7], genres:["action","scifi","horror"], note:"Millions know the world already. The trick is making a movie instead of a cosplay trailer." },
  { source:"toy",        kind:"Toy/kids brand",         action:"Buy the brand rights", ask:[8, 30],  brand:[1.4, 3.0], fp:[1.2, 2.2], lib:[0.9, 1.4], awards:[0.2, 0.6], genres:["family","action"], note:"A licensor with shelves to fill wants a studio that will not embarrass the brand." },
  { source:"remake",     kind:"Remake rights",          action:"Acquire rights",     ask:[3, 12],    brand:[0.9, 2.0], fp:[0.8, 1.7], lib:[0.8, 1.3], awards:[0.3, 1.0], genres:["horror","thriller","drama","comedy"], note:"An older or foreign title with a hook the audience still understands. New take required." },
  { source:"dormant",    kind:"Dormant franchise",      action:"Buy the franchise",  ask:[25, 85],   brand:[1.7, 3.4], fp:[1.8, 3.0], lib:[1.2, 2.0], awards:[0.2, 0.8], genres:["action","scifi","family","horror"], note:"A known brand went quiet. The audience remembers the good years and pretends the bad entry never happened." },
  { source:"distressed", kind:"Distressed IP",          action:"Buy distressed rights", ask:[2, 10], brand:[0.7, 1.8], fp:[0.8, 1.9], lib:[0.8, 1.5], awards:[0.2, 0.9], genres:ZG_GENRES, note:"The owner needs cash and a graceful headline. You get a bargain, but the brand needs repair." },
  { source:"sequelrights", kind:"Outside sequel rights", action:"Buy sequel rights", ask:[7, 24],    brand:[1.2, 2.7], fp:[1.2, 2.4], lib:[0.9, 1.5], awards:[0.2, 0.8], genres:["action","comedy","horror","thriller"], note:"The prior film worked just enough that a follow-up has value. You would control what comes next." },
];
const OUTSIDE_PITCHES = [
  { kind:"license", label:"License it out", share:0, pts:[3,7], feeMult:[0.02,0.05], shift:0.1, copy:"They finance it. You collect a licence fee, keep approval, and ride backend if it works." },
  { kind:"minority", label:"Minority co-finance", share:0.25, pts:[1,4], feeMult:[0.01,0.03], shift:0.25, copy:"They bring the package and most of the money. You keep a real piece and final brand approval." },
  { kind:"joint", label:"Joint venture", share:0.5, pts:[0,2], feeMult:[0.0,0.015], shift:0.35, copy:"A true co-production. Half the risk, half the upside, and a bigger swing than you would take alone." },
  { kind:"streamer", label:"Streamer pitch", share:0.15, pts:[4,8], feeMult:[0.025,0.06], shift:0.05, copy:"A platform wants a controlled bet. Less theatrical upside, more guaranteed money, fewer sleepless nights." },
];
function genreLabel(gid) { return GENRE_LABEL[gid] || gid; }
function ipBrand(ip) { return clamp(+(ip.brand == null ? 1 : ip.brand), 0.5, 5); }
function ipFilmCount(ip) { return ip.films || ip.filmsMade || 0; }
function ipValue(ip) {
  const brand = ipBrand(ip);
  const fp = ip.franchisePotential || 1;
  const lib = ip.libraryPotential || 1;
  const films = ipFilmCount(ip);
  return +(brand * 10 + fp * 7 + lib * 4 + films * 3).toFixed(1);
}
function mkSandboxPropertyOffer(g) {
  const pool = PROPERTY_KINDS.filter((k) => g.studioMode || ["idea","script","book","remake","distressed"].includes(k.source) || g.rep >= 60);
  const k = pick(pool.length ? pool : PROPERTY_KINDS);
  const genre = pick(k.genres || ZG_GENRES);
  const brand = +rnd(k.brand[0], k.brand[1]).toFixed(1);
  const ask = +rnd(k.ask[0], k.ask[1]).toFixed(1);
  const title = mkTitle(genre);
  const scriptQuality = ri(42, 92);
  const conceptQuality = ri(38, 94);
  const franchisePotential = +rnd(k.fp[0], k.fp[1]).toFixed(1);
  const libraryPotential = +rnd(k.lib[0], k.lib[1]).toFixed(1);
  const awardsPotential = +rnd(k.awards[0], k.awards[1]).toFixed(1);
  return { id:uid(), type:"property", source:k.source, kind:k.kind, action:k.action, name:title, title, genre, ask, brand, note:k.note, scriptQuality, conceptQuality, franchisePotential, libraryPotential, awardsPotential };
}
function mkOutsideIpPitchOffer(g) {
  const vault = (g.ips || []).filter((ip) => ip.status !== "sold" && ipBrand(ip) >= 0.5);
  if (!vault.length) return null;
  const ip = pick(vault);
  const p = pick(OUTSIDE_PITCHES);
  const brand = ipBrand(ip);
  const sweet = GENRE_SWEET[ip.genre] || 45;
  const B = Math.round(clamp(sweet * rnd(0.65, 1.55) + brand * rnd(4, 12), 8, 190) / 5) * 5;
  const marketing = p.kind === "streamer" ? Math.round(B * rnd(0.12, 0.25)) : Math.round(B * rnd(0.2, 0.55));
  const genre = ip.genre || pick(ZG_GENRES);
  const titleStem = ip.name || ip.title || mkTitle(genre);
  const titles = [
    `${titleStem}: New Blood`, `${titleStem}: Legacy`, `${titleStem} Returns`, `The ${titleStem} Chapter`, `${titleStem} II`, `${titleStem}: The First Door`
  ];
  const pts = ri(p.pts[0], p.pts[1]);
  const fee = +Math.max(0.3, B * rnd(p.feeMult[0], p.feeMult[1]) + brand * 0.35).toFixed(1);
  const producer = pick(["Meridian Pictures", "Northlight Studios", "Atlas Crown", "Continental Media", "a hungry streamer", "an A-list director's company", "a sharp outside producer"]);
  const plan = pick(["standalone", "sequel", "trilogy", "backtoback"]);
  return { id:uid(), type:"ippitch", ipId:ip.id, ipName:titleStem, kind:p.kind, label:p.label, title:pick(titles), genre, B, marketing, share:p.share, pts, fee, shift:p.shift, producer, copy:p.copy, plan };
}
function ownedPropertyFromOffer(o, g) {
  return {
    id:uid(), name:o.name || o.title, title:o.title || o.name, source:o.source || "ip", kind:o.kind || "Owned IP", genre:o.genre || pick(ZG_GENRES),
    brand:+(o.brand == null ? 1 : o.brand).toFixed(1),
    films:0, acquiredAt:g.t, purchasePrice:o.ask || 0, status:"owned",
    scriptQuality:o.scriptQuality || ri(45, 85), conceptQuality:o.conceptQuality || ri(45, 85),
    franchisePotential:o.franchisePotential || (o.kind && /franchise|comic|toy|game/i.test(o.kind) ? 2 : 1),
    libraryPotential:o.libraryPotential || 1,
    awardsPotential:o.awardsPotential || 0.8,
    lastPitchedAt:null,
  };
}
function sandboxBudgetAdvice(g, ip, cfg) {
  if (!ip) return [];
  const B = cfg.B || 40;
  const marketing = cfg.marketing || 0;
  const strategy = cfg.strategy || "moderate";
  const finance = cfg.finance || "self";
  const plan = cfg.franchisePlan || "standalone";
  const sweet = GENRE_SWEET[ip.genre] || 45;
  const brand = ipBrand(ip);
  const fp = ip.franchisePotential || 1;
  const active = (g.pipeline || []).filter((d) => d.status === "pipeline");
  const tents = active.filter((d) => d.tier === "tent" || d.B >= 90).length + (B >= 90 ? 1 : 0);
  const cheapGenre = ["horror","comedy","romance","drama","thriller"].includes(ip.genre);
  const notes = [];
  if (B > sweet * 1.8 && cheapGenre) notes.push(`This is rich for a ${genreLabel(ip.genre).toLowerCase()} picture. The genre has a ceiling; money alone will not raise it.`);
  else if (B < sweet * 0.55 && ["action","scifi","family"].includes(ip.genre)) notes.push(`The concept wants more scale than this. Cheap ${genreLabel(ip.genre).toLowerCase()} can look cheap fast.`);
  else notes.push(`The budget is inside the sane zone for ${genreLabel(ip.genre).toLowerCase()}. No one gets fired for this number.`);
  if (strategy === "wide" && marketing < B * 0.35) notes.push(`Wide release with ${fmtM(marketing)} marketing is underpowered. You are buying screens without buying awareness.`);
  if (strategy === "platform" && B > 60) notes.push(`A platform release on a ${fmtM(B)} spend is delicate. This needs awards heat or it turns into a slow-motion cash burn.`);
  if (strategy === "streamer") notes.push(`This reads like a streamer sale: cap the upside, protect the floor, keep the IP alive.`);
  if (marketing > B * 0.75) notes.push(`Marketing is starting to wag the dog. Good if the movie has four-quadrant heat; dangerous if it is just noise.`);
  if (brand >= 2.5 || fp >= 2) notes.push(`The franchise potential supports a bigger swing, but only if the film itself works. Brand is borrowed trust.`);
  if (plan === "trilogy") notes.push(`A trilogy plan is leverage if chapter one lands and a prison sentence if it does not.`);
  if (plan === "backtoback") notes.push(`Back-to-back only makes sense with real brand power. Otherwise you are pre-ordering your own problem.`);
  if (finance === "partner") notes.push(`A partner lowers cash exposure and also takes the victory lap with you.`);
  if (finance === "streamer") notes.push(`The pre-buy makes the downside civilized. The ceiling gets civilized too.`);
  if (tents >= 3) notes.push(`Slate warning: too many tentpoles at once. You need counterprogramming, not another moonshot.`);
  const genres = active.map((d) => d.genre);
  if (!genres.includes("horror") && !genres.includes("comedy") && !genres.includes("romance") && B >= 75) notes.push(`The slate could use a cheaper genre picture to balance this swing.`);
  return notes.slice(0, 5);
}
function sandboxSlateAdvice(g) {
  const active = (g.pipeline || []).filter((d) => d.status === "pipeline");
  const vault = (g.ips || []).filter((ip) => ip.status !== "sold");
  const exposure = active.reduce((s, d) => s + (d.invested || 0) + (d.extraCost || 0), 0);
  const tents = active.filter((d) => d.tier === "tent" || d.B >= 90).length;
  const cheap = active.filter((d) => ["horror","comedy","romance","drama","thriller"].includes(d.genre) && d.B <= 45).length;
  const family = active.some((d) => d.genre === "family") || vault.some((ip) => ip.genre === "family");
  const notes = [];
  if (!active.length) notes.push("No active slate. The vault is optionality, not a business until something goes before cameras.");
  if (tents >= 3) notes.push("Too concentrated in tentpoles. If one cracks, the whole year starts taking water.");
  else if (tents >= 1 && cheap === 0) notes.push("You have an anchor. Now buy counterprogramming: horror, comedy, romance, something that can win cheap.");
  if (!family) notes.push("No family title in the mix. That is fine for a boutique shingle, thin for a real studio slate.");
  const dramaN = active.filter((d) => d.genre === "drama").length;
  if (dramaN >= 2 && active.length <= 4) notes.push("Too much prestige chasing, not enough commercial ballast.");
  if (exposure > Math.max(60, g.cash * 1.2)) notes.push("Marketing and production commitments are heavy for the cash position. Do not confuse a slate with a dare.");
  if (vault.length >= 3 && active.length <= 2) notes.push("The vault is healthy. Now decide what actually deserves a release date.");
  if (!notes.length) notes.push("Good spread: some owned IP, some outside deals, enough risk that the upside matters, not enough that one bomb defines the year.");
  return notes.slice(0, 4);
}
function sandboxReleaseShift(ip, cfg) {
  const B = cfg.B || 40;
  const marketing = cfg.marketing || 0;
  const sweet = GENRE_SWEET[ip.genre] || 45;
  let shift = 0;
  const mRatio = B > 0 ? marketing / B : 0;
  if (mRatio >= 0.55) shift += 0.45; else if (mRatio >= 0.3) shift += 0.25; else if ((cfg.strategy || "moderate") === "wide") shift -= 0.45;
  if ((cfg.strategy || "moderate") === "platform" && ["drama","romance","horror"].includes(ip.genre)) shift += 0.15;
  if ((cfg.strategy || "moderate") === "streamer") shift -= 0.05;
  if (B > sweet * 2.1 && ["horror","comedy","romance","drama","thriller"].includes(ip.genre)) shift -= 0.45;
  if (B < sweet * 0.55 && ["action","scifi","family"].includes(ip.genre)) shift -= 0.35;
  return shift;
}

function refreshOffers(g) {
  g.offers = [];
  if (g.career) return; /* career mode runs on the deal desk and the scenario's own objectives, nothing else */
  const studio = g.contacts.filter((c) => c.kind === "studio").sort((a, b) => b.rel - a.rel)[0];
  const sName = studio ? studio.name : mkName();
  if (g.rep >= 50 && !g.franchise && chance(0.3)) {
    const genre = pick(["action","scifi","family"]);
    g.offers.push({ id: uid(), type: "franchise", studioId: studio ? studio.id : null, studio: sName,
      title: mkTitle(genre), genre, B: ri(110, 170) });
  }
  if (g.rep >= 65 && !g.overall && chance(0.3)) {
    g.offers.push({ id: uid(), type: "overall", studioId: studio ? studio.id : null, studio: sName, pay: 0.5, months: 18 });
  }
  if (g.rep >= 80 && g.t >= g.kingmakerAt) {
    g.offers.push({ id: uid(), type: "kingmaker", studioId: studio ? studio.id : null, studio: sName });
  }
  /* the summit: found your own studio */
  if (!g.studioMode && g.cash >= 250) {
    g.offers.push({ id: uid(), type: "found" });
  }
  /* dormant studio libraries: buy the back catalogue, unlock remakes and sequels on dead titles */
  if (g.studioMode && chance(0.22) && !g.offers.some((o) => o.type === "oldstudio") && (g.oldStudios || []).length < 3) {
    const nm = pick(["Silver Reel", "Continental Pictures", "Highline Films", "Coronet Studios", "Republic Screen"]);
    const titles = ri(3, 6);
    const ask = ri(30, 90);
    g.offers.push({ id: uid(), type: "oldstudio", name: nm, titles, ask, monthly: +(ask * rnd(0.006, 0.012)).toFixed(2) });
  }
  /* sandbox property market: spec scripts and rights can be bought into the vault without greenlighting a film */
  const propChance = g.studioMode ? 0.68 : (g.rep >= 35 && g.cash >= 2 ? 0.35 : 0.12);
  if (chance(propChance) && g.offers.filter((o) => o.type === "property" || o.type === "ip").length < (g.studioMode ? 3 : 1)) {
    g.offers.push(mkSandboxPropertyOffer(g));
  }
  /* studio mode: the older IP-market hook now feeds the same owned-property vault */
  if (g.studioMode && chance(0.35) && g.offers.filter((o) => o.type === "property" || o.type === "ip").length < 3) {
    const kinds = [
      { k: "Dormant film franchise", source:"dormant", ask: [35, 80], brand: [2, 3], genres: ["action","scifi","family"], fp:[1.8, 3.0], lib:[1.2, 2.0], awards:[0.2, 0.8], note:"Two hit movies a generation ago, then silence. The audience never really left." },
      { k: "Comic book universe", source:"comic", ask: [10, 28], brand: [1, 2], genres: ["action","scifi"], fp:[1.4, 2.5], lib:[1.0, 1.6], awards:[0.2, 0.7], note:"Decades of characters, storylines, and a fanbase that shows up if you respect the tone." },
      { k: "Bestselling novel series", source:"book", ask: [8, 20], brand: [1, 2], genres: ["thriller","romance","drama"], fp:[0.8, 1.8], lib:[1.0, 1.6], awards:[0.8, 1.7], note:"Readers are already casting it in their heads. That is a gift and a threat." },
      { k: "Global toy brand", source:"toy", ask: [25, 60], brand: [2, 3], genres: ["family","action"], fp:[1.5, 2.7], lib:[0.9, 1.4], awards:[0.2, 0.5], note:"Every household knows the logo. The movie just has to not embarrass it." },
    ];
    const kk = pick(kinds);
    const genre = pick(kk.genres.length ? kk.genres : ["action"]);
    const title = mkTitle(genre);
    g.offers.push({ id: uid(), type: "property", source:kk.source, kind: kk.k, genre, name: title, title, ask: +rnd(kk.ask[0], kk.ask[1]).toFixed(0), brand: +rnd(kk.brand[0], kk.brand[1]).toFixed(1),
      note: kk.note, scriptQuality: ri(45, 88), conceptQuality: ri(45, 90), franchisePotential:+rnd(kk.fp[0], kk.fp[1]).toFixed(1), libraryPotential:+rnd(kk.lib[0], kk.lib[1]).toFixed(1), awardsPotential:+rnd(kk.awards[0], kk.awards[1]).toFixed(1), action:"Buy the IP" });
  }
  /* owned IP should generate incoming opportunities, not just manual development buttons */
  if (g.studioMode && (g.ips || []).length && chance(0.42) && g.offers.filter((o) => o.type === "ippitch").length < 2) {
    const pitch = mkOutsideIpPitchOffer(g);
    if (pitch) g.offers.push(pitch);
  }
}

function studioValuation(g) {
  /* enterprise value: the business, not the bank account */
  const marks = g.pipeline.reduce((s, d) => s + (d.exited ? 0 : (d.mark || 0)), 0);
  const ipVal = (g.ips || []).reduce((s, ip) => s + ipValue(ip), 0);
  const libVal = g.library.reduce((s, L) => s + L.base * 40, 0);
  return +(receivablesOut(g) + marks + ipVal + libVal).toFixed(0);
}

/* ---------------- month end ---------------- */
function endMonth(g) {
  g.t += 1;
  g.committedThisMonth = 0;
  const zOld = g.zeitgeist ? { trend: g.zeitgeist.trend, sentiment: g.zeitgeist.sentiment } : null;
  const z = shiftZeitgeist(g);
  if (zOld && (zOld.trend !== z.trend || zOld.sentiment !== z.sentiment)) {
    addLog(g, `The market turns: ${z.trend} is now ${z.sentiment.toLowerCase()}.`, z.sentiment === "Bullish" || z.sentiment === "Euphoric" ? "good" : z.sentiment === "Cold" || z.sentiment === "Cooling" ? "bad" : "");
  }
  g.cash = +(g.cash - (g.studioMode ? 2.0 : 0.35)).toFixed(2); /* overhead scales with the shingle */
  applyHardAssetCashflow(g);

  /* overall deal: the retainer pays, the obligation looms */
  if (g.overall) {
    g.cash = +(g.cash + g.overall.pay).toFixed(2);
    if (g.t - g.overall.lastBoard > 2) {
      addLog(g, `${g.overall.studio} terminates your overall deal: two months without boarding a picture. The retainer stops and the town notices.`, "bad");
      g.rep = clamp(g.rep - 4, 0, 100);
      g.overall = null;
    } else if (g.t >= g.overall.until) {
      addLog(g, `Your overall deal with ${g.overall.studio} expires on good terms. They hint at renewal if the standing holds.`);
      g.overall = null;
    }
  }

  /* franchise: contractually board the next chapter when it comes due */
  if (g.franchise && g.franchise.pendingAt != null && g.t >= g.franchise.pendingAt) {
    if (g.pipeline.filter((x) => x.status === "pipeline").length < plateCap(g)) {
      boardFranchiseFilm(g);
    }
  }

  /* mid-flight: public news moves the town's mark on every open position */
  for (const d of g.pipeline) {
    if (d.status !== "pipeline" || d.exited) continue;
    if (d.releaseAt <= g.t) continue;
    if ((d.share > 0 || d.pts > 0) && chance(0.45)) {
      /* public news leans toward the truth ~60% of the time */
      const dir = d.e !== 0 ? (chance(0.6) ? Math.sign(d.e) : (chance(0.5) ? -Math.sign(d.e) : Math.sign(d.e))) : (chance(0.5) ? 1 : -1);
      d.news = clamp((d.news || 0) + dir, -3, 3);
      const bank = dir > 0 ? NEWS_UP : NEWS_DOWN;
      addLog(g, pick(bank).replace("{T}", d.title), dir > 0 ? "good" : "bad");
    }
    d.mark = +(markPosition(d, g) * rnd(0.96, 1.05)).toFixed(1);
    /* streamers come knocking when there is something to buy */
    const streamBoost = g.career && g.career.restrictions && g.career.restrictions.streamingFocus;
    if (d.mark > 0.5 && chance(streamBoost ? 0.4 : 0.2)) {
      const streamer = g.contacts.find((c) => c.kind === "streamer");
      const offer = +Math.max(0.2, d.mark * rnd(streamBoost ? 1.0 : 0.9, streamBoost ? 1.3 : 1.12)).toFixed(1);
      g.queue.push({ type: "buyout", dealId: d.id, offer, who: streamer ? streamer.name : "A streamer" });
      continue;
    }
    if (d.share >= 0.2 && chance(0.12) && !d.fixPaid) {
      g.queue.push({ type: "trouble", dealId: d.id, cost: +(d.B * 0.05 * d.share).toFixed(1) });
    }
  }

  /* releases */
  for (const d of g.pipeline) {
    if (d.status === "pipeline" && g.t >= d.releaseAt) resolveDeal(g, d);
  }
  g.pipeline = g.pipeline.filter((d) => d.status === "pipeline");

  processReceivables(g);

  refreshDesk(g);
  refreshOffers(g);

  /* the ladder moves both ways */
  const li = ladderIdx(g.rep);
  if (li !== (g.lastLadder || 0)) {
    addLog(g, li > (g.lastLadder || 0)
      ? `The town upgrades you: you are now a ${LADDER[li].name}. Different calls start coming.`
      : `Word gets around. You have slipped back to ${LADDER[li].name}. Some doors close quietly.`,
      li > (g.lastLadder || 0) ? "good" : "bad");
    g.lastLadder = li;
  }

  if (g.cash < -1) {
    g.over = true;
    addLog(g, `The account is empty and the calls stop coming. In this town, broke is invisible.`, "bad");
  }
  if (!g.won && !g.studioMode && !g.career && g.cash >= 250) {
    g.won = true;
    addLog(g, `${fmtM(g.cash)} in the account. The call you have been building toward is now yours to make: found the studio. The offer sits on your desk.`, "good");
  }
  if (g.career) checkCareerProgress(g);
  return g;
}

function scheduleIncome(g, d, totalIn) {
  if (totalIn <= 0.05) return;
  const sched = [
    { at: g.t,     amt: +(totalIn * 0.45).toFixed(2), label: "opening" },
    { at: g.t + 1, amt: +(totalIn * 0.25).toFixed(2), label: "theatrical" },
    { at: g.t + 2, amt: +(totalIn * 0.10).toFixed(2), label: "theatrical tail" },
    { at: g.t + 3, amt: +(totalIn * 0.07).toFixed(2), label: "home video" },
    { at: g.t + 4, amt: +(totalIn * 0.07).toFixed(2), label: "streaming" },
    { at: g.t + 5, amt: +(totalIn * 0.06).toFixed(2), label: "streaming" },
  ];
  g.receivables.push({ id: uid(), title: d.title, sched });
  g.library.push({ id: uid(), title: d.title, base: +(totalIn * 0.005).toFixed(3) });
}
function receivablesOut(g) {
  return g.receivables.reduce((s, r) => s + r.sched.filter((p) => !p.done).reduce((a, p) => a + p.amt, 0), 0);
}
function processReceivables(g) {
  let inflow = 0;
  for (const r of g.receivables) {
    for (const p of r.sched) { if (!p.done && p.at <= g.t) { inflow += p.amt; p.done = true; } }
  }
  g.receivables = g.receivables.filter((r) => r.sched.some((p) => !p.done));
  for (const L of g.library) {
    inflow += L.base;
    L.base = +(L.base * 0.96).toFixed(3);
    if (chance(0.008)) {
      const pop = +(L.base * rnd(40, 120)).toFixed(1);
      inflow += pop;
      addLog(g, `"${L.title}" finds a second life on streaming. The residual cheque: ${fmtM(pop)}. Old movies never die, they just wait.`, "good");
    }
  }
  g.library = g.library.filter((L) => L.base > 0.02);
  inflow *= (g.ownStake == null ? 1 : g.ownStake);
  if (inflow > 0.01) {
    g.cash = +(g.cash + inflow).toFixed(1);
    g.lastInflow = +inflow.toFixed(1);
  } else g.lastInflow = 0;
}

function resolveDeal(g, d) {
  /* draw the outcome: consensus weights, shifted by the hidden edge and the real market trend */
  let b = drawBucket(shiftWeights(baseWeights(d), zgMod(d, g)));
  const shift = (n) => { for (let i = 0; i < Math.abs(n); i++) { if (n > 0) b = Math.min(d.tier === "tent" ? 4 : 5, b + 1); else b = Math.max(0, b - 1); } };
  if (d.e === 1 && chance(0.55)) shift(1);
  if (d.e === 2) { shift(1); if (chance(0.55)) shift(1); }
  if (d.e === -1 && chance(0.55)) shift(-1);
  if (d.e === -2) { shift(-1); if (chance(0.55)) shift(-1); }
  if (d.fixPaid && b === 0 && chance(0.5)) b = 1;
  /* market chaos: sometimes a tiny movie eats your weekend, sometimes you are the tiny movie */
  let chaos = "";
  if (chance(0.07) && b >= 2) { b = Math.max(0, b - 1); chaos = "A no-budget comedy nobody tracked ate the opening weekend."; }
  else if (d.tier === "indie" && b >= 4 && chance(0.5)) { chaos = "It started on forty screens. Then the lines went around the block."; }

  const swan = applyBlackSwan(g, d, b);
  b = swan.b;
  const bucket = BUCKETS[b];
  const k = rnd(bucket.k[0], bucket.k[1]);
  const filmNet = +(d.B * k).toFixed(1);

  /* your waterfall */
  const gross = +Math.max(0.25 * d.B, d.B * (1.75 + k * 2.1)).toFixed(1);
  const talentCut = (d.talentPts || 0) > 0 ? +Math.max(0, (filmNet + 0.35 * d.B) * d.talentPts / 100).toFixed(1) : 0;
  const extraCost = d.extraCost || 0;
  const sequelPay = (d.sq || 0) > 0 && b >= 4 ? +((d.sq / 100) * d.B * rnd(2.5, 5)).toFixed(1) : 0;
  const pointsPay = d.pts > 0 ? +Math.max(0, (filmNet + 0.35 * d.B) * d.pts / 100).toFixed(1) : 0;
  const equityPay = d.share > 0 ? +Math.max(0, d.invested + d.share * (filmNet - talentCut)).toFixed(1) : 0;
  let yourNet = d.exited
    ? +(d.exitPay - d.invested - extraCost).toFixed(1)
    : +(pointsPay + equityPay + sequelPay - d.invested - extraCost).toFixed(1);
  const wouldHave = d.exited ? +(pointsPay + equityPay + sequelPay - d.invested - extraCost).toFixed(1) : null;

  /* slate insurance: hedges the next real loss, then it is spent */
  let insurancePayout = 0;
  if (!d.exited && yourNet < -1 && g.insurance && g.t <= g.insurance.expiresAt) {
    insurancePayout = Math.min(g.insurance.cover, -yourNet);
    yourNet = +(yourNet + insurancePayout).toFixed(1);
    g.cash = +(g.cash + insurancePayout).toFixed(1);
    addLog(g, `Slate insurance absorbs ${fmtM(insurancePayout)} of the loss on "${d.title}". That is what hedging is for.`, "");
    g.insurance = null;
  }

  if (!d.exited) scheduleIncome(g, d, +(pointsPay + equityPay + sequelPay).toFixed(1));

  d.status = "closed";
  d.result = { bucket: b, bucketLabel: bucket.label, filmNet, gross, talentCut, pointsPay, equityPay, sequelPay, yourNet, wouldHave, chaos, consensusNet: d.consensusNet, insurancePayout, swanHit: swan.hit };
  resolveProspectOutcome(g, d, b);
  if (g.career && !d.exited) trackCareerOutcome(g, d, yourNet);
  g.closed.unshift(d);
  g.stats.done += 1;
  if (yourNet > 0.2) g.stats.wins += 1;
  if (yourNet < -0.2) g.stats.losses += 1;
  g.stats.bestNet = Math.max(g.stats.bestNet, yourNet);
  g.stats.worstNet = Math.min(g.stats.worstNet, yourNet);
  if (d.exited) { g.stats.exits += 1; if (wouldHave > yourNet) g.stats.exitRegret += 1; }

  /* reputation and relationships move on outcomes, not coffee */
  const big = d.share > 0.15 || d.pts >= 5;
  if (b >= 4) { g.rep = clamp(g.rep + (big ? 6 : 3), 0, 100); }
  else if (b === 3) { g.rep = clamp(g.rep + (big ? 3 : 2), 0, 100); }
  else if (b === 0 && big) { g.rep = clamp(g.rep - 3, 0, 100); }
  if (d.packagerId) relMove(g, d.packagerId, b >= 3 ? 7 : b <= 1 ? -3 : 2);
  /* winners introduce you around */
  if (b >= 4 && chance(0.6)) {
    const kinds = ["packager","agent","studio"];
    const nc = mkContact(pick(kinds), ri(38, 50));
    g.contacts.push(nc);
    addLog(g, `Success travels. ${nc.name} (${nc.label.toLowerCase()}) asks for a meeting.`, "good");
  }

  /* your own IP: released films, not button clicks, move the brand */
  if (d.ipId) {
    const ip = (g.ips || []).find((x) => x.id === d.ipId);
    if (ip) {
      ip.films = ipFilmCount(ip) + 1;
      ip.status = "developed";
      ip.lastFilmAt = g.t;
      if (b >= 4) {
        const licensing = +(d.B * 0.025 * ipBrand(ip) * (ip.franchisePotential || 1)).toFixed(1);
        if (licensing > 0.5) {
          g.receivables.push({ id: uid(), title: ip.name + " licensing tail", sched: [
            { at: g.t + 1, amt: +(licensing * 0.45).toFixed(2), label:"licensing" },
            { at: g.t + 2, amt: +(licensing * 0.35).toFixed(2), label:"merch/licensing" },
            { at: g.t + 3, amt: +(licensing * 0.20).toFixed(2), label:"merch/licensing" }] });
          addLog(g, `Because "${d.title}" worked, "${ip.name}" starts throwing off real licensing revenue: ${fmtM(licensing)} over the next few months.`, "good");
        }
      }
      if (b >= 4) { ip.brand = Math.min(5, +(ipBrand(ip) + 0.7).toFixed(1)); addLog(g, `The "${ip.name}" brand gets stronger because the movie delivered: brand power rises to ${ip.brand}.`, "good"); }
      else if (b === 3) { ip.brand = Math.min(5, +(ipBrand(ip) + 0.25).toFixed(1)); addLog(g, `"${d.title}" keeps the "${ip.name}" brand alive: brand power nudges to ${ip.brand}.`, "good"); }
      else if (b <= 1) { ip.brand = Math.max(0.5, +(ipBrand(ip) - 0.8).toFixed(1)); addLog(g, `A weak entry dents the "${ip.name}" brand: power falls to ${ip.brand}. Universes are built on trust.`, "bad"); }
      if (b >= 4 && ip.franchisePotential >= 1.2 && chance(0.65)) {
        const p = mkOutsideIpPitchOffer(g);
        if (p && p.ipId === ip.id) {
          g.offers = g.offers || [];
          g.offers.unshift(p);
          addLog(g, `The phones light up around "${ip.name}". Outside producers are already pitching the next move.`, "good");
        }
      }
      if ([5, 10, 15].includes(ip.films)) {
        g.rep = clamp(g.rep + 3, 0, 100);
        addLog(g, `${ip.films} films deep into the "${ip.name}" universe. ${ip.films >= 15 ? "The town has one word for what you built: empire." : ip.films >= 10 ? "This is a full cinematic universe now." : "A real franchise is taking shape."}`, "good");
      }
    }
  }
  /* a smash you were part of earns you the sequel, not just points, and the talent wants more this time */
  if (b >= 4 && !d.franchiseIdx && !d.ipId && !d.exited && (d.share > 0 || d.pts > 0 || d.myFee > 0) && !/ II+$/.test(d.title)) {
    const talentName = mkName();
    const role = chance(0.55) ? "lead" : "director";
    const rId = uid();
    g.talentReneg = g.talentReneg || [];
    g.talentReneg.push({ id: rId, sourceTitle: d.title, talentName, role, ptsBump: d.tier === "tent" ? 2 : 1, eqBump: d.tier === "tent" ? 5 : 3, status: "demanding" });
    g.sequelPipe.push({ title: d.title + " II", genre: d.genre, tier: d.tier, B: Math.round(d.B * 1.2), packagerId: d.packagerId, packagerName: d.packagerName, renegId: rId });
    addLog(g, `The town wants more of "${d.title}", and you delivered the first one. The sequel comes to you before anyone else, but ${talentName}, the ${role}, wants a richer package this time.`, "good");
  }

  /* franchise stewardship: the chain lives or dies on each chapter */
  if (d.franchiseIdx && g.franchise) {
    if (b <= 1) {
      addLog(g, `Chapter ${d.franchiseIdx} of "${g.franchise.titleBase}" ${b === 0 ? "bombs" : "underperforms"} and the studio kills the saga. Stewarding a brand into the ground is the loudest way to fail in this town.`, "bad");
      g.rep = clamp(g.rep - 8, 0, 100);
      if (g.franchise.studioId) relMove(g, g.franchise.studioId, -10);
      g.franchise = null;
    } else if (d.franchiseIdx < 3) {
      g.franchise.filmIdx = d.franchiseIdx + 1;
      g.franchise.pendingAt = g.t + 2;
      addLog(g, `The studio greenlights chapter ${d.franchiseIdx + 1} of "${g.franchise.titleBase}". Bigger budget, escalated terms, same steward.`, "good");
    } else {
      addLog(g, `You delivered all three chapters of "${g.franchise.titleBase}". The town has a short list of people who can steward a brand. You are on it now.`, "good");
      g.rep = clamp(g.rep + 10, 0, 100);
      if (g.franchise.studioId) relMove(g, g.franchise.studioId, 10);
      g.franchise = null;
    }
  }

  g.queue.push({ type: "result", dealId: d.id });
  addLog(g, `"${d.title}" opens: ${bucket.label.toLowerCase()}. Film P&L ${fmtM(filmNet)}. Your net ${yourNet >= 0 ? "+" : ""}${fmtM(yourNet)}.`, yourNet > 0.2 ? "good" : yourNet < -0.2 ? "bad" : "");
}

/* =====================================================================
   STUDIO SIM (a third, fully separate mode)
   Its own game state, its own save key, its own screen. Nothing here
   reads or writes Sandbox or Career state. Everything is prefixed
   ssim* to make that boundary impossible to cross by accident.
   ===================================================================== */

/* ---------------- talent database ---------------- */
const SSIM_GENRES = ["action","scifi","comedy","thriller","horror","drama","family","romance"];
const SSIM_GENRE_INFO = {
  action:  { label: "Action",   sweet: 90,  travel: 1.7 },
  scifi:   { label: "Sci-Fi",   sweet: 100, travel: 1.8 },
  comedy:  { label: "Comedy",   sweet: 35,  travel: 0.8 },
  thriller:{ label: "Thriller", sweet: 45,  travel: 1.0 },
  horror:  { label: "Horror",   sweet: 20,  travel: 0.9 },
  drama:   { label: "Drama",    sweet: 28,  travel: 0.75 },
  family:  { label: "Family",   sweet: 70,  travel: 1.5 },
  romance: { label: "Romance",  sweet: 25,  travel: 0.8 },
};
const SSIM_SOURCES = {
  original:    { label: "Original idea",       cost: [0.2, 1],   rights: 0,     fpMult: 0.7,  merchMult: 0.6, intlMult: 0.9, awardsMult: 1.0, lib: 0.8 },
  script:      { label: "Spec script",         cost: [1.5, 5],   rights: 0,     fpMult: 0.8,  merchMult: 0.6, intlMult: 0.9, awardsMult: 1.1, lib: 0.9 },
  book:        { label: "Book rights",         cost: [1, 4],     rights: [2,7], fpMult: 0.9,  merchMult: 0.5, intlMult: 1.0, awardsMult: 1.3, lib: 1.1 },
  comic:       { label: "Comic IP",            cost: [1, 3],     rights: [5,14],fpMult: 1.6,  merchMult: 1.5, intlMult: 1.4, awardsMult: 0.6, lib: 1.2 },
  game:        { label: "Video game IP",       cost: [1, 3],     rights: [4,12],fpMult: 1.4,  merchMult: 1.3, intlMult: 1.3, awardsMult: 0.5, lib: 1.0 },
  toy:         { label: "Toy brand",           cost: [1, 3],     rights: [6,16],fpMult: 1.2,  merchMult: 2.0, intlMult: 1.2, awardsMult: 0.4, lib: 1.0 },
  remake:      { label: "Remake rights",       cost: [1, 3],     rights: [3,9], fpMult: 1.1,  merchMult: 0.7, intlMult: 1.1, awardsMult: 0.7, lib: 1.0 },
  dormant:     { label: "Dormant franchise",   cost: [1, 3],     rights: [8,22],fpMult: 1.7,  merchMult: 1.2, intlMult: 1.3, awardsMult: 0.6, lib: 1.4 },
  sequelrights:{ label: "Outside sequel rights",cost: [1, 4],    rights: [6,18],fpMult: 1.3,  merchMult: 1.1, intlMult: 1.2, awardsMult: 0.6, lib: 1.1 },
  distressed:  { label: "Distressed IP",       cost: [0.5, 2],   rights: [3,9], fpMult: 1.2,  merchMult: 1.0, intlMult: 1.0, awardsMult: 0.6, lib: 1.0, bargain: true },
  producerpkg: { label: "Producer package",    cost: [1, 3],     rights: 0,     fpMult: 0.9,  merchMult: 0.7, intlMult: 1.0, awardsMult: 0.9, lib: 0.9, comesWithDirector: true },
  directorpassion:{ label: "Director's passion project", cost: [0.5, 2], rights: 0, fpMult: 0.6, merchMult: 0.4, intlMult: 0.8, awardsMult: 1.4, lib: 1.0, comesWithDirector: true, discountDirector: true },
  actorattached:{ label: "Actor-attached project", cost: [1, 3], rights: 0,     fpMult: 0.8,  merchMult: 0.6, intlMult: 1.1, awardsMult: 1.0, lib: 0.9, comesWithActor: true },
  jointprod:   { label: "Joint production offer", cost: [0, 2],  rights: [2,8], fpMult: 1.1,  merchMult: 0.9, intlMult: 1.1, awardsMult: 0.9, lib: 1.0, comesWithPartner: true },
  cofinancing: { label: "Co-financing opportunity", cost: [0, 1],rights: 0,     fpMult: 1.0,  merchMult: 0.8, intlMult: 1.0, awardsMult: 0.9, lib: 0.9, comesWithPartner: true },
  fullpackage: { label: "Fully packaged picture",   cost: [0, 0], rights: [8,26],fpMult: 1.2,  merchMult: 1.0, intlMult: 1.1, awardsMult: 0.9, lib: 1.0, prepackaged: true },
  sequel:      { label: "Sequel",               cost: [0, 0],    rights: 0,     fpMult: 1.3,  merchMult: 1.1, intlMult: 1.2, awardsMult: 0.8, lib: 1.1 },
  joint:       { label: "Joint production offer",cost: [0, 0],   rights: 0,     fpMult: 0.9,  merchMult: 0.9, intlMult: 1.0, awardsMult: 0.9, lib: 0.9, comesWithPartner: true },
};
const SSIM_PITCH_FLAVOR = {
  original: [
    "A writer pitched it cold in a room with nothing but conviction.",
    "Nobody else in town has read this yet. You would be first.",
    "A spec that started as a favor to a friend and turned into something real.",
    "The writer walked out of three other meetings before this one. Something about the room felt right here.",
  ],
  script: [
    "A finished spec has been quietly making the rounds and everyone in town has read it.",
    "This one has been on the black list for two years running and still nobody has pulled the trigger.",
    "A clean, tight draft that needs almost no work. Rare enough that people are asking why nobody has bought it yet.",
    "Three other studios passed. The writer thinks it was for the wrong reasons.",
  ],
  book: [
    "The novel sold well and the author's agent is finally ready to talk film rights.",
    "A quiet bestseller that keeps getting handed between readers. The kind of book people actually finish.",
    "The author turned down two prior offers. This time the number, and the timing, might be right.",
    "Book clubs have been talking about this one for a year. The built-in audience already exists, it just needs a screen.",
  ],
  comic: [
    "Decades of stories and a built-in fanbase that shows up opening weekend, every time.",
    "A cult series with a small but ferociously loyal readership. Get it right and they will tell everyone.",
    "The publisher wants a studio that understands the tone, not just the costume.",
    "This run has been optioned and dropped twice before. Whoever finally makes it will inherit a built-in audience and a skeptical one.",
  ],
  game: [
    "Millions of players already know this world. Now it needs a story that respects it.",
    "A beloved franchise with a fanbase that has been burned by adaptations before. They will show up either way.",
    "The developer wants final say on tone. The world is the whole appeal here.",
    "A cult favorite among players, virtually unknown outside that world. The upside is real if it crosses over.",
  ],
  toy: [
    "Every household on earth knows the name. The movie just has to not embarrass it.",
    "The brand has a merchandising machine already built. The film is almost secondary to what comes after it.",
    "A toy line from a different generation, ready for a nostalgia play aimed at the parents in the room, not just the kids.",
    "The licensor wants a partner who will take the brand seriously, not just slap the logo on a poster.",
  ],
  remake: [
    "A foreign or older hit, ripe for a new take. The trailer writes itself.",
    "The original still holds up. The question is whether anyone needed a new version at all.",
    "Rights holders overseas are eager for a studio that will actually improve on the original, not just repeat it.",
    "A cult favorite from another era that a whole generation has never seen. Ripe for rediscovery, or a shrug.",
  ],
  dormant: [
    "Two hit films a decade ago, then silence. The audience never really left.",
    "The last entry ended on a cliffhanger nobody ever paid off. There is real appetite to finish the story.",
    "A franchise the previous owner let go cold through neglect, not failure. The brand equity is still there.",
    "Fans still make fan art for this one. Whoever revives it inherits real goodwill, and real expectations.",
  ],
  sequelrights: [
    "Another studio made the original. The rights to continue it are on the table now.",
    "The studio that made the first one passed on a sequel. Their loss, potentially.",
    "A modest original with a small but real audience that wants more. Nobody else seems to be chasing it.",
    "The rights holder wants a studio that will treat the world seriously, not just cash in on the name.",
  ],
  distressed: [
    "A studio in real financial trouble is selling this off fast, and cheap, to raise cash today.",
    "A rival's fire sale. Their emergency is your discount.",
    "Whoever is selling needs the cash more than they need the property. That is your leverage.",
    "The kind of deal that only exists because someone else is desperate. Worth asking why, and worth taking anyway.",
  ],
  producerpkg: [
    "A veteran producer walks in with the script and a director already attached.",
    "A packaged deal, tidy and ready to move. The producer has done this before and knows how to keep it on schedule.",
    "Everything is assembled except the money. That part is you.",
    "A producer with a real track record wants a home for this. They chose you first.",
  ],
  directorpassion: [
    "A respected director has wanted to make this for years and will take less to do it.",
    "A personal project a filmmaker has been carrying for a decade. The discount is real, so is the ego on the line.",
    "Not the kind of film that wins big at the box office. The kind that wins the director's loyalty for the next one.",
    "A director between franchise gigs wants to make something that actually matters to them. Support it and they remember.",
  ],
  actorattached: [
    "A name actor read this and is already attached, agents circling.",
    "An actor between franchise commitments wants a change of pace, and picked this to make it.",
    "The kind of attachment that gets a script read by everyone else in town within a week.",
    "An actor looking to prove range outside their usual lane. The right studio partner matters more to them than the paycheck this time.",
  ],
  jointprod: [
    "A rival studio wants to make this together: shared cost, shared upside.",
    "Another studio has the IP but not the appetite to go it alone. They are offering to split it evenly.",
    "A co-production that lets both sides swing bigger than either could alone, and split the outcome the same way.",
    "The other studio brings international distribution relationships you do not have yet.",
  ],
  cofinancing: [
    "A financier wants in on this specific picture, nothing more.",
    "Pure capital, no creative opinions attached, at least not yet.",
    "A financing group looking to diversify into film for the first time. They want a steady hand more than a hit.",
    "Money that comes with fewer strings than a studio partner, and less of a safety net too.",
  ],
  fullpackage: [
    "A producer walks in with the whole thing assembled: finished script, director attached, the cast already signed. They just need a studio to finance and release it.",
    "This one has been shopped around town fully built. Every element is locked. All that is missing is the money and the marquee.",
    "An agency package, complete top to bottom. The only decision left is whether you want to own it.",
    "Everything is done except the check. The talent is already committed at agreed terms, no negotiation left to have.",
  ],
};
function ssimPickFlavor(source) {
  const arr = SSIM_PITCH_FLAVOR[source];
  return arr ? pick(arr) : "A deal memo, nothing more.";
}

function ssimMkProject(sourceKey, genre, opts) {
  opts = opts || {};
  const src = SSIM_SOURCES[sourceKey] || SSIM_SOURCES.original;
  const concept = clamp(ri(25, 70) + (src.bargain ? -8 : 0) + (["comic","game","toy","dormant"].includes(sourceKey) ? 8 : 0), 15, 90);
  const franchisePotential = clamp(Math.round((concept + ri(-10, 25)) * src.fpMult * 0.6), 5, 98);
  const merchPotential = clamp(Math.round((franchisePotential * 0.5 + ri(0, 30)) * src.merchMult), 3, 98);
  const intlAppealPotential = clamp(Math.round((concept * 0.6 + ri(0, 30)) * src.intlMult), 5, 98);
  const awardsPotential = clamp(Math.round((concept * 0.7 + ri(-10, 25)) * src.awardsMult), 3, 98);
  const libraryPotential = clamp(Math.round((franchisePotential * 0.4 + concept * 0.3) * src.lib), 3, 98);
  const devCost = (sourceKey === "sequel" || sourceKey === "joint") ? 0 : +rnd(src.cost[0], src.cost[1]).toFixed(2);
  const rightsCost = Array.isArray(src.rights) ? +rnd(src.rights[0], src.rights[1]).toFixed(1) : (src.rights || 0);
  return {
    id: uid(), title: opts.title || mkTitle(genre), genre, source: sourceKey,
    conceptQuality: concept, scriptQuality: opts.scriptQuality || 0, franchisePotential,
    merchPotential, intlAppealPotential, awardsPotential, libraryPotential, sequelDemand: 0, remakePotential: clamp(30 + ri(-10,20), 5, 90),
    devCost, rightsCost,
    writerId: null, directorId: null, actorIds: [],
    interestedDirectorId: null, interestedActorId: null, paidFees: 0, negotiatedPoints: 0, attachedTerms: [],
    phase: "concept", budget: { atl: 0, btl: 0, marketing: 0, contingency: 0, points: 0 },
    releaseStrategy: null, releaseAt: 0, result: null, franchiseId: null, draftsWritten: 0,
    franchiseStrategy: null, partner: opts.partner || null, financing: null, suggestedBudget: null,
  };
}

/* a project sometimes already has someone circling before the player goes looking */
function ssimRollInterest(g, p) {
  const chanceOfInterest = clamp((p.conceptQuality + p.franchisePotential) / 260, 0.15, 0.6);
  if (chance(chanceOfInterest)) {
    const cand = g.talent.filter((t) => t.role === "director" && t.busyUntil <= g.t && t.genres.includes(p.genre)).sort(() => Math.random() - 0.5)[0]
      || g.talent.filter((t) => t.role === "director" && t.busyUntil <= g.t).sort(() => Math.random() - 0.5)[0];
    if (cand) p.interestedDirectorId = cand.id;
  }
  if (chance(chanceOfInterest * 0.8)) {
    const cand = g.talent.filter((t) => t.role === "actor" && t.busyUntil <= g.t && t.genres.includes(p.genre)).sort(() => Math.random() - 0.5)[0]
      || g.talent.filter((t) => t.role === "actor" && t.busyUntil <= g.t).sort(() => Math.random() - 0.5)[0];
    if (cand) p.interestedActorId = cand.id;
  }
  return p;
}

function ssimName() { return mkName(); }

/* talent tiers: unknowns are genuinely cheap and risky, elites are genuinely expensive */
const SSIM_TIERS = [
  { id: "unknown",    label: "Unknown",         starRange: [1,1], salaryRange: [0.05,0.3],  weight: 22 },
  { id: "working",    label: "Working-class",   starRange: [1,2], salaryRange: [0.3,1.2],   weight: 20 },
  { id: "midlevel",   label: "Mid-level",       starRange: [2,3], salaryRange: [1,4],       weight: 20 },
  { id: "rising",     label: "Rising star",     starRange: [3,3], salaryRange: [3,8],       weight: 14 },
  { id: "prestige",   label: "Prestige",        starRange: [3,4], salaryRange: [5,12],      weight: 10 },
  { id: "blockbuster",label: "Blockbuster",     starRange: [4,5], salaryRange: [10,22],     weight: 9 },
  { id: "elite",      label: "Elite superstar",  starRange: [5,5], salaryRange: [20,35],     weight: 5 },
];
function ssimPickTier() {
  const total = SSIM_TIERS.reduce((s, t) => s + t.weight, 0);
  let roll = Math.random() * total;
  for (const t of SSIM_TIERS) { roll -= t.weight; if (roll <= 0) return t; }
  return SSIM_TIERS[0];
}

function ssimMkTalent(role, forceTier) {
  const tier = forceTier ? SSIM_TIERS.find((t) => t.id === forceTier) : ssimPickTier();
  const star = ri(tier.starRange[0], tier.starRange[1]);
  const heat = clamp(star * 14 + ri(-12, 18) + (tier.id === "elite" ? 15 : tier.id === "unknown" ? -10 : 0), 3, 98);
  const prestige = clamp(star * 12 + ri(-15, 22), 3, 97);
  const genres = [pick(SSIM_GENRES), pick(SSIM_GENRES)];
  let salary = role === "writer" ? +clamp(tier.salaryRange[0] * 0.5 + rnd(0, (tier.salaryRange[1] - tier.salaryRange[0]) * 0.5), 0.05, 20).toFixed(2)
    : +rnd(tier.salaryRange[0], tier.salaryRange[1]).toFixed(2);
  const pointsDemand = role === "writer" ? 0 : role === "actor" ? (tier.id === "elite" ? ri(6,10) : tier.id === "blockbuster" ? ri(4,7) : tier.id === "prestige" || tier.id === "rising" ? ri(1,3) : 0) : (tier.id === "elite" || tier.id === "blockbuster" ? ri(3,6) : 0);
  const domesticAppeal = clamp(star * 15 + ri(-10, 15) + (role === "actor" ? 5 : 0), 5, 98);
  const intlAppeal = clamp(star * 13 + ri(-15, 20) + (pick(["action","scifi","family"]).length ? 0 : 0), 5, 98);
  const awardsAppeal = clamp(prestige * 0.8 + ri(-10, 15), 3, 98);
  const volatility = clamp(ri(10, 60) - star * 4, 5, 60); /* lower = more reliable, higher = boom/bust */
  const breakoutPotential = tier.id === "unknown" || tier.id === "working" ? clamp(ri(20, 90), 20, 90) : 0;
  return {
    id: uid(), name: ssimName(), role, tier: tier.id, tierLabel: tier.label, star, salary, pointsDemand, heat, prestige,
    domesticAppeal, intlAppeal, awardsAppeal, volatility, breakoutPotential,
    genres, history: [], busyUntil: 0, franchiseLeverage: 0,
  };
}

function ssimTalentPool() {
  const writers = [];
  const directors = [];
  const actors = [];
  /* deliberately weighted so there is always a deep bench of cheap, usable talent */
  for (let i = 0; i < 20; i++) writers.push(ssimMkTalent("writer"));
  for (let i = 0; i < 18; i++) directors.push(ssimMkTalent("director"));
  for (let i = 0; i < 32; i++) actors.push(ssimMkTalent("actor"));
  /* guarantee at least a few in every tier per role, so the range is always real */
  SSIM_TIERS.forEach((t) => {
    if (!writers.some((x) => x.tier === t.id)) writers.push(ssimMkTalent("writer", t.id));
    if (!directors.some((x) => x.tier === t.id)) directors.push(ssimMkTalent("director", t.id));
    if (!actors.some((x) => x.tier === t.id)) actors.push(ssimMkTalent("actor", t.id));
  });
  return [...writers, ...directors, ...actors];
}

/* salary and demands drift with heat; called whenever heat changes */
function ssimRepriceTalent(t) {
  const tier = SSIM_TIERS.find((x) => x.id === t.tier) || SSIM_TIERS[2];
  const base = (tier.salaryRange[0] + tier.salaryRange[1]) / 2 * (t.role === "writer" ? 0.4 : 1);
  const heatMult = clamp(0.5 + (t.heat / 100) * 1.1, 0.4, 2.2);
  const floor = t.role === "writer" ? 0.05 : 0.05;
  t.salary = +clamp(base * heatMult, floor, 60).toFixed(2);
  if (t.role !== "writer") {
    const basePts = t.role === "actor" ? (t.star >= 5 ? 7 : t.star >= 4 ? 4 : t.star >= 3 ? 1.5 : 0) : (t.star >= 5 ? 4 : t.star >= 4 ? 2 : 0);
    t.pointsDemand = Math.round(clamp(basePts * heatMult + t.franchiseLeverage / 30, 0, 18));
  }
  t.domesticAppeal = clamp(t.domesticAppeal + (t.heat > 70 ? 0.3 : t.heat < 25 ? -0.3 : 0), 5, 99);
  t.intlAppeal = clamp(t.intlAppeal + (t.heat > 70 ? 0.2 : 0), 5, 99);
}

/* an unknown or working-class talent can break out after a hit, jumping tiers for real */
function ssimMaybeBreakout(g, t) {
  if (!(t.tier === "unknown" || t.tier === "working")) return false;
  if (!chance((t.breakoutPotential || 30) / 140)) return false;
  const nextTier = t.tier === "unknown" ? "rising" : "prestige";
  const nt = SSIM_TIERS.find((x) => x.id === nextTier);
  t.tier = nextTier; t.tierLabel = nt.label;
  t.star = Math.min(5, t.star + 2);
  t.heat = clamp(t.heat + 35, 0, 100);
  ssimRepriceTalent(t);
  addLog(g, `${t.name} breaks out. The trades will not stop talking about them, and their next quote just changed forever.`, "good");
  return true;
}

/* ---------------- project development ---------------- */
function ssimHireWriter(g, projectId, writerId) {
  const p = g.projects.find((x) => x.id === projectId);
  const w = g.talent.find((x) => x.id === writerId && x.role === "writer");
  if (!p || !w || w.busyUntil > g.t) return false;
  if (g.cash < w.salary) return false;
  g.cash = +(g.cash - w.salary).toFixed(1);
  p.devCost = +(p.devCost + w.salary).toFixed(1);
  p.writerId = w.id;
  w.busyUntil = g.t + 1;
  const fit = w.genres.includes(p.genre) ? 8 : 0;
  const roll = clamp(Math.round(w.star * 12 + p.conceptQuality * 0.35 + fit + rnd(-8, 12)), 10, 97);
  p.scriptQuality = p.draftsWritten === 0 ? roll : Math.max(p.scriptQuality, roll) + 3;
  p.scriptQuality = clamp(p.scriptQuality, 10, 98);
  p.draftsWritten += 1;
  p.phase = "writing";
  return true;
}

/* ---------------- packaging ---------------- */
function ssimAttachDirector(g, projectId, directorId) {
  const p = g.projects.find((x) => x.id === projectId);
  const d = g.talent.find((x) => x.id === directorId && x.role === "director");
  if (!p || !d || d.busyUntil > g.t) return false;
  if (g.cash < d.salary) return false;
  g.cash = +(g.cash - d.salary).toFixed(1);
  p.directorId = d.id;
  p.paidFees = +((p.paidFees || 0) + d.salary).toFixed(2);
  p.phase = "packaged";
  return true;
}

function ssimAttachActor(g, projectId, actorId) {
  const p = g.projects.find((x) => x.id === projectId);
  const a = g.talent.find((x) => x.id === actorId && x.role === "actor");
  if (!p || !a || a.busyUntil > g.t) return false;
  if (p.actorIds.length >= 3 || p.actorIds.includes(actorId)) return false;
  if (g.cash < a.salary) return false;
  g.cash = +(g.cash - a.salary).toFixed(1);
  p.actorIds.push(a.id);
  p.paidFees = +((p.paidFees || 0) + a.salary).toFixed(2);
  return true;
}

/* negotiation: pay the full ask, trade cash for extra points, or lowball with real rejection risk */
const SSIM_TIER_RANK = { unknown: 0, working: 1, midlevel: 2, rising: 3, prestige: 4, blockbuster: 5, elite: 6 };

/* what a talent actually needs to feel good about a deal: cash plus points,
   points converted to a rough cash-equivalent for comparison. Someone already
   circling the project for career reasons will settle for meaningfully less. */
function ssimTalentReservation(t, interested) {
  const unitPointValue = +(Math.max(0.05, t.salary) * 0.15).toFixed(3);
  let R = t.salary + (t.pointsDemand || 0) * unitPointValue;
  if (interested) R *= 0.82;
  return { R: +R.toFixed(2), unitPointValue };
}

/* a stateless negotiation step: the UI tracks the round count and resubmits
   with a new slider position each time. Three rounds, real counters, no
   walking away early, only after three honest tries. */
function ssimSubmitOffer(g, projectId, talentId, role, salaryOffer, pointsOffer, round) {
  const p = g.projects.find((x) => x.id === projectId);
  const t = g.talent.find((x) => x.id === talentId);
  if (!p || !t || t.busyUntil > g.t) return { ok: false, reason: "unavailable" };
  if (role === "actor" && (p.actorIds.length >= 3 || p.actorIds.includes(talentId))) return { ok: false, reason: "full" };
  const interested = (role === "director" ? p.interestedDirectorId : p.interestedActorId) === talentId;
  const { R, unitPointValue } = ssimTalentReservation(t, interested);
  const offerValue = salaryOffer + pointsOffer * unitPointValue;
  if (offerValue >= R * 0.97) {
    if (g.cash < salaryOffer) return { ok: false, reason: "cash", talentName: t.name };
    g.cash = +(g.cash - salaryOffer).toFixed(2);
    p.attachedTerms = p.attachedTerms || [];
    p.attachedTerms.push({ talentId, role, salaryPaid: salaryOffer, pointsAgreed: pointsOffer });
    p.paidFees = +((p.paidFees || 0) + salaryOffer).toFixed(2);
    p.negotiatedPoints = +((p.negotiatedPoints || 0) + pointsOffer).toFixed(1);
    if (role === "director") { p.directorId = t.id; p.phase = "packaged"; }
    else { p.actorIds.push(t.id); }
    return { ok: true, talentName: t.name, interested };
  }
  if (round >= 2) {
    t.busyUntil = Math.max(t.busyUntil, g.t + 1);
    return { ok: false, reason: "walked", talentName: t.name };
  }
  /* tell the player which lever actually needs to move */
  const salaryShare = salaryOffer / Math.max(0.01, t.salary);
  const pointsShare = (pointsOffer * unitPointValue) / Math.max(0.01, (t.pointsDemand || 0) * unitPointValue || t.salary * 0.3);
  const wantsSalary = salaryShare <= pointsShare;
  return { ok: false, reason: "counter", wantsSalary, talentName: t.name, interested };
}

function ssimGreenlightReady(p) {
  return !!p.directorId && p.actorIds.length >= 1 && p.scriptQuality >= 30;
}

/* ---------------- budgets and greenlight ---------------- */
const SSIM_FINANCE_PARTNERS = ["Meridian Pictures", "Northlight Studios", "Atlas Crown", "Continental Media"];
function ssimSetBudgetsAndGreenlight(g, projectId, btl, marketing, strategy, contingency, franchiseStrategy, financing) {
  const p = g.projects.find((x) => x.id === projectId);
  if (!p || !ssimGreenlightReady(p)) return false;
  const d = g.talent.find((x) => x.id === p.directorId);
  const actors = p.actorIds.map((id) => g.talent.find((x) => x.id === id)).filter(Boolean);
  const atl = +(p.paidFees || (d.salary + actors.reduce((s, a) => s + a.salary, 0))).toFixed(1);
  const negotiatedIds = new Set((p.attachedTerms || []).map((x) => x.talentId));
  const points = (p.attachedTerms || []).reduce((s, x) => s + x.pointsAgreed, 0)
    + (negotiatedIds.has(d.id) ? 0 : (d.pointsDemand || 0))
    + actors.reduce((s, a) => s + (negotiatedIds.has(a.id) ? 0 : (a.pointsDemand || 0)), 0);
  contingency = contingency || 0;
  const fStrat = franchiseStrategy || "standalone";
  const extraFilms = fStrat === "trilogy" ? 2 : fStrat === "backtoback" ? 1 : 0;
  const perFollowupAtl = +(atl * 0.92).toFixed(1);
  const perFollowupBtl = +(btl * 0.95).toFixed(1);
  const perFollowupMarketing = +(marketing * 0.9).toFixed(1);
  const followupCost = extraFilms * (perFollowupAtl + perFollowupBtl + perFollowupMarketing);
  const reserveFee = fStrat === "sequeloption" ? +(btl * 0.05).toFixed(1) : 0;

  /* financing on the primary picture: a partner or investor covers part of the production
     cost in exchange for a cut of the net, or a streamer buys it outright for a guaranteed
     payout, trading all the upside for zero risk. This is what makes a bigger swing possible
     on a studio that cannot yet self-finance the whole thing. */
  const fin = financing || { type: "self" };
  let studioShare = 1, financeCash = 0, financeLabel = null, guaranteedPayout = 0;
  if (fin.type === "partner50") { studioShare = 0.5; financeLabel = { name: pick(SSIM_FINANCE_PARTNERS), pct: 50 }; }
  else if (fin.type === "investor") { studioShare = 1 - (fin.pct || 25) / 100; financeLabel = { name: "Private investor group", pct: fin.pct || 25 }; }
  else if (fin.type === "streamer") { studioShare = 0; guaranteedPayout = +((btl + marketing + contingency) * (1 + (fin.margin || 18) / 100)).toFixed(1); financeLabel = { name: pick(["Streamflix","Peacham","Prime Vault","Kudzu TV"]), streamer: true }; }
  const productionCash = (btl + marketing + contingency) * studioShare;
  const totalUpfront = productionCash + followupCost + reserveFee;
  if (g.cash < totalUpfront) return false;
  g.cash = +(g.cash - totalUpfront).toFixed(1);
  p.budget = { atl, btl, marketing, contingency, points };
  p.releaseStrategy = strategy;
  p.phase = "production";
  p.franchiseStrategy = fStrat;
  p.sequelReserved = fStrat === "sequeloption";
  p.financing = fin.type === "self" ? null : { type: fin.type, ...financeLabel, guaranteedPayout };
  if (fin.type === "partner50" || fin.type === "investor") p.partner = { name: financeLabel.name, pct: financeLabel.pct };
  const months = 3 + (btl > SSIM_GENRE_INFO[p.genre].sweet ? 1 : 0);
  p.releaseAt = g.t + months;
  d.busyUntil = p.releaseAt + 1;
  actors.forEach((a) => { a.busyUntil = p.releaseAt; });
  if (financeLabel) addLog(g, `${financeLabel.name} ${fin.type === "streamer" ? `pre-buys "${p.title}" for a guaranteed ${fmtM(guaranteedPayout)}` : `covers ${financeLabel.pct}% of "${p.title}" for ${financeLabel.pct}% of the net`}. Your cash outlay drops to ${fmtM(productionCash)}.`, "good");

  const chain = [p];
  for (let i = 0; i < extraFilms; i++) {
    const seq = ssimMkProject("sequel", p.genre, { title: p.title + " " + (i === 0 ? "II" : "III"), scriptQuality: clamp(p.scriptQuality - 5, 20, 90) });
    seq.directorId = d.id; seq.actorIds = actors.map((a) => a.id);
    seq.budget = { atl: perFollowupAtl, btl: perFollowupBtl, marketing: perFollowupMarketing, contingency: 0, points };
    seq.releaseStrategy = strategy;
    seq.phase = "production";
    seq.franchiseStrategy = fStrat;
    seq.releaseAt = chain[chain.length - 1].releaseAt + (fStrat === "backtoback" ? 2 : months + 2);
    g.projects.push(seq);
    chain.push(seq);
  }
  if (chain.length > 1) addLog(g, `${g.studioName} locks in ${fStrat === "trilogy" ? "a full trilogy" : "two films shot back to back"} for "${p.title}": the whole cast and crew, paid at today's rate, before any of them get more expensive.`, "good");
  return true;
}

/* ---------------- resolution: the rich P&L ---------------- */
function ssimDirectorFit(d, genre) { return d.genres.includes(genre) ? 1 : 0; }
function ssimActorAppeal(actors) { return actors.reduce((s, a) => s + a.star / 5 * (0.5 + a.heat / 200), 0); }

/* the cheapest analyst on staff: a live, honest read on whether the current
   budget and marketing look profitable for this package, before you commit */
function ssimBudgetAdvice(g, p, btl, marketing, contingency, strategy) {
  const d = g.talent.find((x) => x.id === p.directorId);
  const actors = p.actorIds.map((id) => g.talent.find((x) => x.id === id)).filter(Boolean);
  if (!d || !actors.length) return { label: "Attach a director and cast first.", tone: "" };
  const info = SSIM_GENRE_INFO[p.genre];
  const fit = ssimDirectorFit(d, p.genre);
  const appeal = ssimActorAppeal(actors);
  const prodValue = 100 * Math.min(1, btl / info.sweet);
  const quality = clamp(Math.round(0.5 * p.scriptQuality + 0.25 * d.prestige + 0.15 * prodValue + fit * 8), 5, 99);
  const atl = p.paidFees || (d.salary + actors.reduce((s, a) => s + a.salary, 0));
  const totalInvestment = btl + atl;
  const tierKey = totalInvestment <= 20 ? "indie" : totalInvestment <= 80 ? "mid" : "tent";
  const rawEk = consensusEV(tierKey, 1);
  const qualityShift = (quality - 55) / 22 + (appeal - 0.8) * 0.4;
  const adjustedEk = rawEk + clamp(qualityShift, -1.2, 1.2) * 0.35;
  const stratMult = strategy === "wide" ? 1 : strategy === "moderate" ? 0.9 : 0.75;
  const marketingNudge = clamp(0.8 + 0.5 * Math.sqrt(marketing / Math.max(5, btl * 0.3)), 0.75, 1.3);
  const sweetRatio = totalInvestment / info.sweet;
  const oversizeMult = sweetRatio <= 1.5 ? 1 : clamp(1 - 0.18 * (sweetRatio - 1.5), 0.3, 1);
  const estWorldwide = Math.max(0.3, totalInvestment * 2.0 * oversizeMult * (1 + adjustedEk)) * marketingNudge * stratMult;
  const estKeepRate = 0.5; /* rentals plus ancillary, net of distribution fee, roughly */
  const estRevenue = estWorldwide * estKeepRate;
  const estCost = atl + btl + marketing + (contingency || 0);
  const estNet = estRevenue - estCost;
  const margin = estNet / Math.max(1, estCost);
  if (margin > 0.25) return { label: "Our read: a strong mix. This package can carry a budget this size.", tone: "good" };
  if (margin > 0) return { label: "Our read: a reasonable bet, nothing extravagant either way.", tone: "" };
  if (margin > -0.2) return { label: "Our read: close to breakeven. Not reckless, but no cushion either.", tone: "warn" };
  return { label: "Our cheapest analyst's honest opinion: this budget looks too rich for this package. Real risk of an unprofitable picture.", tone: "bad" };
}

/* the chief of staff's honest read on why a picture did what it did. This is
   diagnosis from the real inputs that moved the outcome, not omniscience.
   Some of what happens is just the market on a given weekend, and a good
   analyst says so instead of pretending to know everything. */
function ssimPostMortem(g, p) {
  const R = p.result;
  if (!R) return [];
  const hit = R.netProfit > 0.5, flop = R.netProfit < -0.5;
  const notes = [];
  if (R.sweetRatio > 2.2) notes.push(`The budget was too rich for a ${SSIM_GENRE_INFO[p.genre].label.toLowerCase()} picture at this scale. Genres like this have a ceiling the audience just will not blow past, no matter how much we spent.`);
  else if (R.sweetRatio < 0.5 && hit) notes.push(`We underspent relative to the genre and it still worked. Sometimes lean is its own advantage.`);
  if (R.fit === 0) notes.push(`The director was not a natural match for ${SSIM_GENRE_INFO[p.genre].label.toLowerCase()}. That shows up in pacing and tone more than people expect.`);
  else if (R.fit === 1 && hit) notes.push(`The director's genre instincts were a real asset here.`);
  if (R.appeal < 0.5 && R.btl > SSIM_GENRE_INFO[p.genre].sweet) notes.push(`The cast did not bring enough star power to justify a picture this size. Audiences need a reason to show up, and marquee value was thin.`);
  else if (R.appeal > 1.3 && hit) notes.push(`The cast's pull did real work opening this. That is what we paid for.`);
  if (R.quality < 45) notes.push(`Plainly, the picture was not very good. Script and production value showed on screen, and word of mouth reflected it.`);
  else if (R.quality >= 78 && hit) notes.push(`Strong reviews and word of mouth carried this past its opening weekend.`);
  if (R.marketingRatio < 0.15 && flop) notes.push(`Marketing was thin for a picture this size. Awareness likely suffered before anyone even saw a trailer.`);
  if ((p.budget.contingency || 0) === 0 && R.bucket === 0) notes.push(`No contingency reserve on this one, so the downside hit at full force.`);
  const qualitySaidHit = R.quality >= 65, qualitySaidFlop = R.quality <= 45;
  if (qualitySaidHit && flop) notes.push(`Honestly, this one should have worked on paper. Sometimes the market just does not show up, and nobody can call that in advance.`);
  else if (qualitySaidFlop && hit) notes.push(`This one outperformed what the numbers going in would have predicted. We will take it, but do not expect to repeat it on purpose.`);
  if (!notes.length) notes.push(hit ? `A clean result. The package matched the budget and the audience showed up.` : flop ? `No single factor stands out. Sometimes a picture just does not connect.` : `A middling result with nothing dramatic behind it either way.`);
  return notes.slice(0, 3);
}

function ssimResolveRelease(g, p) {
  const d = g.talent.find((x) => x.id === p.directorId);
  const actors = p.actorIds.map((id) => g.talent.find((x) => x.id === id)).filter(Boolean);
  const info = SSIM_GENRE_INFO[p.genre];
  const fit = ssimDirectorFit(d, p.genre);
  const appeal = ssimActorAppeal(actors);
  const prodValue = 100 * Math.min(1, p.budget.btl / info.sweet);
  const quality = clamp(Math.round(0.5 * p.scriptQuality + 0.25 * d.prestige + 0.15 * prodValue + fit * 8), 5, 99);

  /* fat-tailed outcome: quality and cast appeal shift which bucket you draw,
     the same proven pattern as the deal desk. Once drawn, the bucket is the
     dominant driver of scale, anchored directly to the below-the-line budget,
     so a bomb still grosses like a bomb no matter how good the packaging. */
  const totalInvestment = p.budget.btl + p.budget.atl;
  const tierKey = totalInvestment <= 20 ? "indie" : totalInvestment <= 80 ? "mid" : "tent";
  let b = drawBucket(TIERS[tierKey].w);
  const qualityShift = (quality - 55) / 22 + (appeal - 0.8) * 0.4;
  const shiftCeiling = tierKey === "tent" ? 4 : 5;
  if (qualityShift > 0.4 && chance(0.55)) b = Math.min(shiftCeiling, b + 1);
  if (qualityShift < -0.4 && chance(0.55)) b = Math.max(0, b - 1);
  /* contingency spend is real downside protection: it cannot save a good picture from being
     a bomb, but it softens exactly how bad a bomb is, representing insurance against overages
     and marketing missteps rather than a magic quality boost */
  const contingencyRatio = clamp((p.budget.contingency || 0) / Math.max(5, p.budget.btl * 0.15), 0, 1);
  let k = rnd(BUCKETS[b].k[0], BUCKETS[b].k[1]);
  if (k < 0) k = k * (1 - contingencyRatio * 0.35);
  const bucketLabel = BUCKETS[b].label;

  const stratMult = p.releaseStrategy === "wide" ? 1 : p.releaseStrategy === "moderate" ? 0.9 : 0.75;
  const marketingNudge = clamp(0.8 + 0.5 * Math.sqrt(p.budget.marketing / Math.max(5, p.budget.btl * 0.3)), 0.75, 1.3);
  const sweetRatio = totalInvestment / info.sweet;
  const oversizeMult = sweetRatio <= 1.5 ? 1 : clamp(1 - 0.18 * (sweetRatio - 1.5), 0.3, 1);
  const baseWorldwide = Math.max(0.3, totalInvestment * 2.0 * oversizeMult * (1 + k));
  const worldwide = +(baseWorldwide * marketingNudge * stratMult).toFixed(1);
  const travel = clamp(info.travel * (0.7 + appeal * 0.5), 0.4, 2.4);
  const domesticShare = 1 / (1 + travel);
  const domestic = +(worldwide * domesticShare).toFixed(1);
  const intl = +(worldwide - domestic).toFixed(1);
  const openingWeekend = +(domestic * (p.releaseStrategy === "platform" ? 0.12 : 0.32)).toFixed(1);
  const rentals = +(domestic * 0.5 + intl * 0.4).toFixed(1);

  /* downstream windows are genre and IP driven, not flat percentages: a kids fantasy
     with real merch potential prints on toy shelves, a prestige drama prints on library
     value and awards, a horror or action/IP picture leans on sequels and franchise heat */
  const streaming = +(worldwide * 0.13 * (0.7 + (p.libraryPotential || 30) / 140)).toFixed(1);
  const tvLibrary = +(worldwide * 0.05 * (0.6 + (p.libraryPotential || 30) / 100)).toFixed(1);
  const merchGenreMult = ["family","scifi","action"].includes(p.genre) ? 1.3 : ["comedy","drama","romance"].includes(p.genre) ? 0.5 : 0.85;
  const merch = b >= 3 ? +(worldwide * 0.03 * ((p.merchPotential || 10) / 100) * merchGenreMult * rnd(0.7, 1.4)).toFixed(1) : +(worldwide * 0.005 * ((p.merchPotential || 10) / 100)).toFixed(1);
  const ancillary = +(streaming + tvLibrary + merch).toFixed(1);

  const distributionFee = +((rentals + ancillary) * 0.12).toFixed(1);
  const grossRevenue = +(rentals + ancillary).toFixed(1);
  let totalRevenue = +(grossRevenue - distributionFee).toFixed(1);

  /* financing obligations on this specific picture: partners and advances already taken */
  const partnerShare = p.partner && p.partner.pct ? +(totalRevenue * p.partner.pct / 100).toFixed(1) : 0;
  const advanceAlreadyPaid = p.advanceTaken || 0;
  totalRevenue = +(totalRevenue - partnerShare - advanceAlreadyPaid).toFixed(1);

  const pointsPay = p.budget.points > 0 ? +Math.max(0, (worldwide - p.budget.btl - p.budget.atl - p.budget.marketing) * p.budget.points / 100).toFixed(1) : 0;
  const totalCost = +(p.budget.atl + p.budget.btl + p.budget.marketing + (p.budget.contingency || 0) + pointsPay).toFixed(1);
  let netProfitFinal = +(totalRevenue - totalCost).toFixed(1);
  const isStreamerDeal = p.financing && p.financing.type === "streamer";
  let streamerPointsPay = 0;
  if (isStreamerDeal) {
    /* the streamer already covered production and marketing; the studio only ever paid
       talent, and collects the guaranteed sale price against that. Points and any advance
       are settled against the real guaranteed price, never against the simulated box
       office run, which for a picture sold outright never actually happened and should
       have no bearing on what anyone gets paid. */
    streamerPointsPay = p.budget.points > 0 ? +(p.financing.guaranteedPayout * p.budget.points / 100).toFixed(1) : 0;
    netProfitFinal = +(p.financing.guaranteedPayout - p.budget.atl - streamerPointsPay - advanceAlreadyPaid).toFixed(1);
  }

  const sequelDemand = clamp(Math.round((b - 2) * 20 + (p.franchisePotential || 20) * 0.3), 0, 100);

  p.result = {
    quality, bucket: b, bucketLabel, openingWeekend, domestic, intl, worldwide,
    streaming, tvLibrary, merch, ancillary, distributionFee, partnerShare, advanceAlreadyPaid, pointsPay: isStreamerDeal ? streamerPointsPay : pointsPay,
    grossRevenue, totalRevenue, atl: p.budget.atl, btl: p.budget.btl, marketing: p.budget.marketing,
    contingency: p.budget.contingency || 0, totalCost, netProfit: netProfitFinal, sequelDemand,
    isStreamerDeal, guaranteedPayout: isStreamerDeal ? p.financing.guaranteedPayout : 0,
    fit, appeal, sweetRatio, oversizeMult, marketingRatio: p.budget.marketing / Math.max(1, p.budget.btl),
  };
  p.sequelDemand = sequelDemand;
  p.phase = "released";
  g.cash = +(g.cash + netProfitFinal).toFixed(1);
  g.stats.released += 1;
  g.stats.lifetimeProfit = +(g.stats.lifetimeProfit + netProfitFinal).toFixed(1);
  if (netProfitFinal > 0.5) g.stats.hits += 1; else if (netProfitFinal < -0.5) g.stats.flops += 1;

  ssimEvolveTalent(g, d, actors, b, p);
  ssimMaybeFranchise(g, p, b);
  addLog(g, `"${p.title}" opens: ${bucketLabel.toLowerCase()}. Worldwide ${fmtM(worldwide)}, studio net ${netProfitFinal >= 0 ? "+" : ""}${fmtM(netProfitFinal)}.`, netProfitFinal > 0.5 ? "good" : netProfitFinal < -0.5 ? "bad" : "");
  return p.result;
}

/* ---------------- talent evolution ---------------- */
function ssimEvolveTalent(g, director, actors, bucket, p) {
  const hit = bucket >= 4;
  const solid = bucket === 3;
  const flop = bucket <= 1;
  const all = [director, ...actors];
  all.forEach((t) => {
    if (!t) return;
    t.history.unshift({ title: p.title, outcome: hit ? "hit" : solid ? "solid" : flop ? "flop" : "steady" });
    t.history = t.history.slice(0, 5);
    if (hit) { t.heat = clamp(t.heat + ri(10, 20), 0, 100); t.prestige = clamp(t.prestige + (p.result && p.result.quality >= 80 ? ri(4, 9) : ri(1, 4)), 0, 100); }
    else if (solid) { t.heat = clamp(t.heat + ri(2, 6), 0, 100); }
    else if (flop) { t.heat = clamp(t.heat - ri(10, 20), 0, 100); }
    ssimRepriceTalent(t);
  });
}

/* ---------------- franchises and sequel renegotiation ---------------- */
function ssimMaybeFranchise(g, p, bucket) {
  if (p.franchiseId || bucket < 3 || p.franchisePotential < 45) return;
  const fr = { id: uid(), title: p.title, genre: p.genre, chapter: 1, brandPower: clamp(30 + bucket * 8, 20, 90),
    lastActorIds: [...p.actorIds], lastDirectorId: p.directorId, lastBudget: p.budget.btl };
  g.franchises.push(fr);
  p.franchiseId = fr.id;
  addLog(g, `"${p.title}" has real franchise potential. The studio can commission a sequel whenever you are ready.`, "good");
}

/* the player can ask for a sequel to ANY released film, not just the ones that auto-qualified
   as a franchise. Weaker candidates just mean a tougher audience and thinner brand power. */
function ssimEnsureFranchiseFor(g, projectId) {
  const p = g.projects.find((x) => x.id === projectId);
  if (!p || p.phase !== "released") return null;
  if (p.franchiseId) return g.franchises.find((x) => x.id === p.franchiseId);
  const bucket = p.result ? p.result.bucket : 2;
  const fr = { id: uid(), title: p.title, genre: p.genre, chapter: 1,
    brandPower: clamp(20 + bucket * 7 + (p.franchisePotential || 20) * 0.2, 10, 90),
    lastActorIds: [...p.actorIds], lastDirectorId: p.directorId, lastBudget: p.budget.btl };
  g.franchises.push(fr);
  p.franchiseId = fr.id;
  return fr;
}

function ssimSequelTerms(g, franchiseId) {
  const fr = g.franchises.find((x) => x.id === franchiseId);
  if (!fr) return null;
  const returningActors = fr.lastActorIds.map((id) => g.talent.find((x) => x.id === id)).filter(Boolean);
  const returningDirector = g.talent.find((x) => x.id === fr.lastDirectorId);
  const raiseMult = 1 + fr.brandPower / 140;
  return {
    franchiseId, director: returningDirector, actors: returningActors, raiseMult,
    directorAsk: returningDirector ? +(returningDirector.salary * raiseMult).toFixed(1) : 0,
    actorAsks: returningActors.map((a) => +(a.salary * raiseMult).toFixed(1)),
    pointsAsk: returningActors.map((a) => Math.min(15, (a.pointsDemand || 0) + 2)),
  };
}

function ssimCommissionSequel(g, franchiseId, choice) {
  const fr = g.franchises.find((x) => x.id === franchiseId);
  if (!fr) return null;
  const terms = ssimSequelTerms(g, franchiseId);
  const genre = fr.genre;
  const p = ssimMkProject("sequel", genre);
  p.title = fr.title + " " + (fr.chapter + 1 === 2 ? "II" : fr.chapter + 1 === 3 ? "III" : String(fr.chapter + 1));
  p.franchisePotential = clamp(fr.brandPower + ri(-5, 10), 10, 98);
  p.scriptQuality = clamp(55 + ri(-10, 20), 20, 90);
  p.phase = "writing";
  g.projects.push(p);

  if (choice === "pay" && terms.director) {
    ssimAttachDirector(g, p.id, terms.director.id);
    terms.director.franchiseLeverage = clamp(terms.director.franchiseLeverage + 8, 0, 100);
  }
  if (choice === "pay") {
    terms.actors.forEach((a) => { ssimAttachActor(g, p.id, a.id); a.franchiseLeverage = clamp(a.franchiseLeverage + 10, 0, 100); ssimRepriceTalent(a); });
  }
  if (choice === "recast") {
    p.franchisePotential = Math.max(5, p.franchisePotential - 15);
    addLog(g, `"${p.title}" recasts the leads. Cheaper, but the audience notices when the faces change.`, "bad");
  }
  fr.chapter += 1;
  return p;
}

/* ---------------- awards season: a light, periodic check ---------------- */
function ssimAwardsCheck(g) {
  const eligible = g.projects.filter((p) => p.phase === "released" && p.result && !p.awardsChecked && g.t - p.releaseAt <= 6);
  eligible.forEach((p) => { p.awardsChecked = true; });
  if (!eligible.length) return;
  const scored = eligible.map((p) => {
    const d = g.talent.find((x) => x.id === p.directorId);
    const w = g.talent.find((x) => x.id === p.writerId);
    const topActor = p.actorIds.map((id) => g.talent.find((x) => x.id === id)).filter(Boolean).sort((a, b) => b.prestige - a.prestige)[0];
    const score = p.result.quality * 0.4 + (d ? d.prestige : 40) * 0.3 + (w ? w.prestige : 40) * 0.15 + (topActor ? topActor.prestige : 40) * 0.15;
    return { p, score, d, w, topActor };
  }).sort((a, b) => b.score - a.score);
  const winner = scored[0];
  if (winner.score >= 62 && chance(0.5)) {
    g.stats.awards += 1;
    g.prestige = clamp((g.prestige || 30) + 10, 0, 100);
    [winner.d, winner.w, winner.topActor].forEach((t) => { if (t) { t.prestige = clamp(t.prestige + 8, 0, 100); ssimRepriceTalent(t); } });
    addLog(g, `"${winner.p.title}" wins big this awards season. Studio prestige climbs, and everyone attached gets more expensive.`, "good");
  }
}

/* ---------------- month advance ---------------- */
/* ---------------- incoming opportunities: pitches inbox ---------------- */
const SSIM_PARTNER_NAMES = ["Meridian Pictures", "Northlight Studios", "Atlas Crown", "Continental Media", "Highline Capital"];
const SSIM_DEV_SOURCES = Object.keys(SSIM_SOURCES).filter((k) => k !== "sequel" && k !== "joint" && !SSIM_SOURCES[k].prepackaged);
const SSIM_FINANCE_SOURCES = Object.keys(SSIM_SOURCES).filter((k) => SSIM_SOURCES[k].prepackaged);

function ssimMkPitch(g, forceSource) {
  const source = forceSource || pick([...SSIM_DEV_SOURCES, ...SSIM_FINANCE_SOURCES]);
  const src = SSIM_SOURCES[source];
  const genre = pick(SSIM_GENRES);
  const proj = ssimMkProject(source, genre);
  const pitch = {
    id: uid(), source, genre, title: proj.title,
    conceptQuality: proj.conceptQuality, franchisePotential: proj.franchisePotential,
    merchPotential: proj.merchPotential, intlAppealPotential: proj.intlAppealPotential,
    awardsPotential: proj.awardsPotential, libraryPotential: proj.libraryPotential,
    rightsCost: proj.rightsCost, devCost: proj.devCost,
    optionCost: +Math.max(0.1, (proj.rightsCost + proj.devCost) * 0.15).toFixed(2),
    flavor: ssimPickFlavor(source),
    optioned: false, optionExpiresAt: null, expiresAt: g.t + ri(2, 4),
    comesWithDirectorId: null, comesWithActorId: null, comesWithActorIds: null, partnerOffer: null,
    prepackagedScriptQuality: null, suggestedBudget: null,
  };
  if (src.comesWithDirector) {
    const cand = g.talent.filter((t) => t.role === "director" && t.busyUntil <= g.t).sort(() => Math.random() - 0.5)[0];
    if (cand) pitch.comesWithDirectorId = cand.id;
  }
  if (src.comesWithActor) {
    const cand = g.talent.filter((t) => t.role === "actor" && t.busyUntil <= g.t).sort(() => Math.random() - 0.5)[0];
    if (cand) pitch.comesWithActorId = cand.id;
  }
  if (src.comesWithPartner) {
    pitch.partnerOffer = { name: pick(SSIM_PARTNER_NAMES), pct: ri(20, 45), coversPct: ri(30, 60) };
  }
  if (src.prepackaged) {
    const dCand = g.talent.filter((t) => t.role === "director" && t.busyUntil <= g.t).sort((a, b) => b.star - a.star)[0];
    const aCands = g.talent.filter((t) => t.role === "actor" && t.busyUntil <= g.t).sort((a, b) => b.star - a.star).slice(0, ri(2, 3));
    if (dCand && aCands.length >= 2) {
      pitch.comesWithDirectorId = dCand.id;
      pitch.comesWithActorIds = aCands.map((a) => a.id);
      pitch.prepackagedScriptQuality = clamp(60 + ri(-10, 25), 35, 95);
      pitch.suggestedBudget = Math.round(SSIM_GENRE_INFO[genre].sweet * rnd(0.8, 1.3));
      /* the terms are already agreed, the rights cost reflects the whole assembled package */
      pitch.rightsCost = +(pitch.rightsCost + dCand.salary + aCands.reduce((s, a) => s + a.salary, 0)).toFixed(1);
    }
  }
  return pitch;
}

/* every month the desk holds at least five ready-to-finance packages and five
   material-to-develop opportunities, ten on offer at minimum, so there is
   always real variety on both sides of the desk, not whatever luck deals. */
function ssimRefreshPitches(g) {
  g.pitches = (g.pitches || []).filter((p) => p.optioned || g.t < p.expiresAt);
  const isFinance = (p) => SSIM_SOURCES[p.source] && SSIM_SOURCES[p.source].prepackaged;
  const financeTarget = 5, devTarget = 5;
  let guard = 0;
  while (g.pitches.filter(isFinance).length < financeTarget && guard < 25) {
    guard++;
    g.pitches.push(ssimMkPitch(g, pick(SSIM_FINANCE_SOURCES)));
  }
  guard = 0;
  while (g.pitches.filter((p) => !isFinance(p)).length < devTarget && guard < 25) {
    guard++;
    g.pitches.push(ssimMkPitch(g, pick(SSIM_DEV_SOURCES)));
  }
  if (g.pitches.length > 16) g.pitches = g.pitches.slice(-16);
}

/* how many pictures can be in active development or production at once */
const SSIM_MAX_ACTIVE = 15;
function ssimActiveCount(g) {
  return g.projects.filter((p) => p.phase !== "released" && p.phase !== "shelved").length;
}

function ssimOptionPitch(g, pitchId) {
  const p = g.pitches.find((x) => x.id === pitchId);
  if (!p || p.optioned) return false;
  if (g.cash < p.optionCost) return false;
  g.cash = +(g.cash - p.optionCost).toFixed(1);
  p.optioned = true;
  p.optionExpiresAt = g.t + 6;
  p.rightsCost = +Math.max(0, p.rightsCost - p.optionCost).toFixed(1);
  return true;
}

function ssimBuyPitch(g, pitchId, shelve) {
  const p = g.pitches.find((x) => x.id === pitchId);
  if (!p) return null;
  if (!shelve && ssimActiveCount(g) >= SSIM_MAX_ACTIVE) return "full";
  const total = p.rightsCost;
  if (g.cash < total) return null;
  g.cash = +(g.cash - total).toFixed(1);
  const proj = ssimMkProject(p.source, p.genre, { title: p.title });
  proj.conceptQuality = p.conceptQuality; proj.franchisePotential = p.franchisePotential;
  proj.merchPotential = p.merchPotential; proj.intlAppealPotential = p.intlAppealPotential;
  proj.awardsPotential = p.awardsPotential; proj.libraryPotential = p.libraryPotential;
  proj.rightsCost = 0; proj.devCost = p.devCost;
  proj.phase = shelve ? "shelved" : "concept";
  if (p.comesWithActorIds && p.comesWithActorIds.length) {
    /* a fully assembled package: script done, director and cast already committed at
       agreed terms, nothing left to negotiate. The rights cost already covered their fees. */
    const d = g.talent.find((x) => x.id === p.comesWithDirectorId);
    const availableActors = p.comesWithActorIds.map((id) => g.talent.find((x) => x.id === id)).filter((a) => a && a.busyUntil <= g.t);
    if (d && d.busyUntil <= g.t && availableActors.length >= 1) {
      proj.directorId = d.id;
      proj.actorIds = availableActors.map((a) => a.id);
      proj.scriptQuality = p.prepackagedScriptQuality || clamp(60 + ri(-10, 20), 35, 90);
      proj.paidFees = +(d.salary + availableActors.reduce((s, a) => s + a.salary, 0)).toFixed(1);
      proj.suggestedBudget = p.suggestedBudget;
      proj.phase = shelve ? "shelved" : "packaged";
    }
  } else if (p.comesWithDirectorId) {
    const d = g.talent.find((x) => x.id === p.comesWithDirectorId); if (d && d.busyUntil <= g.t) { proj.directorId = d.id; proj.phase = shelve ? "shelved" : "writing"; }
  }
  if (p.comesWithActorId && !p.comesWithActorIds) { const a = g.talent.find((x) => x.id === p.comesWithActorId); if (a && a.busyUntil <= g.t) proj.actorIds.push(a.id); }
  if (p.partnerOffer && !shelve) proj.partner = { name: p.partnerOffer.name, pct: p.partnerOffer.pct };
  if (!proj.directorId) ssimRollInterest(g, proj);
  g.projects.push(proj);
  g.pitches = g.pitches.filter((x) => x.id !== pitchId);
  return proj;
}

/* ---------------- financing: loans, investors, advances, project stakes ---------------- */
function ssimCreditCap(g) {
  const assetBase = g.projects.filter((p) => p.phase === "production").reduce((s, p) => s + p.budget.btl + p.budget.atl, 0);
  return Math.max(0, Math.round(0.6 * (assetBase + Math.max(g.cash, 0)) - (g.debt || 0)));
}
function ssimTakeLoan(g, amount) {
  const cap = ssimCreditCap(g);
  const amt = Math.min(amount, cap);
  if (amt <= 0) return 0;
  g.debt = +((g.debt || 0) + amt).toFixed(1);
  g.cash = +(g.cash + amt).toFixed(1);
  return amt;
}
function ssimRepayLoan(g, amount) {
  const amt = Math.min(amount, g.debt || 0, Math.max(0, g.cash));
  if (amt <= 0) return 0;
  g.debt = +((g.debt || 0) - amt).toFixed(1);
  g.cash = +(g.cash - amt).toFixed(1);
  return amt;
}
function ssimTakeAdvance(g, projectId, amount) {
  const p = g.projects.find((x) => x.id === projectId);
  if (!p || p.phase !== "production") return false;
  g.cash = +(g.cash + amount).toFixed(1);
  p.advanceTaken = +((p.advanceTaken || 0) + amount).toFixed(1);
  return true;
}
function ssimTakeInvestor(g, projectId, pct) {
  const p = g.projects.find((x) => x.id === projectId);
  if (!p || p.partner) return false;
  const cashIn = +((p.budget.btl || 0) * pct / 100 * 0.9).toFixed(1);
  g.cash = +(g.cash + cashIn).toFixed(1);
  p.partner = { name: "Private investor group", pct };
  return cashIn;
}
function ssimEndMonth(g) {
  g.t += 1;
  g.cash = +(g.cash - 1.2).toFixed(2); /* overhead, scaled to the new starting capital */
  if (g.debt > 0) g.debt = +(g.debt * 1.01).toFixed(2); /* 12% annualized, same rate as everywhere else in this game */
  for (const p of g.projects) {
    if (p.phase === "production" && g.t >= p.releaseAt) ssimResolveRelease(g, p);
  }
  ssimRefreshPitches(g);
  if (g.t % 12 === 0) ssimAwardsCheck(g);
  if (g.cash < -5 && ssimCreditCap(g) <= 0) { g.over = true; addLog(g, `The studio runs out of runway. The lot goes quiet.`, "bad"); }
  return g;
}

function newStudioSimGame(studioName) {
  const g = {
    kind: "studiosim",
    studioName: (studioName || "").trim() || "New Horizon Pictures",
    t: 0, cash: 200, prestige: 30, over: false, debt: 0,
    talent: ssimTalentPool(), projects: [], franchises: [], pitches: [],
    stats: { released: 0, hits: 0, flops: 0, awards: 0, lifetimeProfit: 0 },
    log: [],
  };
  ssimRefreshPitches(g);
  addLog(g, `${g.studioName} opens its doors with ${fmtM(g.cash)} and a talent book to build from scratch.`, "good");
  return g;
}

/* =====================================================================
   COMPONENT
   ===================================================================== */
const SAVE_SANDBOX = "hollywood-producer-save-v2";
const SAVE_CAREER = "hollywood-producer-career-save-v1";
const SAVE_META = "hollywood-producer-meta-v1";
const SAVE_STUDIOSIM = "hollywood-producer-studiosim-save-v1";

export default function TheProducer() {
  const [game, setGame] = useState(undefined);
  const [saveKey, setSaveKey] = useState(SAVE_SANDBOX);
  const [screen, setScreen] = useState("menu"); // menu | scenario-select | setup | studiosim-setup | play
  const [saves, setSaves] = useState({ sandbox: null, career: null, studiosim: null });
  const [meta, setMeta] = useState({ completedScenarios: {}, sandboxUnlocks: [] });
  const [tab, setTab] = useState("desk");
  const [modal, setModal] = useState(null);
  const [savedTick, setSavedTick] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      const found = { sandbox: null, career: null, studiosim: null };
      try { const r = await window.storage.get(SAVE_SANDBOX); if (r && r.value) found.sandbox = JSON.parse(r.value); } catch (e) {}
      try { const r = await window.storage.get(SAVE_CAREER); if (r && r.value) found.career = JSON.parse(r.value); } catch (e) {}
      try { const r = await window.storage.get(SAVE_STUDIOSIM); if (r && r.value) found.studiosim = JSON.parse(r.value); } catch (e) {}
      try { const r = await window.storage.get(SAVE_META); if (r && r.value) setMeta(JSON.parse(r.value)); } catch (e) {}
      setSaves(found);
      setGame(null);
    })();
  }, []);

  useEffect(() => {
    if (!game || screen !== "play") return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await window.storage.set(saveKey, JSON.stringify(game));
        setSavedTick(true); setTimeout(() => setSavedTick(false), 1200);
      } catch (e) { console.error("save failed", e); }
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [game, screen, saveKey]);

  /* trophy room: meta progress lives outside any single game save, credited once per resolved career */
  useEffect(() => {
    if (!game || !game.career || !game.career.result || game.career.result.metaSynced) return;
    const merged = mergeMetaProgress(meta, game.career.scenarioId, game.career.result.score.grade, game.career.result.earnedUnlocks || []);
    setMeta(merged);
    window.storage.set(SAVE_META, JSON.stringify(merged)).catch(() => {});
    up((g) => { g.career.result.metaSynced = true; });
  }, [game]);

  const up = (fn) => { const c = JSON.parse(JSON.stringify(game)); fn(c); setGame(c); };

  const enterGame = (g, key) => { setGame(g); setSaveKey(key); setScreen("play"); setTab("desk"); setModal(null); };

  if (game === undefined) return <div className="pr"><style>{CSS}</style><div className="empty" style={{paddingTop:80}}>Checking the trades...</div></div>;

  if (screen === "menu") return <MainMenu saves={saves}
    onContinueSandbox={() => enterGame(saves.sandbox, SAVE_SANDBOX)}
    onNewSandbox={() => setScreen("setup")}
    onCareer={() => setScreen("scenario-select")}
    onContinueStudioSim={() => enterGame(saves.studiosim, SAVE_STUDIOSIM)}
    onNewStudioSim={() => setScreen("studiosim-setup")} />;

  if (screen === "setup") return <Setup onStart={(n, mode, sName) => enterGame(newGame(n || "Alex Doyle", mode, sName), SAVE_SANDBOX)} onCancel={() => setScreen("menu")} />;

  if (screen === "studiosim-setup") return <StudioSimSetup onStart={(name) => enterGame(newStudioSimGame(name), SAVE_STUDIOSIM)} onCancel={() => setScreen("menu")} />;

  if (screen === "scenario-select") return <ScenarioSelect saves={saves} meta={meta}
    onPick={(scId) => {
      const existing = saves.career;
      if (existing && existing.career && existing.career.scenarioId === scId && !existing.career.result) { enterGame(existing, SAVE_CAREER); return; }
      enterGame(newCareerGame("Alex Doyle", scId), SAVE_CAREER);
    }}
    onBack={() => setScreen("menu")} />;

  if (game.kind === "studiosim") return <StudioSimApp game={game} up={up} savedTick={savedTick} onMenu={() => setScreen("menu")} />;

  const qItem = game.queue[0];

  /* ---------- actions ---------- */
  const commit = (dealId, structId, sharePct) => up((g) => {
    const d = g.deals.find((x) => x.id === dealId);
    if (!d) return;
    const res = commitDeal(g, d, structId, sharePct);
    if (!res) { addLog(g, `Not enough cash for that position on "${d.title}".`, "bad"); setModal(null); return; }
    if (res.full) { addLog(g, `Your plate is full: two new deals a month, six in flight. Even you cannot produce everything.`, "bad"); setModal(null); return; }
    if (res.rival) setModal({ type: "rival", dealId });
    else setModal(null);
  });

  const rivalChoice = (dealId, choice) => up((g) => {
    const d = g.deals.find((x) => x.id === dealId);
    if (!d) { setModal(null); return; }
    if (choice === "sweeten") { finalizeCommit(g, d, true); }
    else if (choice === "stand") {
      if (chance(0.42 + g.rep / 280)) { finalizeCommit(g, d, false); addLog(g, `You hold your number on "${d.title}" and the rival blinks first.`, "good"); }
      else loseDeal(g, d);
    } else { walkDeal(g, d); addLog(g, `You walk away from the "${d.title}" auction. ${byId(g, d.packagerId)?.name || "The packager"} sounds disappointed on the phone.`); }
    setModal(null);
  });

  const passDeal = (dealId) => up((g) => {
    const d = g.deals.find((x) => x.id === dealId);
    if (d) walkDeal(g, d);
  });

  const answerQueue = (choice) => up((g) => {
    const item = g.queue.shift();
    if (!item) return;
    if (item.type === "reneg") {
      const r = (g.talentReneg || []).find((x) => x.id === item.renegId);
      const sq = { ...item.sq };
      if (r) {
        if (choice === "pay") { sq.B = Math.round(sq.B * 1.08); sq.ptsBump = r.ptsBump; r.status = "paid"; addLog(g, `You pay ${r.talentName}'s premium on "${sq.title}". The package stays intact, the budget and backend both rise.`); }
        if (choice === "negotiate") {
          const won = chance(0.55 + g.rep / 300);
          if (won) { sq.ptsBump = Math.max(1, r.ptsBump - 1); r.status = "negotiated"; addLog(g, `${r.talentName} comes down. "${sq.title}" boards on better terms than asked.`, "good"); }
          else { sq.B = Math.round(sq.B * 1.08); sq.ptsBump = r.ptsBump; r.status = "paid"; addLog(g, `${r.talentName}'s team calls your bluff. You pay full freight on "${sq.title}" anyway.`, "bad"); }
        }
        if (choice === "recast") { sq.B = Math.round(sq.B * 0.92); sq.ptsBump = 0; sq.recast = true; r.status = "recast"; addLog(g, `You recast ${r.talentName}'s role on "${sq.title}". Cheaper, but the brand loses some heat before a frame is shot.`, "bad"); }
      }
      g.deals.push(mkSequelDeal(g, sq));
      if (sq.recast) { const dd = g.deals[g.deals.length - 1]; dd.e = Math.max(-2, (dd.e || 0) - 1); }
      return;
    }
    const d = g.pipeline.find((x) => x.id === item.dealId) || g.closed.find((x) => x.id === item.dealId);
    if (!d) return;
    if (item.type === "buyout" && choice === "accept") {
      d.exited = true;
      d.exitPay = item.offer;
      g.cash = +(g.cash + item.offer).toFixed(1);
      const streamer = g.contacts.find((c) => c.kind === "streamer");
      if (streamer) streamer.rel = clamp(streamer.rel + 4, 0, 100);
      addLog(g, `${item.who} buys you out of "${d.title}" for ${fmtM(item.offer)}. Certainty has a price, and today they paid it.`);
    }
    if (item.type === "buyout" && choice === "decline") {
      addLog(g, `You pass on ${item.who}'s buyout of "${d.title}". You want the tail.`);
    }
    if (item.type === "trouble") {
      if (choice === "pay") {
        g.cash = +(g.cash - item.cost).toFixed(1);
        d.fixPaid = true;
        d.invested = +(d.invested + item.cost).toFixed(1);
        d.news = clamp((d.news || 0) - 1, -3, 3);
        d.mark = markPosition(d, g);
        addLog(g, `You wire ${fmtM(item.cost)} to steady "${d.title}". Protecting the downside is not glamorous. Neither is losing.`);
      } else {
        addLog(g, `You let "${d.title}" sort out its own mess. Sometimes they do.`);
      }
    }
    /* result items need no choice handling: closing the modal is the action */
  });

  const shopPosition = (dealId, offer) => up((g) => {
    const d = g.pipeline.find((x) => x.id === dealId);
    if (!d || d.exited) { setModal(null); return; }
    d.exited = true;
    d.exitPay = offer;
    g.cash = +(g.cash + offer).toFixed(1);
    addLog(g, `You shop your position in "${d.title}" and take ${fmtM(offer)}. Initiating the sale costs you the spread. Certainty costs what it costs.`);
    setModal(null);
  });

  const submitAsk = (dealId, ask) => up((g) => {
    const d = g.deals.find((x) => x.id === dealId);
    if (!d) { setModal(null); return; }
    if (!d.nego) d.nego = mkNego(g, d);
    const n = d.nego;
    n.round += 1;
    const V = askValue(n.profile, ask);
    if (V <= n.R) {
      closeTerms(g, d, ask);
      setModal(null);
      return;
    }
    if (n.round >= 3) {
      g.deals = g.deals.filter((x) => x.id !== dealId);
      if (d.packagerId) relMove(g, d.packagerId, -6);
      addLog(g, `Talks on "${d.title}" collapse after three rounds. The studio calls you difficult. The packager stops returning calls for a while.`, "bad");
      setModal(null);
      return;
    }
    if (V > n.R * 1.7) {
      /* an insulting anchor: sometimes they simply stop returning calls */
      if (chance(0.3)) {
        g.deals = g.deals.filter((x) => x.id !== dealId);
        if (d.packagerId) relMove(g, d.packagerId, -4);
        addLog(g, `Your opening ask on "${d.title}" lands as an insult. The studio stops returning calls, and the packager hears about it.`, "bad");
        setModal(null);
        return;
      }
      n.R = +(n.R * 0.88).toFixed(1);
      n.counter = mkCounter(d, n, ask, 0.75);
      n.bristled = true;
    } else {
      n.R = +(n.R * PROFILES[n.profile].decay).toFixed(1);
      n.counter = mkCounter(d, n, ask, 0.9);
      n.bristled = false;
    }
    setModal({ type: "termsheet", dealId, lastAsk: ask });
  });

  const acceptCounter = (dealId) => up((g) => {
    const d = g.deals.find((x) => x.id === dealId);
    if (!d || !d.nego || !d.nego.counter) { setModal(null); return; }
    closeTerms(g, d, d.nego.counter);
    setModal(null);
  });

  const closeTerms = (g, d, terms) => {
    const invested = +(d.B * (terms.eq / 100)).toFixed(1);
    if (invested > g.cash + terms.fee) { addLog(g, `You do not have the cash to fund ${terms.eq}% of "${d.title}". The deal dies at the wire.`, "bad"); g.deals = g.deals.filter((x) => x.id !== d.id); return; }
    if ((g.committedThisMonth || 0) >= commitCap(g) || g.pipeline.filter((x) => x.status === "pipeline").length >= plateCap(g)) { addLog(g, `Terms agreed on "${d.title}" and then reality intrudes: your plate is full.`, "bad"); g.deals = g.deals.filter((x) => x.id !== d.id); return; }
    d.struct = terms.eq > 0 ? "coown" : terms.pts > 0 ? "points" : "fee";
    d.myFee = terms.fee;
    d.pts = terms.pts;
    d.sq = terms.sq;
    d.share = terms.eq / 100;
    d.invested = invested;
    g.cash = +(g.cash - invested + terms.fee).toFixed(1);
    g.committedThisMonth = (g.committedThisMonth || 0) + 1;
    if (g.overall) g.overall.lastBoard = g.t;
    d.status = "pipeline";
    d.news = 0;
    d.mark = markPosition(d, g);
    d.releaseAt = g.t + ri(3, 6);
    g.pipeline.push(d);
    g.deals = g.deals.filter((x) => x.id !== d.id);
    const bits = [];
    if (terms.fee > 0) bits.push(fmtM(terms.fee) + " fee");
    if (terms.pts > 0) bits.push(terms.pts + " gross points");
    if (terms.sq > 0) bits.push(terms.sq + " points on any sequel");
    if (terms.eq > 0) bits.push(terms.eq + "% of the financing");
    addLog(g, `Terms close on "${d.title}": ${bits.join(", ") || "a handshake"}. ${d.nego && d.nego.round <= 1 ? "One round. Clean." : "Hard fought."}`, "good");
    if (d.packagerId) relMove(g, d.packagerId, 3);
    if (d.isFranchise) {
      d.brand = true;
      d.franchiseIdx = 1;
      d.mark = markPosition(d, g);
      g.franchise = { studioId: d.packagerId, studioName: d.packagerName, baseB: d.B, baseTerms: { ...terms }, filmIdx: 1, pendingAt: null, titleBase: d.title, genre: d.genre };
      addLog(g, `You are now the steward of the "${d.title}" saga: three pictures, escalating budgets, your terms carrying through. Deliver, and the town remembers. Fail, and it remembers longer.`, "good");
    }
  };

  const takeOffer = (offerId) => {
    const o0 = game.offers.find((x) => x.id === offerId);
    if (o0 && o0.type === "found") { setModal({ type: "found" }); return; }
    if (o0 && (o0.type === "ip" || o0.type === "property")) { buyIp(offerId); return; }
    if (o0 && o0.type === "ippitch") { acceptIpPitch(offerId); return; }
    if (o0 && o0.type === "oldstudio") { buyOldStudio(offerId); return; }
    up((g) => {
    const o = g.offers.find((x) => x.id === offerId);
    if (!o) return;
    g.offers = g.offers.filter((x) => x.id !== offerId);
    if (o.type === "overall") {
      g.overall = { studio: o.studio, studioId: o.studioId, pay: o.pay, until: g.t + o.months, lastBoard: g.t };
      addLog(g, `You sign an overall deal with ${o.studio}: ${fmtM(o.pay)} a month for ${o.months} months, and you owe them a boarded picture at least every other month. Retainers are handcuffs with a salary.`, "good");
      return;
    }
    if (o.type === "kingmaker") {
      if ((g.committedThisMonth || 0) >= commitCap(g) || g.pipeline.filter((x) => x.status === "pipeline").length >= plateCap(g)) {
        addLog(g, `You have the leverage to name your terms and no room on the plate to use it. The window stays open.`, "bad");
        g.offers.push(o);
        return;
      }
      const d = mkDeal(g, { tier: "tent" });
      d.signals = mkSignals(g, d.e, 3);
      d.termSheet = false;
      d.myFee = 3; d.pts = 12; d.sq = 5; d.share = 0; d.invested = 0;
      d.struct = "points";
      d.status = "pipeline"; d.news = 0; d.mark = markPosition(d, g);
      d.releaseAt = g.t + ri(3, 6);
      g.cash = +(g.cash + 3).toFixed(1);
      g.committedThisMonth = (g.committedThisMonth || 0) + 1;
      if (g.overall) g.overall.lastBoard = g.t;
      g.pipeline.push(d);
      g.kingmakerAt = g.t + 12;
      addLog(g, `Kingmaker terms on "${d.title}": ${fmtM(3)} fee, 12 gross points, 5 sequel points, their money. When you can dictate, dictate.`, "good");
      return;
    }
    if (o.type === "franchise") {
      const d = mkDeal(g, { tier: "tent" });
      d.title = o.title; d.genre = o.genre; d.B = o.B;
      d.termSheet = true; d.isFranchise = true; d.brand = true;
      d.heat = 0; d.firstLook = true; d.hook = null;
      d.packagerId = o.studioId; d.packagerName = o.studio;
      d.consensusNet = consensusEV("tent", o.B);
      g.deals.unshift(d);
      addLog(g, `${o.studio} opens franchise talks on "${o.title}". One term sheet covers all three pictures.`);
      setTimeout(() => setModal({ type: "termsheet", dealId: d.id }), 0);
    }
  }); };

  const declineOffer = (offerId) => up((g) => { g.offers = g.offers.filter((x) => x.id !== offerId); });

  const foundStudio = (name) => up((g) => {
    g.studioMode = true;
    g.studioName = (name || "").trim() || (g.name.split(" ")[0] + " Pictures");
    g.offers = g.offers.filter((x) => x.type !== "found");
    g.rep = clamp(g.rep + 5, 0, 100);
    addLog(g, `The trades run it above the fold: ${g.studioName} opens its gates, built on ${fmtM(g.cash)} of deals nobody else saw coming. You still produce. Now you also own.`, "good");
    setModal(null);
  });

  const buyIp = (offerId) => up((g) => {
    const o = g.offers.find((x) => x.id === offerId);
    if (!o || g.cash < o.ask) return;
    g.cash = +(g.cash - o.ask).toFixed(1);
    g.offers = g.offers.filter((x) => x.id !== offerId);
    g.ips = g.ips || [];
    const prop = ownedPropertyFromOffer(o, g);
    g.ips.push(prop);
    const gate = g.studioMode ? g.studioName : g.name + "'s shingle";
    addLog(g, `${gate} ${o.source === "script" ? "buys the spec script" : o.source === "idea" ? "buys the pitch" : "acquires"} "${prop.name}" (${prop.kind}) for ${fmtM(o.ask)}. It goes into the vault. No movie is greenlit until you choose to spend real money.`, "good");
  });

  const acceptIpPitch = (offerId) => up((g) => {
    const o = g.offers.find((x) => x.id === offerId);
    if (!o) return;
    const ip = (g.ips || []).find((x) => x.id === o.ipId);
    if (!ip) { g.offers = g.offers.filter((x) => x.id !== offerId); return; }
    if ((g.committedThisMonth || 0) >= commitCap(g) || g.pipeline.filter((x) => x.status === "pipeline").length >= plateCap(g)) {
      addLog(g, `The slate is full. You cannot approve another "${ip.name}" project this month.`, "bad"); return;
    }
    const tier = o.B <= 16 ? "indie" : o.B <= 65 ? "mid" : "tent";
    const productionShare = o.share || 0;
    const invested = +((o.B + o.marketing) * productionShare).toFixed(1);
    if (invested > g.cash + o.fee) { addLog(g, `The pitch is smart, but your share would require ${fmtM(invested)}. Cash says no.`, "bad"); return; }
    const e = (() => { const r = Math.random(); return r < 0.10 ? -2 : r < 0.32 ? -1 : r < 0.72 ? 0 : r < 0.93 ? 1 : 2; })();
    const d = { id: uid(), title: o.title, genre: o.genre || ip.genre, tier, B: o.B, e, heat: 0, firstLook: true, termSheet: false, tell: null, nego: null,
      packagerId: null, packagerName: o.producer, hook: null, signals: mkSignals(g, e, 2), structures: [], fee: o.fee, consensusNet: consensusEV(tier, o.B),
      status: "pipeline", struct: productionShare > 0 ? "coown" : "points", invested, myFee: o.fee, pts: o.pts, sq: o.plan === "standalone" ? 0 : 2, share: productionShare,
      sweetened: false, exited: false, exitPay: 0, fixPaid: false, news: 0, mark: 0, releaseAt: g.t + ri(3, 6), result: null, brandLvl: ipBrand(ip), ipId: ip.id,
      pkgShift: (o.shift || 0) + sandboxReleaseShift(ip, { B:o.B, marketing:o.marketing, strategy:o.kind === "streamer" ? "streamer" : "moderate" }), marketing:o.marketing, releaseStrategy:o.kind === "streamer" ? "streamer" : "moderate", franchisePlan:o.plan, ownedPitch:true, extraCost:0 };
    d.mark = markPosition(d, g);
    g.cash = +(g.cash - invested + o.fee).toFixed(1);
    g.committedThisMonth = (g.committedThisMonth || 0) + 1;
    if (g.overall) g.overall.lastBoard = g.t;
    g.pipeline.push(d);
    g.offers = g.offers.filter((x) => x.id !== offerId);
    addLog(g, `You approve ${o.producer}'s pitch for "${d.title}" from your "${ip.name}" rights: ${o.label.toLowerCase()}, ${fmtM(o.B)} production, ${fmtM(o.marketing)} marketing, ${o.pts} points${productionShare ? ", " + Math.round(productionShare * 100) + "% equity" : ", no production cash at risk"}.`, "good");
  });

  const buyOldStudio = (offerId) => up((g) => {
    const o = g.offers.find((x) => x.id === offerId);
    if (!o || g.cash < o.ask) return;
    g.cash = +(g.cash - o.ask).toFixed(1);
    g.offers = g.offers.filter((x) => x.id !== offerId);
    g.oldStudios = g.oldStudios || [];
    const rights = Array.from({ length: o.titles }, () => mkTitle(pick(ZG_GENRES)));
    g.oldStudios.push({ id: uid(), name: o.name, monthly: o.monthly, titles: rights, revived: [] });
    addLog(g, `${g.studioName} buys the ${o.name} library outright: ${o.titles} old titles and a back catalogue that pays every month, plus remake and sequel rights on every one of them.`, "good");
  });

  const reviveTitle = (studioId, titleName) => up((g) => {
    const os = (g.oldStudios || []).find((x) => x.id === studioId);
    if (!os || os.revived.includes(titleName)) return;
    if ((g.committedThisMonth || 0) >= commitCap(g) || g.pipeline.filter((x) => x.status === "pipeline").length >= plateCap(g)) { addLog(g, `The slate is full.`, "bad"); return; }
    const B = ri(30, 90);
    if (B > g.cash) { addLog(g, `Not enough cash to revive "${titleName}".`, "bad"); return; }
    const tier = B <= 65 ? "mid" : "tent";
    const e = (() => { const r = Math.random(); return r < 0.15 ? -1 : r < 0.7 ? 0 : r < 0.93 ? 1 : 2; })();
    const d = { id: uid(), title: titleName + " (Reimagined)", genre: pick(ZG_GENRES), tier, B, e, heat: 0, firstLook: true,
      termSheet: false, tell: null, nego: null, packagerId: null, packagerName: g.studioName, hook: null, signals: mkSignals(g, e, 2),
      structures: [], fee: 0, consensusNet: consensusEV(tier, B), status: "pipeline", struct: "own", invested: B, myFee: 0, pts: 0, sq: 0, share: 1,
      sweetened: false, exited: false, exitPay: 0, fixPaid: false, news: 0, mark: 0, releaseAt: g.t + ri(3, 5), result: null, brandLvl: 1.5, pkgShift: 0.4 };
    d.mark = markPosition(d, g);
    g.cash = +(g.cash - B).toFixed(1);
    g.committedThisMonth = (g.committedThisMonth || 0) + 1;
    os.revived.push(titleName);
    g.pipeline.push(d);
    addLog(g, `${g.studioName} revives "${titleName}" for a new audience: ${fmtM(B)}, built on a name people already trust a little.`, "good");
  });

  const sellIp = (ipId) => up((g) => {
    const ip = g.ips.find((x) => x.id === ipId);
    if (!ip) return;
    const price = +(ipValue(ip) * rnd(0.85, 1.15)).toFixed(1);
    g.cash = +(g.cash + price).toFixed(1);
    g.ips = g.ips.filter((x) => x.id !== ipId);
    addLog(g, `You sell "${ip.name}" to a rival studio for ${fmtM(price)}. Not every property is worth finishing yourself.`, "good");
    setModal(null);
  });

  const buyInsurance = (cost, cover) => up((g) => {
    if (g.cash < cost || g.insurance) return;
    g.cash = +(g.cash - cost).toFixed(1);
    g.insurance = { cost, cover, boughtAt: g.t, expiresAt: g.t + 6 };
    addLog(g, `You buy slate insurance: ${fmtM(cost)} for ${fmtM(cover)} of downside protection on your next bomb, six months of cover.`, "good");
    setModal(null);
  });

  const launchSpinoff = (ipId, kind) => up((g) => {
    const ip = (g.ips || []).find((x) => x.id === ipId);
    if (!ip) return;
    addLog(g, `The old ${kind === "tv" ? "streaming-series" : "merchandise"} shortcut is gone. The brand only gets stronger when the movies work; outside series/licensing now arrive as real pitches with risk.`, "bad");
  });


  const developFilm = (ipId, pkg) => up((g) => {
    const ip = (g.ips || []).find((x) => x.id === ipId);
    if (!ip) { setModal(null); return; }
    const B = pkg.B;
    const marketing = pkg.marketing || 0;
    const contingency = pkg.contingency ? +(B * 0.08).toFixed(1) : 0;
    const talentCost = pkg.director * 8 + pkg.star * 12 + pkg.vfx * 10 + (pkg.coprod ? 4 : 0);
    const finance = pkg.finance || "self";
    const myShare = finance === "partner" ? 0.55 : finance === "streamer" ? 0.25 : 1;
    const streamerAdvance = finance === "streamer" ? +(Math.max(3, B * 0.28 + marketing * 0.45)).toFixed(1) : 0;
    const recoupedRisk = +((B + marketing) * myShare).toFixed(1);
    const extraCost = +(talentCost + contingency).toFixed(1);
    const upfront = +(recoupedRisk + extraCost - streamerAdvance).toFixed(1);
    if (upfront > g.cash) { addLog(g, `You cannot fund this package: ${fmtM(upfront)} needed after financing, ${fmtM(g.cash)} on hand.`, "bad"); setModal(null); return; }
    if ((g.committedThisMonth || 0) >= commitCap(g) || g.pipeline.filter((x) => x.status === "pipeline").length >= plateCap(g)) {
      addLog(g, `The slate is full. Even a studio has limits.`, "bad"); setModal(null); return;
    }
    const tier = B <= 16 ? "indie" : B <= 65 ? "mid" : "tent";
    const e = (() => { const r = Math.random(); return r < 0.08 ? -2 : r < 0.3 ? -1 : r < 0.7 ? 0 : r < 0.92 ? 1 : 2; })();
    /* packaging and release design raise the odds, but mismatched scale can eat the benefit */
    const pkgShift = pkg.director * 0.55 + pkg.star * 0.45 + pkg.vfx * 0.35 + (pkg.coprod ? 0.3 : 0) + sandboxReleaseShift(ip, pkg);
    const overloaded = talentCost > B * 0.35;
    const talentPts = pkg.star * 3 + (pkg.coprod ? 2 : 0);
    const titleBase = ip.name || ip.title;
    const suffix = ipFilmCount(ip) === 0 ? "" : (pkg.franchisePlan === "trilogy" ? `: Chapter ${ipFilmCount(ip) + 1}` : " " + (ipFilmCount(ip) + 1));
    const d = {
      id: uid(), title: titleBase + suffix, genre: ip.genre, tier, B, e,
      heat: 0, firstLook: true, termSheet: false, tell: null, nego: null,
      packagerId: null, packagerName: g.studioName || g.name, hook: null,
      signals: mkSignals(g, e, 2),
      structures: [], fee: streamerAdvance, consensusNet: consensusEV(tier, B),
      status: "pipeline", struct: myShare >= 1 ? "own" : "coown", invested: recoupedRisk, myFee: streamerAdvance, pts: finance === "streamer" ? 4 : 0, sq: pkg.franchisePlan === "standalone" ? 0 : 2, share: myShare,
      sweetened: false, exited: false, exitPay: 0, fixPaid: false, news: 0, mark: 0,
      releaseAt: g.t + ri(3, 6) + (pkg.vfx >= 2 || pkg.franchisePlan === "backtoback" ? 1 : 0), result: null, brandLvl: ipBrand(ip), ipId: ip.id,
      pkgShift: overloaded ? pkgShift * 0.35 : pkgShift, talentPts, partner: finance === "partner" ? "Meridian Capital" : finance === "streamer" ? "Streamer pre-buy" : null,
      marketing, releaseStrategy: pkg.strategy, franchisePlan: pkg.franchisePlan, productionBudget:B, extraCost,
    };
    d.mark = markPosition(d, g);
    g.cash = +(g.cash - upfront).toFixed(1);
    g.committedThisMonth = (g.committedThisMonth || 0) + 1;
    if (g.overall) g.overall.lastBoard = g.t;
    g.pipeline.push(d);
    ip.status = "developed";
    const bits = [];
    if (pkg.director) bits.push(pkg.director >= 2 ? "an A-list director" : "a strong director");
    if (pkg.star) bits.push(pkg.star >= 2 ? "A-list stars on points" : "name stars on points");
    if (pkg.vfx) bits.push(pkg.vfx >= 2 ? "top-tier VFX" : "solid VFX support");
    if (pkg.coprod) bits.push("a proven co-producer");
    bits.push(`${RELEASE_LABEL[pkg.strategy] || "Moderate"} release`);
    if (pkg.franchisePlan && pkg.franchisePlan !== "standalone") bits.push(FRANCHISE_LABEL[pkg.franchisePlan].toLowerCase());
    addLog(g, `${g.studioName} greenlights "${d.title}": ${fmtM(B)} production, ${fmtM(marketing)} marketing, ${FINANCE_LABEL[finance].toLowerCase()}, ${bits.join(", ")}.${overloaded ? " The talent bill is heavy for a picture this size, the odds boost barely survives it." : ""}`, "good");
    setModal(null);
  });

  const sellStake = (pct) => up((g) => {
    if (g.ownStake - pct < 0.25 && pct < g.ownStake) return;
    const val = studioValuation(g);
    const price = +(val * pct * rnd(0.95, 1.1)).toFixed(1);
    g.cash = +(g.cash + price).toFixed(1);
    g.ownStake = +(g.ownStake - pct).toFixed(2);
    addLog(g, `Private equity buys ${Math.round(pct * 100)}% of ${g.studioName} for ${fmtM(price)}. From today they take their share of every dollar the films bring in. You kept the chair. They bought the cushion.`, "good");
    setModal(null);
  });

  const sellStudio = () => up((g) => {
    const val = studioValuation(g);
    const price = +(val * g.ownStake * rnd(1.0, 1.15)).toFixed(0);
    g.cash = +(g.cash + price).toFixed(1);
    g.retired = { price, valuation: val };
    addLog(g, `${g.studioName} sells for ${fmtM(val)}. Your ${Math.round(g.ownStake * 100)}% nets ${fmtM(price)}. The gate keeps the name. The town keeps the stories.`, "good");
    setModal(null);
  });

  const scoutTalent = () => up((g) => {
    const cost = 0.3;
    if (g.cash < cost || (g.talentProspects || []).length >= 10) return;
    g.cash = +(g.cash - cost).toFixed(2);
    const found = scoutProspects(g, 1);
    g.talentProspects = [...(g.talentProspects || []), ...found];
    addLog(g, `Your scout turns up ${found[0].name}, a ${found[0].role} with a scouting grade of ${found[0].visibleGrade}. Grades are not always right.`);
  });

  const signTalent = (prospectId) => up((g) => {
    const ok = signProspect(g, prospectId, 3, 1);
    if (ok) { const p = g.talentProspects.find((x) => x.id === prospectId); addLog(g, `You sign ${p.name} to a 3-picture deal.`, "good"); }
  });

  const attachProspect = (dealId, prospectId) => up((g) => {
    const ok = attachProspectToDeal(g, dealId, prospectId);
    if (ok) { const p = g.talentProspects.find((x) => x.id === prospectId); const d = g.deals.find((x) => x.id === dealId); addLog(g, `${p.name} attaches to "${d.title}".`, "good"); }
    setModal(null);
  });

  const sellAsset = (assetId) => up((g) => { sellHardAsset(g, assetId); });

  const nextMonth = () => up((g) => endMonth(g));

  /* ---------- render ---------- */
  return (
    <div className="pr">
      <style>{CSS}</style>
      {savedTick && <div className="saved">SAVED ●</div>}
      <header className="top">
        <h1 className="title">{game.studioMode ? game.studioName : "The Producer"}</h1>
        <div className="subhead">{dateLabel(game.t)} · {game.studioMode ? "A " + game.name + " company · You own " + Math.round(game.ownStake * 100) + "%" : "Beat the town's math"}</div>
      </header>
      <div className="statbar">
        <div className="stat"><div className="k">Bankroll</div><div className={"v " + (game.cash >= 0 ? "pos" : "neg")}>{fmtM(game.cash)}</div></div>
        <div className="stat"><div className="k">Reputation</div><div className="v gold">{game.rep}</div></div>
        <div className="stat"><div className="k">{game.studioMode ? "Studio Value" : "Marked NAV"}</div><div className="v gold">{fmtM((game.studioMode ? studioValuation(game) : receivablesOut(game) + game.pipeline.reduce((s, d) => s + (d.exited ? 0 : (d.mark || 0)), 0)) + Math.max(0, game.cash))}</div></div>
        {game.lastInflow > 0 && <div className="stat"><div className="k">Last Inflow</div><div className="v pos">+{fmtM(game.lastInflow)}</div></div>}
        <div className="stat"><div className="k">Standing</div><div className="v gold" style={{fontSize:12.5}}>{LADDER[ladderIdx(game.rep)].name}</div></div>
      </div>
      <nav className="tabs">
        {[["desk","The Desk", game.deals.length],["pipeline","In Play", game.pipeline.length],...(game.studioMode ? [["studio","The Studio", game.ips.length]] : []),["people","People",""],["record","Track Record", game.closed.length],["trades","The Trades",""]].map(([id,label,n]) => (
          <button key={id} className={"tab" + (tab === id ? " on" : "")} onClick={() => setTab(id)}>
            {label}{n !== "" && n > 0 ? <span className="n">{n}</span> : null}
          </button>
        ))}
        <button className="tab" onClick={() => setScreen("menu")}>Main Menu</button>
      </nav>

      <main className="wrap">
        {game.career && game.career.result && <CareerResultCard g={game} onMenu={() => setScreen("menu")} />}
        {!game.career && game.retired && (
          <div className="card" style={{borderColor:"var(--gold)"}}>
            <div className="lbl" style={{color:"var(--gold)"}}>The exit</div>
            <div style={{fontSize:14, lineHeight:1.7}}>You sold {game.studioName} at a {fmtM(game.retired.valuation)} valuation and walked away with {fmtM(game.retired.price)} for your stake. Career: {game.stats.done} deals, {game.stats.wins} wins, {game.stats.losses} losses, best trade {fmtM(game.stats.bestNet)}, {game.ips.reduce((s, ip) => s + ip.films, 0)} films across {game.ips.length} universes of your own. The town will spend a decade telling stories about how you did it.</div>
            <div className="actions"><button className="btn gold" onClick={() => setScreen("menu")}>Back to the main menu</button></div>
          </div>
        )}
        {!game.career && game.over && (
          <div className="card" style={{borderColor:"var(--red)"}}>
            <div className="lbl" style={{color:"var(--red)"}}>The phone stopped ringing</div>
            <div className="kv"><span>Deals <b>{game.stats.done}</b></span><span>Wins <b>{game.stats.wins}</b></span><span>Losses <b>{game.stats.losses}</b></span></div>
            <div className="actions"><button className="btn gold" onClick={() => setScreen("menu")}>Back to the main menu</button></div>
          </div>
        )}

        {tab === "desk" && <><CareerCard g={game} />{!game.career && <Offers g={game} onTake={takeOffer} onDecline={declineOffer} />}
          <DeskTab g={game} onOpen={(d) => setModal({ type: d.termSheet ? "termsheet" : "structure", dealId: d.id })} onPass={passDeal} onAttachOpen={(d) => setModal({ type: "attach", dealId: d.id })} /></>}
        {tab === "pipeline" && <PipelineTab g={game} onShop={(d) => setModal({ type: "shop", dealId: d.id, offer: +Math.max(0.1, d.mark * rnd(0.85, 1.02)).toFixed(1) })} onSellAsset={sellAsset} />}
        {tab === "studio" && game.studioMode && <StudioTab g={game} onDevelop={(ip) => setModal({ type: "develop", ipId: ip.id })} onSellStake={sellStake} onSellStudio={() => setModal({ type: "sellstudio" })} onSellIp={sellIp} onBuyInsurance={buyInsurance} onRevive={reviveTitle} />}
        {tab === "people" && <PeopleTab g={game} onScout={scoutTalent} onSign={signTalent} />}
        {tab === "record" && <RecordTab g={game} />}
        {tab === "trades" && <TradesTab g={game} />}
      </main>

      <div className="endmonth">
        <button disabled={game.over || !!game.retired || (game.career && !!game.career.result) || !!qItem || !!modal} onClick={nextMonth}>▶ END MONTH</button>
      </div>

      {qItem && qItem.type === "result" && <ResultModal g={game} item={qItem} onClose={() => answerQueue("ok")} />}
      {qItem && qItem.type === "buyout" && <BuyoutModal g={game} item={qItem} onChoose={answerQueue} />}
      {qItem && qItem.type === "trouble" && <TroubleModal g={game} item={qItem} onChoose={answerQueue} />}
      {!qItem && modal?.type === "structure" && <StructureModal g={game} dealId={modal.dealId} onCommit={commit} onClose={() => setModal(null)} />}
      {!qItem && modal?.type === "rival" && <RivalModal g={game} dealId={modal.dealId} onChoose={rivalChoice} />}
      {!qItem && modal?.type === "shop" && <ShopModal g={game} dealId={modal.dealId} offer={modal.offer} onSell={shopPosition} onClose={() => setModal(null)} />}
      {!qItem && modal?.type === "attach" && <AttachTalentModal g={game} dealId={modal.dealId} onAttach={attachProspect} onClose={() => setModal(null)} />}
      {!qItem && modal?.type === "termsheet" && <TermSheetModal g={game} dealId={modal.dealId} lastAsk={modal.lastAsk} onSubmit={submitAsk} onAccept={acceptCounter} onClose={() => setModal(null)} />}
      {qItem && qItem.type === "reneg" && <RenegModal g={game} item={qItem} onChoose={answerQueue} />}
      {!qItem && modal?.type === "found" && <FoundModal g={game} onFound={foundStudio} onClose={() => setModal(null)} />}
      {!qItem && modal?.type === "develop" && <DevelopModal g={game} ipId={modal.ipId} onGo={developFilm} onClose={() => setModal(null)} />}
      {!qItem && modal?.type === "sellstudio" && <SellStudioModal g={game} onSell={sellStudio} onClose={() => setModal(null)} />}
    </div>
  );
}

function Setup({ onStart, onCancel }) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState("producer");
  const [sName, setSName] = useState("");
  return (
    <div className="pr">
      <style>{CSS}</style>
      <header className="top">
        <h1 className="title">The Producer</h1>
        <div className="subhead">A market game</div>
      </header>
      <main className="wrap" style={{maxWidth:520}}>
        <div className="card">
          <div className="lbl">Your name</div>
          <input type="text" value={name} maxLength={24} placeholder="Alex Doyle" onChange={(e) => setName(e.target.value)} />
          <div className="kv" style={{marginTop:12, lineHeight:1.65}}>
            <span>You have {fmtM(10)} and a decent reputation. Every month, packaged films cross your desk with the town's math attached, and the town is usually right. Your edge is what people whisper to you, and whispers are wrong about a third of the time. Take safe fees, take backend points, or put real capital at risk. Rivals will make you overpay. Streamers will offer to cap your upside. Most films fail. A few change everything. Run the bankroll to {fmtM(250)} and you earn your own studio.</span>
          </div>
          <div className="lbl" style={{marginTop:14}}>How do you want to start?</div>
          <div className="pick" style={mode === "producer" ? {borderColor:"var(--gold)"} : {}} onClick={() => setMode("producer")}>
            <div className="nm">The climb: start as a producer</div>
            <div className="dt">{fmtM(10)}, a reputation to build, and a studio to earn at {fmtM(250)}.</div>
          </div>
          <div className="pick" style={mode === "studio" ? {borderColor:"var(--gold)"} : {}} onClick={() => setMode("studio")}>
            <div className="nm">The chair: start with your studio</div>
            <div className="dt">{fmtM(300)}, standing already earned, the IP market open from day one.</div>
          </div>
          {mode === "studio" && <>
            <div className="lbl">Studio name</div>
            <input type="text" value={sName} maxLength={28} placeholder="Doyle Pictures" onChange={(e) => setSName(e.target.value)} />
          </>}
          <div className="actions">
            <button className="btn green" style={{flex:1}} onClick={() => onStart(name.trim(), mode, sName)}>{mode === "studio" ? "Open the gates" : "Open the office"}</button>
            {onCancel && <button className="btn ghost" onClick={onCancel}>Cancel</button>}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- tabs ---------------- */
function Offers({ g, onTake, onDecline }) {
  const items = [];
  if (g.overall) items.push(
    <div key="ov" className="card" style={{borderColor:"var(--gold)"}}>
      <div className="lbl" style={{color:"var(--gold)"}}>Overall deal · {g.overall.studio}</div>
      <div className="kv"><span>Retainer <b>{fmtM(g.overall.pay)}/mo</b></span><span>Runs to <b>{dateLabel(g.overall.until)}</b></span><span>Last boarded <b>{dateLabel(g.overall.lastBoard)}</b></span></div>
      <div className="kv" style={{marginTop:6}}><span>Board a picture at least every other month or they tear it up.</span></div>
    </div>
  );
  if (g.franchise) items.push(
    <div key="fr" className="card" style={{borderColor:"var(--gold)"}}>
      <div className="lbl" style={{color:"var(--gold)"}}>Franchise steward · "{g.franchise.titleBase}"</div>
      <div className="kv"><span>Chapter <b>{g.franchise.filmIdx} of 3</b></span><span>Studio <b>{g.franchise.studioName}</b></span>{g.franchise.pendingAt != null && <span>Next boards <b>{dateLabel(g.franchise.pendingAt)}</b></span>}</div>
      <div className="kv" style={{marginTop:6}}><span>A chapter that bombs kills the saga and dents you badly. Deliver all three and the town remembers.</span></div>
    </div>
  );
  for (const o of g.offers) {
    if (o.type === "oldstudio") items.push(
      <div key={o.id} className="deal" style={{borderColor:"#b08a2e", borderWidth:2}}>
        <div className="from">Brokered quietly · a dying studio needs cash</div>
        <div className="t">For sale: the {o.name} library</div>
        <div className="body">{o.titles} titles nobody has touched in years, remake and sequel rights included, plus a back catalogue that pays every month whether you lift a finger or not. Asking {fmtM(o.ask)}, paying roughly {fmtM(o.monthly)}/mo starting immediately.</div>
        <div className="actions">
          <button className="btn gold" disabled={g.cash < o.ask} onClick={() => onTake(o.id)}>Acquire the library ({fmtM(o.ask)})</button>
          <button className="btn ghost" onClick={() => onDecline(o.id)}>Pass</button>
        </div>
      </div>
    );
    if (o.type === "property" || o.type === "ip") items.push(
      <div key={o.id} className="deal" style={{borderColor:"#b08a2e", borderWidth:2}}>
        <div className="from">The rights market · brokered quietly</div>
        <div className="t">For sale: "{o.name}" · {o.kind}</div>
        <div className="meta">{genreLabel(o.genre)} · asking {fmtM(o.ask)} · brand {o.brand}/5 · script {o.scriptQuality || "—"} · franchise {o.franchisePotential || 1}x</div>
        <div className="body">{o.note || "Rights are available now. Buy the property, put it in the vault, and decide later whether the movie deserves real money."}</div>
        <div className="consensus"><div className="h">Advisor read</div>Buying this does not greenlight a movie. It creates optionality: develop it yourself, wait for an outside pitch, sell it later, or let it sit until the slate needs this genre.</div>
        <div className="actions">
          <button className="btn gold" disabled={g.cash < o.ask} onClick={() => onTake(o.id)}>{o.action || "Acquire it"} ({fmtM(o.ask)})</button>
          <button className="btn ghost" onClick={() => onDecline(o.id)}>Pass</button>
        </div>
      </div>
    );
    if (o.type === "ippitch") items.push(
      <div key={o.id} className="deal" style={{borderColor:"#b08a2e", borderWidth:2}}>
        <div className="from">Incoming pitch · based on IP you own</div>
        <div className="t">{o.producer} wants "{o.title}"</div>
        <div className="meta">From "{o.ipName}" · {genreLabel(o.genre)} · {fmtM(o.B)} production · {fmtM(o.marketing)} marketing · {o.label}</div>
        <div className="body">{o.copy} Their proposal gives you {fmtM(o.fee)} upfront, {o.pts} backend points{o.share ? ", and requires you to cover " + Math.round(o.share * 100) + "% of production/marketing" : ", with no production cash at risk"}. Franchise approach: {FRANCHISE_LABEL[o.plan] || o.plan}.</div>
        <div className="consensus"><div className="h">Advisor read</div>This is why owning IP matters: you do not have to develop every film yourself. Approve the right outside team, protect the brand, and let their money work.</div>
        <div className="actions">
          <button className="btn gold" disabled={o.share && ((o.B + o.marketing) * o.share) > g.cash + o.fee} onClick={() => onTake(o.id)}>Approve pitch</button>
          <button className="btn ghost" onClick={() => onDecline(o.id)}>Pass</button>
        </div>
      </div>
    );
    if (o.type === "franchise") items.push(
      <div key={o.id} className="deal" style={{borderColor:"#b08a2e", borderWidth:2}}>
        <div className="from">From: {o.studio} · a call your standing earned</div>
        <div className="t">The "{o.title}" franchise</div>
        <div className="body">We own a dormant brand the audience never stopped loving, and we think you are the one to bring it back. Three pictures, starting at {fmtM(o.B)} and escalating, one term sheet covering the whole saga with your terms carrying through and improving each chapter. Understand what you are accepting: stewards who deliver become legends. Stewards who bomb chapter one become cautionary tales.</div>
        <div className="actions">
          <button className="btn gold" onClick={() => onTake(o.id)}>Open franchise talks</button>
          <button className="btn ghost" onClick={() => onDecline(o.id)}>Not this brand</button>
        </div>
      </div>
    );
    if (o.type === "overall") items.push(
      <div key={o.id} className="deal" style={{borderColor:"#b08a2e", borderWidth:2}}>
        <div className="from">From: {o.studio} · a call your standing earned</div>
        <div className="t">An overall deal</div>
        <div className="body">{fmtM(o.pay)} a month for {o.months} months, offices on the lot, your name on the gate. In exchange, you keep producing: board at least one picture every other month or the deal terminates and the town hears why. Security has a leash on it.</div>
        <div className="actions">
          <button className="btn gold" onClick={() => onTake(o.id)}>Sign it</button>
          <button className="btn ghost" onClick={() => onDecline(o.id)}>Stay independent</button>
        </div>
      </div>
    );
    if (o.type === "found") items.push(
      <div key={o.id} className="deal" style={{borderColor:"#b08a2e", borderWidth:2}}>
        <div className="from">From: your lawyer, your banker, and everyone who ever passed on you</div>
        <div className="t">Found your studio</div>
        <div className="body">The bankroll is there. The track record is there. One signature turns you from the town's sharpest producer into a studio with your name on the gate. You keep everything you do now: the deals, the term sheets, the positions. You add a slate of your own, an IP war chest, and eventually an exit. Overhead becomes real. So does the legend.</div>
        <div className="actions">
          <button className="btn gold" onClick={() => onTake(o.id)}>Sign it</button>
          <button className="btn ghost" onClick={() => onDecline(o.id)}>Not yet</button>
        </div>
      </div>
    );
    if (o.type === "kingmaker") items.push(
      <div key={o.id} className="deal" style={{borderColor:"#b08a2e", borderWidth:2}}>
        <div className="from">From: {o.studio} · a call very few people ever get</div>
        <div className="t">Name your picture</div>
        <div className="body">Once a year, at your standing, a studio simply says yes: {fmtM(3)} fee, 12 gross points, 5 sequel points, their money, your pick. Your people will bring you an unusually well-scouted project with three separate reads on it. This is what the ladder was for.</div>
        <div className="actions">
          <button className="btn gold" onClick={() => onTake(o.id)}>Make the call</button>
          <button className="btn ghost" onClick={() => onDecline(o.id)}>Save the favour</button>
        </div>
      </div>
    );
  }
  return <>{items}</>;
}

const HEAT_LABEL = ["No competition", "Warm interest around town", "Hot: multiple parties circling", "A frenzy: everyone wants it"];

function DeskTab({ g, onOpen, onPass, onAttachOpen }) {
  if (!g.deals.length) return <div className="empty">Nothing on the desk. End the month and the phone will ring.</div>;
  const eligible = (d) => (g.talentProspects || []).filter((p) => p.signed && p.contract && p.contract.filmsRemaining > 0);
  return (
    <>
      {g.deals.map((d) => (
        <div key={d.id} className="deal">
          <div className="from">From: {d.packagerName}{d.firstLook ? " · FIRST LOOK, EXCLUSIVE" : ""} · {dateLabel(g.t)}</div>
          <div className="t">{d.title}</div>
          <div className="meta">{TIERS[d.tier].label} {d.genre} · Budget {fmtM(d.B)} · Release: {TIERS[d.tier].rel} (distribution decides)</div>
          {d.hook && <div className="body">{d.hook.txt}</div>}
          {d.tell && <div className="body" style={{color:"#7a5a1e"}}>{d.tell.txt}</div>}
          <div className="consensus">
            <div className="h">The town's math</div>
            Expected net around {d.consensusNet >= 0 ? "+" : ""}{fmtM(d.consensusNet)} on {fmtM(d.B)}. Most likely outcome: treads water or underperforms. Real bomb risk. {d.tier === "indie" ? "Slim but live shot at a breakout that returns many times the budget." : d.tier === "tent" ? "Ceiling is high, but so is the burn if it misses." : "Modest ceiling, modest floor."}
            <div style={{marginTop:6}}>{HEAT_LABEL[d.heat]}.</div>
          </div>
          {d.signals.map((s, i) => (
            <div key={i} className="signal">"{s.txt}"<div className="who">{s.who}, agent. Take it for what it is worth.</div></div>
          ))}
          {!d.signals.length && <div className="body" style={{color:"#7a6a3e"}}>No whispers on this one. You know what the town knows, nothing more.</div>}
          {d.attachedProspectName && <div className="body" style={{color:"var(--gold2)", fontStyle:"italic"}}>{d.attachedProspectName} is attached from the farm.</div>}
          <div className="actions">
            <button className="btn gold" onClick={() => onOpen(d)}>{d.termSheet ? "Open negotiations" : "Talk structure"}</button>
            {!d.attachedProspectId && eligible(d).length > 0 && <button className="btn ghost" onClick={() => onAttachOpen(d)}>Attach farm talent</button>}
            <button className="btn ghost" onClick={() => onPass(d.id)}>Pass</button>
          </div>
        </div>
      ))}
      <div className="empty" style={{padding:"0 8px 8px"}}>Deals expire at month's end. You can board two per month, six in flight. Every safe fee is a position you did not take.</div>
    </>
  );
}

const NEWS_READ = ["deeply bearish", "bearish", "cooling", "mixed", "warming", "bullish", "euphoric"];
function HardAssetsCard({ g, onSell }) {
  const assets = g.hardAssets || [];
  if (!assets.length) return null;
  return (
    <div className="card">
      <div className="lbl" style={{marginTop:0}}>Hard Assets</div>
      {assets.map((a) => (
        <div key={a.id} className="kv" style={{marginTop:6, alignItems:"center", justifyContent:"space-between"}}>
          <span><b>{a.name}</b> · {a.type.replace(/_/g, " ")} · value {fmtM(a.value)}{a.monthlyIncome ? " · +" + fmtM(a.monthlyIncome) + "/mo" : ""}{a.monthlyCost ? " · -" + fmtM(a.monthlyCost) + "/mo upkeep" : ""}</span>
          {a.canSell && <button className="btn ghost" onClick={() => onSell(a.id)}>Sell (~{fmtM(a.value * 0.85)})</button>}
        </div>
      ))}
    </div>
  );
}
function PipelineTab({ g, onShop, onSellAsset }) {
  if (!g.pipeline.length && !(g.hardAssets || []).length) return <div className="empty">Nothing in play. The desk is where positions get built.</div>;
  return (
    <>
      <HardAssetsCard g={g} onSell={onSellAsset} />
      {!g.pipeline.length && <div className="empty">Nothing in the pipeline yet.</div>}
      {!!g.pipeline.length && <div className="empty" style={{padding:"2px 8px 12px"}}>The mark is what the town thinks your position is worth today, priced off public news. Your whispers may know better, in either direction.</div>}
      {g.pipeline.map((d) => {
        const basis = d.invested;
        const delta = d.mark - basis;
        const sellable = !d.exited && d.mark > 0.3;
        return (
          <div key={d.id} className="card">
            <div className="lbl">{d.title} · releases {dateLabel(d.releaseAt)}</div>
            <div className="kv">
              <span>Structure <b>{d.struct === "fee" ? "Fee only" : d.struct === "points" ? d.pts + " points" : d.struct === "own" ? "Own 100%" : Math.round(d.share * 100) + "% equity"}</b></span>
              <span>Budget <b>{fmtM(d.B)}</b></span>
              {d.invested > 0 && <span>Basis <b>{fmtM(d.invested)}</b></span>}
              {(d.share > 0 || d.pts > 0) && !d.exited && <span>Mark <b style={{color: delta >= 0 ? "var(--green)" : "var(--red)"}}>{fmtM(d.mark)}</b></span>}
              {(d.share > 0 || d.pts > 0) && !d.exited && <span>Town read <b>{NEWS_READ[(d.news || 0) + 3]}</b></span>}
              {d.myFee > 0 && <span>Fee banked <b>{fmtM(d.myFee)}</b></span>}
              {d.exited && <span style={{color:"var(--gold2)"}}>Position sold for {fmtM(d.exitPay)}</span>}
              {d.sweetened && <span style={{color:"var(--red)"}}>Overpaid in the auction</span>}
              {d.fixPaid && <span>Paid to steady the ship</span>}
            </div>
            {sellable && (
              <div className="actions">
                <button className="btn ghost" onClick={() => onShop(d)}>Shop the position (~{fmtM(d.mark * 0.93)})</button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function TalentFarmPanel({ g, onScout, onSign }) {
  const prospects = g.talentProspects || [];
  const unsigned = prospects.filter((p) => !p.signed && !p.contractExpired);
  const expired = prospects.filter((p) => p.contractExpired && !p.signed);
  const signed = prospects.filter((p) => p.signed);
  const scoutCost = 0.3;
  return (
    <div className="card">
      <div className="row">
        <div className="lbl" style={{margin:0}}>Talent Farm</div>
        <button className="btn ghost" disabled={g.cash < scoutCost || prospects.length >= 10} onClick={onScout}>Scout ({fmtM(scoutCost)})</button>
      </div>
      <div className="kv" style={{marginTop:6}}><span>Cheap genre talent, signed to short multi-picture deals. A scouting report is right about 70% of the time, not always.</span></div>
      {!prospects.length && <div className="kv" style={{marginTop:8}}><span>Nobody scouted yet.</span></div>}
      {signed.map((p) => (
        <div key={p.id} className="kv" style={{marginTop:8, alignItems:"flex-start"}}>
          <span><b>{p.name}</b> · {p.role} · {p.genreAffinity} · {p.breakoutStatus} · {p.contract.filmsRemaining} film{p.contract.filmsRemaining === 1 ? "" : "s"} left on contract, {fmtM(p.contract.costPerFilm)}/film</span>
        </div>
      ))}
      {unsigned.map((p) => (
        <div key={p.id} className="kv" style={{marginTop:8, alignItems:"center", justifyContent:"space-between"}}>
          <span><b>{p.name}</b> · {p.role} · {p.genreAffinity} · scouting grade {p.visibleGrade}</span>
          <button className="btn ghost" disabled={g.cash < p.costPerFilm * 2} onClick={() => onSign(p.id)}>Sign (3 pics, {fmtM(p.costPerFilm)}/film)</button>
        </div>
      ))}
      {expired.map((p) => (
        <div key={p.id} className="kv" style={{marginTop:8, alignItems:"center", justifyContent:"space-between"}}>
          <span><b>{p.name}</b> · {p.role} · contract expired, {p.breakoutStatus}, the discount is gone</span>
          <button className="btn ghost" disabled={g.cash < p.costPerFilm * 2} onClick={() => onSign(p.id)}>Re-sign ({fmtM(p.costPerFilm)}/film)</button>
        </div>
      ))}
    </div>
  );
}

function PeopleTab({ g, onScout, onSign }) {
  const sorted = [...g.contacts].sort((a, b) => b.rel - a.rel);
  return (
    <>
      <TalentFarmPanel g={g} onScout={onScout} onSign={onSign} />
      <div className="empty" style={{padding:"2px 8px 12px"}}>Relationships move on outcomes, not coffee. Make people money and they bring you their best. Burn them and the whispers dry up.</div>
      {sorted.map((c) => (
        <div key={c.id} className="card">
          <div className="row">
            <div>
              <div style={{fontWeight:800, fontSize:15}}>{c.name}</div>
              <div style={{color:"var(--dim)", fontSize:11.5, marginTop:2}}>{c.label}{c.kind === "packager" && c.rel >= 62 ? " · sends you first looks" : ""}</div>
            </div>
            <div style={{fontFamily:"'Courier Prime',monospace", fontSize:12, color:"var(--dim)"}}>trust {c.rel}</div>
          </div>
          <div className="relbar"><i style={{width: c.rel + "%"}} /></div>
          <div className="kv" style={{marginTop:8}}><span>{c.gives}</span></div>
        </div>
      ))}
    </>
  );
}

function RecordTab({ g }) {
  const s = g.stats;
  return (
    <>
      <div className="card">
        <div className="lbl">The scorecard</div>
        <div className="kv">
          <span>Deals closed <b>{s.done}</b></span>
          <span>Wins <b>{s.wins}</b></span>
          <span>Losses <b>{s.losses}</b></span>
          <span>Best trade <b>{fmtM(s.bestNet)}</b></span>
          <span>Worst trade <b>{fmtM(s.worstNet)}</b></span>
          <span>Early exits <b>{s.exits}</b>{s.exits > 0 ? <span style={{color:"var(--dim)"}}> ({s.exitRegret} you regretted)</span> : null}</span>
        </div>
      </div>
      <div className="card">
        <div className="lbl">Closed positions</div>
        {!g.closed.length ? <div className="empty">No results yet. They come 3 to 6 months after you commit.</div> : (
          <table>
            <thead><tr><th>Title</th><th>Deal</th><th>Film P&L</th><th>Your net</th></tr></thead>
            <tbody>
              {g.closed.map((d) => (
                <tr key={d.id}>
                  <td>{d.title}{d.exited ? " (sold early)" : ""}</td>
                  <td>{d.struct === "fee" ? "fee" : d.struct === "points" ? d.pts + "pts" : d.struct === "own" ? "100%" : Math.round(d.share * 100) + "%"}</td>
                  <td style={{color: d.result.filmNet >= 0 ? "var(--green)" : "var(--red)"}}>{fmtM(d.result.filmNet)}</td>
                  <td style={{color: d.result.yourNet >= 0 ? "var(--green)" : "var(--red)"}}>{fmtM(d.result.yourNet)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function TradesTab({ g }) {
  if (!g.log.length) return <div className="empty">Nothing yet.</div>;
  return (
    <>
      {g.log.map((l, i) => (
        <div key={i} className={"news " + l.kind}>
          <div className="d">{l.d}</div>
          <div className="h">{l.txt}</div>
        </div>
      ))}
    </>
  );
}

/* ---------------- modals ---------------- */
function StructureModal({ g, dealId, onCommit, onClose }) {
  const d = g.deals.find((x) => x.id === dealId);
  const [share, setShare] = useState(0.25);
  if (!d) return null;
  const coown = d.structures.find((s) => s.id === "coown");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{d.title}</h3>
        <div className="sub">{fmtM(d.B)} budget. Town expects {d.consensusNet >= 0 ? "+" : ""}{fmtM(d.consensusNet)}. How much of this do you want to be?</div>
        {d.structures.map((st) => {
          if (st.id === "coown") {
            const pct = clamp(share, 0.05, st.maxShare);
            const cost = +(d.B * pct).toFixed(1);
            const afford = g.cash + st.fee >= cost;
            return (
              <div key={st.id} className={"pick" + (afford ? "" : " off")} style={!afford ? {opacity:.45} : {}}>
                <div className="nm">Co-finance: {Math.round(pct * 100)}% for {fmtM(cost)}</div>
                <div className="dt">Fee {fmtM(st.fee)} now. You eat {Math.round(pct * 100)}% of the film's P&L, up or down. Max {Math.round(st.maxShare * 100)}%.</div>
                <input type="range" min={5} max={Math.round(st.maxShare * 100)} step={5} value={Math.round(pct * 100)} onChange={(e) => setShare(+e.target.value / 100)} onClick={(e) => e.stopPropagation()} />
                <div className="actions" style={{marginTop:6}}>
                  <button className="btn green" disabled={!afford} onClick={() => onCommit(d.id, "coown", pct)}>Commit {fmtM(cost)}</button>
                </div>
              </div>
            );
          }
          const cost = st.id === "own" ? d.B : 0;
          const afford = g.cash + st.fee >= cost;
          return (
            <div key={st.id} className={"pick" + (afford ? "" : " off")} style={!afford ? {opacity:.45} : {}} onClick={() => afford && onCommit(d.id, st.id, 0)}>
              <div className="nm">{st.label}{st.id === "own" ? `: ${fmtM(d.B)}` : ""}</div>
              <div className="dt">
                {st.id === "fee" && `${fmtM(st.fee)} guaranteed, paid now. Zero exposure, zero upside. Builds the resume.`}
                {st.id === "points" && `${fmtM(st.fee)} now plus ${st.pts} points. Points pay on anything decent, print on a breakout, pay nothing on a bomb.`}
                {st.id === "own" && `All the risk, all the reward. On an indie, this is the lottery ticket with your name on it.`}
              </div>
            </div>
          );
        })}
        <div className="actions"><button className="btn ghost" style={{flex:1}} onClick={onClose}>Back</button></div>
      </div>
    </div>
  );
}

function RivalModal({ g, dealId, onChoose }) {
  const d = g.deals.find((x) => x.id === dealId);
  if (!d) return null;
  return (
    <div className="overlay">
      <div className="modal">
        <h3>There is a rival at the table</h3>
        <div className="sub">Your lawyer calls before the ink is dry: another buyer just matched your position on "{d.title}". The packager will take the better deal by morning.</div>
        <div className="pick" onClick={() => onChoose(dealId, "sweeten")}>
          <div className="nm">Sweeten to win it</div>
          <div className="dt">Fee cut nearly in half, minus 2 points{d.invested > 0 ? ", and you pay an 8% premium on your stake" : ""}. You get the deal. You also just paid the winner's curse.</div>
        </div>
        <div className="pick" onClick={() => onChoose(dealId, "stand")}>
          <div className="nm">Hold your number</div>
          <div className="dt">Discipline. Roughly a coin flip whether the rival blinks or takes it. Reputation tilts the odds your way.</div>
        </div>
        <div className="pick" onClick={() => onChoose(dealId, "walk")}>
          <div className="nm">Walk away</div>
          <div className="dt">No deal is a position too. The packager will remember, a little.</div>
        </div>
      </div>
    </div>
  );
}

function ShopModal({ g, dealId, offer, onSell, onClose }) {
  const d = g.pipeline.find((x) => x.id === dealId);
  if (!d) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Shop the position</h3>
        <div className="sub">You put "{d.title}" out to the market. The town marks it at {fmtM(d.mark)}, and when you are the one calling, you pay the spread. Best bid today: {fmtM(offer)} against your {fmtM(d.invested)} basis.</div>
        <div className="pick" onClick={() => onSell(dealId, offer)}>
          <div className="nm">Take {fmtM(offer)}</div>
          <div className="dt">Position closed. You will see what it would have paid on release day.</div>
        </div>
        <div className="actions"><button className="btn ghost" style={{flex:1}} onClick={onClose}>Hold instead</button></div>
      </div>
    </div>
  );
}

function AttachTalentModal({ g, dealId, onAttach, onClose }) {
  const d = g.deals.find((x) => x.id === dealId);
  const eligible = (g.talentProspects || []).filter((p) => p.signed && p.contract && p.contract.filmsRemaining > 0);
  if (!d) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Attach farm talent to "{d.title}"</h3>
        <div className="sub">A genre match matters more than a mismatch. This costs their per-film rate and burns one film off their contract.</div>
        {!eligible.length && <div className="kv"><span>Nobody signed and available right now.</span></div>}
        {eligible.map((p) => (
          <div key={p.id} className="pick" onClick={() => onAttach(dealId, p.id)}>
            <div className="nm">{p.name} · {p.role} · {p.genreAffinity}{p.genreAffinity === d.genre ? " (match)" : ""}</div>
            <div className="dt">{p.breakoutStatus} · {p.contract.filmsRemaining} films left · {fmtM(p.contract.costPerFilm)} to attach</div>
          </div>
        ))}
        <div className="actions"><button className="btn ghost" style={{flex:1}} onClick={onClose}>Never mind</button></div>
      </div>
    </div>
  );
}

function BuyoutModal({ g, item, onChoose }) {
  const d = g.pipeline.find((x) => x.id === item.dealId);
  if (!d) return null;
  const basis = d.invested > 0 ? ` against your ${fmtM(d.invested)} at risk` : "";
  return (
    <div className="overlay">
      <div className="modal">
        <h3>{item.who} wants your position</h3>
        <div className="sub">"{d.title}" is mid-production and the platform wants it. The town marks your position at {fmtM(d.mark)}. Their number today: {fmtM(item.offer)}{basis}. Guaranteed money. Capped forever.</div>
        <div className="pick" onClick={() => onChoose("accept")}>
          <div className="nm">Take the money: {fmtM(item.offer)}</div>
          <div className="dt">Certainty is a return too. You will find out what you gave up on release day.</div>
        </div>
        <div className="pick" onClick={() => onChoose("decline")}>
          <div className="nm">Hold. You want the tail.</div>
          <div className="dt">Most films fail. The ones that do not are why you are in this business.</div>
        </div>
      </div>
    </div>
  );
}

function TroubleModal({ g, item, onChoose }) {
  const d = g.pipeline.find((x) => x.id === item.dealId);
  if (!d) return null;
  return (
    <div className="overlay">
      <div className="modal">
        <h3>Trouble on "{d.title}"</h3>
        <div className="sub">Word from the cutting room is not good. The producers are passing the hat for a rescue fund: your share of the fix is {fmtM(item.cost)}. It might save the picture. It might be good money after bad.</div>
        <div className="pick" onClick={() => onChoose("pay")}>
          <div className="nm">Wire the money ({fmtM(item.cost)})</div>
          <div className="dt">Cuts the odds of a total bomb. Raises your basis.</div>
        </div>
        <div className="pick" onClick={() => onChoose("skip")}>
          <div className="nm">Let it ride</div>
          <div className="dt">You already know what you know. Averaging into trouble is how fortunes leak.</div>
        </div>
      </div>
    </div>
  );
}

function ResultModal({ g, item, onClose }) {
  const d = g.closed.find((x) => x.id === item.dealId);
  if (!d) return null;
  const R = d.result;
  const good = R.yourNet > 0.2;
  const bad = R.yourNet < -0.2;
  return (
    <div className="overlay">
      <div className="modal">
        <div className="verdictline" style={{color: R.bucket >= 4 ? "var(--gold)" : R.bucket === 3 ? "var(--green)" : R.bucket <= 1 ? "var(--red)" : "var(--ivory)"}}>{R.bucketLabel}</div>
        <div className="sub" style={{textAlign:"center"}}>"{d.title}" · The town expected {R.consensusNet >= 0 ? "+" : ""}{fmtM(R.consensusNet)}. The film made {fmtM(R.filmNet)}.{R.chaos ? " " + R.chaos : ""}</div>
        <div className="bignum" style={{color: good ? "var(--green)" : bad ? "var(--red)" : "var(--ivory)"}}>{R.yourNet >= 0 ? "+" : ""}{fmtM(R.yourNet)}</div>
        <div className="sub" style={{textAlign:"center", marginTop:-4}}>your net on the position</div>
        <div className="ledger">
          {d.myFee > 0 && <div className="ln"><span>Producer fee (banked at signing)</span><span>+{fmtM(d.myFee)}</span></div>}
          {d.invested > 0 && <div className="ln"><span>Capital you put at risk</span><span>-{fmtM(d.invested)}</span></div>}
          {(d.extraCost || 0) > 0 && <div className="ln"><span>Marketing, packaging and contingency</span><span>-{fmtM(d.extraCost)}</span></div>}
          {!d.exited && d.pts > 0 && <div className="ln"><span>Your {d.pts} points</span><span>+{fmtM(R.pointsPay)}</span></div>}
          {!d.exited && d.share > 0 && <div className="ln"><span>Equity proceeds ({Math.round(d.share * 100)}%)</span><span>+{fmtM(R.equityPay)}</span></div>}
          {!d.exited && R.sequelPay > 0 && <div className="ln"><span>Sequel rights ({d.sq} pts): the franchise is born</span><span>+{fmtM(R.sequelPay)}</span></div>}
          {d.exited && <div className="ln"><span>Buyout received mid-flight</span><span>+{fmtM(d.exitPay)}</span></div>}
          <div className="ln net"><span>NET</span><span style={{color: R.yourNet >= 0 ? "#1d7a4c" : "#a23325"}}>{R.yourNet >= 0 ? "+" : ""}{fmtM(R.yourNet)}</span></div>
        </div>
        {d.exited && R.wouldHave != null && (
          <div className="sub" style={{marginTop:10, textAlign:"center", color: R.wouldHave > R.yourNet ? "var(--red)" : "var(--green)"}}>
            Holding would have netted {R.wouldHave >= 0 ? "+" : ""}{fmtM(R.wouldHave)}. {R.wouldHave > R.yourNet ? "It stings. It was still a rational trade." : "Selling was the right call. Take the win twice."}
          </div>
        )}
        <div className="actions"><button className="btn green" style={{flex:1}} onClick={onClose}>Next</button></div>
      </div>
    </div>
  );
}

/* ---------------- term sheet modal ---------------- */
function Stepper({ label, value, step, max, min, fmt, onChange }) {
  return (
    <div className="pick" style={{cursor:"default"}}>
      <div className="row">
        <div>
          <div className="nm">{label}</div>
          <div className="dt">{fmt(value)}</div>
        </div>
        <div style={{display:"flex", gap:6}}>
          <button className="btn ghost" style={{padding:"6px 12px"}} onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}>-</button>
          <button className="btn gold" style={{padding:"6px 12px"}} onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))}>+</button>
        </div>
      </div>
    </div>
  );
}

function TermSheetModal({ g, dealId, lastAsk, onSubmit, onAccept, onClose }) {
  const d = g.deals.find((x) => x.id === dealId);
  const n = d ? d.nego : null;
  const maxEq = n ? n.maxEq : (d && d.tier === "tent" ? 30 : 40);
  const [ask, setAsk] = useState(lastAsk || { fee: 1, pts: 4, sq: 0, eq: 0 });
  if (!d) return null;
  const roundsUsed = n ? n.round : 0;
  const invested = +(d.B * (ask.eq / 100)).toFixed(1);
  const affordable = invested <= g.cash + ask.fee;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Term sheet: {d.title}</h3>
        <div className="sub">{fmtM(d.B)} {d.tier === "tent" ? "tentpole" : "picture"}. Round {Math.min(roundsUsed + 1, 3)} of 3. Every round you push, they cool a little. What they cut in a counter tells you what they guard.</div>
        {n && n.counter && (
          <div className="pick" style={{borderColor:"var(--gold)", cursor:"default"}}>
            <div className="nm">{n.bristled ? "They bristle at your number, but counter:" : "\u201cIs that your best number?\u201d They counter:"}</div>
            <div className="dt" style={{marginTop:6, lineHeight:1.5}}>
              Fee {fmtM(n.counter.fee)} · {n.counter.pts} points · {n.counter.sq} sequel points · up to {n.counter.eq}% equity
            </div>
            <div className="dt" style={{marginTop:6, lineHeight:1.5}}>{counterText(lastAsk || ask, n.counter, n.profile)}</div>
            <div className="actions">
              <button className="btn green" onClick={() => onAccept(dealId)}>Sign their counter</button>
            </div>
          </div>
        )}
        <div className="sub" style={{marginBottom:4, marginTop:10}}>Your ask:</div>
        <Stepper label="Producer fee" value={ask.fee} step={0.25} min={0} max={3} fmt={(v) => fmtM(v) + " upfront, banked at signing"} onChange={(v) => setAsk({ ...ask, fee: v })} />
        <Stepper label="Gross points" value={ask.pts} step={1} min={0} max={12} fmt={(v) => v + " points. Pay on anything decent, print on a breakout"} onChange={(v) => setAsk({ ...ask, pts: v })} />
        <Stepper label="Sequel rights" value={ask.sq} step={1} min={0} max={5} fmt={(v) => v + " points on any sequel. Pays only if this becomes a franchise"} onChange={(v) => setAsk({ ...ask, sq: v })} />
        <Stepper label="Equity" value={ask.eq} step={5} min={0} max={maxEq} fmt={(v) => v === 0 ? "None. Their money, their risk" : v + "% of the financing: " + fmtM(d.B * v / 100) + " of your cash at risk"} onChange={(v) => setAsk({ ...ask, eq: v })} />
        {!affordable && <div className="sub" style={{color:"var(--red)"}}>You cannot fund {ask.eq}% of this budget with {fmtM(g.cash)} on hand.</div>}
        <div className="actions">
          <button className="btn gold" style={{flex:1}} disabled={!affordable || roundsUsed >= 3} onClick={() => onSubmit(dealId, ask)}>{roundsUsed >= 2 ? "Final ask (they walk if it fails)" : "Put it to them"}</button>
          <button className="btn ghost" onClick={onClose}>Step away</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- studio mode views ---------------- */
function slateRisk(g) {
  const active = g.pipeline.filter((d) => d.status === "pipeline");
  const exposure = active.reduce((s, d) => s + (d.invested || 0), 0);
  const tents = active.filter((d) => d.tier === "tent").length;
  const val = studioValuation(g);
  const ratio = val > 0 ? exposure / val : 0;
  if (tents >= 3) return { level: "high", txt: `${tents} tentpoles unresolved at once. If two miss in the same quarter, nothing in the portfolio is there to absorb it.` };
  if (ratio > 0.6) return { level: "high", txt: `${fmtM(exposure)} at risk against ${fmtM(val)} in enterprise value. The slate is not hedged, it is concentrated.` };
  if (tents >= 2 || ratio > 0.35) return { level: "medium", txt: `A reasonable spread, but two real misses back to back would still hurt.` };
  return { level: "low", txt: `Exposure is spread thin enough that one bomb will not sink the quarter.` };
}

function StudioTab({ g, onDevelop, onSellStake, onSellStudio, onSellIp, onBuyInsurance, onRevive }) {
  const val = studioValuation(g);
  const recv = receivablesOut(g);
  const risk = slateRisk(g);
  const advice = sandboxSlateAdvice(g);
  const insCost = Math.max(4, Math.round(val * 0.02));
  const insCover = Math.round(insCost * 3.5);
  const vault = g.ips || [];
  return (
    <>
      <div className="card" style={{borderColor:"var(--gold)"}}>
        <div className="lbl" style={{color:"var(--gold)"}}>{g.studioName}</div>
        <div className="kv">
          <span>Enterprise value <b>{fmtM(val)}</b></span>
          <span>Your stake <b>{Math.round(g.ownStake * 100)}%</b></span>
          <span>Cash <b>{fmtM(g.cash)}</b></span>
          <span>Owed to you <b>{fmtM(recv)}</b></span>
          <span>Library titles <b>{g.library.length}</b></span>
          <span>Vault properties <b>{vault.length}</b></span>
        </div>
        <div className="kv" style={{marginTop:8}}><span>Box office arrives over six months: opening first, streaming last, and the library pays a trickle forever, with the occasional revival cheque.</span></div>
        <div className="actions">
          {g.ownStake - 0.1 >= 0.25 && <button className="btn ghost" onClick={() => onSellStake(0.1)}>Sell 10% to PE (~{fmtM(val * 0.1)})</button>}
          {g.ownStake - 0.25 >= 0.25 && <button className="btn ghost" onClick={() => onSellStake(0.25)}>Sell 25% (~{fmtM(val * 0.25)})</button>}
          {val >= 500 && <button className="btn gold" onClick={onSellStudio}>Sell the studio</button>}
        </div>
      </div>
      <div className="card" style={{borderColor: risk.level === "high" ? "var(--red)" : risk.level === "medium" ? "var(--gold)" : "var(--line)"}}>
        <div className="lbl" style={{margin:0, color: risk.level === "high" ? "var(--red)" : "var(--gold)"}}>Portfolio risk: {risk.level}</div>
        <div className="kv" style={{marginTop:6}}><span>{risk.txt}</span></div>
        <div className="actions">
          {g.insurance ? (
            <div className="kv"><span>Insured for {fmtM(g.insurance.cover)} through {dateLabel(g.insurance.expiresAt)}.</span></div>
          ) : (
            <button className="btn ghost" disabled={g.cash < insCost} onClick={() => onBuyInsurance(insCost, insCover)}>Buy slate insurance ({fmtM(insCost)} covers {fmtM(insCover)})</button>
          )}
        </div>
      </div>
      <div className="card" style={{borderColor:"var(--gold)"}}>
        <div className="lbl" style={{color:"var(--gold)", margin:0}}>Slate advisor</div>
        {advice.map((n, i) => <div key={i} className="kv" style={{marginTop:i ? 4 : 8}}><span>{n}</span></div>)}
      </div>
      {!!(g.oldStudios || []).length && g.oldStudios.map((os) => (
        <div key={os.id} className="card">
          <div className="lbl" style={{margin:0}}>The {os.name} library</div>
          <div className="kv" style={{marginTop:6}}><span>Pays <b>{fmtM(os.monthly)}/mo</b></span><span>Titles <b>{os.titles.length}</b></span><span>Revived <b>{os.revived.length}</b></span></div>
          <div className="actions">
            {os.titles.filter((t) => !os.revived.includes(t)).slice(0, 3).map((t) => (
              <button key={t} className="btn ghost" onClick={() => onRevive(os.id, t)}>Revive "{t}"</button>
            ))}
          </div>
        </div>
      ))}
      {!vault.length && <div className="empty">No properties in the vault yet. The Desk now brings spec scripts, books, comics, games, remake rights, distressed IP, and dormant franchises. Buy the rights first; greenlight later.</div>}
      {vault.map((ip) => {
        const films = ipFilmCount(ip);
        const brand = ipBrand(ip);
        return (
          <div key={ip.id} className="card">
            <div className="row">
              <div>
                <div style={{fontWeight:800, fontSize:15}}>"{ip.name}"</div>
                <div style={{color:"var(--dim)", fontSize:11.5, marginTop:2}}>{ip.kind || "Owned property"} · {genreLabel(ip.genre)} · {films} film{films === 1 ? "" : "s"} made{films >= 15 ? " · AN EMPIRE" : films >= 10 ? " · a full universe" : films >= 5 ? " · a living franchise" : ""}</div>
              </div>
              <div style={{fontFamily:"'Courier Prime',monospace", fontSize:12, color:"var(--gold)"}}>brand {brand}/5</div>
            </div>
            <div className="relbar"><i style={{width: (brand / 5) * 100 + "%"}} /></div>
            <div className="kv" style={{marginTop:8}}>
              <span>Script <b>{ip.scriptQuality || "—"}</b></span>
              <span>Concept <b>{ip.conceptQuality || "—"}</b></span>
              <span>Franchise <b>{ip.franchisePotential || 1}x</b></span>
              <span>Library <b>{ip.libraryPotential || 1}x</b></span>
              <span>Est. rights value <b>{fmtM(ipValue(ip))}</b></span>
            </div>
            <div className="actions">
              <button className="btn green" onClick={() => onDevelop(ip)}>Develop {films ? "next film" : "first film"}</button>
              <button className="btn ghost" onClick={() => onSellIp(ip.id)}>Sell this property</button>
            </div>
            <div className="kv" style={{marginTop:8}}><span>Streaming and merchandise are no longer magic buttons. If a film works, licensing revenue and outside pitches can follow. If it misses, the brand takes the hit.</span></div>
          </div>
        );
      })}
    </>
  );
}

function FoundModal({ g, onFound, onClose }) {
  const [name, setName] = useState((g.name.split(" ")[0] || "Doyle") + " Pictures");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Name the studio</h3>
        <div className="sub">This is the name on the water tower, the gate, and the lawsuit letterhead. Choose accordingly.</div>
        <input type="text" value={name} maxLength={28} onChange={(e) => setName(e.target.value)} />
        <div className="actions">
          <button className="btn green" style={{flex:1}} onClick={() => onFound(name)}>Open the gates</button>
          <button className="btn ghost" onClick={onClose}>Not yet</button>
        </div>
      </div>
    </div>
  );
}

function DevelopModal({ g, ipId, onGo, onClose }) {
  const ip = (g.ips || []).find((x) => x.id === ipId);
  const [B, setB] = useState(60);
  const [marketing, setMarketing] = useState(24);
  const [strategy, setStrategy] = useState("moderate");
  const [director, setDirector] = useState(0);
  const [star, setStar] = useState(0);
  const [vfx, setVfx] = useState(0);
  const [coprod, setCoprod] = useState(false);
  const [finance, setFinance] = useState("self");
  const [contingency, setContingency] = useState(false);
  const [franchisePlan, setFranchisePlan] = useState("standalone");
  if (!ip) return null;
  const tier = B <= 16 ? "indie" : B <= 65 ? "mid" : "tent";
  const talentCost = director * 8 + star * 12 + vfx * 10 + (coprod ? 4 : 0);
  const contingencyCost = contingency ? +(B * 0.08).toFixed(1) : 0;
  const myShare = finance === "partner" ? 0.55 : finance === "streamer" ? 0.25 : 1;
  const streamerAdvance = finance === "streamer" ? +(Math.max(3, B * 0.28 + marketing * 0.45)).toFixed(1) : 0;
  const riskCapital = +((B + marketing) * myShare).toFixed(1);
  const upfront = +(riskCapital + talentCost + contingencyCost - streamerAdvance).toFixed(1);
  const overloaded = talentCost > B * 0.35;
  const notes = sandboxBudgetAdvice(g, ip, { B, marketing, strategy, finance, contingency, franchisePlan });
  const DIR_LABELS = ["Lean director package", "Strong director", "A-list director"];
  const STAR_LABELS = ["No marquee names", "Name cast on points", "A-list ensemble on points"];
  const VFX_LABELS = ["Lean craft/VFX", "Premium craft/VFX", "Top-tier VFX/animation"];
  const releaseOpts = [["platform","Platform"], ["moderate","Moderate"], ["wide","Wide"], ["streamer","Streamer pre-buy"]];
  const financeOpts = [["self","Self-finance"], ["partner","Partner/co-finance"], ["streamer","Streamer pre-buy"]];
  const planOpts = [["standalone","Standalone"], ["sequel","Sequel option"], ["trilogy","Trilogy plan"], ["backtoback","Back-to-back"]];
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Develop "{ip.name}"</h3>
        <div className="sub">{ip.kind || "Owned property"} · {genreLabel(ip.genre)} · brand {ipBrand(ip)}/5. You control the spend, release shape, financing, and whether this is one movie or the start of a universe.</div>
        <div className="lbl">Production budget: {fmtM(B)} · {TIERS[tier].label}</div>
        <input type="range" min={5} max={250} step={5} value={B} onChange={(e) => setB(+e.target.value)} />
        <div className="lbl" style={{marginTop:14}}>Marketing spend: {fmtM(marketing)}</div>
        <input type="range" min={0} max={160} step={5} value={marketing} onChange={(e) => setMarketing(+e.target.value)} />
        <div className="lbl" style={{marginTop:14}}>Release strategy</div>
        <div className="actions" style={{marginTop:6}}>
          {releaseOpts.map(([id, label]) => <button key={id} className={"btn " + (strategy === id ? "gold" : "ghost")} onClick={() => { setStrategy(id); if (id === "streamer") setFinance("streamer"); }}>{label}</button>)}
        </div>
        <div className="lbl" style={{marginTop:14}}>Financing</div>
        <div className="actions" style={{marginTop:6}}>
          {financeOpts.map(([id, label]) => <button key={id} className={"btn " + (finance === id ? "gold" : "ghost")} onClick={() => { setFinance(id); if (id === "streamer") setStrategy("streamer"); }}>{label}</button>)}
        </div>
        <div className="lbl" style={{marginTop:14}}>Franchise strategy</div>
        <div className="actions" style={{marginTop:6}}>
          {planOpts.map(([id, label]) => <button key={id} className={"btn " + (franchisePlan === id ? "gold" : "ghost")} onClick={() => setFranchisePlan(id)}>{label}</button>)}
        </div>
        <div className="lbl" style={{marginTop:14}}>Director: {DIR_LABELS[director]}{director > 0 ? " (" + fmtM(director * 8) + ")" : ""}</div>
        <input type="range" min={0} max={2} step={1} value={director} onChange={(e) => setDirector(+e.target.value)} />
        <div className="lbl" style={{marginTop:14}}>Cast: {STAR_LABELS[star]}{star > 0 ? " (" + fmtM(star * 12) + " upfront, plus " + (star * 3) + " points)" : ""}</div>
        <input type="range" min={0} max={2} step={1} value={star} onChange={(e) => setStar(+e.target.value)} />
        <div className="lbl" style={{marginTop:14}}>Craft/VFX: {VFX_LABELS[vfx]}{vfx > 0 ? " (" + fmtM(vfx * 10) + ")" : ""}</div>
        <input type="range" min={0} max={2} step={1} value={vfx} onChange={(e) => setVfx(+e.target.value)} />
        <div className="pick" style={coprod ? {borderColor:"var(--gold)"} : {}} onClick={() => setCoprod(!coprod)}>
          <div className="nm">Bring in a proven co-producer ({fmtM(4)}, +2 talent points)</div>
          <div className="dt">Credibility with financiers and the town, at a price.</div>
        </div>
        <div className="pick" style={contingency ? {borderColor:"var(--gold)"} : {}} onClick={() => setContingency(!contingency)}>
          <div className="nm">Add contingency ({fmtM(contingencyCost || B * 0.08)})</div>
          <div className="dt">Boring money that saves exciting money. Does not improve the brand; it protects production.</div>
        </div>
        <div className="card" style={{borderColor:"var(--gold)", marginTop:12}}>
          <div className="lbl" style={{color:"var(--gold)", margin:0}}>Advisor read</div>
          {notes.map((n, i) => <div key={i} className="kv" style={{marginTop:i ? 4 : 8}}><span>{n}</span></div>)}
        </div>
        <div className="sub" style={{marginTop:10, color: overloaded ? "var(--red)" : upfront > g.cash ? "var(--red)" : "var(--dim)"}}>
          {overloaded ? `The talent bill (${fmtM(talentCost)}) is heavy for a ${fmtM(B)} picture. Packaging still helps, but most of its value gets eaten by the size mismatch. ` : ""}
          Upfront cash need: {fmtM(upfront)} ({fmtM(riskCapital)} risk capital + {fmtM(talentCost + contingencyCost)} package/contingency{streamerAdvance ? ` - ${fmtM(streamerAdvance)} streamer advance` : ""}). Cash on hand {fmtM(g.cash)}.
        </div>
        <div className="actions">
          <button className="btn green" style={{flex:1}} disabled={upfront > g.cash} onClick={() => onGo(ipId, { B, marketing, strategy, director, star, vfx, coprod, finance, contingency, franchisePlan })}>Greenlight {fmtM(upfront)}</button>
          <button className="btn ghost" onClick={onClose}>Back</button>
        </div>
      </div>
    </div>
  );
}

function RenegModal({ g, item, onChoose }) {
  const sq = item.sq;
  const r = (g.talentReneg || []).find((x) => x.id === item.renegId);
  if (!r) return null;
  return (
    <div className="overlay">
      <div className="modal">
        <h3>The sequel trap</h3>
        <div className="sub">"{r.sourceTitle}" was a hit. Before "{sq.title}" can reach your desk, {r.talentName}, the {r.role}, wants a richer deal this time: roughly +{r.ptsBump} backend point{r.ptsBump === 1 ? "" : "s"}. Stars remember who needed them first.</div>
        <div className="pick" onClick={() => onChoose("pay")}>
          <div className="nm">Pay the premium</div>
          <div className="dt">Budget and points both rise. The package, and the brand, stay intact.</div>
        </div>
        <div className="pick" onClick={() => onChoose("negotiate")}>
          <div className="nm">Negotiate them down</div>
          <div className="dt">A real chance to shave the ask. If it fails, you pay full freight anyway.</div>
        </div>
        <div className="pick" onClick={() => onChoose("recast")}>
          <div className="nm">Recast entirely</div>
          <div className="dt">Cheaper, but the odds tighten before a frame is shot. Brand takes the hit, not your wallet.</div>
        </div>
      </div>
    </div>
  );
}

function SellStudioModal({ g, onSell, onClose }) {
  const val = studioValuation(g);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Sell {g.studioName}</h3>
        <div className="sub">A media conglomerate wants the whole thing: the library, the universes, the receivables, the name on the gate. Valuation around {fmtM(val)}. Your {Math.round(g.ownStake * 100)}% would net roughly {fmtM(val * g.ownStake)}. This is the exit. There is no buying it back.</div>
        <div className="pick" onClick={onSell}>
          <div className="nm">Sell everything</div>
          <div className="dt">The career ends on your terms, which is rarer in this town than a hit.</div>
        </div>
        <div className="actions"><button className="btn ghost" style={{flex:1}} onClick={onClose}>Keep building</button></div>
      </div>
    </div>
  );
}

/* ---------------- career mode UI ---------------- */
function MainMenu({ saves, onContinueSandbox, onNewSandbox, onCareer, onContinueStudioSim, onNewStudioSim }) {
  return (
    <div className="pr">
      <style>{CSS}</style>
      <header className="top">
        <h1 className="title">The Producer</h1>
        <div className="subhead">Beat the town's math</div>
      </header>
      <main className="wrap" style={{maxWidth:520}}>
        <div className="card">
          <div className="lbl" style={{marginTop:0}}>Sandbox</div>
          <div className="kv" style={{marginBottom:10}}><span>Build your own Hollywood however you want: deals, term sheets, your own studio, no fixed goal but the one you set yourself.</span></div>
          <div className="actions">
            {saves.sandbox && <button className="btn gold" style={{flex:1}} onClick={onContinueSandbox}>Continue Sandbox</button>}
            <button className="btn ghost" onClick={onNewSandbox}>New Sandbox Game</button>
          </div>
        </div>
        <div className="card" style={{borderColor:"var(--gold)"}}>
          <div className="lbl" style={{marginTop:0, color:"var(--gold)"}}>Career Mode</div>
          <div className="kv" style={{marginBottom:10}}><span>Sandbox asks what studio you want to build. Career Mode asks whether you can solve a specific Hollywood problem, under real restrictions, with a real scorecard at the end.</span></div>
          <div className="actions">
            <button className="btn green" style={{flex:1}} onClick={onCareer}>Career Mode{saves.career && !saves.career.career?.result ? " (in progress)" : ""}</button>
          </div>
        </div>
        <div className="card" style={{borderColor:"var(--gold2)"}}>
          <div className="lbl" style={{marginTop:0, color:"var(--gold2)"}}>Studio Sim</div>
          <div className="kv" style={{marginBottom:10}}><span>A deeper production loop: build a talent roster, develop original ideas and IP, hire a writer, package a director and cast, set real budgets, and watch a full P&L resolve. Build franchises. Chase awards.</span></div>
          <div className="actions">
            {saves.studiosim && <button className="btn gold" style={{flex:1}} onClick={onContinueStudioSim}>Continue Studio Sim</button>}
            <button className="btn ghost" onClick={onNewStudioSim}>New Studio Sim</button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StudioSimSetup({ onStart, onCancel }) {
  const [name, setName] = useState("");
  return (
    <div className="pr">
      <style>{CSS}</style>
      <header className="top">
        <h1 className="title">Studio Sim</h1>
        <div className="subhead">Talent, packaging, budgets, and box office</div>
      </header>
      <main className="wrap" style={{maxWidth:520}}>
        <div className="card">
          <div className="lbl">Studio name</div>
          <input type="text" value={name} maxLength={28} placeholder="New Horizon Pictures" onChange={(e) => setName(e.target.value)} />
          <div className="kv" style={{marginTop:12, lineHeight:1.65}}>
            <span>You start with {fmtM(200)} and a fresh talent book: eight writers, eight directors, twelve actors, each with their own star rating, salary, and heat. Develop an idea, hire a writer to draft it, package a director and up to three actors, set the budget and marketing, and greenlight. A hit raises everyone's price for the next picture. A real hit with real franchise potential can become a saga, and the talent who built it will want more to come back.</span>
          </div>
          <div className="actions">
            <button className="btn green" style={{flex:1}} onClick={() => onStart(name.trim())}>Open the studio</button>
            <button className="btn ghost" onClick={onCancel}>Back</button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ScenarioSelect({ saves, meta, onPick, onBack }) {
  return (
    <div className="pr">
      <style>{CSS}</style>
      <header className="top">
        <h1 className="title">Career Mode</h1>
        <div className="subhead">Choose your problem</div>
      </header>
      <main className="wrap" style={{maxWidth:560}}>
        {SCENARIOS.map((sc) => {
          const inProgress = saves.career && saves.career.career && saves.career.career.scenarioId === sc.id && !saves.career.career.result;
          const completed = saves.career && saves.career.career && saves.career.career.scenarioId === sc.id && saves.career.career.result;
          const bestGrade = meta.completedScenarios ? meta.completedScenarios[sc.id] : null;
          return (
            <div key={sc.id} className="card" style={{borderColor: inProgress ? "var(--gold)" : "var(--line)"}}>
              <div className="row">
                <div className="lbl" style={{margin:0}}>{sc.name}</div>
                <div style={{fontSize:11, color:"var(--dim)"}}>{sc.difficulty}</div>
              </div>
              <div className="kv" style={{marginTop:6}}><span>{sc.desc}</span></div>
              <div className="kv" style={{marginTop:6}}>
                <span>Starting cash <b>{fmtM(sc.startCash)}</b></span>
                <span>Starting rep <b>{sc.startRep}</b></span>
                <span>Length <b>{sc.estLength}</b></span>
              </div>
              <div className="kv" style={{marginTop:6}}><span style={{color:"var(--gold2)"}}>Goal: {sc.goal}</span></div>
              {bestGrade && <div className="kv" style={{marginTop:6}}><span>Best grade so far: <b>{bestGrade}</b></span></div>}
              {sc.rivalStudioLogic && sc.rivalStudioLogic.map((r) => (
                <div key={r.id} className="kv" style={{marginTop:6}}><span style={{color:"var(--dim)"}}>Rumored rival: {r.name}. {r.description}</span></div>
              ))}
              {sc.sandboxUnlocks && sc.sandboxUnlocks.map((u) => (
                <div key={u.id} className="kv" style={{marginTop:4}}><span style={{color:"var(--dim)"}}>Trophy at grade {u.requiresGrade}+: {u.name}</span></div>
              ))}
              {completed && <div className="kv" style={{marginTop:6}}><span style={{color: completed.result.victory ? "var(--green)" : "var(--red)"}}>{completed.result.victory ? `Completed. Grade ${completed.result.score.grade}.` : `Attempted, did not finish. Grade ${completed.result.score.grade}.`}</span></div>}
              <div className="actions">
                <button className="btn green" onClick={() => onPick(sc.id)}>{inProgress ? "Continue" : completed ? "Play again" : "Start"}</button>
              </div>
            </div>
          );
        })}
        {!!(meta.sandboxUnlocks || []).length && (
          <div className="card" style={{borderColor:"var(--gold)"}}>
            <div className="lbl" style={{margin:0, color:"var(--gold)"}}>Trophy Room</div>
            {meta.sandboxUnlocks.map((u) => (
              <div key={u.id} className="kv" style={{marginTop:6}}><span><b>{u.name}</b>: {u.description}</span></div>
            ))}
          </div>
        )}
        <div className="actions"><button className="btn ghost" style={{flex:1}} onClick={onBack}>Back to main menu</button></div>
      </main>
    </div>
  );
}

function CareerCard({ g }) {
  if (!g.career) return null;
  const sc = scenarioById(g.career.scenarioId);
  const act = sc.acts[g.career.act];
  return (
    <div className="card" style={{borderColor:"var(--gold)"}}>
      <div className="lbl" style={{margin:0, color:"var(--gold)"}}>{sc.name} · {act.title}</div>
      <div className="kv" style={{marginTop:6}}><span>{act.objective}</span></div>
      <div style={{marginTop:8}}>
        {sc.victory.map((v) => {
          const prog = v.prog(g);
          const pct = clamp((prog / v.target) * 100, 0, 100);
          return (
            <div key={v.id} style={{marginBottom:6}}>
              <div className="kv" style={{marginBottom:2}}><span>{v.label}</span><span><b>{prog}</b> / {v.target}</span></div>
              <div className="relbar"><i style={{width: pct + "%"}} /></div>
            </div>
          );
        })}
      </div>
      {g.career.restrictions.maxBudget && <div className="kv" style={{marginTop:8}}><span>Budget cap: {fmtM(g.career.restrictions.maxBudget)} per picture.</span></div>}
    </div>
  );
}

function ScoreBar({ label, v }) {
  return (
    <div style={{marginBottom:6}}>
      <div className="kv" style={{marginBottom:2}}><span>{label}</span><span><b>{Math.round(v)}</b>/100</span></div>
      <div className="relbar"><i style={{width: v + "%", background: v >= 70 ? "linear-gradient(90deg,#2c6b45,var(--green))" : v >= 40 ? "linear-gradient(90deg,#77571f,var(--gold))" : "linear-gradient(90deg,#7a2e26,var(--red))"}} /></div>
    </div>
  );
}

function CareerResultCard({ g, onMenu }) {
  const sc = scenarioById(g.career.scenarioId);
  const res = g.career.result;
  return (
    <div className="card" style={{borderColor: res.victory ? "var(--gold)" : "var(--red)"}}>
      <div className="verdictline" style={{color: res.victory ? "var(--gold)" : "var(--red)"}}>{res.victory ? sc.name.toUpperCase() + ": SOLVED" : "CAREER OVER"}</div>
      <div className="kv" style={{justifyContent:"center", marginBottom:10}}><span>{res.victory ? sc.goal : "The problem beat you this time. That is what a real challenge means."}</span></div>
      <div className="ledger">
        <div className="ln" style={{fontWeight:700, fontSize:16, justifyContent:"center", borderBottom:"none"}}>Career Score: {res.score.grade} ({res.score.overall}/100)</div>
      </div>
      <div style={{marginTop:12}}>
        {res.score.dims.map((d) => <ScoreBar key={d.label} label={d.label} v={d.v} />)}
      </div>
      {!!(res.earnedUnlocks || []).length && (
        <div className="kv" style={{marginTop:10, flexDirection:"column", alignItems:"flex-start"}}>
          {res.earnedUnlocks.map((u) => <span key={u.id} style={{color:"var(--gold2)"}}>Trophy Room unlock: {u.name}</span>)}
        </div>
      )}
      <div className="actions"><button className="btn gold" style={{flex:1}} onClick={onMenu}>Back to the main menu</button></div>
    </div>
  );
}

/* =====================================================================
   STUDIO SIM UI
   ===================================================================== */
function StudioSimApp({ game, up, savedTick, onMenu }) {
  const [tab, setTab] = useState("pitches");
  const [modal, setModal] = useState(null);
  const g = game;

  const startProject = (source, genre) => up((gg) => {
    const src = SSIM_SOURCES[source];
    if (ssimActiveCount(gg) >= SSIM_MAX_ACTIVE) { addLog(gg, `The slate is full at ${SSIM_MAX_ACTIVE} active pictures. Release or shelve something first.`, "bad"); return; }
    const proj = ssimMkProject(source, genre);
    const total = proj.devCost + proj.rightsCost;
    if (gg.cash < total) { addLog(gg, `Not enough cash to acquire that.`, "bad"); return; }
    gg.cash = +(gg.cash - total).toFixed(1);
    ssimRollInterest(gg, proj);
    gg.projects.push(proj);
    const interestBits = [];
    if (proj.interestedDirectorId) interestBits.push(gg.talent.find((x) => x.id === proj.interestedDirectorId).name + " (director)");
    if (proj.interestedActorId) interestBits.push(gg.talent.find((x) => x.id === proj.interestedActorId).name + " (actor)");
    addLog(gg, `${gg.studioName} picks up "${proj.title}" as ${src.label.toLowerCase()}${total > 0 ? ` for ${fmtM(total)}` : ""}. Franchise potential looks like ${proj.franchisePotential}/100.${interestBits.length ? ` Word is ${interestBits.join(" and ")} already circling it.` : ""}`, "good");
    setModal(null);
  });

  const optionPitch = (pitchId) => up((gg) => { const p = gg.pitches.find(x=>x.id===pitchId); if (ssimOptionPitch(gg, pitchId)) addLog(gg, `${gg.studioName} options "${p.title}", holding it exclusively for six months.`, "good"); });
  const buyPitch = (pitchId, shelve) => up((gg) => {
    const p = gg.pitches.find(x=>x.id===pitchId);
    const proj = ssimBuyPitch(gg, pitchId, shelve);
    if (proj === "full") { addLog(gg, `The slate is full at ${SSIM_MAX_ACTIVE} active pictures. Release or shelve something first.`, "bad"); return; }
    if (proj) addLog(gg, shelve ? `${gg.studioName} banks the rights to "${p.title}" for later.` : `${gg.studioName} acquires "${p.title}". Into development.`, "good");
  });
  const passPitch = (pitchId) => up((gg) => { gg.pitches = gg.pitches.filter(x=>x.id!==pitchId); });

  const hireWriter = (projectId, writerId) => up((gg) => {
    const ok = ssimHireWriter(gg, projectId, writerId);
    if (ok) { const p = gg.projects.find((x) => x.id === projectId); const w = gg.talent.find((x) => x.id === writerId); addLog(gg, `${w.name} turns in a draft of "${p.title}". Script quality now ${p.scriptQuality}/100.`, "good"); }
    setModal(null);
  });

  const submitOffer = (projectId, talentId, role, salaryOffer, pointsOffer, round) => {
    let result = null;
    up((gg) => {
      result = ssimSubmitOffer(gg, projectId, talentId, role, salaryOffer, pointsOffer, round);
      const p = gg.projects.find((x) => x.id === projectId);
      if (result.ok) addLog(gg, `${result.talentName} signs on${pointsOffer ? ` for ${fmtM(salaryOffer)} plus ${pointsOffer} points` : ` for ${fmtM(salaryOffer)}`} on "${p.title}".`, "good");
      else if (result.reason === "walked") addLog(gg, `${result.talentName} walks away from "${p.title}" after three rounds with no deal.`, "bad");
    });
    return result;
  };

  const greenlight = (projectId, btl, marketing, strategy, contingency, franchiseStrategy, financing) => up((gg) => {
    const ok = ssimSetBudgetsAndGreenlight(gg, projectId, btl, marketing, strategy, contingency, franchiseStrategy, financing);
    if (ok) { const p = gg.projects.find((x) => x.id === projectId); addLog(gg, `GREENLIT: "${p.title}" at ${fmtM(btl)} below the line, ${fmtM(marketing)} in marketing. Cameras roll.`, "good"); setModal(null); }
    else addLog(gg, `Cannot greenlight: check the budget against cash on hand.`, "bad");
  });

  const commissionSequel = (franchiseId, choice) => up((gg) => {
    const seq = ssimCommissionSequel(gg, franchiseId, choice);
    if (seq) addLog(gg, `${gg.studioName} commissions "${seq.title}".`, "good");
    setModal(null);
  });

  const takeLoan = (amount) => up((gg) => { const amt = ssimTakeLoan(gg, amount); if (amt > 0) addLog(gg, `${gg.studioName} draws ${fmtM(amt)} on its credit line.`, "good"); setModal(null); });
  const repayLoan = (amount) => up((gg) => { const amt = ssimRepayLoan(gg, amount); if (amt > 0) addLog(gg, `${gg.studioName} pays down ${fmtM(amt)} of debt.`, ""); setModal(null); });
  const takeAdvance = (projectId, amount) => up((gg) => { if (ssimTakeAdvance(gg, projectId, amount)) { const p = gg.projects.find(x=>x.id===projectId); addLog(gg, `A distribution advance on "${p.title}" brings in ${fmtM(amount)} now, against revenue later.`, "good"); } setModal(null); });
  const takeInvestor = (projectId, pct) => up((gg) => { const p = gg.projects.find(x=>x.id===projectId); const cashIn = ssimTakeInvestor(gg, projectId, pct); if (cashIn) addLog(gg, `An investor takes ${pct}% of "${p.title}" for ${fmtM(cashIn)} up front.`, "good"); setModal(null); });

  const nextMonth = () => {
    const beforeReleased = new Set(g.projects.filter((p) => p.phase === "released").map((p) => p.id));
    let newlyReleasedId = null;
    up((gg) => {
      ssimEndMonth(gg);
      const after = gg.projects.filter((p) => p.phase === "released" && !beforeReleased.has(p.id));
      if (after.length) newlyReleasedId = after[0].id;
    });
    if (newlyReleasedId) setModal({ type: "result", projectId: newlyReleasedId });
  };

  const active = g.projects.filter((p) => p.phase !== "released" && p.phase !== "shelved");
  const released = g.projects.filter((p) => p.phase === "released");
  const shelved = g.projects.filter((p) => p.phase === "shelved");

  return (
    <div className="pr">
      <style>{CSS}</style>
      {savedTick && <div className="saved">SAVED ●</div>}
      <header className="top">
        <h1 className="title">{g.studioName}</h1>
        <div className="subhead">{dateLabel(g.t)} · Studio Sim</div>
      </header>
      <div className="statbar">
        <div className="stat"><div className="k">Cash</div><div className={"v " + (g.cash >= 0 ? "pos" : "neg")}>{fmtM(g.cash)}</div></div>
        {g.debt > 0 && <div className="stat"><div className="k">Debt</div><div className="v neg">{fmtM(g.debt)}</div></div>}
        <div className="stat"><div className="k">Prestige</div><div className="v gold">{g.prestige}</div></div>
        <div className="stat"><div className="k">Slate</div><div className="v">{active.length}/{SSIM_MAX_ACTIVE}</div></div>
        <div className="stat"><div className="k">Lifetime P&L</div><div className={"v " + (g.stats.lifetimeProfit >= 0 ? "pos" : "neg")}>{fmtM(g.stats.lifetimeProfit)}</div></div>
      </div>
      <nav className="tabs">
        {[["pitches","Pitches", (g.pitches||[]).length],["desk","Development", active.filter(p=>["concept","writing"].includes(p.phase)).length],["slate","Slate", active.filter(p=>["ready_to_package","packaged","production"].includes(p.phase) || (p.phase==="writing"&&ssimGreenlightReady(p))).length],["talent","Talent",""],["financing","Financing",""],["franchises","Franchises", g.franchises.length],["record","Released", released.length],["trades","The Trades",""]].map(([id,label,n]) => (
          <button key={id} className={"tab" + (tab === id ? " on" : "")} onClick={() => setTab(id)}>
            {label}{n !== "" && n > 0 ? <span className="n">{n}</span> : null}
          </button>
        ))}
        <button className="tab" onClick={onMenu}>Main Menu</button>
      </nav>

      <main className="wrap">
        {g.over && (
          <div className="card" style={{borderColor:"var(--red)"}}>
            <div className="lbl" style={{color:"var(--red)"}}>The lot goes quiet</div>
            <div className="kv"><span>Films released <b>{g.stats.released}</b></span><span>Hits <b>{g.stats.hits}</b></span><span>Lifetime P&L <b>{fmtM(g.stats.lifetimeProfit)}</b></span></div>
            <div className="actions"><button className="btn gold" onClick={onMenu}>Back to the main menu</button></div>
          </div>
        )}

        {tab === "pitches" && <SsimPitchesTab g={g} onOption={optionPitch} onBuy={buyPitch} onPass={passPitch} />}
        {tab === "desk" && <SsimDeskTab g={g} onNew={() => setModal({ type: "newproject" })} onHireWriter={(p) => setModal({ type: "hirewriter", projectId: p.id })} />}
        {tab === "slate" && <SsimSlateTab g={g} shelved={shelved} onPackage={(p) => setModal({ type: "package", projectId: p.id })} onBudget={(p) => setModal({ type: "budget", projectId: p.id })} onResult={(p) => setModal({ type: "result", projectId: p.id })} onFinance={(p) => setModal({ type: "projectfinance", projectId: p.id })} />}
        {tab === "talent" && <SsimTalentTab g={g} />}
        {tab === "financing" && <SsimFinancingTab g={g} onBorrow={() => setModal({ type: "loan", mode: "borrow" })} onRepay={() => setModal({ type: "loan", mode: "repay" })} />}
        {tab === "franchises" && <SsimFranchiseTab g={g} onCommission={(fr) => setModal({ type: "sequel", franchiseId: fr.id })} />}
        {tab === "record" && <SsimRecordTab g={g} onResult={(p) => setModal({ type: "result", projectId: p.id })} onSequel={(p) => {
          let frId = null;
          up((gg) => { const fr = ssimEnsureFranchiseFor(gg, p.id); if (fr) frId = fr.id; });
          if (frId) setModal({ type: "sequel", franchiseId: frId });
        }} />}
        {tab === "trades" && <SsimTradesTab g={g} />}
      </main>

      <div className="endmonth">
        <button disabled={g.over || !!modal || g.projects.some((p) => p.phase === "released" && p.result && !p.resultSeen)} onClick={nextMonth}>▶ END MONTH</button>
      </div>

      {modal?.type === "newproject" && <SsimNewProjectModal g={g} onStart={startProject} onClose={() => setModal(null)} />}
      {modal?.type === "hirewriter" && <SsimHireWriterModal g={g} projectId={modal.projectId} onHire={hireWriter} onClose={() => setModal(null)} />}
      {modal?.type === "package" && <SsimPackageModal g={g} projectId={modal.projectId} onOffer={submitOffer} onClose={() => setModal(null)} />}
      {modal?.type === "budget" && <SsimBudgetModal g={g} projectId={modal.projectId} onGreenlight={greenlight} onClose={() => setModal(null)} />}
      {modal?.type === "result" && <SsimPremiere g={g} projectId={modal.projectId} onClose={() => {
        let nextUnseenId = null;
        up((gg) => {
          const pp = gg.projects.find((x) => x.id === modal.projectId);
          if (pp) pp.resultSeen = true;
          const nextUnseen = gg.projects.find((x) => x.phase === "released" && x.result && !x.resultSeen);
          if (nextUnseen) nextUnseenId = nextUnseen.id;
        });
        setModal(nextUnseenId ? { type: "result", projectId: nextUnseenId } : null);
      }} onSequel={(p) => {
        let frId = null;
        up((gg) => { const pp = gg.projects.find((x) => x.id === p.id); if (pp) pp.resultSeen = true; const fr = ssimEnsureFranchiseFor(gg, p.id); if (fr) frId = fr.id; });
        if (frId) setModal({ type: "sequel", franchiseId: frId });
      }} />}
      {modal?.type === "sequel" && <SsimSequelModal g={g} franchiseId={modal.franchiseId} onCommission={commissionSequel} onClose={() => setModal(null)} />}
      {modal?.type === "loan" && <SsimLoanModal g={g} mode={modal.mode} onBorrow={takeLoan} onRepay={repayLoan} onClose={() => setModal(null)} />}
      {modal?.type === "projectfinance" && <SsimProjectFinanceModal g={g} projectId={modal.projectId} onAdvance={takeAdvance} onInvestor={takeInvestor} onClose={() => setModal(null)} />}
    </div>
  );
}

/* ---------------- studio sim tabs ---------------- */
const SSIM_PHASE_LABEL = { concept: "Needs a writer", writing: "Awaiting more development", ready_to_package: "Ready to package", packaged: "Ready to greenlight", production: "In production" };

function SsimDeskTab({ g, onNew, onHireWriter }) {
  const devProjects = g.projects.filter((p) => p.phase === "concept" || (p.phase === "writing" && !ssimGreenlightReady(p)));
  return (
    <>
      <div className="card">
        <div className="row">
          <div className="lbl" style={{margin:0}}>Development</div>
          <button className="btn gold" onClick={onNew}>Start a project</button>
        </div>
        <div className="kv" style={{marginTop:6}}><span>Original ideas are cheap and risky. Purchased scripts and acquired IP cost more upfront but usually start with better bones and real franchise potential.</span></div>
      </div>
      {!devProjects.length && <div className="empty">Nothing in development. Start a project to get moving.</div>}
      {devProjects.map((p) => {
        const w = p.writerId ? g.talent.find((x) => x.id === p.writerId) : null;
        return (
          <div key={p.id} className="card proj">
            <span className="phase">{SSIM_PHASE_LABEL[p.phase]}</span>
            <div className="pt">{p.title}</div>
            <div className="kv">
              <span>{SSIM_GENRE_INFO[p.genre].label}</span>
              <span>{SSIM_SOURCES[p.source].label}</span>
              <span>Concept <b>{p.conceptQuality}</b></span>
              <span>Script <b>{p.scriptQuality || "unwritten"}</b></span>
              <span>Franchise potential <b>{p.franchisePotential}</b></span>
              {w && <span>Writer <b>{w.name}</b> (busy until {dateLabel(w.busyUntil)})</span>}
            </div>
            <div className="actions">
              <button className="btn gold" onClick={() => onHireWriter(p)}>{p.writerId ? "Order another draft" : "Hire a writer"}</button>
            </div>
          </div>
        );
      })}
    </>
  );
}

function SsimSlateTab({ g, shelved, onPackage, onBudget, onResult, onFinance }) {
  const packaging = g.projects.filter((p) => (p.phase === "writing" && ssimGreenlightReady(p) === false && p.scriptQuality >= 30) || p.phase === "packaged");
  const readyForBudget = g.projects.filter((p) => ssimGreenlightReady(p) && (p.phase === "writing" || p.phase === "packaged"));
  const inProduction = g.projects.filter((p) => p.phase === "production");
  if (!packaging.length && !readyForBudget.length && !inProduction.length && !(shelved||[]).length) return <div className="empty">Nothing on the slate yet. Get a script to at least 30 quality in Development, then package it here.</div>;
  return (
    <>
      {!!(shelved||[]).length && (
        <div className="card">
          <div className="lbl" style={{marginTop:0}}>Shelved rights</div>
          <div className="kv" style={{marginBottom:6}}><span>Owned but not in active development. No slate slot used.</span></div>
          {shelved.map((p) => <div key={p.id} className="kv" style={{marginTop:4}}><span>{p.title} · {SSIM_GENRE_INFO[p.genre].label} · franchise potential {p.franchisePotential}</span></div>)}
        </div>
      )}
      {readyForBudget.map((p) => {
        const d = g.talent.find((x) => x.id === p.directorId);
        const actors = p.actorIds.map((id) => g.talent.find((x) => x.id === id)).filter(Boolean);
        return (
          <div key={p.id} className="card proj">
            <span className="phase">Ready to greenlight</span>
            <div className="pt">{p.title}</div>
            <div className="kv">
              <span>{SSIM_GENRE_INFO[p.genre].label}</span>
              <span>Script <b>{p.scriptQuality}</b></span>
              <span>Director <b>{d ? d.name : "none"}</b></span>
              <span>Cast <b>{actors.map((a) => a.name).join(", ") || "none"}</b></span>
            </div>
            <div className="actions">
              <button className="btn green" onClick={() => onPackage(p)}>Adjust packaging</button>
              <button className="btn gold" onClick={() => onBudget(p)}>Set budget &amp; greenlight</button>
            </div>
          </div>
        );
      })}
      {packaging.filter((p) => !readyForBudget.includes(p)).map((p) => {
        const d = p.directorId ? g.talent.find((x) => x.id === p.directorId) : null;
        return (
          <div key={p.id} className="card proj">
            <span className="phase">Needs packaging</span>
            <div className="pt">{p.title}</div>
            <div className="kv">
              <span>{SSIM_GENRE_INFO[p.genre].label}</span>
              <span>Script <b>{p.scriptQuality}</b></span>
              <span>Director <b>{d ? d.name : "none yet"}</b></span>
              <span>Cast <b>{p.actorIds.length}/3</b></span>
            </div>
            <div className="actions">
              <button className="btn gold" onClick={() => onPackage(p)}>Attach director &amp; cast</button>
            </div>
          </div>
        );
      })}
      {inProduction.map((p) => (
        <div key={p.id} className="card proj">
          <span className="phase">In production{p.partner ? " · " + p.partner.name + " (" + p.partner.pct + "%)" : ""}{p.advanceTaken ? " · advance taken" : ""}</span>
          <div className="pt">{p.title}</div>
          <div className="kv">
            <span>{SSIM_GENRE_INFO[p.genre].label}</span>
            <span>Budget <b>{fmtM(p.budget.btl)}</b></span>
            <span>Marketing <b>{fmtM(p.budget.marketing)}</b></span>
            <span>Releases <b>{dateLabel(p.releaseAt)}</b></span>
          </div>
          {!p.partner && (
            <div className="actions"><button className="btn ghost" onClick={() => onFinance(p)}>Raise capital on this picture</button></div>
          )}
        </div>
      ))}
    </>
  );
}

function SsimTalentTab({ g }) {
  const groups = [["director","Directors"],["actor","Actors"],["writer","Writers"]];
  return (
    <>
      {groups.map(([role, label]) => (
        <div key={role} className="card">
          <div className="lbl" style={{marginTop:0}}>{label}</div>
          <table>
            <thead><tr><th>Name</th><th>Star</th><th>Heat</th><th>Salary</th>{role !== "writer" && <th>Points</th>}<th>Status</th></tr></thead>
            <tbody>
              {g.talent.filter((t) => t.role === role).sort((a, b) => b.star - a.star || b.heat - a.heat).map((t) => (
                <tr key={t.id}>
                  <td>{t.name}<div style={{color:"var(--dim)", fontSize:10.5}}>{t.genres.map((gg) => SSIM_GENRE_INFO[gg].label).join(", ")}</div></td>
                  <td>{"★".repeat(t.star)}</td>
                  <td>{t.heat}</td>
                  <td>{fmtM(t.salary)}</td>
                  {role !== "writer" && <td>{t.pointsDemand || 0}</td>}
                  <td>{t.busyUntil > g.t ? "Booked" : "Available"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

function SsimFranchiseTab({ g, onCommission }) {
  if (!g.franchises.length) return <div className="empty">No franchises yet. A film with real franchise potential that does well will spin one up automatically.</div>;
  return (
    <>
      {g.franchises.map((fr) => (
        <div key={fr.id} className="card">
          <div className="row">
            <div>
              <div style={{fontWeight:800, fontSize:15}}>{fr.title}</div>
              <div style={{color:"var(--dim)", fontSize:11.5, marginTop:2}}>{SSIM_GENRE_INFO[fr.genre].label} · Chapter {fr.chapter}</div>
            </div>
            <div style={{fontFamily:"'Courier Prime',monospace", fontSize:12, color:"var(--gold)"}}>brand {fr.brandPower}/100</div>
          </div>
          <div className="relbar"><i style={{width: fr.brandPower + "%"}} /></div>
          <div className="actions"><button className="btn green" onClick={() => onCommission(fr)}>Commission the next chapter</button></div>
        </div>
      ))}
    </>
  );
}

function SsimRecordTab({ g, onResult, onSequel }) {
  const released = g.projects.filter((p) => p.phase === "released").sort((a, b) => b.releaseAt - a.releaseAt);
  if (!released.length) return <div className="empty">Nothing released yet.</div>;
  return (
    <div className="card">
      <div className="lbl" style={{marginTop:0}}>Released</div>
      <table>
        <thead><tr><th>Title</th><th>Q</th><th>Worldwide</th><th>Net</th><th></th></tr></thead>
        <tbody>
          {released.map((p) => (
            <tr key={p.id}>
              <td onClick={() => onResult(p)} style={{cursor:"pointer"}}>{p.title}{p.franchiseId ? " 🎬" : ""}</td>
              <td onClick={() => onResult(p)} style={{cursor:"pointer"}}>{p.result.quality}</td>
              <td onClick={() => onResult(p)} style={{cursor:"pointer"}}>{fmtM(p.result.worldwide)}</td>
              <td onClick={() => onResult(p)} style={{cursor:"pointer", color: p.result.netProfit >= 0 ? "var(--green)" : "var(--red)"}}>{fmtM(p.result.netProfit)}</td>
              <td><button className="btn ghost" style={{padding:"4px 8px", fontSize:11}} onClick={() => onSequel(p)}>Sequel</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="kv" style={{marginTop:8}}><span>Tap a row for the full P&L. Any released film can get a sequel, franchise or not.</span></div>
    </div>
  );
}

function SsimTradesTab({ g }) {
  if (!g.log.length) return <div className="empty">Nothing yet.</div>;
  return (
    <>
      {g.log.map((l, i) => (
        <div key={i} className={"news " + l.kind}>
          <div className="d">{l.d}</div>
          <div className="h">{l.txt}</div>
        </div>
      ))}
    </>
  );
}

/* ---------------- studio sim modals ---------------- */
function Modal({ title, sub, children, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {sub && <div className="sub">{sub}</div>}
        {children}
      </div>
    </div>
  );
}

function SsimNewProjectModal({ g, onStart, onClose }) {
  const [source, setSource] = useState("original");
  const [genre, setGenre] = useState("action");
  const src = SSIM_SOURCES[source];
  const cost = src.cost[1] > 0 ? (src.cost[0] + src.cost[1]) / 2 : 0;
  return (
    <Modal title="Start a project" sub="Pick where the material comes from, then a genre." onClose={onClose}>
      <div className="lbl">Source</div>
      {Object.entries(SSIM_SOURCES).filter(([k]) => k !== "sequel" && k !== "joint").map(([k, s]) => (
        <div key={k} className={"pick" + (source === k ? " sel" : "")} onClick={() => setSource(k)}>
          <div className="nm">{s.label}</div>
          <div className="dt">{s.cost[1] > 0 ? `Around ${fmtM((s.cost[0]+s.cost[1])/2)}` : "No upfront cost"} · franchise potential x{s.fpMult}</div>
        </div>
      ))}
      <div className="lbl">Genre</div>
      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        {SSIM_GENRES.map((gid) => <option key={gid} value={gid}>{SSIM_GENRE_INFO[gid].label} (sweet spot ~{fmtM(SSIM_GENRE_INFO[gid].sweet)})</option>)}
      </select>
      <div className="sub" style={{marginTop:10}}>Cash on hand {fmtM(g.cash)}.</div>
      <div className="actions">
        <button className="btn green" style={{flex:1}} onClick={() => onStart(source, genre)}>Acquire it</button>
        <button className="btn ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function SsimHireWriterModal({ g, projectId, onHire, onClose }) {
  const p = g.projects.find((x) => x.id === projectId);
  if (!p) return null;
  const writers = g.talent.filter((x) => x.role === "writer").sort((a, b) => b.star - a.star);
  return (
    <Modal title="Hire a writer" sub={`Developing "${p.title}" (${SSIM_GENRE_INFO[p.genre].label})`} onClose={onClose}>
      {writers.map((w) => {
        const busy = w.busyUntil > g.t;
        const fit = w.genres.includes(p.genre);
        return (
          <div key={w.id} className={"pick" + (busy ? " busy" : "")} onClick={() => !busy && onHire(p.id, w.id)}>
            <div className="nm">{w.name} {fit ? "· genre fit ✦" : ""}</div>
            <div className="dt">{"★".repeat(w.star)} · {fmtM(w.salary)}{busy ? " · BOOKED" : ""}</div>
          </div>
        );
      })}
    </Modal>
  );
}

function SsimPackageModal({ g, projectId, onOffer, onClose }) {
  const p = g.projects.find((x) => x.id === projectId);
  const [target, setTarget] = useState(null); // { talentId, role }
  const [round, setRound] = useState(0);
  const [msg, setMsg] = useState(null);
  const [salary, setSalary] = useState(0);
  const [pts, setPts] = useState(0);
  if (!p) return null;
  const directors = g.talent.filter((x) => x.role === "director").sort((a, b) => (b.id === p.interestedDirectorId ? 1 : 0) - (a.id === p.interestedDirectorId ? 1 : 0) || b.star - a.star);
  const actors = g.talent.filter((x) => x.role === "actor").sort((a, b) => (b.id === p.interestedActorId ? 1 : 0) - (a.id === p.interestedActorId ? 1 : 0) || b.star - a.star);
  const curDirector = p.directorId ? g.talent.find((x) => x.id === p.directorId) : null;

  const targetTalent = target ? g.talent.find((x) => x.id === target.talentId) : null;
  const openTarget = (talentId, role) => {
    const t = g.talent.find((x) => x.id === talentId);
    const interested = (role === "director" ? p.interestedDirectorId : p.interestedActorId) === talentId;
    setTarget({ talentId, role });
    setRound(0); setMsg(null);
    setSalary(+(t.salary * (interested ? 0.55 : 0.65)).toFixed(2));
    setPts(Math.round((t.pointsDemand || 0) * 0.5));
  };
  const submit = () => {
    const res = onOffer(p.id, target.talentId, target.role, salary, pts, round);
    if (res.ok) { setMsg(null); setTarget(null); return; }
    if (res.reason === "walked") { setMsg(`${res.talentName} walks. Three tries and no deal. Try someone else.`); setTarget(null); return; }
    if (res.reason === "cash") { setMsg(`Not enough cash on hand for that number.`); return; }
    setRound((r) => r + 1);
    setMsg(`${res.talentName} passes on that number. ${res.wantsSalary ? "It reads like they want more cash up front." : "It reads like they want more points, not more cash."}`);
  };

  if (target && targetTalent) {
    const interested = (target.role === "director" ? p.interestedDirectorId : p.interestedActorId) === targetTalent.id;
    return (
      <Modal title={`Negotiate with ${targetTalent.name}`} sub={`${targetTalent.tierLabel} · ${"★".repeat(targetTalent.star)} · usual ask ${fmtM(targetTalent.salary)}${targetTalent.pointsDemand ? " + " + targetTalent.pointsDemand + " pts" : ""}${interested ? " · already circling this project" : ""}`} onClose={() => { setTarget(null); setMsg(null); }}>
        <div className="sub">Round {round + 1} of 3.{interested ? " They want to do this one; it will not take much to get there." : ""}</div>
        {msg && <div className="sub" style={{color:"var(--gold2)"}}>{msg}</div>}
        <div className="lbl">Salary offer: {fmtM(salary)}</div>
        <input type="range" min={0} max={Math.round(targetTalent.salary * 1.3 * 100) / 100} step={Math.max(0.01, +(targetTalent.salary / 40).toFixed(2))} value={salary} onChange={(e) => setSalary(+e.target.value)} />
        <div className="lbl">Points offered: {pts}</div>
        <input type="range" min={0} max={18} step={1} value={pts} onChange={(e) => setPts(+e.target.value)} />
        <div className="sub" style={{marginTop:6}}>Cash on hand {fmtM(g.cash)}.</div>
        <div className="actions">
          <button className="btn green" style={{flex:1}} onClick={submit}>Put it to them</button>
          <button className="btn ghost" onClick={() => { setTarget(null); setMsg(null); }}>Back</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={`Package "${p.title}"`} sub={`${SSIM_GENRE_INFO[p.genre].label} · Script ${p.scriptQuality}/100. Genre fit and star power both move the odds.`} onClose={onClose}>
      <div className="lbl">Director{curDirector ? ` (current: ${curDirector.name})` : ""}</div>
      {directors.map((d) => {
        const busy = d.busyUntil > g.t;
        const fit = d.genres.includes(p.genre);
        const sel = p.directorId === d.id;
        const interested = p.interestedDirectorId === d.id;
        return (
          <div key={d.id} className={"pick" + (sel ? " sel" : "") + (busy && !sel ? " busy" : "")} onClick={() => !busy && !sel && openTarget(d.id, "director")}>
            <div className="nm">{d.name} {fit ? "· genre fit ✦" : ""}{interested ? " · circling this project" : ""}</div>
            <div className="dt">{"★".repeat(d.star)} · prestige {d.prestige} · {fmtM(d.salary)}{d.pointsDemand ? " + " + d.pointsDemand + " pts" : ""}{busy && !sel ? " · BOOKED" : sel ? " · ATTACHED" : ""}</div>
          </div>
        );
      })}
      <div className="lbl">Cast ({p.actorIds.length}/3)</div>
      {actors.map((a) => {
        const busy = a.busyUntil > g.t;
        const attached = p.actorIds.includes(a.id);
        const full = p.actorIds.length >= 3;
        const interested = p.interestedActorId === a.id;
        return (
          <div key={a.id} className={"pick" + (attached ? " sel" : "") + ((busy || full) && !attached ? " busy" : "")} onClick={() => !busy && !attached && !full && openTarget(a.id, "actor")}>
            <div className="nm">{a.name}{interested ? " · circling this project" : ""}</div>
            <div className="dt">{"★".repeat(a.star)} · heat {a.heat} · {fmtM(a.salary)}{a.pointsDemand ? " + " + a.pointsDemand + " pts" : ""}{attached ? " · ATTACHED" : busy ? " · BOOKED" : full ? " · cast full" : ""}</div>
          </div>
        );
      })}
      <div className="actions"><button className="btn ghost" style={{flex:1}} onClick={onClose}>Done</button></div>
    </Modal>
  );
}

function SsimBudgetModal({ g, projectId, onGreenlight, onClose }) {
  const p = g.projects.find((x) => x.id === projectId);
  const info = p ? SSIM_GENRE_INFO[p.genre] : null;
  const [btl, setBtl] = useState(p && p.suggestedBudget ? p.suggestedBudget : (info ? info.sweet : 30));
  const [marketing, setMarketing] = useState(p && p.suggestedBudget ? Math.round(p.suggestedBudget * 0.3) : (info ? Math.round(info.sweet * 0.3) : 10));
  const [contingency, setContingency] = useState(0);
  const [strategy, setStrategy] = useState("wide");
  const [franchiseStrategy, setFranchiseStrategy] = useState("standalone");
  const [finType, setFinType] = useState("self");
  const [investorPct, setInvestorPct] = useState(30);
  const [streamerMargin, setStreamerMargin] = useState(18);
  if (!p) return null;
  const d = g.talent.find((x) => x.id === p.directorId);
  const actors = p.actorIds.map((id) => g.talent.find((x) => x.id === id)).filter(Boolean);
  const atl = +(p.paidFees || (d.salary + actors.reduce((s, a) => s + a.salary, 0))).toFixed(1);
  const negotiatedIds2 = new Set((p.attachedTerms || []).map((x) => x.talentId));
  const points = (p.attachedTerms || []).reduce((s, x) => s + x.pointsAgreed, 0)
    + (negotiatedIds2.has(d.id) ? 0 : (d.pointsDemand || 0))
    + actors.reduce((s, a) => s + (negotiatedIds2.has(a.id) ? 0 : (a.pointsDemand || 0)), 0);
  const franchiseReady = (p.franchisePotential || 0) >= 45;
  const extraFilms = franchiseStrategy === "trilogy" ? 2 : franchiseStrategy === "backtoback" ? 1 : 0;
  const followupCost = extraFilms * ((atl * 0.92) + (btl * 0.95) + (marketing * 0.9));
  const reserveFee = franchiseStrategy === "sequeloption" ? +(btl * 0.05).toFixed(1) : 0;
  const prodCost = btl + marketing + contingency;
  const studioShare = finType === "partner50" ? 0.5 : finType === "investor" ? 1 - investorPct / 100 : finType === "streamer" ? 0 : 1;
  const studioProdCash = prodCost * studioShare;
  const total = atl + studioProdCash + followupCost + reserveFee;
  const guaranteedPayout = +(prodCost * (1 + streamerMargin / 100)).toFixed(1);
  const strategies = [
    { id: "wide", label: "Wide release", desc: "Full marketing push behind it, biggest possible opening" },
    { id: "moderate", label: "Moderate release", desc: "A steadier, cheaper rollout" },
    { id: "platform", label: "Platform release", desc: "Small and controlled, let reviews do the work" },
  ];
  const fStrats = [
    { id: "standalone", label: "Standalone", desc: "Just this one. No commitment beyond it." },
    { id: "sequeloption", label: "Reserve sequel option", desc: `A small ${fmtM(reserveFee || btl*0.05)} deposit now holds first right to a sequel later.` },
    { id: "trilogy", label: "Plan a trilogy", desc: "Lock the whole cast and crew at today's rate for two more films, paid now. Cheaper if this hits before their price rises. Painful if it flops with two more already financed." },
    { id: "backtoback", label: "Shoot two back-to-back", desc: "One more film, same cast and crew, paid now, releasing soon after this one." },
  ];
  const advice = ssimBudgetAdvice(g, p, btl, marketing, contingency, strategy);
  return (
    <Modal title={`Set the budget: "${p.title}"`} sub={`${info.label} · genre sweet spot around ${fmtM(info.sweet)} below the line`} onClose={onClose}>
      <div className="lbl">Above the line (already paid at packaging): {fmtM(atl)}{points ? `, plus ${points} backend points` : ""}</div>
      <div className="lbl">Below the line: {fmtM(btl)}</div>
      <input type="range" min={5} max={250} step={5} value={btl} onChange={(e) => setBtl(+e.target.value)} />
      <div className="lbl">Marketing / P&amp;A: {fmtM(marketing)}</div>
      <input type="range" min={2} max={100} step={2} value={marketing} onChange={(e) => setMarketing(+e.target.value)} />
      <div className="lbl">Contingency reserve: {fmtM(contingency)}</div>
      <input type="range" min={0} max={Math.round(btl * 0.3)} step={1} value={contingency} onChange={(e) => setContingency(+e.target.value)} />
      <div className="sub" style={{marginTop:2}}>Softens how bad a bomb can get. It cannot save a weak picture, but it caps the downside.</div>
      <div className="kv" style={{marginTop:10, padding:"8px 10px", border:"1px solid var(--line)", borderRadius:8, background: advice.tone === "good" ? "rgba(79,201,139,.08)" : advice.tone === "bad" ? "rgba(226,104,90,.08)" : "transparent"}}>
        <span style={{color: advice.tone === "good" ? "var(--green)" : advice.tone === "bad" ? "var(--red)" : advice.tone === "warn" ? "var(--gold2)" : "var(--dim)"}}>{advice.label}</span>
      </div>

      <div className="lbl">Who pays for production: {fmtM(prodCost)}</div>
      <div className={"pick" + (finType === "self" ? " sel" : "")} onClick={() => setFinType("self")}>
        <div className="nm">Self-financed</div>
        <div className="dt">You pay the full {fmtM(prodCost)}. Every dollar of the net is yours too.</div>
      </div>
      <div className={"pick" + (finType === "partner50" ? " sel" : "")} onClick={() => setFinType("partner50")}>
        <div className="nm">50/50 partner studio</div>
        <div className="dt">A partner covers half of {fmtM(prodCost)}, for half of the net, win or lose. Your cash outlay drops to {fmtM(prodCost * 0.5)}.</div>
      </div>
      <div className={"pick" + (finType === "investor" ? " sel" : "")} onClick={() => setFinType("investor")}>
        <div className="nm">Outside investor: {investorPct}% stake</div>
        <div className="dt">They cover {investorPct}% of {fmtM(prodCost)} for {investorPct}% of the net. Your cash outlay drops to {fmtM(prodCost * (1 - investorPct/100))}.</div>
        {finType === "investor" && <input type="range" min={10} max={49} step={5} value={investorPct} onChange={(e) => { setInvestorPct(+e.target.value); }} onClick={(e) => e.stopPropagation()} style={{marginTop:8}} />}
      </div>
      <div className={"pick" + (finType === "streamer" ? " sel" : "")} onClick={() => setFinType("streamer")}>
        <div className="nm">Streamer pre-buy: guaranteed {fmtM(guaranteedPayout)}</div>
        <div className="dt">A streamer covers all of production and pays you a fixed {fmtM(guaranteedPayout)} at release, margin included, whatever the film actually does. Zero risk, zero upside.</div>
        {finType === "streamer" && <input type="range" min={10} max={35} step={1} value={streamerMargin} onChange={(e) => { setStreamerMargin(+e.target.value); }} onClick={(e) => e.stopPropagation()} style={{marginTop:8}} />}
      </div>

      <div className="lbl">Release strategy</div>
      {strategies.map((s) => (
        <div key={s.id} className={"pick" + (strategy === s.id ? " sel" : "")} onClick={() => setStrategy(s.id)}>
          <div className="nm">{s.label}</div><div className="dt">{s.desc}</div>
        </div>
      ))}
      {franchiseReady && (
        <>
          <div className="lbl">Franchise planning (franchise potential {p.franchisePotential}/100)</div>
          {fStrats.map((s) => (
            <div key={s.id} className={"pick" + (franchiseStrategy === s.id ? " sel" : "")} onClick={() => setFranchiseStrategy(s.id)}>
              <div className="nm">{s.label}</div><div className="dt">{s.desc}</div>
            </div>
          ))}
        </>
      )}
      <div className="sub" style={{marginTop:10}}>Your cash outlay: {fmtM(total)}. Cash on hand {fmtM(g.cash)}.</div>
      <div className="actions">
        <button className="btn green" style={{flex:1}} disabled={total > g.cash} onClick={() => onGreenlight(p.id, btl, marketing, strategy, contingency, franchiseStrategy, { type: finType, pct: investorPct, margin: streamerMargin })}>GREENLIGHT</button>
        <button className="btn ghost" onClick={onClose}>Back</button>
      </div>
    </Modal>
  );
}

function Roll({ to, dur }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (ts) => {
      if (!start) start = ts;
      const k = Math.min(1, (ts - start) / dur);
      setV(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  return <span>{fmtM(v)}</span>;
}

function SsimPremiere({ g, projectId, onClose, onSequel }) {
  const p = g.projects.find((x) => x.id === projectId);
  const [stage, setStage] = useState(0);
  if (!p || !p.result) return null;
  const R = p.result;
  const good = R.netProfit > 0.5, bad = R.netProfit < -0.5;
  const stages = ["opening", "domestic", "international", "windows", "ledger"];
  const cur = stages[Math.min(stage, stages.length - 1)];
  const next = () => setStage((s) => Math.min(stages.length - 1, s + 1));
  return (
    <Modal title={p.title} sub={`${R.bucketLabel} · quality ${R.quality}/100${p.franchiseId ? " · franchise picture" : ""}`} onClose={cur === "ledger" ? onClose : undefined}>
      {cur === "opening" && (
        <>
          <div className="stagelbl" style={{fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"var(--dim)", textAlign:"center"}}>Opening weekend</div>
          <div className="bignum"><Roll to={R.openingWeekend} dur={1400} /></div>
          <div className="actions"><button className="btn gold" style={{flex:1}} onClick={next}>Domestic run →</button></div>
        </>
      )}
      {cur === "domestic" && (
        <>
          <div className="stagelbl" style={{fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"var(--dim)", textAlign:"center"}}>Domestic box office</div>
          <div className="bignum"><Roll to={R.domestic} dur={1400} /></div>
          <div className="actions"><button className="btn gold" style={{flex:1}} onClick={next}>Go international →</button></div>
        </>
      )}
      {cur === "international" && (
        <>
          <div className="kv" style={{justifyContent:"center"}}><span>Domestic {fmtM(R.domestic)}</span></div>
          <div className="stagelbl" style={{fontSize:11, letterSpacing:".2em", textTransform:"uppercase", color:"var(--dim)", textAlign:"center", marginTop:10}}>International</div>
          <div className="bignum"><Roll to={R.intl} dur={1200} /></div>
          <div className="verdictline" style={{fontSize:16}}>Worldwide: {fmtM(R.worldwide)}</div>
          <div className="actions"><button className="btn gold" style={{flex:1}} onClick={next}>Downstream windows →</button></div>
        </>
      )}
      {cur === "windows" && (
        <>
          <div className="ledger">
            <div className="ln"><span>Streaming &amp; licensing</span><span>+{fmtM(R.streaming)}</span></div>
            <div className="ln"><span>TV &amp; library</span><span>+{fmtM(R.tvLibrary)}</span></div>
            <div className="ln"><span>Merchandising</span><span>+{fmtM(R.merch)}</span></div>
            <div className="ln net"><span>Ancillary total</span><span>{fmtM(R.ancillary)}</span></div>
          </div>
          <div className="actions"><button className="btn gold" style={{flex:1}} onClick={next}>The full ledger →</button></div>
        </>
      )}
      {cur === "ledger" && (
        <>
          <div className="verdictline" style={{color: good ? "var(--gold)" : bad ? "var(--red)" : "var(--ivory)"}}>{R.bucketLabel}</div>
          <div className="bignum" style={{color: good ? "var(--green)" : bad ? "var(--red)" : "var(--ivory)"}}>{R.netProfit >= 0 ? "+" : ""}{fmtM(R.netProfit)}</div>
          <div className="sub" style={{textAlign:"center", marginTop:-6}}>net to the studio</div>
          <div className="ledger">
            <div className="ln"><span>Worldwide box office</span><span>{fmtM(R.worldwide)}</span></div>
            <div className="ln"><span>Ancillary (streaming, TV, merch)</span><span>+{fmtM(R.ancillary)}</span></div>
            <div className="ln"><span>Distribution/studio fees</span><span>-{fmtM(R.distributionFee)}</span></div>
            {R.partnerShare > 0 && <div className="ln"><span>Partner share</span><span>-{fmtM(R.partnerShare)}</span></div>}
            {R.advanceAlreadyPaid > 0 && <div className="ln"><span>Advance already paid out</span><span>-{fmtM(R.advanceAlreadyPaid)}</span></div>}
            <div className="ln"><span>Total revenue</span><span>{fmtM(R.totalRevenue)}</span></div>
            <div className="ln"><span>Above the line</span><span>-{fmtM(R.atl)}</span></div>
            <div className="ln"><span>Below the line</span><span>-{fmtM(R.btl)}</span></div>
            <div className="ln"><span>Marketing / P&amp;A</span><span>-{fmtM(R.marketing)}</span></div>
            {R.contingency > 0 && <div className="ln"><span>Contingency reserve</span><span>-{fmtM(R.contingency)}</span></div>}
            {R.pointsPay > 0 && <div className="ln"><span>Backend points paid</span><span>-{fmtM(R.pointsPay)}</span></div>}
            <div className="ln net"><span>NET</span><span style={{color: R.netProfit >= 0 ? "#1d7a4c" : "#a23325"}}>{R.netProfit >= 0 ? "+" : ""}{fmtM(R.netProfit)}</span></div>
          </div>
          {R.isStreamerDeal && <div className="kv" style={{marginTop:8}}><span style={{color:"var(--gold2)"}}>Sold outright for a guaranteed {fmtM(R.guaranteedPayout)}. Box office was for the trades, not your ledger.</span></div>}
          <div className="card" style={{marginTop:10, background:"var(--panel2)"}}>
            <div className="lbl" style={{marginTop:0}}>Chief of staff's read</div>
            {ssimPostMortem(g, p).map((note, i) => <div key={i} className="kv" style={{marginTop: i ? 6 : 0}}><span>{note}</span></div>)}
          </div>
          <div className="kv" style={{marginTop:10}}><span>Sequel demand: <b>{R.sequelDemand}/100</b>{p.franchiseId ? " · franchise brand power moved with this result" : ""}</span></div>
          <div className="actions">
            <button className="btn gold" style={{flex:1}} onClick={onClose}>Back to the studio</button>
            {onSequel && <button className="btn ghost" onClick={() => onSequel(p)}>Commission a sequel</button>}
          </div>
        </>
      )}
    </Modal>
  );
}

function SsimPitchesTab({ g, onOption, onBuy, onPass }) {
  const pitches = g.pitches || [];
  if (!pitches.length) return <div className="empty">Nothing on offer right now. Check back after ending the month.</div>;
  return (
    <>
      <div className="empty" style={{padding:"2px 8px 12px"}}>Outside material comes to you. Option to hold it, buy to develop or shelve the rights, or pass.</div>
      {pitches.map((p) => {
        const src = SSIM_SOURCES[p.source];
        const d = p.comesWithDirectorId ? g.talent.find((x) => x.id === p.comesWithDirectorId) : null;
        const a = p.comesWithActorId ? g.talent.find((x) => x.id === p.comesWithActorId) : null;
        const fullCast = p.comesWithActorIds ? p.comesWithActorIds.map((id) => g.talent.find((x) => x.id === id)).filter(Boolean) : null;
        return (
          <div key={p.id} className="deal">
            <div className="from">{src.label}{p.optioned ? " · OPTIONED" : ""} · expires {dateLabel(p.optioned ? p.optionExpiresAt : p.expiresAt)}</div>
            <div className="t">{p.title}</div>
            <div className="meta">{SSIM_GENRE_INFO[p.genre].label} · rights {fmtM(p.rightsCost)}{p.devCost ? " · dev " + fmtM(p.devCost) : ""}{p.suggestedBudget ? " · suggested production " + fmtM(p.suggestedBudget) : ""}</div>
            <div className="body">{p.flavor}</div>
            <div className="kv" style={{marginTop:6}}>
              <span>Concept <b>{p.conceptQuality}</b></span>
              <span>Franchise <b>{p.franchisePotential}</b></span>
              <span>Merch <b>{p.merchPotential}</b></span>
              <span>Intl <b>{p.intlAppealPotential}</b></span>
              <span>Awards <b>{p.awardsPotential}</b></span>
            </div>
            {fullCast ? (
              <div className="kv" style={{marginTop:4}}><span style={{color:"var(--gold2)"}}>Fully packaged: {d ? d.name + " directing" : "a director"}, starring {fullCast.map((x) => x.name).join(", ")}. Script quality {p.prepackagedScriptQuality}/100, terms already agreed. Only the financing decision is left.</span></div>
            ) : <>
              {d && <div className="kv" style={{marginTop:4}}><span style={{color:"var(--gold2)"}}>Comes with {d.name} attached to direct.</span></div>}
              {a && <div className="kv" style={{marginTop:4}}><span style={{color:"var(--gold2)"}}>Comes with {a.name} attached to star.</span></div>}
            </>}
            {p.partnerOffer && <div className="kv" style={{marginTop:4}}><span style={{color:"var(--gold2)"}}>{p.partnerOffer.name} offers to cover part of production for {p.partnerOffer.pct}% of the net.</span></div>}
            <div className="actions">
              <button className="btn gold" disabled={g.cash < p.rightsCost} onClick={() => onBuy(p.id, false)}>{fullCast ? "Acquire & finance" : "Buy & develop"} ({fmtM(p.rightsCost)})</button>
              <button className="btn ghost" disabled={g.cash < p.rightsCost} onClick={() => onBuy(p.id, true)}>Buy &amp; shelve</button>
              {!p.optioned && <button className="btn ghost" disabled={g.cash < p.optionCost} onClick={() => onOption(p.id)}>Option ({fmtM(p.optionCost)})</button>}
              <button className="btn ghost" onClick={() => onPass(p.id)}>Pass</button>
            </div>
          </div>
        );
      })}
    </>
  );
}

function SsimFinancingTab({ g, onBorrow, onRepay }) {
  const cap = ssimCreditCap(g);
  return (
    <div className="card">
      <div className="lbl" style={{marginTop:0}}>Bank credit line</div>
      <div className="kv"><span>Available <b>{fmtM(cap)}</b></span><span>Balance <b>{fmtM(g.debt || 0)}</b></span><span>Rate <b>12%/yr</b></span></div>
      <div className="kv" style={{marginTop:6}}><span>Collateralized against your slate in production plus cash on hand. Interest accrues every month whether or not a film is in theaters.</span></div>
      <div className="actions">
        <button className="btn gold" disabled={cap <= 0} onClick={onBorrow}>Borrow</button>
        {g.debt > 0 && <button className="btn ghost" onClick={onRepay}>Repay early</button>}
      </div>
      <div className="kv" style={{marginTop:14}}><span>For financing on a specific picture, an advance or an outside investor, open the Slate tab and use "Raise capital" on a project already in production.</span></div>
    </div>
  );
}

function SsimSequelModal({ g, franchiseId, onCommission, onClose }) {
  const fr = g.franchises.find((x) => x.id === franchiseId);
  if (!fr) return null;
  const terms = ssimSequelTerms(g, franchiseId);
  return (
    <Modal title={`Commission: ${fr.title} ${fr.chapter + 1}`} sub={`Brand power ${fr.brandPower}/100. The returning cast and director know what this is worth now.`} onClose={onClose}>
      {terms.director && (
        <div className="kv" style={{marginBottom:8}}><span>{terms.director.name} wants {fmtM(terms.directorAsk)} to return (was {fmtM(terms.director.salary)}).</span></div>
      )}
      {terms.actors.map((a, i) => (
        <div key={a.id} className="kv" style={{marginBottom:4}}><span>{a.name} wants {fmtM(terms.actorAsks[i])} and {terms.pointsAsk[i]} points to return.</span></div>
      ))}
      <div className="pick" onClick={() => onCommission(fr.id, "pay")}>
        <div className="nm">Pay the raise, bring everyone back</div>
        <div className="dt">Higher cost, the audience gets exactly what it came for.</div>
      </div>
      <div className="pick" onClick={() => onCommission(fr.id, "recast")}>
        <div className="nm">Recast</div>
        <div className="dt">Cheaper, but franchise potential takes a real hit. Audiences notice new faces.</div>
      </div>
      <div className="actions"><button className="btn ghost" style={{flex:1}} onClick={onClose}>Not yet</button></div>
    </Modal>
  );
}

function SsimLoanModal({ g, mode, onBorrow, onRepay, onClose }) {
  const cap = ssimCreditCap(g);
  const maxAmt = mode === "borrow" ? cap : Math.min(g.debt || 0, Math.max(0, Math.floor(g.cash)));
  const [amt, setAmt] = useState(Math.max(1, Math.round(maxAmt / 2)));
  if (maxAmt <= 0) return (
    <Modal title="Bank credit line" sub={mode === "borrow" ? "No borrowing capacity right now. Get a picture into production or build up cash." : "Nothing to repay from cash on hand."} onClose={onClose}>
      <div className="actions"><button className="btn ghost" style={{flex:1}} onClick={onClose}>Close</button></div>
    </Modal>
  );
  return (
    <Modal title={mode === "borrow" ? "Draw on the credit line" : "Repay the bank"} sub={mode === "borrow" ? `Up to ${fmtM(maxAmt)} available at 12% a year.` : `Balance ${fmtM(g.debt)}.`} onClose={onClose}>
      <div className="lbl">Amount: {fmtM(Math.min(amt, maxAmt))}</div>
      <input type="range" min={1} max={Math.max(1, Math.round(maxAmt))} step={1} value={Math.min(amt, maxAmt)} onChange={(e) => setAmt(+e.target.value)} />
      <div className="actions">
        <button className="btn gold" style={{flex:1}} onClick={() => mode === "borrow" ? onBorrow(amt) : onRepay(amt)}>{mode === "borrow" ? "Take the money" : "Pay it down"}</button>
        <button className="btn ghost" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function SsimProjectFinanceModal({ g, projectId, onAdvance, onInvestor, onClose }) {
  const p = g.projects.find((x) => x.id === projectId);
  if (!p) return null;
  const maxAdvance = Math.round(p.budget.btl * 0.4);
  const [advAmt, setAdvAmt] = useState(Math.round(maxAdvance / 2));
  const [pct, setPct] = useState(25);
  const estInvestorCash = +(p.budget.btl * pct / 100 * 0.9).toFixed(1);
  return (
    <Modal title={`Raise capital: ${p.title}`} sub="A distribution advance brings cash now against revenue you would otherwise collect at release. An investor takes a straight percentage of this picture's net, forever, in exchange for cash today." onClose={onClose}>
      <div className="lbl">Distribution advance: {fmtM(advAmt)}</div>
      <input type="range" min={1} max={Math.max(1, maxAdvance)} step={1} value={advAmt} onChange={(e) => setAdvAmt(+e.target.value)} />
      <div className="actions"><button className="btn gold" onClick={() => onAdvance(p.id, advAmt)}>Take the advance</button></div>
      <div className="lbl" style={{marginTop:16}}>Investor stake: {pct}% of this picture's net</div>
      <input type="range" min={5} max={49} step={5} value={pct} onChange={(e) => setPct(+e.target.value)} />
      <div className="sub" style={{marginTop:4}}>Roughly {fmtM(estInvestorCash)} up front, and they keep {pct}% of whatever this picture nets, win or lose.</div>
      <div className="actions"><button className="btn gold" onClick={() => onInvestor(p.id, pct)}>Take the investor</button></div>
      <div className="actions" style={{marginTop:10}}><button className="btn ghost" style={{flex:1}} onClick={onClose}>Never mind</button></div>
    </Modal>
  );
}
