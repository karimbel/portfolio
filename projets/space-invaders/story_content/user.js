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
  // --- Configuration du jeu (variables encapsulées) ---
let effetsSonoresStoryline = getVar("effetsSonores");
console.log("Effets sonores initiaux : " + effetsSonoresStoryline);
const jeu = {
    dimensions: {
        largeur: null,
        hauteur: null
    },
    ennemis: {
        vitesse: null,
        direction: 1,
        pasDescente: null,
        liste: [],
        intervalleTir: null,
        dernierTir: 0
    },
    joueur: {
        vitesse: 6,
        element: null,
        hauteur: 50,
        vies: 3,
        niveau: 1
    },
    balles: {
        vitesse: 12,
        liste: []
    },
    touches: {},
    sons: {
        effetsSonores: effetsSonoresStoryline,
        sonTir: false,
        sonExplosion: false,
        sonTouche: false
    }
};

// Fonction pour mettre à jour effetsSonores
function mettreAJourEffetsSonores() {
    try {
        effetsSonoresStoryline = getVar('effetsSonores') !== undefined ? getVar('effetsSonores') : true;
        jeu.sons.effetsSonores = effetsSonoresStoryline;
        console.log("Effets sonores mis à jour : jeu.sons.effetsSonores=" + jeu.sons.effetsSonores);
    } catch (e) {
        console.log("Erreur lors de la mise à jour de effetsSonores : " + e.message);
    }
}

// Nettoyage des écouteurs et éléments DOM
function cleanUp() {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    
    // Réinitialiser les ennemis
    const nombreRangees = getVar('nombreRangees') || 6;
    const nombreColonnes = getVar('nombreColonnes') || 10;
    const espacementX = jeu.dimensions.largeur ? jeu.dimensions.largeur / (nombreColonnes + 1) : 100;
    const espacementY = jeu.dimensions.hauteur ? Math.min(80, jeu.dimensions.hauteur / (nombreRangees + 10)) : 50;
    
    jeu.ennemis.liste.forEach((ennemi, index) => {
        if (ennemi && ennemi.parentNode) {
            gsap.killTweensOf(ennemi);
            gsap.set(ennemi, {
                x: espacementX * (index % nombreColonnes + 1) - 25,
                y: espacementY + espacementY * Math.floor(index / nombreColonnes),
                display: 'block'
            });
        }
    });
    jeu.ennemis.liste = [];
    
    // Supprimer les balles
    jeu.balles.liste.forEach(balle => {
        if (balle && balle.element && balle.element.parentNode) {
            gsap.killTweensOf(balle.element);
            balle.element.remove();
        }
    });
    jeu.balles.liste = [];
    
    jeu.touches = {};
    console.log("Nettoyage effectué : ennemis réinitialisés, balles supprimées");
}

// Fonction pour arrêter le jeu
function arreterJeu() {
    try {
        cleanUp();
        cancelAnimationFrame(boucleJeu);
        setVar('jeuTermine', true);
        setVar('sonTir', false);
        setVar('sonExplosion', false);
        setVar('sonTouche', false);
        console.log("Jeu arrêté : écouteurs supprimés, animations annulées, jeuTermine=true");
    } catch (e) {
        console.log("Erreur lors de l'arrêt du jeu : " + e.message);
    }
}

// Gestion des touches
function handleKeyDown(e) {
    jeu.touches[e.keyCode] = true;
    console.log("Touche enfoncée : " + e.keyCode);
}

function handleKeyUp(e) {
    jeu.touches[e.keyCode] = false;
    console.log("Touche relâchée : " + e.keyCode);
}

// Setup Niveau 1
function initJeuN1() {
    jeu.ennemis.vitesse = 3;
    jeu.ennemis.pasDescente = 20;
    jeu.ennemis.intervalleTir = 2000;
    jeu.joueur.vies = 3;
    jeu.joueur.niveau = 1;
    console.log("Niveau 1 initialisé : vitesse=" + jeu.ennemis.vitesse + ", intervalleTir=" + jeu.ennemis.intervalleTir + "ms");
    initNiveau();
}

