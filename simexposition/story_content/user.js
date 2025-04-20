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
  var player = GetPlayer();

// --- Définir les valeurs par défaut pour Distance, Focale et Luminance ---
var cursLuminance = "Ensoleillé";
var choixLuminance = 3;
var cursDistance = "4";
var cursFocale = 18;

// Initialiser Distance et Focale (pas de dépendance avec l'IL)
player.SetVar("varTxtDistance", cursDistance);
player.SetVar("varTxtFocale", cursFocale);

// Initialiser les curseurs et variables de luminance (statiquement)
player.SetVar("cursorLuminance", 3); // Indice 3 : ensoleillé
player.SetVar("varCursEnvLuminance", 3); // Indice 3 : ensoleillé
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

// Définir l'image de luminance en fonction du curseur de luminance
let imgScene;
switch (choixLuminance) {
	case 1: imgScene = "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5tP7Bg7RSZc.png"; break;
	case 2: imgScene = "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5yICyp9nNwh.png"; break;
	case 3: imgScene = "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png"; break;
	default: imgScene = "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png";
}

// Injecter les styles CSS dynamiquement
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    [data-acc-text='imgScene'],
    [data-acc-text='imgPersonnages'] {
        width: 660px;
        height: 491px;
        background-size: 100% 100%;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        filter: blur(0px) contrast(100%);
        overflow: hidden;
    }
    [data-acc-text='imgScene'] {
        background-image: url('`+ imgScene +`');
    }
    [data-acc-text='imgPersonnages'] {
        background-image: url('https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OOMmlhsZRi.png');
    }
`;
document.head.appendChild(styleSheet);


// effet mouvement collimateurs
setTimeout(function() {
	
	// Récupérer l'élément image
	var img = document.querySelector("[data-acc-text='imgCollimateurs']");
	
	// Centrer l'image vertical et horizontalement
	img.style.position = 'absolute';
	img.style.left = '40%';
	img.style.top = '40%';
	img.style.transformOrigin = 'center center';
	img.style.transform = 'translate(-50%, -50%) rotate(0deg)';
	
	// Paramètres du mouvement
	var maxRotation = 5;    // Rotation max en degrés
	var maxTranslationX = 100; // Déplacement max en pixels (gauche/droite)
	var maxTranslationY = 200; // Déplacement max en pixels (haut/bas)
	var speed = 0.08;        // Vitesse du mouvement
	
	// Variables pour le mouvement fluide
	var currentRot = 0;
	var currentX = 0;
	var currentY = 0;
	var targetRot = 0;
	var targetX = 0;
	var targetY = 0;
	
	// Fonction pour générer une nouvelle cible aléatoire
	function newTarget() {
	    targetRot = (Math.random() * 2 - 1) * maxRotation;
	    targetX = (Math.random() * 2 - 1) * maxTranslationX;
	    targetY = (Math.random() * 2 - 1) * maxTranslationY;
	}
	
	// Fonction d'animation
	function animate() {
	    // Interpolation douce vers la cible
	    currentRot += (targetRot - currentRot) * speed;
	    currentX += (targetX - currentX) * speed;
	    currentY += (targetY - currentY) * speed;
	    
	    // Appliquer la translation et la rotation tout en maintenant le centrage
	    img.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px) rotate(${currentRot}deg)`;
	    
	    // Générer une nouvelle cible de temps en temps
	    if (Math.random() < 0.02) {
	        newTarget();
	    }
	    
	    // Continuer l'animation
	    requestAnimationFrame(animate);
	}
	
	// Initialiser le mouvement
	newTarget();
	animate();

}, 100);


}

window.Script2 = function()
{
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
        document.querySelector("[data-acc-text='imgScene']"),
        document.querySelector("[data-acc-text='imgPersonnages']"),

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

}

