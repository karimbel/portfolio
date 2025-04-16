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
  /* 
Contexte : Simulateur d'exposition - réalisation avec Storyline 360 et Grok
Version : 1.0
Historique du code : création (14/04/2025)
- Script exécuté au démarrage de la diapositive (début de la chronologie)
- Initialisation statique des valeurs par défaut pour les curseurs
- Initialisation de cursorLuminance et varCursEnvLuminance pour la luminance
- Initialisation de varNiveauExpoLV pour l’indice de luminance cible
- Initialisation de varExpoIndice pour l’indice d’exposition
- Initialisation du flou sur imgScene à f/11 (indice 13)
*/

//console.log("Script de démarrage démarré");

var player = GetPlayer();

// --- Définir les valeurs par défaut pour Distance, Focale et Luminance ---
var cursLuminance = "Ensoleillé";
var cursDistance = "3";
var cursFocale = 18;

// Initialiser Distance et Focale (pas de dépendance avec l'IL)
player.SetVar("varTxtDistance", cursDistance);
player.SetVar("varTxtFocale", cursFocale);

// Initialiser les curseurs et variables de luminance (statiquement)
player.SetVar("cursorLuminance", 2); // Indice 2 : ensoleillé
player.SetVar("varCursEnvLuminance", 2); // Indice 2 : ensoleillé
player.SetVar("varTxtLuminance", cursLuminance); // Texte : "Ensoleillé"
player.SetVar("varNiveauExpoLV", 11); // IL cible pour ensoleillé

// Positionner les curseurs (ISO, Ouverture, Vitesse) avec des valeurs statiques pour IL 11
// ISO 100
player.SetVar("varCursExpoIso", 0);
player.SetVar("varTxtParamIso", "100");
// Ouverture f/11
player.SetVar("varCursExpoOuverture", 6);
player.SetVar("varTxtParamOuverture", "11");
// Vitesse 1/15
player.SetVar("varCursExpoVitesse", 4);
player.SetVar("varTxtParamVitesse", "1/15");

// Initialiser l’indice d’exposition à 0 (exposition correcte au démarrage)
player.SetVar("varExpoIndice", 0);
//console.log("varExpoIndice initialisée à : " + player.GetVar("varExpoIndice"));

// --- Initialisation statique au démarrage ---
setTimeout(function() {
    // Initialisation du flou sur imgScene
    const imageScene = document.querySelector("[data-acc-text='zoomScene']");
    if (!imageScene) {
        console.log("Erreur : 'zoomScene' non trouvé lors de l'initialisation !");
    } else if (typeof gsap === 'undefined') {
        console.log("Erreur : GSAP n'est pas chargé lors de l'initialisation !");
    } else {
        gsap.set(imageScene, {
            opacity: 1,
            display: "block",
            transformOrigin: "center center"
        });
        gsap.set(imageScene, {
            filter: "blur(1px) contrast(1)"
        });
        //console.log("Initialisation de imgScene - Flou: 1px, Contraste: 1");
        const rectScene = imageScene.getBoundingClientRect();
        //console.log("Position initiale de imageScene - x: " + rectScene.left + ", y: " + rectScene.top);
    }

    //console.log("Script de démarrage terminé");
}, 100);
}

window.Script2 = function()
{
  console.log("Script Luminosité démarré");

var player = GetPlayer();

try {
    let newExpoIndice = player.GetVar("varExpoIndice");
    console.log(`Ajustement luminosité - ExpoIndice: ${newExpoIndice}`);

    if (typeof gsap === "undefined") {
        console.warn("GSAP non chargé, luminosité non ajustée");
        return;
    }

    let brightnessValue = 1 + (newExpoIndice / 3);
    let elements = [
        document.querySelector("[data-acc-text='zoomScene']"),
        document.querySelector("[data-acc-text='zoomPersonnages']"),

    ].filter(Boolean);

    if (elements.length === 0) {
        console.warn("Aucune image trouvée pour l'animation");
        return;
    }

    gsap.to(elements, {
        duration: 0.3,
        filter: `brightness(${brightnessValue})`,
        ease: "power2.out",
        onStart: () => elements.forEach(el => el.style.visibility = "visible"),
    });
    console.log(`Luminosité ajustée à ${brightnessValue}`);
} catch (error) {
    console.error("Erreur dans le script Luminosité :", error);
}

console.log("Script Luminosité terminé");
}