// Setup Niveau 2
function initJeuN2() {
    jeu.ennemis.vitesse = 4.5;
    jeu.ennemis.pasDescente = 20;
    jeu.ennemis.intervalleTir = 2000;
    jeu.joueur.vies = 3;
    jeu.joueur.niveau = 2;
    console.log("Niveau 2 initialisé : vitesse=" + jeu.ennemis.vitesse + ", intervalleTir=" + jeu.ennemis.intervalleTir + "ms");
    initNiveau();
}

// Setup Niveau 3
function initJeuN3() {
    jeu.ennemis.vitesse = 4; // Augmenté de 3 à 4 pour plus de dynamisme
    jeu.ennemis.pasDescente = 20;
    jeu.ennemis.intervalleTir = 1200; // Réduit de 1500ms à 1200ms pour plus de tirs
    jeu.joueur.vies = 3;
    jeu.joueur.niveau = 3;
    console.log("Niveau 3 initialisé : vitesse=" + jeu.ennemis.vitesse + ", intervalleTir=" + jeu.ennemis.intervalleTir + "ms");
    initNiveau();
}

// Setup Niveau 4
function initJeuN4() {
    jeu.ennemis.vitesse = 3;
    jeu.ennemis.pasDescente = 30;
    jeu.ennemis.intervalleTir = 2000;
    jeu.joueur.vies = 3;
    jeu.joueur.niveau = 4;
    console.log("Niveau 4 initialisé : vitesse=" + jeu.ennemis.vitesse + ", intervalleTir=" + jeu.ennemis.intervalleTir + "ms");
    initNiveau();
}

// Setup Niveau 5
function initJeuN5() {
    jeu.ennemis.vitesse = 4;
    jeu.ennemis.pasDescente = 25;
    jeu.ennemis.intervalleTir = 1000;
    jeu.joueur.vies = 3;
    jeu.joueur.niveau = 5;
    console.log("Niveau 5 initialisé : vitesse=" + jeu.ennemis.vitesse + ", intervalleTir=" + jeu.ennemis.intervalleTir + "ms");
    initNiveau();
}

// Fonction pour recommencer le jeu
function recommencerJeu(vies, niveau) {
    try {
        jeu.joueur.vies = vies;
        jeu.joueur.niveau = niveau;
        setVar('vies', vies);
        setVar('niveau', niveau);
        setVar('jeuTermine', false);
        setVar('jeuPerdu', false);
        setVar('finJeu', false);
        setVar('ennemisRestants', 0);
        setVar('finNiveau1', false);
        setVar('finNiveau2', false);
        setVar('finNiveau3', false);
        setVar('finNiveau4', false);
        setVar('finNiveau5', false);
        setVar('sonTir', false);
        setVar('sonExplosion', false);
        setVar('sonTouche', false);
        console.log("Jeu réinitialisé avec vies=" + vies + ", niveau=" + niveau);
    } catch (e) {
        console.log("Erreur lors de la réinitialisation des variables Storyline : " + e.message);
    }
    switch (niveau) {
        case 1:
            initJeuN1();
            break;
        case 2:
            initJeuN2();
            break;
        case 3:
            initJeuN3();
            break;
        case 4:
            initJeuN4();
            break;
        case 5:
            initJeuN5();
            break;
        default:
            console.log("Erreur : Niveau non valide");
            initJeuN1();
            break;
    }
}

