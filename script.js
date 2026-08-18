const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  menuButton.classList.toggle('active', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// V4.1: indica a seção ativa sem manter "Onde encontrar"
// aceso durante Parceiros, Contato ou Rodapé.
const sectionLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const sectionTargets = sectionLinks
  .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter(item => item.section);

const updateActiveSection = () => {
  const y = window.scrollY + 150;
  let current = null;

  sectionTargets.forEach((item, index) => {
    const start = item.section.offsetTop;
    const next = sectionTargets[index + 1];

    // Para todos os itens, menos o último, a área ativa segue até
    // o início da próxima seção que existe no menu.
    // Para "Onde encontrar", termina no fim da própria seção.
    const end = next
      ? next.section.offsetTop
      : item.section.offsetTop + item.section.offsetHeight;

    if (y >= start && y < end) current = item;
  });

  sectionLinks.forEach(link => {
    const active = Boolean(current && link === current.link);
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
};

updateActiveSection();
window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);