window.Script3 = function()
{
  console.log("Script Ouverture (Mode Av/A) démarré");

var player = GetPlayer();
let isProcessing = false;

const isoValues = [100, 200, 400, 800, 1600, 3200, 6400];
const apertureValues = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const shutterValues = [1, 2, 4, 8, 15, 30, 60, 125, 250, 500, 1000, 2000, 4000];

function shutterSpeedString(value) {
    return shutterValues[value] <= 4 ? (1 / shutterValues[value]).toFixed(2) + '"' : `1/${shutterValues[value]}`;
}

try {
    // --- Vérification initiale ---
    let newApertureIndex = player.GetVar("varCursExpoOuverture");
    let lastApertureIndex = player.GetVar("lastApertureIndex") || -1;

    if (isProcessing || newApertureIndex === lastApertureIndex) {
        console.log(`Exécution ignorée : isProcessing=${isProcessing}, newApertureIndex=${newApertureIndex}, lastApertureIndex=${lastApertureIndex}`);
        return;
    }

    isProcessing = true;
    console.log(`Changement Ouverture détecté : ${apertureValues[lastApertureIndex] || 'inconnu'} -> ${apertureValues[newApertureIndex]}`);

    // --- Définir les valeurs de base ---
    let luminanceIndex = player.GetVar("varCursEnvLuminance");
    let baseISOIndex, baseApertureIndex, baseShutterIndex;
    if (luminanceIndex === 2) {
        baseISOIndex = 0; baseApertureIndex = 6; baseShutterIndex = 4;
    } else if (luminanceIndex === 1) {
        baseISOIndex = 0; baseApertureIndex = 4; baseShutterIndex = 1;
    } else if (luminanceIndex === 0) {
        baseISOIndex = 0; baseApertureIndex = 0; baseShutterIndex = 1;
    } else {
        console.warn("Luminance inconnue, valeur par défaut (IL 7)");
        baseISOIndex = 0; baseApertureIndex = 4; baseShutterIndex = 1;
    }

    // --- Mettre à jour l'ouverture ---
    player.SetVar("varTxtParamOuverture", apertureValues[newApertureIndex]);

    // --- Ajuster les curseurs ---
    function adjustSlidersToBalanceExposure() {
        let apertureStopChange = newApertureIndex - baseApertureIndex;
        console.log(`Changement Ouverture : ${apertureStopChange} stop(s)`);

        let newShutterIndex = baseShutterIndex - apertureStopChange;
        newShutterIndex = Math.max(0, Math.min(12, newShutterIndex));

        player.SetVar("varCursExpoVitesse", newShutterIndex);
        player.SetVar("varTxtParamVitesse", shutterSpeedString(newShutterIndex));

        let newExpoIndice = apertureStopChange * (1/3);
        newExpoIndice = Math.max(-3, Math.min(3, newExpoIndice));
        player.SetVar("varExpoIndice", newExpoIndice);

        console.log(`Ajustement - ISO: ${isoValues[baseISOIndex]}, Ouverture: f/${apertureValues[newApertureIndex]}, Vitesse: ${shutterSpeedString(newShutterIndex)}, ExpoIndice: ${newExpoIndice}`);
    }

    // --- Exécution ---
    adjustSlidersToBalanceExposure();
    player.SetVar("lastApertureIndex", newApertureIndex);
} catch (error) {
    console.error("Erreur dans le script Ouverture :", error);
} finally {
    isProcessing = false;
    console.log("Script Ouverture (Mode Av/A) terminé");
}
}