window.Script3 = function()
{
  console.log("Script Ouverture démarré");

var player = GetPlayer();
let isProcessing = false;

const isoValues = [100, 200, 400, 800, 1600, 3200, 6400];
const apertureValues = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const shutterValues = [1, 2, 4, 8, 15, 30, 60, 125, 250, 500, 1000, 2000, 4000];

function shutterSpeedString(value) {
    return shutterValues[value] <= 4 ? (1 / shutterValues[value]).toFixed(2) + '"' : `1/${shutterValues[value]}`;
}

function getBaseValues(luminanceIndex) {
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
    return { baseISOIndex, baseApertureIndex, baseShutterIndex };
}

function calculateExposureIndex(isoIndex, apertureIndex, shutterIndex, baseISOIndex, baseApertureIndex, baseShutterIndex) {
    let isoStopChange = isoIndex - baseISOIndex;
    let apertureStopChange = apertureIndex - baseApertureIndex;
    let shutterStopChange = shutterIndex - baseShutterIndex;
    let totalStopChange = isoStopChange + apertureStopChange + shutterStopChange;
    return Math.max(-3, Math.min(3, totalStopChange * (1/3)));
}

try {
    // --- Vérification initiale ---
    let modeAvA = player.GetVar("varModeActifAvA");
    let modeM = player.GetVar("varModeActifM");
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
    let { baseISOIndex, baseApertureIndex, baseShutterIndex } = getBaseValues(luminanceIndex);

    // --- Mettre à jour l'ouverture ---
    player.SetVar("varTxtParamOuverture", apertureValues[newApertureIndex]);

    // --- Ajuster les curseurs ---
    if (modeAvA) {
        // Mode Av/A : Ajuster la vitesse pour compenser l'ouverture
        let apertureStopChange = newApertureIndex - baseApertureIndex;
        console.log(`Changement Ouverture : ${apertureStopChange} stop(s)`);

        let newShutterIndex = baseShutterIndex - apertureStopChange;
        newShutterIndex = Math.max(0, Math.min(12, newShutterIndex));

        player.SetVar("varCursExpoVitesse", newShutterIndex);
        player.SetVar("varTxtParamVitesse", shutterSpeedString(newShutterIndex));

        // Calculer varExpoIndice en tenant compte de l'ISO (indépendant)
        let currentISOIndex = player.GetVar("varCursExpoIso") || baseISOIndex;
        let newExpoIndice = calculateExposureIndex(currentISOIndex, newApertureIndex, newShutterIndex, baseISOIndex, baseApertureIndex, baseShutterIndex);
        player.SetVar("varExpoIndice", newExpoIndice);

        console.log(`Ajustement (Av/A) - ISO: ${isoValues[currentISOIndex]}, Ouverture: f/${apertureValues[newApertureIndex]}, Vitesse: ${shutterSpeedString(newShutterIndex)}, ExpoIndice: ${newExpoIndice}`);
    } else if (modeM) {
        // Mode M : Pas d'ajustement automatique, mise à jour de varExpoIndice
        let currentISOIndex = player.GetVar("varCursExpoIso") || baseISOIndex;
        let currentShutterIndex = player.GetVar("varCursExpoVitesse") || baseShutterIndex;
        let newExpoIndice = calculateExposureIndex(currentISOIndex, newApertureIndex, currentShutterIndex, baseISOIndex, baseApertureIndex, baseShutterIndex);
        player.SetVar("varExpoIndice", newExpoIndice);

        console.log(`Ajustement (M) - ISO: ${isoValues[currentISOIndex]}, Ouverture: f/${apertureValues[newApertureIndex]}, Vitesse: ${shutterSpeedString(currentShutterIndex)}, ExpoIndice: ${newExpoIndice}`);
    } else {
        console.log("Mode non supporté pour ce script (ni Av/A ni M)");
    }

    player.SetVar("lastApertureIndex", newApertureIndex);
} catch (error) {
    console.error("Erreur dans le script Ouverture :", error);
} finally {
    isProcessing = false;
    console.log("Script Ouverture terminé");
}
}

