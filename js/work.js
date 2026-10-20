const owSlides = document.querySelectorAll('.ow-slide');
const owVideos = document.querySelectorAll('.ow-slide video');
const owThumbsWrap = document.querySelector('.ow-thumbs');
const owPrevBtn = document.querySelector('.ow-prev');
const owNextBtn = document.querySelector('.ow-next');
const owDurationFill = document.querySelector('.ow-duration-fill');

let owIndex = 0;

function buildThumbs() {
  owVideos.forEach((video, i) => {
    const btn = document.createElement('button');
    btn.className = 'ow-thumb' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Video ' + (i + 1));

    const img = document.createElement('img');
    img.alt = '';
    btn.appendChild(img);
    owThumbsWrap.appendChild(btn);

    btn.addEventListener('click', () => {
      owIndex = i;
      showSlide(owIndex);
    });

    video.addEventListener('loadeddata', () => {
      video.currentTime = 0.5;
    });

    video.addEventListener('seeked', function captureFrame() {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 220;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      img.src = canvas.toDataURL('image/jpeg');
      video.removeEventListener('seeked', captureFrame);
      video.currentTime = 0;
    });
  });
}

function showSlide(newIndex) {
  owSlides.forEach((slide, i) => {
    const video = slide.querySelector('video');
    if (i === newIndex) {
      slide.classList.add('active');
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      slide.classList.remove('active');
      video.pause();
      video.currentTime = 0;
    }
  });

  document.querySelectorAll('.ow-thumb').forEach((btn, i) => {
    btn.classList.toggle('active', i === newIndex);
  });

  owDurationFill.style.transform = 'scaleY(0)';
}

function nextSlide() {
  owIndex = (owIndex + 1) % owSlides.length;
  showSlide(owIndex);
}

function prevSlide() {
  owIndex = (owIndex - 1 + owSlides.length) % owSlides.length;
  showSlide(owIndex);
}

owNextBtn.addEventListener('click', nextSlide);
owPrevBtn.addEventListener('click', prevSlide);

owVideos.forEach((video, i) => {
  video.addEventListener('timeupdate', () => {
    if (i !== owIndex || !video.duration) return;
    const progress = video.currentTime / video.duration;
    owDurationFill.style.transform = 'scaleY(' + progress + ')';
  });

  video.addEventListener('ended', () => {
    if (i === owIndex) nextSlide();
  });
});

buildThumbs();
showSlide(0);