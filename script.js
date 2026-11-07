const hackingStart = new Date(2026, 10, 6, 19, 0, 0);
const hackingEnd = new Date(2026, 10, 7, 18, 0, 0);

const statusEl = document.getElementById('status');
const countdownEl = document.getElementById('countdown');
const themeToggle = document.getElementById('theme-toggle');
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiButton = document.getElementById('test-confetti');

const timeEls = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

let countdownInterval = null;
let confettiAnimationFrame = null;
let confettiParticles = [];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  confettiCanvas.width = window.innerWidth * ratio;
  confettiCanvas.height = window.innerHeight * ratio;
  confettiCanvas.style.width = `${window.innerWidth}px`;
  confettiCanvas.style.height = `${window.innerHeight}px`;
  const ctx = confettiCanvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function triggerConfetti() {
  if (prefersReducedMotion) {
    return;
  }

  const ctx = confettiCanvas.getContext('2d');
  const colors = ['#7dd3fc', '#b794f4', '#fbbf24', '#f472b6', '#34d399'];
  confettiParticles = Array.from({ length: 180 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -11 - 4,
    size: Math.random() * 7 + 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.35,
    life: 1
  }));

  const burst = () => {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles = confettiParticles.filter((piece) => piece.life > 0);

    confettiParticles.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += 0.08;
      piece.rotation += piece.spin;
      piece.life -= 0.008;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.5);
      ctx.restore();
    });

    if (confettiParticles.length > 0) {
      confettiAnimationFrame = requestAnimationFrame(burst);
    } else {
      cancelAnimationFrame(confettiAnimationFrame);
      confettiAnimationFrame = null;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  };

  cancelAnimationFrame(confettiAnimationFrame);
  confettiAnimationFrame = requestAnimationFrame(burst);
}

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light-theme', isLight);
  themeToggle.textContent = isLight ? '🌙' : '☀️';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  localStorage.setItem('plutohacks-theme', theme);
}

const savedTheme = localStorage.getItem('plutohacks-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
  applyTheme(nextTheme);
});

function getTimeParts(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function updateCountdown() {
  const now = new Date();

  if (now >= hackingEnd) {
    clearInterval(countdownInterval);
    statusEl.textContent = 'Hacking is over! Submit your project';
    statusEl.classList.add('status-complete');
    countdownEl.classList.add('hidden');
    triggerConfetti();
    return;
  }

  statusEl.classList.remove('status-complete');

  let targetDate = hackingStart;
  let label = 'Hacking starts in';

  if (now >= hackingStart) {
    targetDate = hackingEnd;
    label = 'Hacking ends in';
  }

  const diff = Math.max(0, targetDate - now);
  const { days, hours, minutes, seconds } = getTimeParts(diff);

  statusEl.textContent = label;
  countdownEl.classList.remove('hidden');
  timeEls.days.textContent = String(days).padStart(2, '0');
  timeEls.hours.textContent = String(hours).padStart(2, '0');
  timeEls.minutes.textContent = String(minutes).padStart(2, '0');
  timeEls.seconds.textContent = String(seconds).padStart(2, '0');
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

confettiButton.addEventListener('click', triggerConfetti);

updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);