window.Script4 = function()
{
  console.log("Script Vitesse démarré");

var player = GetPlayer();
let isProcessing = false;

const isoValues = [100, 200, 400, 800, 1600, 3200, 6400];
const apertureValues = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const shutterValues = [1, 2, 4, 8, 15, 30, 60, 125, 250, 500, 1000, 2000, 4000];

function shutterSpeedString(value) {
    return shutterValues[value] <= 4 ? (1 / shutterValues[value]).toFixed(2) + '"' : `1/${shutterValues[value]}`;
}

function getBaseValues(luminanceIndex) {
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
    return { baseISOIndex, baseApertureIndex, baseShutterIndex };
}

function calculateExposureIndex(isoIndex, apertureIndex, shutterIndex, baseISOIndex, baseApertureIndex, baseShutterIndex) {
    let isoStopChange = isoIndex - baseISOIndex;
    let apertureStopChange = apertureIndex - baseApertureIndex;
    let shutterStopChange = shutterIndex - baseShutterIndex;
    let totalStopChange = isoStopChange + apertureStopChange + shutterStopChange;
    return Math.max(-3, Math.min(3, totalStopChange * (1/3)));
}

try {
    // --- Vérification initiale ---
    let modeTvS = player.GetVar("varModeActifTvS");
    let modeM = player.GetVar("varModeActifM");
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
    let { baseISOIndex, baseApertureIndex, baseShutterIndex } = getBaseValues(luminanceIndex);

    // --- Mettre à jour la vitesse ---
    player.SetVar("varTxtParamVitesse", shutterSpeedString(newShutterIndex));

    // --- Ajuster les curseurs ---
    if (modeTvS) {
        // Mode Tv/S : Ajuster l'ouverture pour compenser la vitesse
        let shutterStopChange = newShutterIndex - baseShutterIndex;
        console.log(`Changement Vitesse : ${shutterStopChange} stop(s)`);

        let newApertureIndex = baseApertureIndex - shutterStopChange;
        newApertureIndex = Math.max(0, Math.min(8, newApertureIndex));

        player.SetVar("varCursExpoOuverture", newApertureIndex);
        player.SetVar("varTxtParamOuverture", apertureValues[newApertureIndex]);

        // Calculer varExpoIndice en tenant compte de l'ISO (indépendant)
        let currentISOIndex = player.GetVar("varCursExpoIso") || baseISOIndex;
        let newExpoIndice = calculateExposureIndex(currentISOIndex, newApertureIndex, newShutterIndex, baseISOIndex, baseApertureIndex, baseShutterIndex);
        player.SetVar("varExpoIndice", newExpoIndice);

        console.log(`Ajustement (Tv/S) - ISO: ${isoValues[currentISOIndex]}, Ouverture: f/${apertureValues[newApertureIndex]}, Vitesse: ${shutterSpeedString(newShutterIndex)}, ExpoIndice: ${newExpoIndice}`);
    } else if (modeM) {
        // Mode M : Pas d'ajustement automatique, mise à jour de varExpoIndice
        let currentISOIndex = player.GetVar("varCursExpoIso") || baseISOIndex;
        let currentApertureIndex = player.GetVar("varCursExpoOuverture") || baseApertureIndex;
        let newExpoIndice = calculateExposureIndex(currentISOIndex, currentApertureIndex, newShutterIndex, baseISOIndex, baseApertureIndex, baseShutterIndex);
        player.SetVar("varExpoIndice", newExpoIndice);

        console.log(`Ajustement (M) - ISO: ${isoValues[currentISOIndex]}, Ouverture: f/${apertureValues[currentApertureIndex]}, Vitesse: ${shutterSpeedString(newShutterIndex)}, ExpoIndice: ${newExpoIndice}`);
    } else {
        console.log("Mode non supporté pour ce script (ni Tv/S ni M)");
    }

    player.SetVar("lastShutterIndex", newShutterIndex);
} catch (error) {
    console.error("Erreur dans le script Vitesse :", error);
} finally {
    isProcessing = false;
    console.log("Script Vitesse terminé");
}
}