// Initialisation commune
function initNiveau() {
    console.log("Interface Storyline chargée");
    console.log("Niveau démarré à : " + new Date().toLocaleTimeString());
    
    // Mettre à jour effetsSonores
    mettreAJourEffetsSonores();
    
    // Réinitialiser les variables sonores
    jeu.sons.sonTir = false;
    jeu.sons.sonExplosion = false;
    jeu.sons.sonTouche = false;
    try {
        setVar('sonTir', false);
        setVar('sonExplosion', false);
        setVar('sonTouche', false);
        console.log("Variables sonores réinitialisées : sonTir=false, sonExplosion=false, sonTouche=false");
    } catch (e) {
        console.log("Erreur lors de la réinitialisation des variables sonores : " + e.message);
    }

    // Forcer la réinitialisation de jeuTermine
    try {
        setVar('jeuTermine', false);
        console.log("jeuTermine réinitialisé à false");
    } catch (e) {
        console.log("Erreur lors de la réinitialisation de jeuTermine : " + e.message);
    }

    cleanUp();

    if (typeof gsap === 'undefined') {
        console.log("Erreur : gsap n'est pas défini ! Vérifiez l'intégration dans Storyline.");
        return;
    }
    console.log("gsap chargé avec succès.");

    setTimeout(() => {
        const slideLayer = document.querySelector('.slide-layer');
        if (!slideLayer) {
            console.log("Erreur : Slide layer non trouvée.");
            return;
        }
        jeu.dimensions.largeur = slideLayer.offsetWidth;
        jeu.dimensions.hauteur = slideLayer.offsetHeight;
        console.log("Dimensions responsive : " + jeu.dimensions.largeur + "x" + jeu.dimensions.hauteur);

        jeu.joueur.element = document.querySelector('[data-acc-text="Joueur"]');
        if (!jeu.joueur.element || !jeu.joueur.element.parentNode) {
            console.log("Erreur : Élément 'Joueur' non trouvé ou non attaché au DOM.");
            return;
        }

        const nombreRangees = getVar('nombreRangees') || 6;
        const nombreColonnes = getVar('nombreColonnes') || 10;
        console.log("Grille dynamique : " + nombreRangees + " rangées x " + nombreColonnes + " colonnes.");

        try {
            setVar('ennemisRestants', nombreRangees * nombreColonnes);
            setVar('vies', jeu.joueur.vies);
            setVar('niveau', jeu.joueur.niveau);
        } catch (e) {
            console.log("Erreur lors de la définition de ennemisRestants, vies ou niveau : " + e.message);
        }

        const allElements = document.querySelectorAll('[data-acc-text]');
        console.log("Éléments avec data-acc-text : ", Array.from(allElements).map(el => el.getAttribute('data-acc-text')));

        jeu.ennemis.liste = [];
        let retryCount = 0;
        const maxRetries = 2;

        function chargerEnnemis() {
            for (let rangee = 1; rangee <= nombreRangees; rangee++) {
                for (let colonne = 1; colonne <= nombreColonnes; colonne++) {
                    const ennemi = document.querySelector('[data-acc-text="Ennemi_' + rangee + '_' + colonne + '"]');
                    if (ennemi && ennemi.parentNode) {
                        jeu.ennemis.liste.push(ennemi);
                        console.log("Ennemi chargé : Ennemi_" + rangee + "_" + colonne);
                    } else {
                        console.log("Avertissement : Ennemi_" + rangee + "_" + colonne + " non trouvé ou non attaché au DOM.");
                    }
                }
            }
            console.log("Nombre d'ennemis chargés : " + jeu.ennemis.liste.length);

            if (jeu.ennemis.liste.length < nombreRangees * nombreColonnes && retryCount < maxRetries) {
                retryCount++;
                console.log("Nombre insuffisant d'ennemis chargés (" + jeu.ennemis.liste.length + "/" + (nombreRangees * nombreColonnes) + "), nouvelle tentative (" + retryCount + "/" + maxRetries + ")");
                setTimeout(chargerEnnemis, 250);
                return;
            }

            if (jeu.ennemis.liste.length === 0) {
                console.log("Erreur : Aucun ennemi chargé après " + maxRetries + " tentatives. Vérifiez les noms 'Ennemi_X_Y' dans Storyline.");
                return;
            }

            jeu.ennemis.liste = jeu.ennemis.liste.filter(ennemi => ennemi && ennemi.parentNode);
            console.log("Ennemis après nettoyage : " + jeu.ennemis.liste.length);

            const espacementX = jeu.dimensions.largeur / (nombreColonnes + 1);
            const espacementY = Math.min(80, jeu.dimensions.hauteur / (nombreRangees + 10));
            for (let i = 0; i < jeu.ennemis.liste.length; i++) {
                const ennemi = jeu.ennemis.liste[i];
                if (!ennemi || !ennemi.parentNode) {
                    console.log("Erreur : Ennemi à l'index " + i + " est null ou non attaché au DOM.");
                    continue;
                }
                try {
                    gsap.killTweensOf(ennemi);
                    gsap.set(ennemi, {
                        x: espacementX * (i % nombreColonnes + 1) - 25,
                        y: espacementY + espacementY * Math.floor(i / nombreColonnes),
                        display: 'block'
                    });
                    console.log("Positionné ennemi " + i + " à x=" + (espacementX * (i % nombreColonnes + 1) - 25) + ", y=" + (espacementY + espacementY * Math.floor(i / nombreColonnes)));
                } catch (e) {
                    console.log("Erreur GSAP pour ennemi " + i + ": " + e.message);
                }
            }

            if (jeu.joueur.element && jeu.joueur.element.parentNode) {
                try {
                    gsap.killTweensOf(jeu.joueur.element);
                    gsap.set(jeu.joueur.element, {
                        x: jeu.dimensions.largeur / 2 - 25,
                        y: jeu.dimensions.hauteur - 50 - jeu.joueur.hauteur
                    });
                    console.log("Position initiale joueur : x=" + (jeu.dimensions.largeur / 2 - 25) + ", y=" + (jeu.dimensions.hauteur - 50 - jeu.joueur.hauteur));
                } catch (e) {
                    console.log("Erreur GSAP pour joueur : " + e.message);
                    return;
                }
            } else {
                console.log("Erreur : jeu.joueur.element est null ou non attaché au DOM.");
                return;
            }

            // Vérifier jeuTermine avant de démarrer la boucle
            try {
                console.log("Valeur de jeuTermine avant boucleJeu : " + getVar('jeuTermine'));
            } catch (e) {
                console.log("Erreur lors de la lecture de jeuTermine avant boucleJeu : " + e.message);
            }

            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);

            console.log("Démarrage de boucleJeu");
            boucleJeu();
        }

        chargerEnnemis();
    }, 250);
}

