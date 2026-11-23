const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const timeline = document.querySelector(".timeline");
const revealItems = [...document.querySelectorAll("[data-reveal]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  siteNav?.classList.remove("is-open");
}

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  siteNav?.classList.toggle("is-open", !open);
});

siteNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  timeline?.classList.add("is-active");
  timeline?.querySelectorAll(".timeline-entry").forEach((entry) => entry.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((items) => {
    items.forEach((item) => {
      if (item.isIntersecting) {
        item.target.classList.add("is-visible");
        revealObserver.unobserve(item.target);
      }
    });
  }, { threshold: 0.14 });

  const timelineObserver = timeline ? new IntersectionObserver((items) => {
    if (items.some((item) => item.isIntersecting)) {
      timeline.classList.add("is-active");
      timeline.querySelectorAll(".timeline-entry").forEach((entry) => entry.classList.add("is-visible"));
      timelineObserver.disconnect();
    }
  }, { threshold: 0.15 }) : null;

  document.documentElement.classList.add("motion-ready");
  revealItems.forEach((item) => revealObserver.observe(item));
  if (timeline && timelineObserver) timelineObserver.observe(timeline);
}

let progressFrame = 0;
function updateReadingProgress() {
  if (progressFrame) return;
  progressFrame = requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    document.documentElement.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, progress))));
    progressFrame = 0;
  });
}

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress, { passive: true });
updateReadingProgress();

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();