window.Script4 = function()
{
  console.log("Script Vitesse (Mode Tv/S) démarré");

var player = GetPlayer();
let isProcessing = false;

const isoValues = [100, 200, 400, 800, 1600, 3200, 6400];
const apertureValues = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const shutterValues = [1, 2, 4, 8, 15, 30, 60, 125, 250, 500, 1000, 2000, 4000];

function shutterSpeedString(value) {
    return shutterValues[value] <= 4 ? (1 / shutterValues[value]).toFixed(2) + '"' : `1/${shutterValues[value]}`;
}

try {
    // --- Vérification initiale ---
    let newShutterIndex = player.GetVar("varCursExpoVitesse");
    let lastShutterIndex = player.GetVar("lastShutterIndex") || -1;

    if (isProcessing || newShutterIndex === lastShutterIndex) {
        console.log(`Exécution ignorée : isProcessing=${isProcessing}, newShutterIndex=${newShutterIndex}, lastShutterIndex=${lastShutterIndex}`);
        return;
    }

    isProcessing = true;
    console.log(`Changement Vitesse détecté : ${shutterSpeedString(lastShutterIndex) || 'inconnu'} -> ${shutterSpeedString(newShutterIndex)}`);

    // --- Définir les valeurs de base ---
    let luminanceIndex = player.GetVar("varCursEnvLuminance");
    let baseISOIndex, baseApertureIndex, baseShutterIndex;
    if (luminanceIndex === 2) {
        baseISOIndex = 0; baseApertureIndex = 6; baseShutterIndex = 4;
    } else if (luminanceIndex === 1) {
        baseISOIndex = 0; baseApertureIndex = 4; baseShutterIndex = 1;
    } else if (luminanceIndex === 0) {
        baseISOIndex = 0; baseApertureIndex = 0; baseShutterIndex = 1;
    } else {
        console.warn("Luminance inconnue, valeur par défaut (IL 7)");
        baseISOIndex = 0; baseApertureIndex = 4; baseShutterIndex = 1;
    }

    // --- Mettre à jour la vitesse ---
    player.SetVar("varTxtParamVitesse", shutterSpeedString(newShutterIndex));

    // --- Ajuster les curseurs ---
    function adjustSlidersToBalanceExposure() {
        let shutterStopChange = newShutterIndex - baseShutterIndex;
        console.log(`Changement Vitesse : ${shutterStopChange} stop(s)`);

        let newApertureIndex = baseApertureIndex - shutterStopChange;
        newApertureIndex = Math.max(0, Math.min(8, newApertureIndex));

        player.SetVar("varCursExpoOuverture", newApertureIndex);
        player.SetVar("varTxtParamOuverture", apertureValues[newApertureIndex]);

        let newExpoIndice = shutterStopChange * (1/3);
        newExpoIndice = Math.max(-3, Math.min(3, newExpoIndice));
        player.SetVar("varExpoIndice", newExpoIndice);

        console.log(`Ajustement - ISO: ${isoValues[baseISOIndex]}, Ouverture: f/${apertureValues[newApertureIndex]}, Vitesse: ${shutterSpeedString(newShutterIndex)}, ExpoIndice: ${newExpoIndice}`);
    }

    // --- Exécution ---
    adjustSlidersToBalanceExposure();
    player.SetVar("lastShutterIndex", newShutterIndex);
} catch (error) {
    console.error("Erreur dans le script Vitesse :", error);
} finally {
    isProcessing = false;
    console.log("Script Vitesse (Mode Tv/S) terminé");
}
}

window.Script5 = function()
{
  console.log("Script ISO (Mode P) démarré");

var player = GetPlayer();
let isProcessing = false;

const isoValues = [100, 200, 400, 800, 1600, 3200, 6400];
const apertureValues = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const shutterValues = [1, 2, 4, 8, 15, 30, 60, 125, 250, 500, 1000, 2000, 4000];

function shutterSpeedString(value) {
    return shutterValues[value] <= 4 ? (1 / shutterValues[value]).toFixed(2) + '"' : `1/${shutterValues[value]}`;
}

try {
    // --- Vérification initiale ---
    let newISOIndex = player.GetVar("varCursExpoIso");
    let lastISOIndex = player.GetVar("lastISOIndex") || -1;

    if (isProcessing || newISOIndex === lastISOIndex) {
        console.log(`Exécution ignorée : isProcessing=${isProcessing}, newISOIndex=${newISOIndex}, lastISOIndex=${lastISOIndex}`);
        return;
    }

    isProcessing = true;
    console.log(`Changement ISO détecté : ${isoValues[lastISOIndex] || 'inconnu'} -> ${isoValues[newISOIndex]}`);

    // --- Définir les valeurs de base ---
    let luminanceIndex = player.GetVar("varCursEnvLuminance");
    let baseISOIndex, baseApertureIndex, baseShutterIndex;
    if (luminanceIndex === 2) {
        baseISOIndex = 0; baseApertureIndex = 6; baseShutterIndex = 4;
    } else if (luminanceIndex === 1) {
        baseISOIndex = 0; baseApertureIndex = 4; baseShutterIndex = 1;
    } else if (luminanceIndex === 0) {
        baseISOIndex = 0; baseApertureIndex = 0; baseShutterIndex = 1;
    } else {
        console.warn("Luminance inconnue, valeur par défaut (IL 7)");
        baseISOIndex = 0; baseApertureIndex = 4; baseShutterIndex = 1;
    }

    // --- Mettre à jour l'ISO ---
    player.SetVar("varTxtParamIso", isoValues[newISOIndex]);

    // --- Ajuster les curseurs ---
    function adjustSlidersToBalanceExposure() {
        let isoStopChange = newISOIndex - baseISOIndex;
        console.log(`Changement ISO : ${isoStopChange} stop(s)`);

        // Répartir le changement entre ouverture et vitesse
        let apertureStopChange = Math.round(isoStopChange / 2); // Moitié pour l'ouverture
        let shutterStopChange = isoStopChange - apertureStopChange; // Reste pour la vitesse

        let newApertureIndex = baseApertureIndex - apertureStopChange;
        let newShutterIndex = baseShutterIndex - shutterStopChange;

        // Ajuster si hors limites
        if (newShutterIndex < 0 || newShutterIndex > 12) {
            let excess = newShutterIndex < 0 ? newShutterIndex : newShutterIndex - 12;
            newApertureIndex -= excess; // Transférer l'excès à l'ouverture
            newShutterIndex = Math.max(0, Math.min(12, newShutterIndex));
        } else if (newApertureIndex < 0 || newApertureIndex > 8) {
            let excess = newApertureIndex < 0 ? newApertureIndex : newApertureIndex - 8;
            newShutterIndex -= excess; // Transférer l'excès à la vitesse
            newApertureIndex = Math.max(0, Math.min(8, newApertureIndex));
        }

        // Assurer que les indices restent dans les bornes
        newApertureIndex = Math.max(0, Math.min(8, newApertureIndex));
        newShutterIndex = Math.max(0, Math.min(12, newShutterIndex));

        // Mettre à jour les variables Storyline
        player.SetVar("varCursExpoOuverture", newApertureIndex);
        player.SetVar("varTxtParamOuverture", apertureValues[newApertureIndex]);
        player.SetVar("varCursExpoVitesse", newShutterIndex);
        player.SetVar("varTxtParamVitesse", shutterSpeedString(newShutterIndex));

        let newExpoIndice = isoStopChange * (1/3);
        newExpoIndice = Math.max(-3, Math.min(3, newExpoIndice));
        player.SetVar("varExpoIndice", newExpoIndice);

        console.log(`Ajustement - ISO: ${isoValues[newISOIndex]}, Ouverture: f/${apertureValues[newApertureIndex]}, Vitesse: ${shutterSpeedString(newShutterIndex)}, ExpoIndice: ${newExpoIndice}`);
    }

    // --- Exécution ---
    adjustSlidersToBalanceExposure();
    player.SetVar("lastISOIndex", newISOIndex);
} catch (error) {
    console.error("Erreur dans le script ISO :", error);
} finally {
    isProcessing = false;
    console.log("Script ISO (Mode P) terminé");
}
}

