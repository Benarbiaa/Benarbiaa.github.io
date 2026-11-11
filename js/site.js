// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav: mark the section in view
const navLinks = [...document.querySelectorAll('.rail-nav a')];
const setCurrent = (id) => {
  navLinks.forEach((a) => {
    if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
};
// More than one section can sit in the band at once (and a ledger entry opening
// moves sections without anything newly entering), so keep the set and take the first.
const sections = [...document.querySelectorAll('main > section')];
const inBand = new Set();
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? inBand.add(e.target) : inBand.delete(e.target)));
  const first = sections.find((sec) => inBand.has(sec));
  if (first) setCurrent(first.id);
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((sec) => spy.observe(sec));

// Project map: draw the runs the first time the map scrolls into view
const map = document.querySelector('.map');
const draw = new IntersectionObserver((entries) => {
  if (entries.some((e) => e.isIntersecting)) {
    map.classList.add('is-drawn');
    draw.disconnect();
  }
}, { threshold: 0.35 });
draw.observe(map);

// Ledger: a link to a closed entry opens it before scrolling there
const openTarget = () => {
  const el = location.hash && document.getElementById(location.hash.slice(1));
  if (el && el.matches('details')) {
    el.open = true;
    el.scrollIntoView();
  }
};
window.addEventListener('hashchange', openTarget);
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#p-"]');
  // Same hash twice fires no hashchange, so handle the click as well
  if (link && link.getAttribute('href') === location.hash) openTarget();
});
openTarget();

// Diagram viewer: any plate opens full size in a dialog
const viewer = document.getElementById('viewer');
const viewerImg = viewer.querySelector('img');
const viewerTitle = document.getElementById('viewer-title');

const openViewer = (plate) => {
  const img = plate.querySelector('img');
  const button = plate.querySelector('.plate-open');
  viewerImg.src = img.currentSrc || img.src;
  viewerImg.alt = img.alt;
  viewerTitle.textContent = button.dataset.title;
  viewer.showModal();
};

document.addEventListener('click', (e) => {
  const plate = e.target.closest('.plate');
  if (plate && e.target.matches('.plate img, .plate-open')) openViewer(plate);
});
viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
// A click on the backdrop lands on the dialog element itself
viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
