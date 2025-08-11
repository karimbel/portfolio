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
  // Tableau des conditions en fonction de l'EV
const evConditions = [
    "Nuit avec une pleine lune",        // EV -6
    "Nuit très sombre",                 // EV -5
    "Nuit avec éclairage urbain",       // EV -4
    "Intérieur faiblement éclairé",     // EV -3
    "Crépuscule",                       // EV -2
    "Ciel très couvert au crépuscule",  // EV -1
    "Ciel couvert",                     // EV 0
    "Intérieur bien éclairé",           // EV 1
    "Journée grise",                    // EV 2
    "Journée légèrement nuageuse",      // EV 3
    "Journée ensoleillée",              // EV 4
    "Plein soleil",                     // EV 5
    "Plein soleil avec sol clair",      // EV 6
    "Plein soleil avec neige",          // EV 7
    "Lumière directe sur neige",        // EV 8
    "Lumière extrêmement réfléchissante",// EV 9
    "Lumière extrême (désert, glaciers)"// EV 10
];

// Tableau du descriptif des conditions en fonction de l'EV
const evDescriptions = [
    "Très faible lumière naturelle, nécessitant une longue exposition et une grande ouverture pour capturer la scène.",
    "Scène presque noire, lumière minimale. Utilisation d'une grande ouverture et d'un trépied indispensable.",
    "Éclairage limité provenant de lampadaires ou de sources lumineuses très faibles.",
    "Environnements intérieurs sombres, comme une pièce éclairée par une seule lampe ou des bougies.",
    "Lumière douce et diffuse juste avant ou après le coucher/lever du soleil. Besoin d'une exposition plus longue.",
    "Lumière faible en extérieur, typique d'une fin de journée nuageuse ou avant la tombée de la nuit.",
    "Journée grise avec lumière diffuse mais suffisante pour des photos en extérieur.",
    "Pièces bien éclairées avec de la lumière artificielle, comme un bureau ou un salon bien éclairé.",
    "Lumière naturelle modérée, utile pour des portraits en extérieur sans ombres dures.",
    "Lumière plus forte mais avec quelques nuages filtrant les rayons du soleil.",
    "Lumière forte et directe provenant du soleil, nécessitant une réduction de l'ouverture ou une augmentation de la vitesse d'obturation.",
    "Journée très lumineuse, idéale pour la photographie de paysages en extérieur. Réglages pour éviter la surexposition.",
    "Reflet intense de la lumière sur une surface claire comme du sable ou du béton. Petite ouverture (f/11) et ISO élevés nécessaires.",
    "Lumière extrêmement réfléchissante venant de la neige, créant une surbrillance. Utilisation d'une petite ouverture et d'un ISO élevés requis.",
    "Conditions lumineuses extrêmes, avec des reflets importants. Utilisation de filtres ND pour réduire la lumière entrant dans l'objectif.",
    "Réflexions puissantes provenant de surfaces métalliques ou d'eau, nécessitant un contrôle strict de l'exposition pour éviter les reflets éblouissants.",
    "Lumière intense dans des environnements lumineux et réfléchissants comme le désert ou les glaciers, requérant des ajustements extrêmes de l'exposition."
];

// Paramètres d'ouverture, vitesse et ISO
const apertureRange = [
    1.4, 1.6, 1.8, 2.0, 2.2, 2.5, 2.8, 3.2, 3.5, 4.0, 4.5, 5.0, 5.6, 6.3, 7.1, 
    8.0, 9.0, 10, 11, 13, 14, 16, 18, 20, 22
];
const shutterSpeedRange = [
    30, 25, 20, 15, 13, 10, 8, 6, 5, 4, 3.2, 2.5, 2, 1.6, 1.3, 1, 1/1.3, 1/1.6, 1/2, 
    1/2.5, 1/3.2, 1/4, 1/5, 1/6, 1/8, 1/10, 1/13, 1/15, 1/20, 1/25, 1/30, 1/40, 
    1/50, 1/60, 1/80, 1/100, 1/125, 1/160, 1/200, 1/250, 1/320, 1/400, 1/500, 
    1/640, 1/800, 1/1000, 1/1250, 1/1600, 1/2000, 1/2500, 1/3200, 1/4000, 1/5000, 
    1/6400, 1/8000
];
const isoRange = [
    50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600
];