window.Script5 = function()
{
  console.log("Script ISO démarré");

var player = GetPlayer();
let isProcessing = false;

const isoValues = [100, 200, 400, 800, 1600, 3200, 6400];
const apertureValues = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const shutterValues = [1, 2, 4, 8, 15, 30, 60, 125, 250, 500, 1000, 2000, 4000];

function shutterSpeedString(value) {
    return shutterValues[value] <= 4 ? (1 / shutterValues[value]).toFixed(2) + '"' : `1/${shutterValues[value]}`;
}

function getBaseValues(luminanceIndex) {
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
    return { baseISOIndex, baseApertureIndex, baseShutterIndex };
}

function calculateExposureIndex(isoIndex, apertureIndex, shutterIndex, baseISOIndex, baseApertureIndex, baseShutterIndex) {
    let isoStopChange = isoIndex - baseISOIndex;
    let apertureStopChange = apertureIndex - baseApertureIndex;
    let shutterStopChange = shutterIndex - baseShutterIndex;
    let totalStopChange = isoStopChange + apertureStopChange + shutterStopChange;
    return Math.max(-3, Math.min(3, totalStopChange * (1/3)));
}

try {
    // --- Vérification initiale ---
    let modeP = player.GetVar("varModeActifP");
    let modeAvA = player.GetVar("varModeActifAvA");
    let modeTvS = player.GetVar("varModeActifTvS");
    let modeM = player.GetVar("varModeActifM");
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
    let { baseISOIndex, baseApertureIndex, baseShutterIndex } = getBaseValues(luminanceIndex);

    // --- Mettre à jour l'ISO ---
    player.SetVar("varTxtParamIso", isoValues[newISOIndex]);

    // --- Ajuster les curseurs ---
    if (modeP) {
        // Mode P : Ajuster ouverture et vitesse pour compenser l'ISO
        let isoStopChange = newISOIndex - baseISOIndex;
        console.log(`Changement ISO : ${isoStopChange} stop(s)`);

        let apertureStopChange = Math.round(isoStopChange / 2);
        let shutterStopChange = isoStopChange - apertureStopChange;

        let newApertureIndex = baseApertureIndex - apertureStopChange;
        let newShutterIndex = baseShutterIndex - shutterStopChange;

        if (newShutterIndex < 0 || newShutterIndex > 12) {
            let excess = newShutterIndex < 0 ? newShutterIndex : newShutterIndex - 12;
            newApertureIndex -= excess;
            newShutterIndex = Math.max(0, Math.min(12, newShutterIndex));
        } else if (newApertureIndex < 0 || newApertureIndex > 8) {
            let excess = newApertureIndex < 0 ? newApertureIndex : newApertureIndex - 8;
            newShutterIndex -= excess;
            newApertureIndex = Math.max(0, Math.min(8, newApertureIndex));
        }

        newApertureIndex = Math.max(0, Math.min(8, newApertureIndex));
        newShutterIndex = Math.max(0, Math.min(12, newShutterIndex));

        player.SetVar("varCursExpoOuverture", newApertureIndex);
        player.SetVar("varTxtParamOuverture", apertureValues[newApertureIndex]);
        player.SetVar("varCursExpoVitesse", newShutterIndex);
        player.SetVar("varTxtParamVitesse", shutterSpeedString(newShutterIndex));

        let newExpoIndice = calculateExposureIndex(newISOIndex, newApertureIndex, newShutterIndex, baseISOIndex, baseApertureIndex, baseShutterIndex);
        player.SetVar("varExpoIndice", newExpoIndice);

        console.log(`Ajustement (P) - ISO: ${isoValues[newISOIndex]}, Ouverture: f/${apertureValues[newApertureIndex]}, Vitesse: ${shutterSpeedString(newShutterIndex)}, ExpoIndice: ${newExpoIndice}`);
    } else if (modeAvA || modeTvS || modeM) {
        // Modes Av/A, Tv/S, M : ISO indépendant, mise à jour de varExpoIndice
        let currentApertureIndex = player.GetVar("varCursExpoOuverture") || baseApertureIndex;
        let currentShutterIndex = player.GetVar("varCursExpoVitesse") || baseShutterIndex;
        let newExpoIndice = calculateExposureIndex(newISOIndex, currentApertureIndex, currentShutterIndex, baseISOIndex, baseApertureIndex, baseShutterIndex);
        player.SetVar("varExpoIndice", newExpoIndice);

        console.log(`Ajustement (${modeAvA ? 'Av/A' : modeTvS ? 'Tv/S' : 'M'}) - ISO: ${isoValues[newISOIndex]}, Ouverture: f/${apertureValues[currentApertureIndex]}, Vitesse: ${shutterSpeedString(currentShutterIndex)}, ExpoIndice: ${newExpoIndice}`);
    } else {
        console.log("Mode non supporté pour ce script");
    }

    player.SetVar("lastISOIndex", newISOIndex);
} catch (error) {
    console.error("Erreur dans le script ISO :", error);
} finally {
    isProcessing = false;
    console.log("Script ISO terminé");
}
}

