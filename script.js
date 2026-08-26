const XLEARN_PROFILE_KEY = 'xlearn.profile';
const XLEARN_FAVORITES_KEY = 'xlearn.favorites';

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFavorites() {
    const favorites = readStorage(XLEARN_FAVORITES_KEY, []);
    return Array.isArray(favorites) ? favorites : [];
}

function setMessage(form, message, isError = false) {
    const messageElement = form.querySelector('.form-message');
    if (!messageElement) return;
    messageElement.textContent = message;
    messageElement.style.color = isError ? '#ffb4b4' : '';
}

function initSearch() {
    const champRecherche = document.querySelector('.recherche input');
    const cartesChapitres = document.querySelectorAll('.chapitre-card');
    if (!champRecherche || !cartesChapitres.length) return;

    champRecherche.addEventListener('input', () => {
        const texteTape = champRecherche.value.toLowerCase().trim();
        cartesChapitres.forEach((carte) => {
            const titreChapitre = carte.querySelector('h3');
            const texteTitre = titreChapitre ? titreChapitre.textContent.toLowerCase() : '';
            carte.style.display = texteTitre.includes(texteTape) ? 'flex' : 'none';
        });
    });
}

function initFavorites() {
    document.querySelectorAll('.chapitre-card').forEach((card) => {
        const title = card.querySelector('h3')?.textContent.trim();
        const courseLink = card.querySelector('.chapitre-actions a');
        if (!title || !courseLink) return;

        const favorite = {
            id: `${location.pathname}:${title}`,
            title,
            subject: document.querySelector('.titre')?.textContent.trim() || 'Cours',
            href: courseLink.getAttribute('href')
        };
        const button = document.createElement('button');
        button.className = 'favori-btn';
        button.type = 'button';

        function updateButton() {
            const isFavorite = getFavorites().some((item) => item.id === favorite.id);
            button.classList.toggle('is-favori', isFavorite);
            button.setAttribute('aria-pressed', String(isFavorite));
            button.innerHTML = isFavorite ? '<i class="fa-solid fa-heart"></i> Favori' : '<i class="fa-regular fa-heart"></i> Favori';
        }

        button.addEventListener('click', () => {
            const favorites = getFavorites();
            const position = favorites.findIndex((item) => item.id === favorite.id);
            if (position === -1) favorites.push(favorite);
            else favorites.splice(position, 1);
            writeStorage(XLEARN_FAVORITES_KEY, favorites);
            updateButton();
        });

        updateButton();
        card.append(button);
    });
}

function initFavoritesOverview() {
    if (!document.querySelector('#cours')) return;
    const section = document.createElement('section');
    section.id = 'favoris';
    section.innerHTML = '<h1 class="section-title">Mes favoris</h1><div class="favoris-liste"></div>';
    const list = section.querySelector('.favoris-liste');
    const favorites = getFavorites();

    if (!favorites.length) {
        list.innerHTML = '<p class="favoris-vides">Ajoutez un cours aux favoris depuis une page de matière.</p>';
    } else {
        favorites.forEach((favorite) => {
            const item = document.createElement('article');
            item.className = 'favori-item';
            const link = document.createElement('a');
            link.href = favorite.href;
            link.textContent = favorite.title;
            const subject = document.createElement('p');
            subject.textContent = favorite.subject;
            item.append(link, subject);
            list.append(item);
        });
    }
    document.querySelector('#cours').after(section);
}

function initProfileForms() {
    const registrationForm = document.querySelector('[data-form="inscription"]');
    registrationForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(registrationForm);
        const password = formData.get('password');
        if (password !== formData.get('passwordConfirm')) {
            setMessage(registrationForm, 'Les mots de passe ne correspondent pas.', true);
            return;
        }

        writeStorage(XLEARN_PROFILE_KEY, {
            username: String(formData.get('username')).trim(),
            email: String(formData.get('email')).trim(),
            password
        });
        setMessage(registrationForm, 'Profil créé. Redirection vers la connexion...');
        setTimeout(() => { location.href = 'page_de_connexion.html'; }, 700);
    });

    const loginForm = document.querySelector('[data-form="connexion"]');
    loginForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const profile = readStorage(XLEARN_PROFILE_KEY, null);
        const formData = new FormData(loginForm);
        if (!profile) {
            setMessage(loginForm, 'Créez d’abord un profil local.', true);
            return;
        }
        if (profile.username !== String(formData.get('username')).trim() || profile.password !== formData.get('password')) {
            setMessage(loginForm, 'Nom d’utilisateur ou mot de passe incorrect.', true);
            return;
        }
        sessionStorage.setItem('xlearn.session', profile.username);
        setMessage(loginForm, `Bienvenue ${profile.username} !`);
        setTimeout(() => { location.href = 'main.html'; }, 500);
    });
}

function initProfileIndicator() {
    const profile = readStorage(XLEARN_PROFILE_KEY, null);
    const profileLink = document.querySelector('.profile-icon');
    if (!profile || !profileLink) return;
    profileLink.title = `Profil local : ${profile.username}`;
    profileLink.setAttribute('aria-label', profileLink.title);
}

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initFavorites();
    initFavoritesOverview();
    initProfileForms();
    initProfileIndicator();
});