// Boucle de jeu
function boucleJeu() {
    try {
        if (getVar('jeuTermine')) {
            console.log("Boucle arrêtée : jeuTermine=true");
            return;
        }
    } catch (e) {
        console.log("Erreur lors de la lecture de jeuTermine : " + e.message);
        return;
    }

    gererEntrees();
    deplacerEnnemis();
    deplacerBalles();
    verifierCollisions();
    tirEnnemi();

    requestAnimationFrame(boucleJeu);
}

// Entrées clavier
function gererEntrees() {
    if (!jeu.joueur.element || !jeu.joueur.element.parentNode) {
        console.log("Erreur : jeu.joueur.element est null ou non attaché au DOM dans gererEntrees");
        return;
    }
    if (jeu.touches[37]) {
        let nouveauX = gsap.getProperty(jeu.joueur.element, 'x') - jeu.joueur.vitesse;
        if (nouveauX > 0) gsap.to(jeu.joueur.element, {x: nouveauX, duration: 0.05});
    }
    if (jeu.touches[39]) {
        let nouveauX = gsap.getProperty(jeu.joueur.element, 'x') + jeu.joueur.vitesse;
        if (nouveauX < jeu.dimensions.largeur - 50) gsap.to(jeu.joueur.element, {x: nouveauX, duration: 0.05});
    }
    if (jeu.touches[32] && !jeu.touches.espacePresse) {
        jeu.touches.espacePresse = true;
        tirerBalle(jeu.joueur.element, 1);
    }
    if (!jeu.touches[32]) jeu.touches.espacePresse = false;
}