window.Script6 = function()
{
  var player = GetPlayer();

setTimeout(function() {
    let luminance = player.GetVar("varCursEnvLuminance");
    let cursFocale = player.GetVar("varCursEnvFocale");
    let distance = player.GetVar("varCursEnvDistance");
    const focaleValues = [null, 18, 24, 35, 55];
    let focale = focaleValues[cursFocale];

    player.SetVar("varTxtFocale", focale);
    player.SetVar("varTxtDistance", distance);

    // Définir les paramètres pour luminance
    var setLuminance;
    switch (luminance) {
        case 1:
            setLuminance = {
                bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5tP7Bg7RSZc.png"
            };
            break;
        case 2:
            setLuminance = {
                bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5yICyp9nNwh.png"
            };
            break;
        case 3:
            setLuminance = {
                bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png"
            };
            break;
        default:
            setLuminance = {
                bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png"
            };
            break;
    }

    // Définir les paramètres pour focale (exactement comme validé)
    var settingsFocale;
    switch (focale) {
        case 18:
            settingsFocale = {
                bgSizePersonnage: "100% 100%", // Comme 4 m
                bgSizeSceneFocale: "100% 100%",
                filterBlur: "blur(1px) contrast(100%)" // Plus prononcé
            };
            break;
        case 24:
            settingsFocale = {
                bgSizePersonnage: "133% 133%", // Comme 3 m
                bgSizeSceneFocale: "105% 105%",
                filterBlur: "blur(1.6px) contrast(100%)" // Plus prononcé
            };
            break;
        case 35:
            settingsFocale = {
                bgSizePersonnage: "166% 166%", // Comme 2 m
                bgSizeSceneFocale: "110% 110%",
                filterBlur: "blur(2px) contrast(100%)" // Plus prononcé
            };
            break;
        case 55:
            settingsFocale = {
                bgSizePersonnage: "200% 200%", // Comme 1 m
                bgSizeSceneFocale: "120% 120%",
                filterBlur: "blur(4px) contrast(100%)" // Plus prononcé
            };
            break;
        default:
            settingsFocale = {
                bgSizePersonnage: "100% 100%",
                bgSizeSceneFocale: "100% 100%",
                filterBlur: "blur(1px) contrast(100%)"
            };
            break;
    }

    // Définir les paramètres pour distance (adapté à focale)
    var settingsDistance;
    switch (focale) {
        case 55: // Équivalent à 1 m
            settingsDistance = {
                bgSizePersonnage: "200% 200%",
                bgSizeSceneDistance: "120% 120%"
            };
            break;
        case 35: // Équivalent à 2 m
            settingsDistance = {
                bgSizePersonnage: "166% 166%",
                bgSizeSceneDistance: "110% 110%"
            };
            break;
        case 24: // Équivalent à 3 m
            settingsDistance = {
                bgSizePersonnage: "133% 133%",
                bgSizeSceneDistance: "105% 105%"
            };
            break;
        case 18: // Équivalent à 4 m
            settingsDistance = {
                bgSizePersonnage: "100% 100%",
                bgSizeSceneDistance: "100% 100%"
            };
            break;
        default:
            settingsDistance = {
                bgSizePersonnage: "100% 100%",
                bgSizeSceneDistance: "100% 100%"
            };
            break;
    }

    // Combiner bgSizeSceneDistance et bgSizeScene
    const combinedBgSizeScene = `${parseFloat(settingsDistance.bgSizeSceneDistance) * parseFloat(settingsFocale.bgSizeSceneFocale.split(' ')[0]) / 100}% ${parseFloat(settingsDistance.bgSizeSceneDistance) * parseFloat(settingsFocale.bgSizeSceneFocale.split(' ')[1]) / 100}%`;

    // Injecter les styles CSS dynamiquement
    var styleSheet = document.createElement("style");
    styleSheet.id = "focaleStyles";
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        [data-acc-text='imgScene'],
        [data-acc-text='imgPersonnages'] {
            width: 660px;
            height: 491px;
            background-repeat: no-repeat;
            overflow: hidden;
            transition: background-size 0.5s ease, filter 0.5s ease, background-position 0.5s ease;
        }
        [data-acc-text='imgScene'] {
            background-image: url('${setLuminance.bgImageScene}');
            background-size: ${combinedBgSizeScene};
            background-position: 50% 50%; /* Centré verticalement, comme distance */
            filter: ${settingsFocale.filterBlur};
        }
        [data-acc-text='imgPersonnages'] {
            background-image: url('https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OOMmlhsZRi.png');
            background-size: ${settingsDistance.bgSizePersonnage};
            background-position: 50% 50%; /* Centré verticalement, comme distance */
            filter: blur(0px) contrast(100%);
        }
    `;
    let oldStyle = document.getElementById("focaleStyles");
    if (oldStyle) oldStyle.remove();
    document.head.appendChild(styleSheet);
}, 100);
}

window.Script7 = function()
{
  var player = GetPlayer();

setTimeout(function() {
    let luminance = player.GetVar("varCursEnvLuminance");
    let distance = player.GetVar("varCursEnvDistance");
    let focale = player.GetVar("varCursEnvFocale");

    player.SetVar("varTxtDistance", distance);

    // Définir les paramètres pour luminance
    var setLuminance;
    switch (luminance) {
        case 1:
            setLuminance = {
                bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5tP7Bg7RSZc.png"
            };
            break;
        case 2:
            setLuminance = {
                bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5yICyp9nNwh.png"
            };
            break;
        case 3:
            setLuminance = {
                bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png"
            };
            break;
        default:
            setLuminance = {
                bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png"
            };
            break;
    }

    // Définir les paramètres pour focale (pour bgSizeScene et filterBlur)
    var settingsFocale;
    const focusX = 40; // Faux centre, plus à gauche
    const focusY = 90; // Très bas, pour exploiter la marge en haut
    switch (focale) {
        case 18:
            settingsFocale = {
                bgSizeScene: "100% 100%",
                filterBlur: "blur(0.5px) contrast(100%)",
                backgroundPosition: `${focusX}% ${focusY}%`
            };
            break;
        case 24:
            settingsFocale = {
                bgSizeScene: "125% 125%",
                filterBlur: "blur(0.8px) contrast(100%)",
                backgroundPosition: `${focusX - (1.25 - 1) * focusX / 1.25}% ${focusY - (1.25 - 1) * focusY / 1.25}%`, // 32% 72%
            };
            break;
        case 35:
            settingsFocale = {
                bgSizeScene: "150% 150%",
                filterBlur: "blur(1px) contrast(100%)",
                backgroundPosition: `${focusX - (1.5 - 1) * focusX / 1.5}% ${focusY - (1.5 - 1) * focusY / 1.5}%`, // 26.67% 60%
            };
            break;
        case 55:
            settingsFocale = {
                bgSizeScene: "180% 180%",
                filterBlur: "blur(2px) contrast(100%)",
                backgroundPosition: `${focusX - (1.8 - 1) * focusX / 1.8}% ${focusY - (1.8 - 1) * focusY / 1.8}%`, // 22.22% 50%
            };
            break;
        default:
            settingsFocale = {
                bgSizeScene: "100% 100%",
                filterBlur: "blur(0.5px) contrast(100%)",
                backgroundPosition: `${focusX}% ${focusY}%`
            };
            break;
    }

    // Définir les paramètres pour distance
    var settingsDistance;
    switch (distance) {
        case 1:
            settingsDistance = {
                bgSizePersonnage: "200% 200%", // Changé de 150% à 200%
                bgSizeSceneDistance: "120% 120%"
            };
            break;
        case 2:
            settingsDistance = {
                bgSizePersonnage: "166% 166%", // Changé de 141% à 166%
                bgSizeSceneDistance: "110% 110%"
            };
            break;
        case 3:
            settingsDistance = {
                bgSizePersonnage: "133% 133%", // Changé de 115% à 133%
                bgSizeSceneDistance: "105% 105%"
            };
            break;
        case 4:
            settingsDistance = {
                bgSizePersonnage: "100% 100%", // Inchangé
                bgSizeSceneDistance: "100% 100%"
            };
            break;
        default:
            settingsDistance = {
                bgSizePersonnage: "100% 100%",
                bgSizeSceneDistance: "100% 100%"
            };
            break;
    }

    // Combiner bgSizeSceneDistance et bgSizeScene
    const combinedBgSizeScene = `${parseFloat(settingsDistance.bgSizeSceneDistance) * parseFloat(settingsFocale.bgSizeScene.split(' ')[0]) / 100}% ${parseFloat(settingsDistance.bgSizeSceneDistance) * parseFloat(settingsFocale.bgSizeScene.split(' ')[1]) / 100}%`;

    // Injecter les styles CSS dynamiquement
    var styleSheet = document.createElement("style");
    styleSheet.id = "distanceStyles";
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        [data-acc-text='imgScene'],
        [data-acc-text='imgPersonnages'] {
            width: 660px;
            height: 491px;
            background-repeat: no-repeat;
            overflow: hidden;
            transition: background-size 0.5s ease, filter 0.5s ease, background-position 0.5s ease;
        }
        [data-acc-text='imgScene'] {
            background-image: url('${setLuminance.bgImageScene}');
            background-size: ${combinedBgSizeScene};
            background-position: ${settingsFocale.backgroundPosition};
            filter: ${settingsFocale.filterBlur};
        }
        [data-acc-text='imgPersonnages'] {
            background-image: url('https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OOMmlhsZRi.png');
            background-size: ${settingsDistance.bgSizePersonnage};
            background-position: 50% 50%; /* Centré verticalement, comme demandé */
            filter: blur(0px) contrast(100%);
        }
    `;
    let oldStyle = document.getElementById("distanceStyles");
    if (oldStyle) oldStyle.remove();
    document.head.appendChild(styleSheet);
}, 100);
}

