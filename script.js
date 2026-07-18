// --------- RECHERCHE INSTANTANEE ---------

// On recupere la barre de recherche.
const barreRecherche = document.querySelector(".recherche input");

// On recupere toutes les cartes de cours de la page.
const cartesCours = document.querySelectorAll(".chapitre-card");

// Cette partie s'execute seulement si la page contient une barre de recherche.
if (barreRecherche) {
    barreRecherche.addEventListener("input", function () {
        // On recupere ce que l'utilisateur tape.
        const texteRecherche = barreRecherche.value.toLowerCase();

        // On compte combien de cartes restent visibles.
        let nombreResultats = 0;

        cartesCours.forEach(function (carte) {
            // On recupere tout le texte de la carte.
            const texteCarte = carte.textContent.toLowerCase();

            // Si le texte de la carte contient ce que l'utilisateur cherche,
            // on affiche la carte. Sinon, on la cache.
            if (texteCarte.includes(texteRecherche)) {
                carte.style.display = "flex";
                nombreResultats++;
            } else {
                carte.style.display = "none";
            }
        });

        afficherMessageRecherche(nombreResultats);
    });
}

function afficherMessageRecherche(nombreResultats) {
    let message = document.querySelector(".message-recherche");

    if (!message) {
        message = document.createElement("p");
        message.className = "message-recherche";
        message.textContent = "Aucun cours trouve.";
        document.querySelector(".liste-cours").appendChild(message);
    }

    if (nombreResultats === 0) {
        message.style.display = "block";
    } else {
        message.style.display = "none";
    }
}