// Déplacement ennemis
function deplacerEnnemis() {
    let bordAtteint = false;
    for (let i = 0; i < jeu.ennemis.liste.length; i++) {
        if (!jeu.ennemis.liste[i] || !jeu.ennemis.liste[i].parentNode || gsap.getProperty(jeu.ennemis.liste[i], 'display') === 'none') continue;
        const ennemiX = gsap.getProperty(jeu.ennemis.liste[i], 'x');
        const nouveauX = ennemiX + jeu.ennemis.vitesse * jeu.ennemis.direction;
        try {
            gsap.to(jeu.ennemis.liste[i], {x: nouveauX, duration: 0.05});
        } catch (e) {
            console.log("Erreur GSAP pour ennemi " + i + " dans deplacerEnnemis : " + e.message);
            continue;
        }

        if (nouveauX > jeu.dimensions.largeur - 50 || nouveauX < 0) bordAtteint = true;

        if (gsap.getProperty(jeu.ennemis.liste[i], 'y') > jeu.dimensions.hauteur - 100) {
            try {
                setVar('jeuTermine', true);
                setVar('finJeu', true);
                setVar('jeuPerdu', true);
                console.log("Niveau perdu : ennemi à hauteur max");
            } catch (e) {
                console.log("Erreur lors de la définition de jeuTermine/finJeu/jeuPerdu : " + e.message);
            }
        }
    }

    if (bordAtteint) {
        jeu.ennemis.direction *= -1;
        for (let i = 0; i < jeu.ennemis.liste.length; i++) {
            if (!jeu.ennemis.liste[i] || !jeu.ennemis.liste[i].parentNode || gsap.getProperty(jeu.ennemis.liste[i], 'display') === 'none') continue;
            const nouveauY = gsap.getProperty(jeu.ennemis.liste[i], 'y') + jeu.ennemis.pasDescente;
            try {
                gsap.to(jeu.ennemis.liste[i], {y: nouveauY, duration: 0.3});
            } catch (e) {
                console.log("Erreur GSAP pour ennemi " + i + " dans descente : " + e.message);
            }
        }
    }
}

// Tirer une balle
function tirerBalle(deElement, direction) {
    if (!deElement || !deElement.parentNode) {
        console.log("Erreur : deElement est null ou non attaché au DOM dans tirerBalle");
        return;
    }
    const modele = direction > 0 ? document.querySelector('[data-acc-text="modeleBalleJoueur"]') : document.querySelector('[data-acc-text="modeleBalleEnnemi"]');
    if (!modele || !modele.parentNode) {
        console.log("Erreur : Modèle de balle non trouvé ou non attaché au DOM.");
        return;
    }

    const balle = modele.cloneNode(true);
    balle.style.display = 'block';
    const slideLayer = document.querySelector('.slide-layer');
    if (!slideLayer) {
        console.log("Erreur : Slide layer non trouvée pour ajouter la balle.");
        return;
    }
    slideLayer.appendChild(balle);

    const deX = gsap.getProperty(deElement, 'x') + 25;
    const deY = gsap.getProperty(deElement, 'y') + (direction > 0 ? -10 : 50);
    try {
        gsap.set(balle, {x: deX, y: deY});
    } catch (e) {
        console.log("Erreur GSAP pour balle : " + e.message);
        balle.remove();
        return;
    }

    jeu.balles.liste.push({element: balle, direction: direction});

    if (direction > 0 && jeu.sons.effetsSonores) {
        try {
            setVar('sonTir', true);
            console.log("Tir déclenché : sonTir=true, effetsSonores=" + jeu.sons.effetsSonores);
        } catch (e) {
            console.log("Erreur lors de la définition de sonTir : " + e.message);
        }
    } else if (direction > 0) {
        console.log("Tir déclenché : sonTir=false (effetsSonores=false)");
    }
}