// Fonction pour récupérer les paramètres d'exposition basés sur l'EV
function getExposureSettings(ev) {
    // Gérer les limites de l'EV
    if (ev < -6 || ev > 20) {
        return "EV hors des limites";
    }
    
    // Mapping EV vers les plages
    const apertureIndex = Math.min(Math.max(0, Math.floor((ev + 6) / 1.0)), apertureRange.length - 1);
    const shutterIndex = Math.min(Math.max(0, Math.floor((ev + 6) / 0.5)), shutterSpeedRange.length - 1);
    const isoIndex = Math.min(Math.max(0, Math.floor((ev + 6) / 3)), isoRange.length - 1);

    return {
        aperture: apertureRange[apertureIndex],
        shutterSpeed: shutterSpeedRange[shutterIndex],
        iso: isoRange[isoIndex]
    };
}

// Fonction pour transformer les vitesses d'obturation en texte
function shutterSpeedToText(shutterSpeed) {
    if (shutterSpeed >= 1) {
        return shutterSpeed + " s";
    } else {
        let fraction = Math.round(1 / shutterSpeed);
        return "1/" + fraction + " s";
    }
}

// Fonction pour récupérer l'index de la condition d'EV
function getConditionByEV(ev) {
    // Calcul de l'index à partir de l'EV (-6 correspond à l'index 0)
    let index = ev; 
    // Vérification si l'EV est dans les limites du tableau
    if (index < 0 || index >= evConditions.length) {
        return "Condition non définie pour cet EV";
    }
    return evConditions[index];
}

// Fonction pour récupérer l'index du descriptif de la condition d'EV
function getDescriptifByEV(ev) {
    // Calcul de l'index à partir de l'EV (-6 correspond à l'index 0)
    let index = ev; 
    // Vérification si l'EV est dans les limites du tableau
    if (index < 0 || index >= evDescriptions.length) {
        return "Descriptif non définie pour cet EV";
    }
    return evDescriptions[index];
}


let player = GetPlayer();
let EVCursor = player.GetVar("EVCursor");

// Mettre à jour les variables dans Storyline
let settings = getExposureSettings(EVCursor);
let condition = getConditionByEV(EVCursor);
let descriptif = getDescriptifByEV(EVCursor);
let apercureTxt = settings.aperture;
let shutterSpeedTxt = shutterSpeedToText(settings.shutterSpeed);
let isoTxt = settings.iso;

player.SetVar("EVCondition", condition);
player.SetVar("EVDescriptif", descriptif);
player.SetVar("ApertureTxt", apercureTxt);
player.SetVar("ShutterSpeedTxt", shutterSpeedTxt);
player.SetVar("IsoTxt", isoTxt);

}

