document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle"),
    nav = document.querySelector(".nav-links");
  if (toggle && nav)
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
  document
    .querySelectorAll("[data-year]")
    .forEach((el) => (el.textContent = new Date().getFullYear()));
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // Hero banner carousel: auto-advance, dots, arrows and pause on hover/focus.
  const hero = document.querySelector(".hero-carousel");
  if (hero) {
    const slides = [...hero.querySelectorAll(".hero-slide")],
      dots = [...hero.querySelectorAll(".carousel-dots button")];
    let current = 0,
      timer;
    const show = (n) => {
      current = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("active", i === current));
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    };
    const next = () => show(current + 1),
      prev = () => show(current - 1);
    hero.querySelector(".carousel-next")?.addEventListener("click", next);
    hero.querySelector(".carousel-prev")?.addEventListener("click", prev);
    dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
    const start = () => {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    };
    hero.addEventListener("mouseenter", () => clearInterval(timer));
    hero.addEventListener("mouseleave", start);
    hero.addEventListener("focusin", () => clearInterval(timer));
    hero.addEventListener("focusout", start);
    start();
  }
  // Horizontal card rails with previous/next controls and position dots.
  document.querySelectorAll(".card-rail").forEach((rail) => {
    const cards = [...rail.querySelectorAll(".rail-card")],
      dotsHost = document.querySelector('[data-rail-dots="' + rail.id + '"]');
    const perView = () =>
      window.innerWidth <= 760 ? 1 : window.innerWidth <= 980 ? 2 : 3;
    const pageCount = () => Math.max(1, Math.ceil(cards.length / perView()));
    const activePage = () =>
      Math.round(
        rail.scrollLeft /
          Math.max(1, (cards[0]?.getBoundingClientRect().width || 1) + 22),
      );
    const renderDots = () => {
      if (!dotsHost) return;
      dotsHost.innerHTML = "";
      for (let i = 0; i < pageCount(); i++) {
        const b = document.createElement("button");
        b.setAttribute("aria-label", "Show card group " + (i + 1));
        b.classList.toggle("active", i === 0);
        b.addEventListener("click", () =>
          rail.scrollTo({
            left: i * (cards[0].offsetWidth + 22),
            behavior: "smooth",
          }),
        );
        dotsHost.appendChild(b);
      }
    };
    renderDots();
    rail.addEventListener(
      "scroll",
      () => {
        const dots = [...((dotsHost || []).children || [])];
        const active = Math.min(dots.length - 1, activePage());
        dots.forEach((d, i) => d.classList.toggle("active", i === active));
      },
      { passive: true },
    );
    document
      .querySelectorAll('[data-target="' + rail.id + '"]')
      .forEach((btn) =>
        btn.addEventListener("click", () => {
          const direction = btn.classList.contains("rail-next") ? 1 : -1;
          rail.scrollBy({
            left: direction * (cards[0].offsetWidth + 22) * perView(),
            behavior: "smooth",
          });
        }),
      );
    window.addEventListener("resize", renderDots);
  });

  const track = document.getElementById("clientTrack");

  if (!track) return;

  // Duplicate logos for seamless infinite scrolling
  const originalLogos = Array.from(track.children);

  originalLogos.forEach((logo) => {
    const clone = logo.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  const prevButton = document.querySelector(".client-prev");
  const nextButton = document.querySelector(".client-next");

  // Previous and next controls
  function moveCarousel(direction) {
    const distance = track.parentElement.clientWidth * 0.1;

    track.style.animation = "none";

    track.parentElement.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });

    setTimeout(() => {
      track.style.animation = "";
    }, 500);
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      moveCarousel(-1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      moveCarousel(1);
    });
  }

  // Engineering Capabilities Image Carousel

  const carousel = document.querySelector(".engineering-carousel");

  if (!carousel) return;

  const slides = carousel.querySelectorAll(".engineering-slide");
  const dots = carousel.querySelectorAll(".engineering-dots button");

  const prevButton_1 = carousel.querySelector(".engineering-prev");
  const nextButton_1 = carousel.querySelector(".engineering-next");

  let currentSlide = 0;
  let autoSlide;

  function showSlide(index) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function previousSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();

    autoSlide = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  nextButton_1.addEventListener("click", function () {
    nextSlide();
    startAutoSlide();
  });

  prevButton_1.addEventListener("click", function () {
    previousSlide();
    startAutoSlide();
  });

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
      startAutoSlide();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);

  startAutoSlide();
});
