window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  // --- Initialisation des objets ---
console.log("Script JavaScript exécuté : jeuTermine devrait être true par défaut");

// Récupérer les objets avec la méthode object() en utilisant les ID fournis
const zoneJeu = object('63nHnt7avy0'); // Zone de jeu
const raquetteJoueur1 = object('65tIam9uAsd'); // Raquette joueur 1 (gauche, humain)
const raquetteJoueur2 = object('5vJNZQ44TyG'); // Raquette joueur 2 (droite, IA)
const balle = object('6ZSPs0zJ02g'); // Balle

// Vérifier si les objets sont correctement récupérés
if (!zoneJeu) console.log("Erreur : zoneJeu non trouvé (ID: 6f8L76dkODW)");
if (!raquetteJoueur1) console.log("Erreur : raquetteJoueur1 non trouvé (ID: 65tIam9uAsd)");
if (!raquetteJoueur2) console.log("Erreur : raquetteJoueur2 non trouvé (ID: 5vJNZQ44TyG)");
if (!balle) console.log("Erreur : balle non trouvée (ID: 6ZSPs0zJ02g)");
console.log("Objets récupérés :", { zoneJeu, raquetteJoueur1, raquetteJoueur2, balle });

// --- Initialisation du joueur Storyline ---
var player = GetPlayer();
if (!player) console.log("Erreur : GetPlayer() n'a pas retourné d'interface Storyline");
else console.log("Interface Storyline (player) chargée");

// --- Dimensions du terrain ---
var largeurTerrain = 960; // Largeur du terrain (px)
var hauteurTerrain = 540; // Hauteur du terrain (px)
console.log("Dimensions terrain :", { largeurTerrain, hauteurTerrain });

// --- Récupérer les variables dynamiques depuis Storyline ---
var positionXBalle = player.GetVar("positionXBalle") || 470;
var positionYBalle = player.GetVar("positionYBalle") || 260;
var vitesseXBalle = player.GetVar("vitesseXBalle") || 5;
var vitesseYBalle = player.GetVar("vitesseYBalle") || 5;
var positionYJoueur1 = player.GetVar("positionYJoueur1") || 220;
var positionYJoueur2 = player.GetVar("positionYJoueur2") || 220;
var cibleY = player.GetVar("cibleY") || 260;
var scoreJoueur1 = player.GetVar("scoreJoueur1") || 0;
var scoreJoueur2 = player.GetVar("scoreJoueur2") || 0;
var niveauDifficulte = player.GetVar("niveauDifficulte") || 2;
var scoreFinal = player.GetVar("scoreFinal") || 5;
var jeuTermine = player.GetVar("jeuTermine") || true;
var jeuAlerteFin = player.GetVar("jeuAlerteFin") || false;
var vitesseRaquette = player.GetVar("vitesseRaquette") || 5;
var jouerBalleMur = player.GetVar("jouerBalleMur") || false;
var jouerBalleRaquette = player.GetVar("jouerBalleRaquette") || false;
var activeEffetsSonores = player.GetVar("activeEffetsSonores") || false;

// Vérifier si les variables Storyline sont récupérées
console.log("Variables Storyline chargées :", {
    positionXBalle, positionYBalle, vitesseXBalle, vitesseYBalle,
    positionYJoueur1, positionYJoueur2, cibleY,
    scoreJoueur1, scoreJoueur2, niveauDifficulte, scoreFinal, jeuTermine, jeuAlerteFin,
    vitesseRaquette, jouerBalleMur, jouerBalleRaquette, activeEffetsSonores
});

// --- Définir le facteur de lissage pour l'IA selon la difficulté ---
var facteurLissage;
switch (niveauDifficulte) {
    case 1: facteurLissage = 0.05; break;
    case 2: facteurLissage = 0.1; break;
    case 3: facteurLissage = 0.2; break;
    default: facteurLissage = 0.1;
}
console.log("Niveau difficulté :", niveauDifficulte, "Facteur lissage IA :", facteurLissage);

// --- Positionner les éléments initialement avec GSAP ---
try {
    gsap.set(balle, { x: positionXBalle, y: positionYBalle });
    gsap.set(raquetteJoueur1, { x: 15, y: positionYJoueur1 });
    gsap.set(raquetteJoueur2, { x: 930, y: positionYJoueur2 });
    console.log("Éléments positionnés avec GSAP");
} catch (e) {
    console.log("Erreur GSAP lors du positionnement initial :", e);
}