// Mouvement balles
function deplacerBalles() {
    for (let i = 0; i < jeu.balles.liste.length; i++) {
        const balle = jeu.balles.liste[i];
        if (!balle || !balle.element || !balle.element.parentNode) continue;
        const nouveauY = gsap.getProperty(balle.element, 'y') - jeu.balles.vitesse * balle.direction;
        try {
            gsap.to(balle.element, {y: nouveauY, duration: 0.05});
        } catch (e) {
            console.log("Erreur GSAP pour balle " + i + " dans deplacerBalles : " + e.message);
            continue;
        }

        if (nouveauY < -50 || nouveauY > jeu.dimensions.hauteur + 50) {
            balle.element.remove();
            jeu.balles.liste.splice(i, 1);
            i--;
        }
    }
}

// Tir ennemi aléatoire
function tirEnnemi() {
    const intervalleMin = 1000;
    if (Date.now() - jeu.ennemis.dernierTir > jeu.ennemis.intervalleTir && jeu.ennemis.liste.length > 0) {
        const ennemisVisibles = jeu.ennemis.liste.filter(ennemi => ennemi && ennemi.parentNode && gsap.getProperty(ennemi, 'display') !== 'none');
        if (ennemisVisibles.length > 0) {
            const ennemiAleatoire = ennemisVisibles[Math.floor(Math.random() * ennemisVisibles.length)];
            tirerBalle(ennemiAleatoire, -1);
            jeu.ennemis.dernierTir = Date.now();
            jeu.ennemis.intervalleTir = Math.max(jeu.ennemis.intervalleTir, intervalleMin);
            console.log("Tir ennemi déclenché, prochain tir dans : " + jeu.ennemis.intervalleTir + "ms");
        }
    }
}