window.Script6 = function()
{
  // Récupérer le player Storyline
var player = GetPlayer();

// Récupérer la valeur du curseur (assumant que la variable Storyline s'appelle "cursFocale")
var cursFocale = player.GetVar("varCursEnvFocale");

// Tableau contenant les valeurs de 18 à 55 (39 étapes)
var focaleValues = [
    18, 24, 35, 55
];

// L'index du curseur va de 0 à 38 (39 étapes)
// On utilise cette valeur comme index pour récupérer la valeur correspondante dans le tableau
var focale = focaleValues[cursFocale];

// Envoyer la valeur au player dans une variable Storyline (par exemple "ExposureResult")
player.SetVar("varTxtFocale", focale);


/*******************
 * Focale - Zoom *
 *******************/

console.log("Script varCursEnvFocale démarré");

// Récupérer la valeur du curseur focale
var focalIndex = player.GetVar("varCursEnvFocale");
console.log("Index brut focale : " + focalIndex);

// Validation pour focale (plage 0 à 3)
if (focalIndex === undefined || focalIndex === null || focalIndex < 0 || focalIndex > 3) {
    focalIndex = 0;
    console.log("focalIndex corrigé à : " + focalIndex);
}
console.log("focalIndex validé : " + focalIndex);

// Ajouter un délai pour le DOM
setTimeout(function() {
    // Cibler les objets
    const imageScene = document.querySelector("[data-acc-text='zoomScene']");
    const imagePersonnages = document.querySelector("[data-acc-text='zoomPersonnages']");

    // Vérifier les objets
    if (!imageScene || !imagePersonnages) {
        console.log("Erreur : zoomScene ou zoomPersonnages non trouvé !");
        return;
    }

    // Vérifier GSAP
    if (typeof gsap === 'undefined') {
        console.log("Erreur : GSAP non chargé !");
        return;
    }

    // État stable
    gsap.set([imageScene, imagePersonnages], {
        opacity: 1,
        display: "block",
        transformOrigin: "center center"
    });

    // Échelle pour imgScene
    let sceneScale;
    switch (focalIndex) {
        case 0:
            sceneScale = 1;
            break;
        case 1:
            sceneScale = 1.1;
            break;
        case 2:
            sceneScale = 1.3;
            break;
        case 3:
            sceneScale = 1.5;
            break;
        default:
            sceneScale = 1;
    }

    // Échelle pour imgPersonnages (basé sur varCursEnvDistance)
    let persoScale;
    switch (focalIndex) {
        case 0:
            persoScale = 1;
            break;
        case 1:
            persoScale = 1.25;
            break;
        case 2:
            persoScale = 1.5;
            break;
        case 3:
            // Vérifier varCursEnvDistance pour ajuster au dézoom
            let distanceIndex = player.GetVar("varCursEnvDistance");
            if (distanceIndex === undefined || distanceIndex === null || distanceIndex < 0 || distanceIndex > 2) {
                distanceIndex = 2;
            }
            if (distanceIndex === 0) {
                persoScale = 1.8; // Réduit légèrement pour CD = 0, CF = 3
            } else if (distanceIndex === 1) {
                persoScale = 1.4; // Réduit légèrement pour CD = 1, CF = 3
            } else {
                persoScale = 2; // Standard pour CF = 3
            }
            break;
        default:
            persoScale = 1;
    }

    console.log("Échelle Scene : " + sceneScale);
    console.log("Échelle Personnages : " + persoScale);

    // Animation GSAP
    gsap.killTweensOf([imageScene, imagePersonnages]);
    gsap.to(imageScene, {
        scale: sceneScale,
        duration: 0.5,
        ease: "power1.inOut"
    });
    gsap.to(imagePersonnages, {
        scale: persoScale,
        duration: 0.5,
        ease: "power1.inOut"
    });
    console.log("Animation appliquée - Scene: " + sceneScale + ", Personnages: " + persoScale);
}, 100);


}