// --- Gestion des touches clavier pour le joueur 1 ---
var touches = {};
document.addEventListener("keydown", function (event) {
    touches[event.key] = true;
    console.log("Touche pressée :", event.key);
});
document.addEventListener("keyup", function (event) {
    touches[event.key] = false;
    console.log("Touche relâchée :", event.key);
});

// --- Ajout : Gestion des événements tactiles pour mobile/tablette ---
var isTouchDevice = 'ontouchstart' in window; // Détection pour logs optionnels
document.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Empêche zoom/scroll
    console.log("Touchstart détecté"); // Pour vérifier si l'événement se déclenche
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const zoneJeuElement = document.querySelector('[data-model-id="63nHnt7avy0"]'); // Élément DOM réel via data-model-id
    if (!zoneJeuElement) {
        console.log("Erreur : zoneJeuElement non trouvé via data-model-id");
        return;
    }
    const rect = zoneJeuElement.getBoundingClientRect();
    console.log("Rect calculé :", rect); // Vérifie les dimensions scalées

    const scaleX = rect.width / largeurTerrain;
    const scaleY = rect.height / hauteurTerrain;

    const relativeX = (touch.clientX - rect.left) / scaleX;
    if (relativeX < largeurTerrain / 2) {
        const relativeY = (touch.clientY - rect.top) / scaleY;
        positionYJoueur1 = Math.max(0, Math.min(relativeY - 50, hauteurTerrain - 100));
        gsap.set(raquetteJoueur1, { y: positionYJoueur1 });
        player.SetVar("positionYJoueur1", positionYJoueur1);
        console.log("Raquette joueur 1 déplacée tactile à y =", positionYJoueur1); // Active pour débogage
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    e.preventDefault();
    console.log("Touchend détecté");
}, { passive: false });

// --- Déplacer la raquette du joueur 1 (humain, touches clavier) ---
function deplacerRaquetteJoueur1() {
    if (jeuTermine) return; // Arrêter si jeu en pause/terminé

    if (touches["ArrowUp"] && positionYJoueur1 > 0) {
        positionYJoueur1 -= vitesseRaquette;
    }
    if (touches["ArrowDown"] && positionYJoueur1 < hauteurTerrain - 100) {
        positionYJoueur1 += vitesseRaquette;
    }

    try {
        gsap.set(raquetteJoueur1, { y: positionYJoueur1 });
        player.SetVar("positionYJoueur1", positionYJoueur1);
        console.log("Raquette joueur 1 déplacée à y =", positionYJoueur1);
    } catch (e) {
        console.log("Erreur GSAP ou SetVar pour raquetteJoueur1 :", e);
    }

    if (scoreJoueur1 >= scoreFinal || scoreJoueur2 >= scoreFinal) {
        player.SetVar("jeuTermine", true);
        player.SetVar("jeuAlerteFin", true);
        console.log("Jeu terminé : scoreJoueur1 =", scoreJoueur1, "scoreJoueur2 =", scoreJoueur2);
        return;
    }

    gsap.delayedCall(0.016, deplacerRaquetteJoueur1);
}

// --- Contrôle de la raquette du joueur 2 (IA) ---
function deplacerRaquetteJoueur2() {
    if (jeuTermine) return; // Arrêter si jeu en pause/terminé

    cibleY = positionYBalle - 50;
    positionYJoueur2 += (cibleY - positionYJoueur2) * facteurLissage;
    positionYJoueur2 = Math.max(0, Math.min(positionYJoueur2, hauteurTerrain - 100));

    try {
        gsap.set(raquetteJoueur2, { y: positionYJoueur2 });
        player.SetVar("positionYJoueur2", positionYJoueur2);
        player.SetVar("cibleY", cibleY);
        console.log("Raquette joueur 2 (IA) déplacée à y =", positionYJoueur2, "cibleY =", cibleY);
    } catch (e) {
        console.log("Erreur GSAP ou SetVar pour raquetteJoueur2 :", e);
    }

    if (scoreJoueur1 >= scoreFinal || scoreJoueur2 >= scoreFinal) {
        player.SetVar("jeuTermine", true);
        player.SetVar("jeuAlerteFin", true);
        console.log("Jeu terminé : scoreJoueur1 =", scoreJoueur1, "scoreJoueur2 =", scoreJoueur2);
        return;
    }

    gsap.delayedCall(0.016, deplacerRaquetteJoueur2);
}

