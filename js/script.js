/* ============================================================
   WEDDING INVITATION — interactivity
   ============================================================ */

/* -------- 1. EDIT YOUR DETAILS HERE -------- */
const CONFIG = {
  // Wedding date & time (local time). Format: YEAR, MONTH(0-11), DAY, HOUR(24h), MIN
  weddingDate: new Date(2026, 10, 14, 20, 0, 0), // 14 November 2026, 8:00 PM  (month 10 = November)

  // Calendar section
  calendarYear: 2026,
  calendarMonth: 10,  // 0 = Jan ... 10 = November
  weddingDay: 14,     // day of month to highlight

  // Links
  mapUrl: "https://maps.app.goo.gl/YhSTxeV14ifh4SVZ7",
  groupUrl: "https://drive.google.com/drive/folders/13Z5VWex8jQwNEPtC-xdNAvsRVB_qS39S?usp=sharing", // shared photo folder
};

/* ============================================================
   2. LANGUAGE TOGGLE (English <-> Arabic)
   ============================================================ */
const langToggle = document.getElementById('langToggle');
let isArabic = true;   // Arabic is the default language

function applyLanguage() {
  document.body.classList.toggle('ar', isArabic);
  document.documentElement.lang = isArabic ? 'ar' : 'en';
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  langToggle.textContent = isArabic ? 'EN' : 'عربي';

  document.querySelectorAll('[data-en]').forEach(el => {
    const val = isArabic ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (val !== null) el.innerHTML = val;
  });
}
langToggle.addEventListener('click', () => { isArabic = !isArabic; applyLanguage(); });

// Apply the default language (Arabic) on load
applyLanguage();

/* ============================================================
   3. MUSIC PLAYER
   ============================================================ */
const song = document.getElementById('song');
const musicToggle = document.getElementById('musicToggle');
const songPlay = document.getElementById('songPlay');

function setPlayingState(playing) {
  musicToggle.classList.toggle('playing', playing);
  if (songPlay) songPlay.classList.toggle('playing', playing);
  const label = songPlay ? songPlay.querySelector('.song-label') : null;
  if (label) {
    label.innerHTML = playing
      ? (isArabic ? 'إيقاف' : 'Pause')
      : (isArabic ? 'تشغيل' : 'Play');
  }
}

function toggleMusic() {
  if (song.paused) {
    song.play().then(() => setPlayingState(true))
      .catch(() => setPlayingState(false));
  } else {
    song.pause();
    setPlayingState(false);
  }
}
musicToggle.addEventListener('click', toggleMusic);
if (songPlay) songPlay.addEventListener('click', toggleMusic);
song.addEventListener('ended', () => setPlayingState(false));

/* ============================================================
   4. COUNTDOWN
   ============================================================ */
const cd = {
  days: document.getElementById('cdDays'),
  hours: document.getElementById('cdHours'),
  mins: document.getElementById('cdMins'),
  secs: document.getElementById('cdSecs'),
};
const pad = n => String(n).padStart(2, '0');

function updateCountdown() {
  const diff = CONFIG.weddingDate - new Date();
  if (diff <= 0) {
    cd.days.textContent = cd.hours.textContent = cd.mins.textContent = cd.secs.textContent = '00';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  cd.days.textContent = pad(d);
  cd.hours.textContent = pad(h);
  cd.mins.textContent = pad(m);
  cd.secs.textContent = pad(s);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
   5. CALENDAR
   ============================================================ */
function buildCalendar() {
  const grid = document.getElementById('calGrid');
  if (!grid) return;
  const heads = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  heads.forEach(h => {
    const c = document.createElement('div');
    c.className = 'cal-cell head';
    c.textContent = h;
    grid.appendChild(c);
  });
  const firstDay = new Date(CONFIG.calendarYear, CONFIG.calendarMonth, 1).getDay();
  const daysInMonth = new Date(CONFIG.calendarYear, CONFIG.calendarMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const c = document.createElement('div');
    c.className = 'cal-cell empty';
    grid.appendChild(c);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const c = document.createElement('div');
    c.className = 'cal-cell';
    if (day === CONFIG.weddingDay) c.classList.add('day-of-wedding');
    c.textContent = day;
    grid.appendChild(c);
  }
}
buildCalendar();

/* ============================================================
   6. APPLY CONFIG LINKS
   ============================================================ */
const mapBtn = document.getElementById('mapBtn');
const groupBtn = document.getElementById('groupBtn');
if (mapBtn) mapBtn.href = CONFIG.mapUrl;
if (groupBtn) groupBtn.href = CONFIG.groupUrl;

/* ============================================================
   7. SCROLL REVEAL
   ============================================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ============================================================
   8. OPENING GATE + FALLING PETALS
   ============================================================ */
const intro = document.getElementById('intro');
const openBtn = document.getElementById('openBtn');
const petalsLayer = document.getElementById('petals');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lock scrolling while the intro is showing
document.body.style.overflow = 'hidden';

// ---- Petals ----
const PETAL_CHARS = ['❀', '✿', '❁', '♥', '❃'];
function spawnPetal() {
  const p = document.createElement('span');
  p.className = 'petal';
  p.textContent = PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
  const dur = 6 + Math.random() * 7;          // 6–13s
  const size = 0.8 + Math.random() * 1.3;     // rem
  const drift = (Math.random() * 120 - 60);   // -60..60 px
  p.style.left = (Math.random() * 100) + 'vw';
  p.style.fontSize = size.toFixed(2) + 'rem';
  p.style.animationDuration = dur.toFixed(2) + 's';
  p.style.setProperty('--drift', drift.toFixed(0) + 'px');
  petalsLayer.appendChild(p);
  setTimeout(() => p.remove(), dur * 1000 + 600);
}
let petalTimer = null;
function startPetals() {
  if (petalTimer || reduceMotion) return;
  for (let i = 0; i < 10; i++) setTimeout(spawnPetal, i * 300);
  petalTimer = setInterval(spawnPetal, 650);
}

// ---- Open the invitation (plays song + reveals with animation) ----
function openInvitation() {
  if (document.body.classList.contains('opened')) return;
  document.body.classList.add('opened');
  document.body.style.overflow = '';
  intro.classList.add('hidden');
  startPetals();
  // The tap on the button is a user gesture, so the song is allowed to play.
  song.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));
  setTimeout(() => { if (intro && intro.parentNode) intro.remove(); }, 1200);
}
openBtn.addEventListener('click', openInvitation);

// Try to autostart the song immediately in case the browser allows it
// (most browsers will block this until the user taps "Open Invitation").
window.addEventListener('load', () => {
  song.play().then(() => setPlayingState(true)).catch(() => { /* blocked — wait for tap */ });
});
