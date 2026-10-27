/* ============================================================
   EDIT YOUR CONTENT HERE – no need to touch anything else
   ============================================================ */

// Start of the weekend: 29 Oct 2026, 17:00 CET (= 16:00 UTC)
const START = new Date(Date.UTC(2026, 9, 29, 16, 0, 0));

const TIMETABLE = [
  { day: "Thursday", date: "29 October", items: [
      { time: "19:30", text: "Cosy dinner" }
  ]},
  { day: "Friday", date: "30 October", items: [
      { text: "Sports with Drizzle" },
      { text: "Healthy brunch" },
      { text: "City getaway" },
      { text: "Time to relax" },
      { text: "Cosy evening walk & dinner" }
  ]},
  { day: "Saturday", date: "31 October", items: [
      { text: "Relax & check-out" }
  ]}
];

const PACKING_INTRO = "A cosy vibrant getaway with a little city in between, so pack light and comfy, plus something a little chic for dinner.";

const PACKING = [
  { title: "Cosy vibrant getaway", sub: "slow mornings, soft vibes", items: [
      "Comfy loungewear",
      "Cosy slippers"
  ]},
  { title: "Sports", sub: "for Friday morning", items: [
      "Sportswear",
      "Trainers"
  ]},
  { title: "City", sub: "comfortable and easy", items: [
      "A comfortable, casual outfit",
      "Comfy walking shoes",
      "A warm jacket or coat (it's late October)"
  ]},
  { title: "Dinner", sub: "casual chic, two evenings", items: [
      "2 casual chic outfits (Thursday & Friday)",
      "Nice shoes to go with them"
  ]},
  { title: "Essentials", sub: "the usual", items: [
      "Toiletries & make-up",
      "Phone charger",
      "ID card"
  ]}
];

/* ============================================================
   APP LOGIC
   ============================================================ */

const $ = (s) => document.querySelector(s);
const pad = (n) => String(n).padStart(2, "0");

/* ---- countdown ---- */
function tick() {
  const diff = START - new Date();
  if (diff <= 0) {
    $("#countdown").innerHTML = '<div style="width:auto;padding:16px 26px"><span style="font-size:1.6rem">It\'s time</span><small>the weekend has begun</small></div>';
    $("#cd-note").textContent = "";
    $("#mini-cd").textContent = "The weekend has begun ✨";
    return false;
  }
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600),
        m = Math.floor(s % 3600 / 60), sec = s % 60;
  $("#cd-d").textContent = pad(d);
  $("#cd-h").textContent = pad(h);
  $("#cd-m").textContent = pad(m);
  $("#cd-s").textContent = pad(sec);
  $("#mini-cd").textContent = `Starts in ${d}d ${h}h ${m}m · Thursday 17:00`;
  return true;
}
tick();
const timer = setInterval(() => { if (!tick()) clearInterval(timer); }, 1000);

/* ---- render content ---- */
const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

$("#days").innerHTML = TIMETABLE.map(d => `
  <article class="day">
    <div class="day-head"><span class="day-name">${esc(d.day)}</span><span class="day-date">${esc(d.date)}</span></div>
    <ul class="items">
      ${d.items.map(i => `<li>${i.time ? `<span class="time">${esc(i.time)}</span>` : ""}${esc(i.text)}${i.note ? `<span class="note">${esc(i.note)}</span>` : ""}</li>`).join("")}
    </ul>
  </article>`).join("");

$("#pack-intro").textContent = PACKING_INTRO;
$("#packing").innerHTML = PACKING.map(g => `
  <article class="day pack">
    <h3>${esc(g.title)}</h3><p class="sub">${esc(g.sub)}</p>
    <ul>${g.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
  </article>`).join("");

/* ---- navigation ---- */
function show(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const el = document.getElementById(id);
  el.scrollTop = 0;
  el.classList.add("active");
}
document.querySelectorAll("[data-go]").forEach(b =>
  b.addEventListener("click", () => show(b.dataset.go)));

/* ---- confetti ---- */
const canvas = $("#confetti"), ctx = canvas.getContext("2d");
const COLORS = ["#7B2D3B", "#D9824B", "#A9BC9C", "#5F7A5C", "#F2C29B", "#EBB7AA", "#E6B65C"];
let parts = [], running = false;

function resize() {
  const r = window.devicePixelRatio || 1;
  canvas.width = innerWidth * r; canvas.height = innerHeight * r;
  ctx.setTransform(r, 0, 0, r, 0, 0);
}
addEventListener("resize", resize); resize();

function burst(x, y) {
  for (let i = 0; i < 160; i++) {
    const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
    parts.push(makePart(x, y, Math.cos(a) * v, Math.sin(a) * v - 6));
  }
  for (let i = 0; i < 120; i++) {   // gentle rain from the top
    parts.push(makePart(Math.random() * innerWidth, -20 - Math.random() * innerHeight * .6,
                        (Math.random() - .5) * 2, 1 + Math.random() * 2));
  }
  if (!running) { running = true; requestAnimationFrame(loop); }
}
function makePart(x, y, vx, vy) {
  return { x, y, vx, vy, w: 6 + Math.random() * 7, h: 4 + Math.random() * 6,
    rot: Math.random() * 6.28, vr: (Math.random() - .5) * .3,
    tilt: Math.random() * 6.28, color: COLORS[Math.random() * COLORS.length | 0],
    round: Math.random() < .3, life: 0 };
}
function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  parts.forEach(p => {
    p.vx *= .985; p.vy = p.vy * .985 + .22;
    p.x += p.vx + Math.sin(p.tilt) * .6; p.y += p.vy;
    p.rot += p.vr; p.tilt += .08; p.life++;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, 1 - p.life / 320);
    ctx.fillStyle = p.color;
    if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2.4, 0, 6.28); ctx.fill(); }
    else ctx.fillRect(-p.w / 2, -p.h / 2 * Math.cos(p.tilt), p.w, p.h * Math.cos(p.tilt));
    ctx.restore();
  });
  parts = parts.filter(p => p.y < innerHeight + 40 && p.life < 320);
  if (parts.length) requestAnimationFrame(loop);
  else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}

/* ---- unlock ---- */
$("#unlock").addEventListener("click", (e) => {
  const b = e.currentTarget.getBoundingClientRect();
  e.currentTarget.disabled = true;
  burst(b.left + b.width / 2, b.top + b.height / 2);
  if (navigator.vibrate) navigator.vibrate(30);
  setTimeout(() => show("menu"), 1300);
  setTimeout(() => { e.currentTarget.disabled = false; }, 2500);
});