// --- Boucle de jeu pour la balle ---
function deplacerBalle() {
    if (jeuTermine) return; // Arrêter si jeu en pause/terminé

    positionXBalle += vitesseXBalle;
    positionYBalle += vitesseYBalle;

    if (positionYBalle <= 0 || positionYBalle >= hauteurTerrain - 20) {
        vitesseYBalle = -vitesseYBalle;
        player.SetVar("vitesseYBalle", vitesseYBalle);
        console.log("Rebond bord vertical, vitesseYBalle =", vitesseYBalle);
        if (activeEffetsSonores == true) {
        	player.SetVar("jouerBalleMur", true);
        } else {
        	player.SetVar("jouerBalleMur", false);
        }

    }

    try {
        if (positionXBalle <= 30 && positionXBalle >= 10 && positionYBalle >= positionYJoueur1 && positionYBalle <= positionYJoueur1 + 100) {
            vitesseXBalle = -vitesseXBalle;
            player.SetVar("vitesseXBalle", vitesseXBalle);
            console.log("Rebond raquette joueur 1, positionXBalle =", positionXBalle, "positionYJoueur1 =", positionYJoueur1);
        	if (activeEffetsSonores == true) { 
        		player.SetVar("jouerBalleRaquette", true);
        	} else {
        		player.SetVar("jouerBalleRaquette", false);
        	}
        }

        if (positionXBalle >= 925 && positionXBalle <= 945 && positionYBalle >= positionYJoueur2 && positionYBalle <= positionYJoueur2 + 100) {
            vitesseXBalle = -vitesseXBalle;
            player.SetVar("vitesseXBalle", vitesseXBalle);
            console.log("Rebond raquette joueur 2, positionXBalle =", positionXBalle, "positionYJoueur2 =", positionYJoueur2);
        	if (activeEffetsSonores == true) { 
        		player.SetVar("jouerBalleRaquette", true);
        	} else {
        		player.SetVar("jouerBalleRaquette", false);
        	}
        }
    } catch (e) {
        console.log("Erreur lors de la détection de collision :", e);
    }

    if (positionXBalle <= 0) {
        scoreJoueur2++;
        player.SetVar("scoreJoueur2", scoreJoueur2);
        console.log("Point pour joueur 2, scoreJoueur2 =", scoreJoueur2);
        if (scoreJoueur2 >= scoreFinal) {
            player.SetVar("jeuTermine", true);
            player.SetVar("jeuAlerteFin", true);
            console.log("Jeu terminé : joueur 2 gagne !");
            return;
        } else {
            reinitialiserBalle();
        }
    } else if (positionXBalle >= largeurTerrain - 20) {
        scoreJoueur1++;
        player.SetVar("scoreJoueur1", scoreJoueur1);
        console.log("Point pour joueur 1, scoreJoueur1 =", scoreJoueur1);
        if (scoreJoueur1 >= scoreFinal) {
            player.SetVar("jeuTermine", true);
            player.SetVar("jeuAlerteFin", true);
            console.log("Jeu terminé : joueur 1 gagne !");
            return;
        } else {
            reinitialiserBalle();
        }
    }

    try {
        gsap.set(balle, { x: positionXBalle, y: positionYBalle });
        player.SetVar("positionXBalle", positionXBalle);
        player.SetVar("positionYBalle", positionYBalle);
        console.log("Balle déplacée à x =", positionXBalle, "y =", positionYBalle);
    } catch (e) {
        console.log("Erreur GSAP ou SetVar pour balle :", e);
    }

    gsap.delayedCall(0.016, deplacerBalle);
}

// --- Réinitialiser la balle au centre ---
function reinitialiserBalle() {
    positionXBalle = 470;
    positionYBalle = 260;
    vitesseXBalle = 5 * (Math.random() > 0.5 ? 1 : -1);
    vitesseYBalle = 5 * (Math.random() > 0.5 ? 1 : -1);
    cibleY = 260;
    player.SetVar("positionXBalle", positionXBalle);
    player.SetVar("positionYBalle", positionYBalle);
    player.SetVar("vitesseXBalle", vitesseXBalle);
    player.SetVar("vitesseYBalle", vitesseYBalle);
    player.SetVar("cibleY", cibleY);
    console.log("Balle réinitialisée :", { positionXBalle, positionYBalle, vitesseXBalle, vitesseYBalle, cibleY });
}

