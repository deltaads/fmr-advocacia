AOS.init({ once: true, offset: 80 });
lucide.createIcons();

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  if (window.scrollY > 60) {
    navbar.classList.add('nav-scrolled');
  } else {
    navbar.classList.remove('nav-scrolled');
  }
});

// Mobile menu
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
mobileToggle.addEventListener('click', function() {
  mobileMenu.classList.toggle('hidden');
  const icon = mobileToggle.querySelector('i');
  if (mobileMenu.classList.contains('hidden')) {
    icon.setAttribute('data-lucide', 'menu');
  } else {
    icon.setAttribute('data-lucide', 'x');
  }
  lucide.createIcons();
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    mobileMenu.classList.add('hidden');
    const icon = mobileToggle.querySelector('i');
    icon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
  });
});

// Testimonials carousel
new Swiper('.testimonial-swiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  autoplay: { delay: 5000, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(function(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = target / 80;
    const updateCount = function() {
      const current = parseInt(counter.innerText);
      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
}

// Trigger counters when visible
const numbersSection = document.querySelector('.gradient-cta');
let countersStarted = false;
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCounters();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
observer.observe(numbersSection);