window.Script7 = function()
{
  // Récupérer le player Storyline
var player = GetPlayer();

// Récupérer la valeur du curseur et mettre 0 si vide/undefined
var cursDistance = player.GetVar("varCursEnvDistance");
if (cursDistance === undefined || cursDistance === null || cursDistance === "") {
    cursDistance = 2;
}

// Tableau contenant les valeurs de 1 à 3 par incréments de 1 (3 étapes)
var exposureValues = [
    "1", "2", "3"
];

// Récupérer la valeur correspondante à l'index du curseur
var distance = exposureValues[cursDistance];

// Envoyer la valeur au player
player.SetVar("varTxtDistance", distance);



/*******************
 * Distance - Zoom *
 *******************/

// Récupérer les valeurs actuelles des curseurs
var zoomStep = player.GetVar("varCursEnvDistance");
var indexOuverture = player.GetVar("varCursExpoOuverture");
console.log("Valeur de varCursEnvDistance (zoomStep) : " + zoomStep);
console.log("Index brut ouverture : " + indexOuverture);

// Validation pour distance (plage 0 à 2)
if (zoomStep === undefined || zoomStep === null || zoomStep < 0 || zoomStep > 2) {
    zoomStep = 2; // Distance 3m par défaut
}

// Validation pour ouverture (plage 0 à 18)
if (indexOuverture === undefined || indexOuverture === null || indexOuverture < 0 || indexOuverture > 18) {
    indexOuverture = 7; // Index 7 par défaut (f/11)
}

// Ajouter un léger délai pour garantir le chargement du DOM
setTimeout(function() {
    // Cibler les objets via leurs noms d'accessibilité
    const imageScene = document.querySelector("[data-acc-text='zoomScene']");
    const imagePersonnages = document.querySelector("[data-acc-text='zoomPersonnages']");

    // Vérifier si les objets sont trouvés
    if (!imageScene) {
        console.log("Erreur : 'zoomScene' non trouvé !");
        return;
    }
    if (!imagePersonnages) {
        console.log("Erreur : 'zoomPersonnages' non trouvé !");
        return;
    }

    // Vérifier si GSAP est chargé
    if (typeof gsap === 'undefined') {
        console.log("Erreur : GSAP n'est pas chargé !");
        return;
    }

    // Logger l'état initial pour diagnostiquer le zoom
    const sceneOpacity = imageScene.style.opacity || "non défini";
    const sceneDisplay = imageScene.style.display || "non défini";
    const persoOpacity = imagePersonnages.style.opacity || "non défini";
    const persoDisplay = imagePersonnages.style.display || "non défini";
    const currentScale = imagePersonnages.style.transform ? imagePersonnages.style.transform.match(/scale\(([^)]+)\)/)?.[1] || "non défini" : "non défini";
    const rectScene = imageScene.getBoundingClientRect();
    const rectPerso = imagePersonnages.getBoundingClientRect();
    console.log("État initial de imageScene - Opacité: " + sceneOpacity + ", Display: " + sceneDisplay + ", x: " + rectScene.left + ", y: " + rectScene.top);
    console.log("État initial de imagePersonnages - Opacité: " + persoOpacity + ", Display: " + persoDisplay + ", Scale: " + currentScale + ", x: " + rectPerso.left + ", y: " + rectPerso.top);

    // Forcer un état initial stable (sans réinitialiser scale)
    gsap.set([imageScene, imagePersonnages], {
        opacity: 1,
        display: "block"
    });
    gsap.set(imageScene, { filter: "blur(1px) contrast(1)" });
    gsap.set(imagePersonnages, { transformOrigin: "center center" });

    // Définir l'échelle pour imgPersonnages
    let scaleValue;
    switch (zoomStep) {
        case 0: // Distance 1m
            scaleValue = 2; // Zoom maximal
            break;
        case 1: // Distance 2m
            scaleValue = 1.5; // Zoom intermédiaire
            break;
        case 2: // Distance 3m (par défaut)
            scaleValue = 1; // Pas de zoom
            break;
        default:
            scaleValue = 1;
    }

    // Définir le flou ou la netteté pour imgScene en fonction de l'ouverture
    let blurValue, contrastValue;
    const standardIndices = [0, 1, 2, 3, 4, 5, 6, 9]; // Indices pour f/1.4 à f/22
    if (standardIndices.includes(indexOuverture)) {
        switch (indexOuverture) {
            case 0: // f/1.2
                blurValue = 2;
                contrastValue = 1;
                break;
            case 1: // f/2
                blurValue = 1.8;
                contrastValue = 1;
                break;
            case 2: // f/2.8
                blurValue = 1.6;
                contrastValue = 1;
                break;
            case 3: // f/4
                blurValue = 1.2;
                contrastValue = 1;
                break;
            case 4: // f/5.6
                blurValue = 1.1;
                contrastValue = 1;
                break;
            case 5: // f/8
                blurValue = 1;
                contrastValue = 1;
                break;
            case 6: // f/11 (par défaut)
                blurValue = 0;
                contrastValue = 1;
                break;
            case 7: // f/16
                blurValue = 0;
                contrastValue = 1.05;
                break;
            case 8: // f/22
                blurValue = 0;
                contrastValue = 1.1;
                break;
        }

        console.log("Flou Scene : " + blurValue + ", Contraste Scene : " + contrastValue);

        // Animation GSAP pour imageScene et imagePersonnages
        gsap.killTweensOf([imageScene, imagePersonnages]);

        // Appliquer le zoom sur imagePersonnages
        gsap.to(imagePersonnages, {
            scale: scaleValue,
            duration: 0.5,
            ease: "power1.inOut",
            onComplete: function() {
                const rectPerso = imagePersonnages.getBoundingClientRect();
                console.log("Position finale de imagePersonnages - x: " + rectPerso.left + ", y: " + rectPerso.top);
            }
        });

        // Appliquer le flou ou la netteté sur imageScene
        gsap.to(imageScene, {
            filter: `blur(${blurValue}px) contrast(${contrastValue})`,
            opacity: 1,
            duration: 0.5,
            ease: "power1.inOut",
            onComplete: function() {
                const rectScene = imageScene.getBoundingClientRect();
                console.log("Position finale de imageScene - x: " + rectScene.left + ", y: " + rectScene.top);
            }
        });
        console.log("Animation GSAP appliquée - Échelle Personnages: " + scaleValue + ", Flou Scene: " + blurValue + ", Contraste Scene: " + contrastValue);
    } else {
        // Indices non standards : Appliquer uniquement le zoom sur imagePersonnages
        console.log("Indice non standard (" + indexOuverture + "), aucun changement de filtre appliqué sur imageScene");
        gsap.killTweensOf(imagePersonnages);
        gsap.to(imagePersonnages, {
            scale: scaleValue,
            duration: 0.5,
            ease: "power1.inOut",
            onComplete: function() {
                const rectPerso = imagePersonnages.getBoundingClientRect();
                console.log("Position finale de imagePersonnages - x: " + rectPerso.left + ", y: " + rectPerso.top);
            }
        });
        console.log("Animation GSAP appliquée - Échelle Personnages: " + scaleValue + ", Flou Scene: inchangé");
    }
}, 50);
}

