const heroSection = document.getElementById('servicesHero');
const slides = document.querySelectorAll('.slide-content');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const progressNum = document.querySelector('.progress-num');
const progressFill = document.querySelector('.progress-fill');

const gradients = [
  'linear-gradient(0deg, #bc400b 0%, #000000 100%)',
  'linear-gradient(70deg, #bc400b 0%, #000000 100%)',
  'linear-gradient(140deg, #bc400b 0%, #000000 100%)',
  'linear-gradient(210deg, #bc400b 0%, #000000 100%)',
  'linear-gradient(280deg, #bc400b 0%, #000000 100%)',
  'linear-gradient(350deg, #bc400b 0%, #000000 100%)',
];

const totalSlides = slides.length;
let current = 0;
let autoTimer = null;

function renderSlide(index, direction) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  heroSection.style.background = gradients[index];
  progressNum.textContent = String(index + 1).padStart(2, '0');
  progressFill.style.height = ((index + 1) / totalSlides * 100) + '%';

  const activeSlide = slides[index];
  const yFrom = direction === 'prev' ? -30 : 30;

  if (window.gsap) {
    gsap.fromTo(activeSlide.children,
      { opacity: 0, y: yFrom },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
    );
  }
}

function goTo(index, direction) {
  current = (index + totalSlides) % totalSlides;
  renderSlide(current, direction);
}

function next() {
  goTo(current + 1, 'next');
}

function prev() {
  goTo(current - 1, 'prev');
}

function startAutoplay() {
  clearInterval(autoTimer);
  autoTimer = setInterval(next, 6000);
}

nextBtn.addEventListener('click', () => {
  next();
  startAutoplay();
});

prevBtn.addEventListener('click', () => {
  prev();
  startAutoplay();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    goTo(i, i > current ? 'next' : 'prev');
    startAutoplay();
  });
});

let touchStartX = 0;
heroSection.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

heroSection.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) < 50) return;
  if (diff < 0) {
    next();
  } else {
    prev();
  }
  startAutoplay();
});

renderSlide(current, 'next');
startAutoplay();

const highlightsTrack = document.querySelector('.highlights-track');

if (highlightsTrack) {
  const allCards = highlightsTrack.querySelectorAll('.highlight-card');
  const originalCount = allCards.length / 2;
  const slideDuration = 600;
  const pauseDuration = 1000;
  let step = 0;

  function cardStep() {
    const card = allCards[0];
    const trackStyle = getComputedStyle(highlightsTrack);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function advance() {
    step++;
    const distance = cardStep() * step;
    highlightsTrack.style.transition = 'transform ' + slideDuration + 'ms ease';
    highlightsTrack.style.transform = 'translateX(-' + distance + 'px)';

    if (step >= originalCount) {
      setTimeout(() => {
        highlightsTrack.style.transition = 'none';
        highlightsTrack.style.transform = 'translateX(0px)';
        step = 0;
      }, slideDuration);
    }
  }

  setInterval(advance, slideDuration + pauseDuration);
}