window.Script8 = function()
{
  var player = GetPlayer();

// --- Définir les valeurs statiques pour la luminance ---
const luminanceValues = [null, "orageux", "nuageux", "ensoleillé"];
const luminanceILValues = [3, 7, 11]; // IL pour chaque luminance
const imageUrls = [
    "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5tP7Bg7RSZc.png", // Orageux
    "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5yICyp9nNwh.png", // Nuageux
    "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png"  // Ensoleillé
];

// --- Précharger les images ---
function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}
preloadImages(imageUrls);

// --- Récupérer la nouvelle valeur du curseur de luminance ---
let newLuminanceIndex = player.GetVar("varCursEnvLuminance"); // 1, 2, ou 3

// --- Mettre à jour les variables de luminance ---
player.SetVar("varTxtLuminance", luminanceValues[newLuminanceIndex]);
player.SetVar("varNiveauExpoLV", luminanceILValues[newLuminanceIndex]);

// Ajouter un délai pour garantir que le DOM soit chargé
setTimeout(function() {

    // Définir l'image de luminance en fonction du curseur de luminance
    let imgScene;
    switch (newLuminanceIndex) {
        case 1: imgScene = imageUrls[0]; break; // Orageux
        case 2: imgScene = imageUrls[1]; break; // Nuageux
        case 3: imgScene = imageUrls[2]; break; // Ensoleillé
        default: imgScene = imageUrls[2]; // Ensoleillé par défaut
    }

    // Injecter les styles CSS dynamiquement
    const styleSheet = document.createElement("style");
    styleSheet.id = "luminanceStyles"; // Identifiant unique
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        [data-acc-text='imgScene'] {
            width: 660px;
            height: 491px;
            background-size: 100% 100%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
            background-image: url('${imgScene}');
        }
    `;
    let oldStyle = document.getElementById("luminanceStyles");
    if (oldStyle) oldStyle.remove();
    document.head.appendChild(styleSheet);

    // --- Ajuster les curseurs avec des valeurs statiques ---
    function adjustSlidersForLuminance() {
        if (newLuminanceIndex === 3) { // IL 11 (ensoleillé)
            // ISO 100
            player.SetVar("varCursExpoIso", 0);
            player.SetVar("varTxtParamIso", "100");
            // Ouverture f/11
            player.SetVar("varCursExpoOuverture", 6);
            player.SetVar("varTxtParamOuverture", "11");
            // Vitesse 1/15
            player.SetVar("varCursExpoVitesse", 4);
            player.SetVar("varTxtParamVitesse", "1/15");
        } else if (newLuminanceIndex === 2) { // IL 7 (nuageux)
            // ISO 100
            player.SetVar("varCursExpoIso", 0);
            player.SetVar("varTxtParamIso", "100");
            // Ouverture f/5.6
            player.SetVar("varCursExpoOuverture", 4);
            player.SetVar("varTxtParamOuverture", "5.6");
            // Vitesse 0.5" (1/2 seconde)
            player.SetVar("varCursExpoVitesse", 1);
            player.SetVar("varTxtParamVitesse", "0.5\"");
        } else if (newLuminanceIndex === 1) { // IL 3 (orageux)
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

        // Réinitialiser l’indice d’exposition à 0 (exposition correcte pour ces valeurs)
        player.SetVar("varExpoIndice", 0);
    }

    // --- Exécuter l’ajustement ---
    adjustSlidersForLuminance();

}, 500); // Augmenté à 500 ms
}

window.Script9 = function()
{
  // Récupérer le player Storyline
var player = GetPlayer();

// Récupérer les variables Storyline avec des valeurs par défaut
let expoIndice = player.GetVar("varExpoIndice");
let distance = player.GetVar("varCursEnvDistance");

setTimeout(function() {

let newExpoIndice = player.GetVar("varExpoIndice");

let brightnessValue = 1 + (newExpoIndice / 3);
let elements = [
	document.querySelector("[data-acc-text='imgScene']"),
	document.querySelector("[data-acc-text='imgPersonnages']"),

].filter(Boolean);

gsap.to(elements, {
	duration: 0.3,
	filter: `brightness(${brightnessValue})`,
	onStart: () => elements.forEach(el => el.style.visibility = "visible"),
});

// Messages d'exposition
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
    "Valeur d'exposition hors plage. Conseils : vérifiez vos paramètres ISO, ouverture, et vitesse, et ajustez vers ISO 100, f/5.6, 1/100s pour un point de départ neutre.";

player.SetVar("varTxtExpoStatus", statusTextExpo);

// Messages de luminance
const statusTextLuminance = 
    distance === 1 ? "Condition orageuse, lumière très faible, ambiance sombre et contrastes élevés." :
    distance === 2 ? "Condition nuageuse, lumière diffuse, tons doux et détails équilibrés." :
    distance === 3 ? "Condition ensoleillée, lumière vive, couleurs éclatantes et ombres marquées." :
    "Condition de luminance inconnue";

player.SetVar("varTxtLuminanceStatus", statusTextLuminance);


// Définir les paramètres avec un switch
var settings;
switch (distance) {
    case 1:
        settings = {
            bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5tP7Bg7RSZc.png",
            bgSizeScene: "100% 100%",
            bgSizePersonnage: "200% 200%",
            filterBlur: "blur(0.8px) contrast(100%)"
        };
        break;
    case 2:
        settings = {
            bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5yICyp9nNwh.png",
            bgSizeScene: "100% 100%",
            bgSizePersonnage: "150% 150%",
            filterBlur: "blur(0.4px) contrast(100%)"
        };
        break;
    case 3:
        settings = {
            bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png",
            bgSizeScene: "100% 100%",
            bgSizePersonnage: "100% 100%",
            filterBlur: "blur(0px) contrast(100%)"
        };
        break;
    default:
        settings = {
            bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png",
            bgSizeScene: "100% 100%",
            bgSizePersonnage: "100% 100%",
            filterBlur: "blur(0px) contrast(100%)"
        };
        break;
}

// Injecter les styles CSS dynamiquement avec transitions
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    [data-acc-text='imgScene'],
    [data-acc-text='imgPersonnages'] {
        width: 660px;
        height: 491px;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        overflow: hidden;
        transition: background-size 0.5s ease, filter 0.5s ease; /* Transition douce */
    }
    [data-acc-text='imgScene'] {
        background-image: url('${settings.bgImageScene}');
        background-size: ${settings.bgSizeScene};
        filter: ${settings.filterBlur};
    }
    [data-acc-text='imgPersonnages'] {
        background-image: url('https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OOMmlhsZRi.png');
        background-size: ${settings.bgSizePersonnage};
        filter: blur(0px) contrast(100%);
    }
`;
document.head.appendChild(styleSheet);

}, 100);
}