window.Script8 = function()
{
  /* 
Contexte : Simulateur d'exposition - réalisation avec Storyline 360 et Grok
Version : 1.0
Historique du code : création (14/04/2025)
- Script exécuté lors du changement du curseur de luminance (varCursEnvLuminance)
- Met à jour varTxtLuminance, varNiveauExpoLV, et les curseurs ISO, ouverture, vitesse avec des valeurs statiques
- Réinitialise varExpoIndice à 0 pour une exposition correcte
*/

console.log("Script de gestion du curseur de luminance démarré");

var player = GetPlayer();

// --- Définir les valeurs statiques pour la luminance ---
const luminanceValues = ["orageux", "nuageux", "ensoleillé"];
const luminanceILValues = [3, 7, 11]; // IL pour chaque luminance

// --- Récupérer la nouvelle valeur du curseur de luminance ---
let newLuminanceIndex = player.GetVar("varCursEnvLuminance"); // 0, 1, ou 2
console.log("Nouvel indice de luminance : " + newLuminanceIndex);

// --- Mettre à jour les variables de luminance ---
player.SetVar("varTxtLuminance", luminanceValues[newLuminanceIndex]);
player.SetVar("varNiveauExpoLV", luminanceILValues[newLuminanceIndex]);
console.log("Après mise à jour de la luminance - varTxtLuminance: " + player.GetVar("varTxtLuminance") + ", varNiveauExpoLV: " + player.GetVar("varNiveauExpoLV"));

// --- Ajuster les curseurs avec des valeurs statiques ---
function adjustSlidersForLuminance() {
    if (newLuminanceIndex === 2) { // IL 11 (ensoleillé)
        // ISO 100
        player.SetVar("varCursExpoIso", 0);
        player.SetVar("varTxtParamIso", "100");
        // Ouverture f/11
        player.SetVar("varCursExpoOuverture", 6);
        player.SetVar("varTxtParamOuverture", "11");
        // Vitesse 1/15
        player.SetVar("varCursExpoVitesse", 4);
        player.SetVar("varTxtParamVitesse", "1/15");
    } else if (newLuminanceIndex === 1) { // IL 7 (nuageux)
        // ISO 100
        player.SetVar("varCursExpoIso", 0);
        player.SetVar("varTxtParamIso", "100");
        // Ouverture f/5.6
        player.SetVar("varCursExpoOuverture", 4);
        player.SetVar("varTxtParamOuverture", "5.6");
        // Vitesse 0.5" (1/2 seconde)
        player.SetVar("varCursExpoVitesse", 1);
        player.SetVar("varTxtParamVitesse", "0.5\"");
    } else if (newLuminanceIndex === 0) { // IL 3 (orageux)
        // ISO 100
        player.SetVar("varCursExpoIso", 0);
        player.SetVar("varTxtParamIso", "100");
        // Ouverture f/1.4
        player.SetVar("varCursExpoOuverture", 0);
        player.SetVar("varTxtParamOuverture", "1.4");
        // Vitesse 0.5" (1/2 seconde)
        player.SetVar("varCursExpoVitesse", 1);
        player.SetVar("varTxtParamVitesse", "0.5\"");
    } else {
        console.log("Erreur : Indice de luminance " + newLuminanceIndex + " non pris en charge !");
        return;
    }

    console.log("Curseurs mis à jour - ISO: " + player.GetVar("varTxtParamIso") + ", Ouverture: " + player.GetVar("varTxtParamOuverture") + ", Vitesse: " + player.GetVar("varTxtParamVitesse"));

    // Réinitialiser l’indice d’exposition à 0 (exposition correcte pour ces valeurs)
    player.SetVar("varExpoIndice", 0);
    console.log("varExpoIndice réinitialisée à : " + player.GetVar("varExpoIndice"));
}

// --- Exécuter l’ajustement ---
adjustSlidersForLuminance();

console.log("Script de gestion du curseur de luminance terminé");
}