// Détection collisions
function verifierCollisions() {
    for (let b = 0; b < jeu.balles.liste.length; b++) {
        const balle = jeu.balles.liste[b];
        if (!balle || !balle.element || !balle.element.parentNode) continue;
        const rectBalle = balle.element.getBoundingClientRect();

        if (balle.direction > 0) {
            for (let e = 0; e < jeu.ennemis.liste.length; e++) {
                const ennemi = jeu.ennemis.liste[e];
                if (!ennemi || !ennemi.parentNode || gsap.getProperty(ennemi, 'display') === 'none') continue;
                const rectEnnemi = ennemi.getBoundingClientRect();
                if (chevauchement(rectBalle, rectEnnemi)) {
                    if (jeu.sons.effetsSonores) {
                        try {
                            setVar('sonExplosion', true);
                            console.log("Collision ennemi : sonExplosion=true, effetsSonores=" + jeu.sons.effetsSonores);
                        } catch (e) {
                            console.log("Erreur lors de la définition de sonExplosion : " + e.message);
                        }
                    } else {
                        console.log("Collision ennemi : sonExplosion=false (effetsSonores=false)");
                    }
                    gsap.set(ennemi, { display: 'none' });
                    balle.element.remove();
                    jeu.balles.liste.splice(b, 1);
                    b--;
                    try {
                        const scoreActuel = getVar('scoreJeu') || 0;
                        setVar('scoreJeu', scoreActuel + 10);
                        const ennemisRestants = jeu.ennemis.liste.filter(e => e && e.parentNode && gsap.getProperty(e, 'display') !== 'none').length;
                        setVar('ennemisRestants', ennemisRestants);
                        console.log("Ennemis restants après collision : " + ennemisRestants);
                    } catch (e) {
                        console.log("Erreur lors de la gestion du score ou ennemisRestants : " + e.message);
                    }
                    break;
                }
            }
        } else {
            if (!jeu.joueur.element || !jeu.joueur.element.parentNode) continue;
            const rectJoueur = jeu.joueur.element.getBoundingClientRect();
            if (chevauchement(rectBalle, rectJoueur)) {
                if (jeu.sons.effetsSonores) {
                    try {
                        setVar('sonTouche', true);
                        console.log("Collision joueur : sonTouche=true, effetsSonores=" + jeu.sons.effetsSonores);
                    } catch (e) {
                        console.log("Erreur lors de la définition de sonTouche : " + e.message);
                    }
                } else {
                    console.log("Collision joueur : sonTouche=false (effetsSonores=false)");
                }
                balle.element.remove();
                jeu.balles.liste.splice(b, 1);
                b--;
                try {
                    jeu.joueur.vies -= 1;
                    setVar('vies', jeu.joueur.vies);
                    if (jeu.joueur.vies <= 0) {
                        setVar('jeuTermine', true);
                        setVar('finJeu', true);
                        setVar('jeuPerdu', true);
                        console.log("Niveau perdu : vies épuisées");
                    }
                } catch (e) {
                    console.log("Erreur lors de la gestion des vies : " + e.message);
                }
            }
        }
    }

    // Vérifier la victoire
    const ennemisVisibles = jeu.ennemis.liste.filter(ennemi => ennemi && ennemi.parentNode && gsap.getProperty(ennemi, 'display') !== 'none').length;
    console.log("Ennemis visibles : " + ennemisVisibles);
    if (ennemisVisibles === 0) {
        try {
            const niveauActuel = jeu.joueur.niveau;
            jeu.joueur.niveau = Math.min(niveauActuel + 1, 5);
            setVar('niveau', jeu.joueur.niveau);
            setVar('jeuTermine', true);
            setVar('finNiveau' + niveauActuel, true);
            console.log("Niveau gagné : finNiveau" + niveauActuel + ", nouveau niveau=" + jeu.joueur.niveau);
        } catch (e) {
            console.log("Erreur lors de la gestion de la victoire : " + e.message);
        }
    }
}

// Détection collision avec marge
function chevauchement(rect1, rect2) {
    const marge = 5;
    return !(rect1.right - marge < rect2.left + marge ||
             rect1.left + marge > rect2.right - marge ||
             rect1.bottom - marge < rect2.top + marge ||
             rect1.top + marge > rect2.bottom - marge);
}

// --- Rendre les fonctions globales pour Storyline ---
window.initJeuN1 = initJeuN1;
window.initJeuN2 = initJeuN2;
window.initJeuN3 = initJeuN3;
window.initJeuN4 = initJeuN4;
window.initJeuN5 = initJeuN5;
window.recommencerJeu = recommencerJeu;
window.mettreAJourEffetsSonores = mettreAJourEffetsSonores;
window.arreterJeu = arreterJeu;
}

