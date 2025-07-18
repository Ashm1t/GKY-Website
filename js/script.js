// script.js
// JS for GKY E‑Systems website

// Helper to load HTML into a container
function loadSection(containerId, sectionPath, callback) {
  fetch(sectionPath)
    .then(res => res.text())
    .then(html => {
      document.getElementById(containerId).innerHTML = html;
      if (callback) callback();
    });
}

// Track section loading for scroll animations
let sectionsLoaded = 0;
const totalSections = 6;
function sectionLoaded() {
  sectionsLoaded++;
  if (sectionsLoaded === totalSections) {
    animateOnScroll();
    heroParallax();
  }
}
// Load sections with callback
loadSection('hero-container', 'sections/hero.html', () => { initCarousel(); sectionLoaded(); });
loadSection('solutions-container', 'sections/solutions.html', sectionLoaded);
loadSection('about-container', 'sections/about.html', sectionLoaded);
loadSection('why-choose-us', 'sections/why-choose-us.html', sectionLoaded);
loadSection('careers', 'sections/careers.html', sectionLoaded);
loadSection('contact', 'sections/contact.html', sectionLoaded);
// Footer: replace the footer element's content
fetch('sections/footer.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('footer').outerHTML = html;
  });

// Carousel functionality (must be called after hero is loaded)
function initCarousel() {
  const slides = document.querySelectorAll('.carousel__slide');
  const prevBtn = document.querySelector('.carousel__btn--prev');
  const nextBtn = document.querySelector('.carousel__btn--next');
  let currentSlide = 0;
  let carouselInterval;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('carousel__slide--active', i === idx);
    });
    currentSlide = idx;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  function startCarousel() {
    carouselInterval = setInterval(nextSlide, 4000);
  }

  function stopCarousel() {
    clearInterval(carouselInterval);
  }

  if (slides.length) {
    showSlide(0);
    startCarousel();
    nextBtn.addEventListener('click', () => {
      stopCarousel();
      nextSlide();
      startCarousel();
    });
    prevBtn.addEventListener('click', () => {
      stopCarousel();
      prevSlide();
      startCarousel();
    });
    // Pause on hover
    document.querySelector('.carousel').addEventListener('mouseenter', stopCarousel);
    document.querySelector('.carousel').addEventListener('mouseleave', startCarousel);
  }
}

// Section scroll animations
function animateOnScroll() {
  const fadeSections = [
    document.getElementById('hero-container'),
  ];
  const slideSections = [
    document.getElementById('solutions-container'),
    document.getElementById('about-container'),
    document.getElementById('why-choose-us'),
    document.getElementById('careers'),
    document.getElementById('contact'),
  ];
  fadeSections.forEach(sec => sec && sec.classList.add('fade-in', 'animate-on-scroll'));
  slideSections.forEach(sec => sec && sec.classList.add('slide-up', 'animate-on-scroll'));

  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// Parallax effect for hero video
function heroParallax() {
  const hero = document.querySelector('.hero');
  const video = document.querySelector('.hero__bg-video');
  if (!hero || !video) return;
  window.addEventListener('scroll', () => {
    const rect = hero.getBoundingClientRect();
    const offset = Math.max(0, -rect.top);
    video.style.transform = `translateY(${offset * 0.25}px)`;
  });
}

// Remove DOMContentLoaded scroll/parallax init
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.nav__hamburger');
  const dropdown = document.querySelector('.nav__dropdown');
  if (hamburger && dropdown) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (dropdown.classList.contains('open') && !dropdown.contains(e.target) && e.target !== hamburger) {
        dropdown.classList.remove('open');
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
      }
    });
  }
}); 