window.Script9 = function()
{
  var player = GetPlayer();

try {
	
    // Récupérer varExpoIndice avec valeur par défaut 0
    const expoIndice = player.GetVar("varExpoIndice") || 0;
    
    
    
    
    // Effet Luminosité
    let newExpoIndice = expoIndice;
    console.log(`Ajustement luminosité - ExpoIndice: ${newExpoIndice}`);

    if (typeof gsap === "undefined") {
        console.warn("GSAP non chargé, luminosité non ajustée");
        return;
    }

    let brightnessValue = 1 + (newExpoIndice / 3);
    let elements = [
        document.querySelector("[data-acc-text='imageFinale']"),
    ].filter(Boolean);

    if (elements.length === 0) {
        console.warn("Aucune image trouvée pour l'animation");
        return;
    }

    gsap.to(elements, {
        duration: 0.3,
        filter: `brightness(${brightnessValue})`,
        ease: "power2.out",
        onStart: () => elements.forEach(el => el.style.visibility = "visible"),
    });
    console.log(`Luminosité ajustée à ${brightnessValue}`);
    
    
    
    
    
	// Définir le texte selon les plages d'exposition
	const statusTextExpo = 
		expoIndice === -2 ? "Image fortement sous-exposée, très sombre, détails dans les ombres perdus. Conseils : augmentez l'ISO (ex. de 100 à 400), ouvrez l'ouverture (ex. de f/8 à f/4), ou ralentissez la vitesse (ex. de 1/500s à 1/125s)." :
	    expoIndice >= -1.99 && expoIndice <= -1.51 ? "Image nettement sous-exposée, sombre, avec des ombres denses. Conseils : passez à un ISO plus élevé (ex. de 200 à 800), utilisez une ouverture plus large (ex. de f/5.6 à f/2.8), ou prolongez la vitesse (ex. de 1/250s à 1/60s)." :
	    expoIndice >= -1.50 && expoIndice <= -1.1 ? "Image sous-exposée, plus sombre que la normale, détails dans les ombres réduits. Conseils : augmentez légèrement l'ISO (ex. de 100 à 200), ouvrez un peu l'ouverture (ex. de f/8 à f/5.6), ou ralentissez la vitesse (ex. de 1/500s à 1/250s)." :
	    expoIndice === -1 ? "Image légèrement sous-exposée, un peu sombre, mais détails encore visibles. Conseils : essayez un ISO un peu plus élevé (ex. de 100 à 200), une ouverture légèrement plus grande (ex. de f/5.6 à f/4), ou une vitesse plus lente (ex. de 1/250s à 1/125s)." :
	    expoIndice >= -0.99 && expoIndice <= -0.51 ? "Image subtilement sous-exposée, légèrement plus sombre, exposition presque correcte. Conseils : ajustez finement l'ISO (ex. de 100 à 150), ouvrez légèrement l'ouverture (ex. de f/5.6 à f/4.5), ou ralentissez un peu la vitesse (ex. de 1/250s à 1/200s)." :
	    expoIndice >= -0.50 && expoIndice <= -0.1 ? "Image à peine sous-exposée, très proche de l'exposition correcte. Conseils : un léger réglage suffit, comme augmenter l'ISO de 100 à 125, ouvrir de f/5.6 à f/5, ou passer de 1/250s à 1/200s." :
	    expoIndice === 0 ? "Exposition correcte, image équilibrée avec des tons naturels. Conseils : maintenez ces paramètres ou ajustez légèrement l'ISO, l'ouverture, ou la vitesse pour un effet créatif (ex. ISO 100, f/5.6, 1/250s)." :
	    expoIndice >= 0.1 && expoIndice <= 0.50 ? "Image à peine surexposée, très légèrement plus claire. Conseils : un léger réglage suffit, comme réduire l'ISO de 200 à 100, fermer de f/5 à f/5.6, ou passer de 1/200s à 1/250s." :
	    expoIndice >= 0.51 && expoIndice <= 0.99 ? "Image subtilement surexposée, un peu plus claire, presque correcte. Conseils : diminuez légèrement l'ISO (ex. de 200 à 150), fermez un peu l'ouverture (ex. de f/4.5 à f/5.6), ou accélérez la vitesse (ex. de 1/200s à 1/250s)." :
	    expoIndice === 1 ? "Image légèrement surexposée, plus claire, détails dans les hautes lumières réduits. Conseils : réduisez l'ISO (ex. de 200 à 100), fermez l'ouverture (ex. de f/4 à f/5.6), ou augmentez la vitesse (ex. de 1/125s à 1/250s)." :
	    expoIndice >= 1.1 && expoIndice <= 1.50 ? "Image surexposée, plus lumineuse, perte de détails dans les zones claires. Conseils : baissez l'ISO (ex. de 400 à 200), utilisez une ouverture plus petite (ex. de f/4 à f/8), ou accélérez la vitesse (ex. de 1/60s à 1/250s)." :
	    expoIndice >= 1.51 && expoIndice <= 1.99 ? "Image nettement surexposée, très lumineuse, hautes lumières écrasées. Conseils : réduisez fortement l'ISO (ex. de 800 à 200), fermez l'ouverture (ex. de f/2.8 à f/8), ou passez à une vitesse rapide (ex. de 1/60s à 1/500s)." :
	    expoIndice === 2 ? "Image fortement surexposée, très claire, détails dans les hautes lumières perdus. Conseils : diminuez l'ISO au minimum (ex. de 800 à 100), fermez au maximum l'ouverture (ex. de f/2.8 à f/11), ou utilisez une vitesse très rapide (ex. de 1/60s à 1/1000s)." :
	    "Valeur d'exposition hors plage. Conseils : vérifiez vos paramètres ISO, ouverture, et vitesse, et ajustez vers ISO 100, f/5.6, 1/250s pour un point de départ neutre.";

    // Mettre à jour la variable Storyline
    player.SetVar("varTxtExpoStatus", statusTextExpo);
    console.log(`Statut exposition : ${statusTextExpo} (varExpoIndice=${expoIndice})`);
    
    
    
	// Récupérer varLuminance avec valeur par défaut 0
	const luminance = parseInt(player.GetVar("varCursEnvLuminance")) || 0;
	
	// Définir le texte selon les conditions de luminance
	const statusTextLuminance = 
	    luminance === 0 ? "Condition orageuse, lumière très faible, ambiance sombre et contrastes élevés." :
	    luminance === 1 ? "Condition nuageuse, lumière diffuse, tons doux et détails équilibrés." :
	    luminance === 2 ? "Condition ensoleillée, lumière vive, couleurs éclatantes et ombres marquées." :
	    "Condition de luminance inconnue";
	    
    // Mettre à jour la variable Storyline
    player.SetVar("varTxtLuminanceStatus", statusTextLuminance);
    console.log(`Statut exposition : ${statusTextLuminance} (varCursEnvLuminance=${luminance})`);


} catch (error) {
    console.error("Erreur script exposition :", error.message);
    console.error("Erreur dans le script Luminosité :", error);
}
}

};
