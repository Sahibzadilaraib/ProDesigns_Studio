// ---------- helpers ----------
const pad = n => String(n).padStart(2, '0');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// TODO: replace with your showreel's YouTube video ID (the part after "v=" in the URL)
const YOUTUBE_VIDEO_ID = '';

// ---------- hero play button -> real YouTube embed ----------
const playBtn = document.getElementById('playBtn');
const playerFrame = document.getElementById('playerFrame');

if (playBtn && playerFrame) {
  playBtn.addEventListener('click', () => {
    if (!YOUTUBE_VIDEO_ID) {
      const cap = document.getElementById('caption');
      if (cap) cap.textContent = 'Add your YouTube video ID in script.js to enable playback';
      return;
    }
    clearInterval(captionInterval);
    playerFrame.classList.add('is-playing');
    playerFrame.innerHTML = `<iframe
        src="https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0"
        title="PRO DESIGNS showreel"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;
  });
}

// ---------- live timecode clock (nav + footer) ----------
const startTime = Date.now();
const clockEl = document.getElementById('clock');
const footerTcEl = document.getElementById('footerTc');

function tickClock() {
  const elapsed = Date.now() - startTime;
  const totalSeconds = Math.floor(elapsed / 1000);
  const h = pad(Math.floor(totalSeconds / 3600) % 24);
  const m = pad(Math.floor(totalSeconds / 60) % 60);
  const s = pad(totalSeconds % 60);
  const f = pad(Math.floor((elapsed % 1000) / (1000 / 24))); // 24fps-style frame count
  const tc = `${h}:${m}:${s}:${f}`;
  if (clockEl) clockEl.textContent = tc;
  if (footerTcEl) footerTcEl.textContent = `TC ${tc}`;
}
tickClock();
setInterval(tickClock, reducedMotion ? 1000 : 90);

// ---------- rotating caption in hero player ----------
const captions = [
  'Now editing — Movie Recaps',
  'Now editing — Technology',
  'Now editing — Finance',
  'Now editing — Automotive',
  'Now editing — Gaming',
  'Now editing — Celebrity'
];
const captionEl = document.getElementById('caption');
const scrubFill = document.getElementById('scrubFill');
let captionIndex = 0;

function rotateCaption() {
  if (!captionEl) return;
  captionEl.style.opacity = 0;
  setTimeout(() => {
    captionIndex = (captionIndex + 1) % captions.length;
    captionEl.textContent = captions[captionIndex];
    captionEl.style.opacity = 1;
    if (scrubFill) scrubFill.style.width = `${8 + Math.random() * 70}%`;
  }, 300);
}
let captionInterval;
if (!reducedMotion) captionInterval = setInterval(rotateCaption, 3200);

// ---------- portfolio timeline playhead ----------
const clips = document.querySelectorAll('.clip');
const playhead = document.getElementById('playhead');
const scrubWrap = document.getElementById('timelineScrub');

function movePlayheadTo(el) {
  if (!playhead || !scrubWrap || !el) return;
  const wrapRect = scrubWrap.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const left = elRect.left - wrapRect.left + scrubWrap.scrollLeft;
  playhead.style.left = `${left}px`;
}

clips.forEach(clip => {
  clip.setAttribute('tabindex', '0');
  clip.addEventListener('mouseenter', () => movePlayheadTo(clip));
  clip.addEventListener('focus', () => movePlayheadTo(clip));
});
window.addEventListener('resize', () => {
  if (clips.length) movePlayheadTo(clips[0]);
});
if (clips.length) movePlayheadTo(clips[0]);

// ---------- mobile nav ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// ---------- scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}