window.Script2 = function()
{
  // Fonction globale pour animer les ennemis sur le calque niveauPerdu
function animateEnnemis(ennemi_danse_1, ennemi_danse_2, ennemi_danse_3) {
    // Vérifier que les objets existent
    if (!ennemi_danse_1 || !ennemi_danse_2 || !ennemi_danse_3) {
        console.log("Erreur : Un ou plusieurs ennemis (ennemi_danse_1, ennemi_danse_2, ennemi_danse_3) non fournis ou non trouvés.");
        return;
    }

    // Vérifier que GSAP est chargé
    if (typeof gsap === 'undefined') {
        console.log("Erreur : GSAP n'est pas défini ! Vérifiez l'intégration dans Storyline.");
        return;
    }

    // Fonction pour retourner une rotation aléatoire entre -5 et +5 degrés
    function obtenirRotationAleatoire() {
        return (Math.random() * 10) - 5; // Génère une valeur entre -5 et +5
    }

    // Créer une timeline GSAP pour l'animation de saut
    const tl = gsap.timeline({ repeat: -1 });

    // Animer ennemi_danse_1 : sauts simples avec rotation aléatoire
    tl.to(ennemi_danse_1, {
        duration: 0.3,
        y: "-=30",
        rotation: obtenirRotationAleatoire(),
        ease: "power2.out"
    }, 0)
    .to(ennemi_danse_1, {
        duration: 0.3,
        y: "+=30",
        rotation: 0,
        ease: "power2.in"
    }, 0.3);

    // Animer ennemi_danse_2 : sauts simples
    tl.to(ennemi_danse_2, {
        duration: 0.3,
        y: "-=40",
        ease: "power2.out"
    }, 0.15)
    .to(ennemi_danse_2, {
        duration: 0.3,
        y: "+=40",
        ease: "power2.in"
    }, 0.45);

    // Animer ennemi_danse_3 : sauts simples avec rotation aléatoire
    tl.to(ennemi_danse_3, {
        duration: 0.3,
        y: "-=35",
        rotation: obtenirRotationAleatoire(),
        ease: "power2.out"
    }, 0.3)
    .to(ennemi_danse_3, {
        duration: 0.3,
        y: "+=35",
        rotation: 0,
        ease: "power2.in"
    }, 0.6);

    console.log("Animation des ennemis déclenchée pour ennemi_danse_1, ennemi_danse_2, ennemi_danse_3");
}

// Rendre la fonction globale
window.animateEnnemis = animateEnnemis;
}

window.Script3 = function()
{
  //initialisation du niveau 1
initJeuN1();
}

window.Script4 = function()
{
  const ennemi_danse_1 = object('60pUH10N2Jc');
const ennemi_danse_2 = object('6ETnVBbqJXR');
const ennemi_danse_3 = object('66jrXd9NFLM');

animateEnnemis(ennemi_danse_1, ennemi_danse_2, ennemi_danse_3);
}

window.Script5 = function()
{
  recommencerJeu(3, 1);
}

window.Script6 = function()
{
  //initialisation du niveau 2
initJeuN2();
}

window.Script7 = function()
{
  const ennemi_danse_1 = object('6rV0UpdhbDm');
const ennemi_danse_2 = object('6RY8t1jylaK');
const ennemi_danse_3 = object('6NUHG6CdLdZ');


animateEnnemis(ennemi_danse_1, ennemi_danse_2, ennemi_danse_3);
}

window.Script8 = function()
{
  recommencerJeu(3, 2);
}

window.Script9 = function()
{
  //initialisation du niveau 3
initJeuN3();
}

window.Script10 = function()
{
  const ennemi_danse_1 = object('6DcjP9DzVj3');
const ennemi_danse_2 = object('5rkRKN6wMwG');
const ennemi_danse_3 = object('5uCWks4JXSd');

animateEnnemis(ennemi_danse_1, ennemi_danse_2, ennemi_danse_3);
}

window.Script11 = function()
{
  recommencerJeu(3, 3);
}

window.Script12 = function()
{
  //initialisation du niveau 4
initJeuN4();
}

window.Script13 = function()
{
  const ennemi_danse_1 = object('6d82fAEAp5e');
const ennemi_danse_2 = object('5aPpoy06HNx');
const ennemi_danse_3 = object('6S9SMmiH8td');

animateEnnemis(ennemi_danse_1, ennemi_danse_2, ennemi_danse_3);
}

window.Script14 = function()
{
  recommencerJeu(3, 4);
}

window.Script15 = function()
{
  //initialisation du niveau 5
initJeuN5();
}

window.Script16 = function()
{
  const ennemi_danse_1 = object('5sTulwxSW8j');
const ennemi_danse_2 = object('6PPfamO7NCM');
const ennemi_danse_3 = object('5jTGJY3T8x9');

animateEnnemis(ennemi_danse_1, ennemi_danse_2, ennemi_danse_3);
}

window.Script17 = function()
{
  recommencerJeu(3, 5);
}

};