// --- Fonction de réinitialisation du jeu ---
function reinitialiserJeu() {
    console.log("Réinitialisation du jeu déclenchée");

    positionXBalle = 470;
    positionYBalle = 260;
    vitesseXBalle = 5 * (Math.random() > 0.5 ? 1 : -1);
    vitesseYBalle = 5 * (Math.random() > 0.5 ? 1 : -1);
    positionYJoueur1 = 220;
    positionYJoueur2 = 220;
    cibleY = 260;
    scoreJoueur1 = 0;
    scoreJoueur2 = 0;
    jeuTermine = true;
    jeuAlerteFin = false;
    scoreFinal = 5;
    niveauDifficulte = 2;
    vitesseRaquette = 5;

    // Mettre à jour le facteur de lissage si la difficulté change
    switch (niveauDifficulte) {
        case 1: facteurLissage = 0.05; break;
        case 2: facteurLissage = 0.1; break;
        case 3: facteurLissage = 0.2; break;
        default: facteurLissage = 0.1;
    }
    console.log("Niveau difficulté réinitialisé :", niveauDifficulte, "Facteur lissage IA :", facteurLissage);

    try {
        player.SetVar("positionXBalle", positionXBalle);
        player.SetVar("positionYBalle", positionYBalle);
        player.SetVar("vitesseXBalle", vitesseXBalle);
        player.SetVar("vitesseYBalle", vitesseYBalle);
        player.SetVar("positionYJoueur1", positionYJoueur1);
        player.SetVar("positionYJoueur2", positionYJoueur2);
        player.SetVar("cibleY", cibleY);
        player.SetVar("scoreJoueur1", scoreJoueur1);
        player.SetVar("scoreJoueur2", scoreJoueur2);
        player.SetVar("jeuTermine", jeuTermine);
        player.SetVar("jeuAlerteFin", jeuAlerteFin);
        player.SetVar("scoreFinal", scoreFinal);
        player.SetVar("niveauDifficulte", niveauDifficulte);
        player.SetVar("vitesseRaquette", vitesseRaquette);
        player.SetVar("jouerBalleRaquette", false);
        player.SetVar("jouerBalleMur", false);
        player.SetVar("activeEffetsSonores", false);
        console.log("Variables Storyline réinitialisées :", {
            positionXBalle, positionYBalle, vitesseXBalle, vitesseYBalle,
            positionYJoueur1, positionYJoueur2, cibleY,
            scoreJoueur1, scoreJoueur2, jeuTermine, jeuAlerteFin,
            scoreFinal, niveauDifficulte, vitesseRaquette, jouerBalleRaquette, 
            jouerBalleMur, activeEffetsSonores
        });
    } catch (e) {
        console.log("Erreur lors de la mise à jour des variables Storyline :", e);
    }

    try {
        gsap.set(balle, { x: positionXBalle, y: positionYBalle });
        gsap.set(raquetteJoueur1, { x: 15, y: positionYJoueur1 });
        gsap.set(raquetteJoueur2, { x: 930, y: positionYJoueur2 });
        console.log("Éléments repositionnés avec GSAP");
    } catch (e) {
        console.log("Erreur GSAP lors de la réinitialisation :", e);
    }
}

// --- Fonction pour démarrer le jeu (globale) ---
function demarrerJeu() {
    // Recharger les variables de configuration depuis Storyline au démarrage
    scoreFinal = player.GetVar("scoreFinal") || 5;
    niveauDifficulte = player.GetVar("niveauDifficulte") || 2;
    vitesseRaquette = player.GetVar("vitesseRaquette") || 5;
    jouerBalleMur = player.GetVar("jouerBalleMur") || false;
    jouerBalleRaquette = player.GetVar("jouerBalleRaquette") || false;
    activeEffetsSonores = player.GetVar("activeEffetsSonores") || false;

    // Recalculer le facteur de lissage basé sur la difficulté actuelle
    switch (niveauDifficulte) {
        case 1: facteurLissage = 0.05; break;
        case 2: facteurLissage = 0.1; break;
        case 3: facteurLissage = 0.2; break;
        default: facteurLissage = 0.1;
    }
    console.log("Variables de configuration rechargées au démarrage :", {
        scoreFinal, niveauDifficulte, vitesseRaquette, facteurLissage
    });

    jeuTermine = false;
    player.SetVar("jeuTermine", false);
    player.SetVar("jeuAlerteFin", false);

    console.log("Jeu démarré : jeuTermine = false");
    deplacerBalle();
    deplacerRaquetteJoueur1();
    deplacerRaquetteJoueur2();
}

// --- Vérifier l'état initial ---
if (!jeuTermine) {
    demarrerJeu();
} else {
    console.log("Jeu en pause au démarrage : jeuTermine = true");
}

// --- Rendre les fonctions globales ---
window.reinitialiserJeu = reinitialiserJeu;
window.demarrerJeu = demarrerJeu;
}

window.Script2 = function()
{
  reinitialiserJeu();
}

window.Script3 = function()
{
  demarrerJeu();
}

};