window.Script10 = function()
{
  // Récupérer le player Storyline
var player = GetPlayer();

// Récupérer les variables Storyline avec des valeurs par défaut
let expoIndice = player.GetVar("varExpoIndice");
let distance = player.GetVar("varCursEnvDistance");

setTimeout(function() {

let newExpoIndice = player.GetVar("varExpoIndice");

let brightnessValue = 1 + (newExpoIndice / 3);
let elements = [
	document.querySelector("[data-acc-text='imgScene']"),
	document.querySelector("[data-acc-text='imgPersonnages']"),

].filter(Boolean);

gsap.to(elements, {
	duration: 0.3,
	filter: `brightness(${brightnessValue})`,
	onStart: () => elements.forEach(el => el.style.visibility = "visible"),
});

// Messages d'exposition
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

player.SetVar("varTxtExpoStatus", statusTextExpo);

// Messages de luminance
const statusTextLuminance = 
    distance === 1 ? "Condition orageuse, lumière très faible, ambiance sombre et contrastes élevés." :
    distance === 2 ? "Condition nuageuse, lumière diffuse, tons doux et détails équilibrés." :
    distance === 3 ? "Condition ensoleillée, lumière vive, couleurs éclatantes et ombres marquées." :
    "Condition de luminance inconnue";

player.SetVar("varTxtLuminanceStatus", statusTextLuminance);


// Définir les paramètres avec un switch
var settings;
switch (distance) {
    case 1:
        settings = {
            bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5tP7Bg7RSZc.png",
            bgSizeScene: "100% 100%",
            bgSizePersonnage: "200% 200%",
            filterBlur: "blur(0.8px) contrast(100%)"
        };
        break;
    case 2:
        settings = {
            bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/5yICyp9nNwh.png",
            bgSizeScene: "100% 100%",
            bgSizePersonnage: "150% 150%",
            filterBlur: "blur(0.4px) contrast(100%)"
        };
        break;
    case 3:
        settings = {
            bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png",
            bgSizeScene: "100% 100%",
            bgSizePersonnage: "100% 100%",
            filterBlur: "blur(0px) contrast(100%)"
        };
        break;
    default:
        settings = {
            bgImageScene: "https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OYrQ3sxQaE.png",
            bgSizeScene: "100% 100%",
            bgSizePersonnage: "100% 100%",
            filterBlur: "blur(0px) contrast(100%)"
        };
        break;
}

// Injecter les styles CSS dynamiquement avec transitions
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    [data-acc-text='imgScene'],
    [data-acc-text='imgPersonnages'] {
        width: 713px;
        height: 540px;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        overflow: hidden;
        transition: background-size 0.5s ease, filter 0.5s ease; /* Transition douce */
    }
    [data-acc-text='imgScene'] {
        background-image: url('${settings.bgImageScene}');
        background-size: ${settings.bgSizeScene};
        filter: ${settings.filterBlur};
    }
    [data-acc-text='imgPersonnages'] {
        background-image: url('https://raw.githubusercontent.com/karimbel/portfolio/main/simexposition/mobile/6OOMmlhsZRi.png');
        background-size: ${settings.bgSizePersonnage};
        filter: blur(0px) contrast(100%);
    }
`;
document.head.appendChild(styleSheet);

}, 100);
}

};
