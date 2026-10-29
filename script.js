// 1. Thème clair / sombre (mémorisé dans le navigateur)
const racine = document.documentElement;
const boutonTheme = document.getElementById('theme');

function themeActuel() {
  return racine.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
function appliquerTheme(theme) {
  racine.dataset.theme = theme;
  boutonTheme.textContent = theme === 'dark' ? 'Thème clair' : 'Thème sombre';
}
try {
  const sauvegarde = localStorage.getItem('theme');
  if (sauvegarde) racine.dataset.theme = sauvegarde;
} catch (e) { /* stockage indisponible : on garde le thème de l'appareil */ }
appliquerTheme(themeActuel());

boutonTheme.addEventListener('click', () => {
  const suivant = themeActuel() === 'dark' ? 'light' : 'dark';
  appliquerTheme(suivant);
  try { localStorage.setItem('theme', suivant); } catch (e) {}
});

// 2. Filtre des projets par catégorie
const filtres = document.querySelectorAll('.filter');
const projets = document.querySelectorAll('.project');
const compteur = document.getElementById('count');

function filtrer(categorie) {
  let visibles = 0;
  projets.forEach(p => {
    const afficher = categorie === 'all' || p.dataset.cat.split(' ').includes(categorie);
    p.hidden = !afficher;
    if (afficher) visibles++;
  });
  filtres.forEach(f => {
    const actif = f.dataset.filter === categorie;
    f.classList.toggle('is-active', actif);
    f.setAttribute('aria-pressed', actif);
  });
  compteur.textContent = visibles + (visibles > 1 ? ' projets affichés' : ' projet affiché');
}
filtres.forEach(f => f.addEventListener('click', () => filtrer(f.dataset.filter)));
filtrer('all');

// 3. Le lien du menu suit la section visible
const liens = document.querySelectorAll('.side nav a');
const observateur = new IntersectionObserver(entrees => {
  entrees.forEach(e => {
    if (e.isIntersecting) {
      liens.forEach(l => l.classList.toggle('is-current', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => observateur.observe(s));

// 4. Copier l'adresse e-mail
const boutonCopie = document.getElementById('copy');
const message = document.getElementById('copied');
boutonCopie.addEventListener('click', async () => {
  const adresse = 'amoldkalash@gmail.com';
  try {
    await navigator.clipboard.writeText(adresse);
    message.textContent = 'Adresse copiée.';
  } catch (e) {
    message.textContent = 'Copie impossible, l\'adresse est : ' + adresse;
  }
  setTimeout(() => { message.textContent = ''; }, 3000);
});