window.Script2 = function()
{
  // Tableau des conditions en fonction de l'EV
const evConditions = [
    "Nuit avec une pleine lune",        // EV -6
    "Nuit très sombre",                 // EV -5
    "Nuit avec éclairage urbain",       // EV -4
    "Intérieur faiblement éclairé",     // EV -3
    "Crépuscule",                       // EV -2
    "Ciel très couvert au crépuscule",  // EV -1
    "Ciel couvert",                     // EV 0
    "Intérieur bien éclairé",           // EV 1
    "Journée grise",                    // EV 2
    "Journée légèrement nuageuse",      // EV 3
    "Journée ensoleillée",              // EV 4
    "Plein soleil",                     // EV 5
    "Plein soleil avec sol clair",      // EV 6
    "Plein soleil avec neige",          // EV 7
    "Lumière directe sur neige",        // EV 8
    "Lumière extrêmement réfléchissante",// EV 9
    "Lumière extrême (désert, glaciers)"// EV 10
];

// Tableau du descriptif des conditions en fonction de l'EV
const evDescriptions = [
    "Très faible lumière naturelle, nécessitant une longue exposition et une grande ouverture pour capturer la scène.",
    "Scène presque noire, lumière minimale. Utilisation d'une grande ouverture et d'un trépied indispensable.",
    "Éclairage limité provenant de lampadaires ou de sources lumineuses très faibles.",
    "Environnements intérieurs sombres, comme une pièce éclairée par une seule lampe ou des bougies.",
    "Lumière douce et diffuse juste avant ou après le coucher/lever du soleil. Besoin d'une exposition plus longue.",
    "Lumière faible en extérieur, typique d'une fin de journée nuageuse ou avant la tombée de la nuit.",
    "Journée grise avec lumière diffuse mais suffisante pour des photos en extérieur.",
    "Pièces bien éclairées avec de la lumière artificielle, comme un bureau ou un salon bien éclairé.",
    "Lumière naturelle modérée, utile pour des portraits en extérieur sans ombres dures.",
    "Lumière plus forte mais avec quelques nuages filtrant les rayons du soleil.",
    "Lumière forte et directe provenant du soleil, nécessitant une réduction de l'ouverture ou une augmentation de la vitesse d'obturation.",
    "Journée très lumineuse, idéale pour la photographie de paysages en extérieur. Réglages pour éviter la surexposition.",
    "Reflet intense de la lumière sur une surface claire comme du sable ou du béton. Petite ouverture (f/11) et ISO élevés nécessaires.",
    "Lumière extrêmement réfléchissante venant de la neige, créant une surbrillance. Utilisation d'une petite ouverture et d'un ISO bas requis.",
    "Conditions lumineuses extrêmes, avec des reflets importants. Utilisation de filtres ND pour réduire la lumière entrant dans l'objectif.",
    "Réflexions puissantes provenant de surfaces métalliques ou d'eau, nécessitant un contrôle strict de l'exposition pour éviter les reflets éblouissants.",
    "Lumière intense dans des environnements lumineux et réfléchissants comme le désert ou les glaciers, requérant des ajustements extrêmes de l'exposition."
];

// Paramètres d'ouverture, vitesse et ISO
const apertureRange = [
    1.4, 1.6, 1.8, 2.0, 2.2, 2.5, 2.8, 3.2, 3.5, 4.0, 4.5, 5.0, 5.6, 6.3, 7.1, 
    8.0, 9.0, 10, 11, 13, 14, 16, 18, 20, 22
];
const shutterSpeedRange = [
    30, 25, 20, 15, 13, 10, 8, 6, 5, 4, 3.2, 2.5, 2, 1.6, 1.3, 1, 1/1.3, 1/1.6, 1/2, 
    1/2.5, 1/3.2, 1/4, 1/5, 1/6, 1/8, 1/10, 1/13, 1/15, 1/20, 1/25, 1/30, 1/40, 
    1/50, 1/60, 1/80, 1/100, 1/125, 1/160, 1/200, 1/250, 1/320, 1/400, 1/500, 
    1/640, 1/800, 1/1000, 1/1250, 1/1600, 1/2000, 1/2500, 1/3200, 1/4000, 1/5000, 
    1/6400, 1/8000
];
const isoRange = [
    50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600
];

// Fonction pour récupérer les paramètres d'exposition basés sur l'EV
function getExposureSettings(ev) {
    // Gérer les limites de l'EV
    if (ev < -6 || ev > 20) {
        return "EV hors des limites";
    }
    
    // Mapping EV vers les plages
    const apertureIndex = Math.min(Math.max(0, Math.floor((ev + 6) / 1.0)), apertureRange.length - 1);
    const shutterIndex = Math.min(Math.max(0, Math.floor((ev + 6) / 0.5)), shutterSpeedRange.length - 1);
    const isoIndex = Math.min(Math.max(0, Math.floor((ev + 6) / 3)), isoRange.length - 1);

    return {
        aperture: apertureRange[apertureIndex],
        shutterSpeed: shutterSpeedRange[shutterIndex],
        iso: isoRange[isoIndex]
    };
}

// Fonction pour transformer les vitesses d'obturation en texte
function shutterSpeedToText(shutterSpeed) {
    if (shutterSpeed >= 1) {
        return shutterSpeed + " s";
    } else {
        let fraction = Math.round(1 / shutterSpeed);
        return "1/" + fraction + " s";
    }
}

// Fonction pour récupérer l'index de la condition d'EV
function getConditionByEV(ev) {
    // Calcul de l'index à partir de l'EV (-6 correspond à l'index 0)
    let index = ev; 
    // Vérification si l'EV est dans les limites du tableau
    if (index < 0 || index >= evConditions.length) {
        return "Condition non définie pour cet EV";
    }
    return evConditions[index];
}

// Fonction pour récupérer l'index du descriptif de la condition d'EV
function getDescriptifByEV(ev) {
    // Calcul de l'index à partir de l'EV (-6 correspond à l'index 0)
    let index = ev; 
    // Vérification si l'EV est dans les limites du tableau
    if (index < 0 || index >= evDescriptions.length) {
        return "Descriptif non définie pour cet EV";
    }
    return evDescriptions[index];
}


let player = GetPlayer();
let EVCursor = player.GetVar("EVCursor");

// Mettre à jour les variables dans Storyline
let settings = getExposureSettings(EVCursor);
let condition = getConditionByEV(EVCursor);
let descriptif = getDescriptifByEV(EVCursor);
let apercureTxt = settings.aperture;
let shutterSpeedTxt = shutterSpeedToText(settings.shutterSpeed);
let isoTxt = settings.iso;

player.SetVar("EVCondition", condition);
player.SetVar("EVDescriptif", descriptif);
player.SetVar("ApertureTxt", apercureTxt);
player.SetVar("ShutterSpeedTxt", shutterSpeedTxt);
player.SetVar("IsoTxt", isoTxt);

}

};
