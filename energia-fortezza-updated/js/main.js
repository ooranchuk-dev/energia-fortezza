// ── CURSOR ──
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

if (cursor && cursorRing) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) *.12;
    cursorRing.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '56px';
      cursorRing.style.height = '56px';
      cursorRing.style.borderColor = 'rgba(232,87,42,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '32px';
      cursorRing.style.height = '32px';
      cursorRing.style.borderColor = 'rgba(232,87,42,0.5)';
    });
  });
}

// ── NAV SCROLL ──
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── REVEAL ON SCROLL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

// ── PARALLAX ──
const parallaxEls = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    const rect = el.closest('section')?.getBoundingClientRect();
    if (!rect) return;
    const offset = (rect.top + rect.height / 2) * speed;
    el.style.transform = `translateY(${offset * 0.15}px) scale(1.05)`;
  });
});

// ── LIVE COUNTER ANIMATION ──
function animateCount(el, target, duration = 2000, suffix = '') {
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      animateCount(el, target, 2000, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── SMOOTH SECTION TRANSITIONS ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── VIDEO LAZY LOAD ──
document.querySelectorAll('video[data-src]').forEach(video => {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      video.src = video.dataset.src;
      video.load();
      obs.disconnect();
    }
  });
  obs.observe(video);
});

// ── CALCOLATORE ──
function updateCalc() {
  const bill = parseFloat(document.getElementById('calc-bill')?.value || 200);
  const kw   = parseFloat(document.getElementById('calc-kw')?.value || 8);
  const bat  = parseFloat(document.getElementById('calc-bat')?.value || 10);
  const price= parseFloat(document.getElementById('calc-price')?.value || 0.25);

  document.getElementById('calc-bill-val').textContent  = '€' + bill + '/mese';
  document.getElementById('calc-kw-val').textContent    = kw + ' kWp';
  document.getElementById('calc-bat-val').textContent   = bat + ' kWh';
  document.getElementById('calc-price-val').textContent = '€' + price.toFixed(2) + '/kWh';

  // Calcoli realistici Liguria
  const produzione  = Math.round(kw * 1450);           // kWh/anno
  const autoconsumo = Math.round(produzione * 0.70);   // 70% autoconsumo
  const risparmio   = Math.round(autoconsumo * price); // €/anno
  const costoSistema = Math.round(kw * 1400 + bat * 300); // stima installazione
  const roi = costoSistema > 0 ? Math.round(costoSistema * 0.5 / risparmio * 10) / 10 : '—';
  document.getElementById('res-annual').textContent = '€' + risparmio.toLocaleString('it');
  document.getElementById('res-roi').textContent    = roi + ' anni';
  document.getElementById('res-prod').textContent   = (produzione/1000).toFixed(1) + ' MWh';
}

['calc-bill','calc-kw','calc-bat','calc-price'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateCalc);
});
updateCalc();

// ── FAQ ACCORDION ──
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const icon   = btn.querySelector('.faq-icon');
  const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

  // Chiudi tutti
  document.querySelectorAll('.faq-a').forEach(a => a.style.maxHeight = '0px');
  document.querySelectorAll('.faq-icon').forEach(i => {
    i.textContent = '+';
    i.style.transform = 'rotate(0deg)';
  });

  if (!isOpen) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
    icon.textContent = '−';
    icon.style.transform = 'rotate(0deg)';
  }
}


