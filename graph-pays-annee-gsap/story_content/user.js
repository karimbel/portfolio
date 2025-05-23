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
  // Données (inchangées)
const donneesIngenieurs = {
  2023: { Europe: 6000000, USA: 3500000, Russie: 4000000, Chine: 6000000 },
  2024: { Europe: 6030000, USA: 3535000, Russie: 4012000, Chine: 6090000 },
  2025: { Europe: 6060000, USA: 3570000, Russie: 4024000, Chine: 6181000 }
};

// Variable pour tracker le premier chargement
let isFirstLoad = true;

// Récupérer l’année
var player = GetPlayer();
var annee = parseInt(player.GetVar("AnneeCourante"));

// Vérifier les données
var donnees = donneesIngenieurs[annee];
if (!donnees) {
  console.error("Données non trouvées pour l’année:", annee);
  return;
}

// Appeler les BARRES
var barreEurope = document.querySelector("[data-acc-text='barreEurope']");
var barreUSA = document.querySelector("[data-acc-text='barreUSA']");
var barreRussie = document.querySelector("[data-acc-text='barreRussie']");
var barreChine = document.querySelector("[data-acc-text='barreChine']");

// Appeler les ÉTIQUETTES
var labelEurope = document.querySelector("[data-acc-text='LabelEurope']");
var labelUSA = document.querySelector("[data-acc-text='LabelUSA']");
var labelRussie = document.querySelector("[data-acc-text='LabelRussie']");
var labelChine = document.querySelector("[data-acc-text='LabelChine']");

// Vérifier les éléments
if (!barreEurope || !barreUSA || !barreRussie || !barreChine || !labelEurope || !labelUSA || !labelRussie || !labelChine) {
  console.error("Certains éléments (barres ou labels) non trouvés dans le DOM");
  return;
}

// Obtenir le conteneur (parent direct des barres)
var conteneur = barreEurope.parentElement && barreEurope.parentElement.closest('div') || 
               document.querySelector('.slide-container') || 
               document.querySelector('.slide-content') || 
               document.querySelector('.cs-slide') || 
               document.body;
if (!conteneur) {
  console.error("Conteneur non trouvé");
  return;
}
var conteneurRect = conteneur.getBoundingClientRect();
var hauteurConteneur = conteneurRect.height;
var hauteurMaxBarre = hauteurConteneur * 0.45; // 45% de la hauteur (≈245px pour 540px)

// Échelle dynamique
var maxValeur = 6181000;
var echelle = hauteurMaxBarre / maxValeur; // Ex. 245 / 6181000 pour 540px

// Définir transformOrigin: 'bottom' pour toutes les animations
gsap.set([barreEurope, barreUSA, barreRussie, barreChine], { transformOrigin: 'bottom' });

// Réinitialiser scaleY: 0 uniquement au premier chargement
if (isFirstLoad) {
  gsap.set([barreEurope, barreUSA, barreRussie, barreChine], { scaleY: 0 });
}

// Rendre les labels invisibles à chaque changement d’année
gsap.set([labelEurope, labelUSA, labelRussie, labelChine], { opacity: 0 });

// Créer une timeline GSAP pour les barres
var tl = gsap.timeline();
if (barreEurope) tl.to(barreEurope, { scaleY: donnees.Europe / maxValeur, duration: 1, ease: "power2.out" }, 0);
if (barreUSA) tl.to(barreUSA, { scaleY: donnees.USA / maxValeur, duration: 1, ease: "power2.out" }, 0.2);
if (barreRussie) tl.to(barreRussie, { scaleY: donnees.Russie / maxValeur, duration: 1, ease: "power2.out" }, 0.4);
if (barreChine) tl.to(barreChine, { scaleY: donnees.Chine / maxValeur, duration: 1, ease: "power2.out" }, 0.6);

// Positionner les labels dynamiquement
const positionnerLabel = (label, barre, region) => {
  if (label && barre) {
    // Attendre la fin de l’animation avec requestAnimationFrame
    const attendreAnimation = () => {
      if (tl.isActive()) {
        requestAnimationFrame(attendreAnimation);
      } else {
        var conteneurRect = conteneur.getBoundingClientRect();
        var barreRect = barre.getBoundingClientRect();
        var labelHauteur = label.getBoundingClientRect().height || 30; // Hauteur réelle ou 30px
        // Calculer Y pour que le bas du label soit au sommet de la barre (0px offset)
        var y = barreRect.top - conteneurRect.top - labelHauteur - 0;
        // Limiter pour rester dans le conteneur
        y = Math.max(10, Math.min(y, conteneurRect.height - labelHauteur - 0));
        // Animer avec GSAP (position Y et opacité)
        gsap.to(label, { y: y, opacity: 1, duration: 1, ease: "power2.out" });
        console.log(`Label ${region}: y=${y}, barreRect.top=${barreRect.top}, conteneurRect.top=${conteneurRect.top}, labelHauteur=${labelHauteur}`);
      }
    };
    requestAnimationFrame(attendreAnimation);
  } else {
    console.error(`Erreur: Label ou barre non trouvé pour ${region}`);
  }
};

// Appliquer le positionnement
positionnerLabel(labelEurope, barreEurope, "Europe");
positionnerLabel(labelUSA, barreUSA, "USA");
positionnerLabel(labelRussie, barreRussie, "Russie");
positionnerLabel(labelChine, barreChine, "Chine");

// Mettre à jour les ÉTIQUETTES (inchangé)
player.SetVar("txtLabelEurope", donnees.Europe.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelUSA", donnees.USA.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelRussie", donnees.Russie.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelChine", donnees.Chine.toLocaleString('fr-FR') || "Erreur");

// Marquer que le premier chargement est terminé
isFirstLoad = false;
}

window.Script2 = function()
{
  // Données (inchangées)
const donneesIngenieurs = {
  2023: { Europe: 6000000, USA: 3500000, Russie: 4000000, Chine: 6000000 },
  2024: { Europe: 6030000, USA: 3535000, Russie: 4012000, Chine: 6090000 },
  2025: { Europe: 6060000, USA: 3570000, Russie: 4024000, Chine: 6181000 }
};

// Récupérer l’année
var player = GetPlayer();
var annee = parseInt(player.GetVar("AnneeCourante"));

// Vérifier les données
var donnees = donneesIngenieurs[annee];
if (!donnees) {
  console.error("Données non trouvées pour l’année:", annee);
  return;
}

// Appeler les BARRES
var barreEurope = document.querySelector("[data-acc-text='barreEurope']");
var barreUSA = document.querySelector("[data-acc-text='barreUSA']");
var barreRussie = document.querySelector("[data-acc-text='barreRussie']");
var barreChine = document.querySelector("[data-acc-text='barreChine']");

// Appeler les ÉTIQUETTES
var labelEurope = document.querySelector("[data-acc-text='LabelEurope']");
var labelUSA = document.querySelector("[data-acc-text='LabelUSA']");
var labelRussie = document.querySelector("[data-acc-text='LabelRussie']");
var labelChine = document.querySelector("[data-acc-text='LabelChine']");

// Vérifier les éléments
if (!barreEurope || !barreUSA || !barreRussie || !barreChine || !labelEurope || !labelUSA || !labelRussie || !labelChine) {
  console.error("Certains éléments (barres ou labels) non trouvés dans le DOM");
  return;
}

// Obtenir le conteneur (parent direct des barres)
var conteneur = barreEurope.parentElement && barreEurope.parentElement.closest('div') || 
               document.querySelector('.slide-container') || 
               document.querySelector('.slide-content') || 
               document.querySelector('.cs-slide') || 
               document.body;
if (!conteneur) {
  console.error("Conteneur non trouvé");
  return;
}
var conteneurRect = conteneur.getBoundingClientRect();
var hauteurConteneur = conteneurRect.height;
var hauteurMaxBarre = hauteurConteneur * 0.45; // 45% de la hauteur (≈245px pour 540px)

// Échelle dynamique
var maxValeur = 6181000;
var echelle = hauteurMaxBarre / maxValeur; // Ex. 245 / 6181000 pour 540px

// Réinitialiser les transformations GSAP (barres seulement)
gsap.set([barreEurope, barreUSA, barreRussie, barreChine], { scaleY: 0, transformOrigin: 'bottom' });
// Rendre les labels invisibles au démarrage
gsap.set([labelEurope, labelUSA, labelRussie, labelChine], { opacity: 0 });

// Créer une timeline GSAP pour les barres
var tl = gsap.timeline();
if (barreEurope) tl.to(barreEurope, { scaleY: donnees.Europe / maxValeur, duration: 1, ease: "power2.out" }, 0);
if (barreUSA) tl.to(barreUSA, { scaleY: donnees.USA / maxValeur, duration: 1, ease: "power2.out" }, 0.2);
if (barreRussie) tl.to(barreRussie, { scaleY: donnees.Russie / maxValeur, duration: 1, ease: "power2.out" }, 0.4);
if (barreChine) tl.to(barreChine, { scaleY: donnees.Chine / maxValeur, duration: 1, ease: "power2.out" }, 0.6);

// Positionner les labels dynamiquement
const positionnerLabel = (label, barre, region) => {
  if (label && barre) {
    // Attendre la fin de l’animation avec requestAnimationFrame
    const attendreAnimation = () => {
      if (tl.isActive()) {
        requestAnimationFrame(attendreAnimation);
      } else {
        var conteneurRect = conteneur.getBoundingClientRect();
        var barreRect = barre.getBoundingClientRect();
        var labelHauteur = label.getBoundingClientRect().height || 30; // Hauteur réelle ou 30px
        // Calculer Y pour que le bas du label soit au sommet de la barre (0px offset)
        var y = barreRect.top - conteneurRect.top - labelHauteur - 0;
        // Limiter pour rester dans le conteneur
        y = Math.max(10, Math.min(y, conteneurRect.height - labelHauteur - 0));
        // Animer avec GSAP (position Y et opacité)
        gsap.to(label, { y: y, opacity: 1, duration: 1, ease: "power2.out" });
        console.log(`Label ${region}: y=${y}, barreRect.top=${barreRect.top}, conteneurRect.top=${conteneurRect.top}, labelHauteur=${labelHauteur}`);
      }
    };
    requestAnimationFrame(attendreAnimation);
  } else {
    console.error(`Erreur: Label ou barre non trouvé pour ${region}`);
  }
};

// Appliquer le positionnement
positionnerLabel(labelEurope, barreEurope, "Europe");
positionnerLabel(labelUSA, barreUSA, "USA");
positionnerLabel(labelRussie, barreRussie, "Russie");
positionnerLabel(labelChine, barreChine, "Chine");

// Mettre à jour les ÉTIQUETTES (inchangé)
player.SetVar("txtLabelEurope", donnees.Europe.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelUSA", donnees.USA.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelRussie", donnees.Russie.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelChine", donnees.Chine.toLocaleString('fr-FR') || "Erreur");
}

window.Script3 = function()
{
  // Données (inchangées)
const donneesIngenieurs = {
  2023: { Europe: 6000000, USA: 3500000, Russie: 4000000, Chine: 6000000 },
  2024: { Europe: 6030000, USA: 3535000, Russie: 4012000, Chine: 6090000 },
  2025: { Europe: 6060000, USA: 3570000, Russie: 4024000, Chine: 6181000 }
};

// Récupérer l’année
var player = GetPlayer();
var annee = parseInt(player.GetVar("AnneeCourante"));

// Vérifier les données
var donnees = donneesIngenieurs[annee];
if (!donnees) {
  console.error("Données non trouvées pour l’année:", annee);
  return;
}

// Appeler les BARRES
var barreEurope = document.querySelector("[data-acc-text='barreEurope']");
var barreUSA = document.querySelector("[data-acc-text='barreUSA']");
var barreRussie = document.querySelector("[data-acc-text='barreRussie']");
var barreChine = document.querySelector("[data-acc-text='barreChine']");

// Appeler les ÉTIQUETTES
var labelEurope = document.querySelector("[data-acc-text='LabelEurope']");
var labelUSA = document.querySelector("[data-acc-text='LabelUSA']");
var labelRussie = document.querySelector("[data-acc-text='LabelRussie']");
var labelChine = document.querySelector("[data-acc-text='LabelChine']");

// Vérifier les éléments
if (!barreEurope || !barreUSA || !barreRussie || !barreChine || !labelEurope || !labelUSA || !labelRussie || !labelChine) {
  console.error("Certains éléments (barres ou labels) non trouvés dans le DOM");
  return;
}

// Obtenir le conteneur (parent direct des barres)
var conteneur = barreEurope.parentElement && barreEurope.parentElement.closest('div') || 
               document.querySelector('.slide-container') || 
               document.querySelector('.slide-content') || 
               document.querySelector('.cs-slide') || 
               document.body;
if (!conteneur) {
  console.error("Conteneur non trouvé");
  return;
}
var conteneurRect = conteneur.getBoundingClientRect();
var hauteurConteneur = conteneurRect.height;
var hauteurMaxBarre = hauteurConteneur * 0.45; // 45% de la hauteur (≈245px pour 540px)

// Échelle dynamique
var maxValeur = 6181000;
var echelle = hauteurMaxBarre / maxValeur; // Ex. 245 / 6181000 pour 540px

// Réinitialiser les transformations GSAP (barres seulement)
gsap.set([barreEurope, barreUSA, barreRussie, barreChine], { scaleY: 0, transformOrigin: 'bottom' });
// Rendre les labels invisibles au démarrage
gsap.set([labelEurope, labelUSA, labelRussie, labelChine], { opacity: 0 });

// Créer une timeline GSAP pour les barres
var tl = gsap.timeline();
if (barreEurope) tl.to(barreEurope, { scaleY: donnees.Europe / maxValeur, duration: 1, ease: "power2.out" }, 0);
if (barreUSA) tl.to(barreUSA, { scaleY: donnees.USA / maxValeur, duration: 1, ease: "power2.out" }, 0.2);
if (barreRussie) tl.to(barreRussie, { scaleY: donnees.Russie / maxValeur, duration: 1, ease: "power2.out" }, 0.4);
if (barreChine) tl.to(barreChine, { scaleY: donnees.Chine / maxValeur, duration: 1, ease: "power2.out" }, 0.6);

// Positionner les labels dynamiquement
const positionnerLabel = (label, barre, region) => {
  if (label && barre) {
    // Attendre la fin de l’animation avec requestAnimationFrame
    const attendreAnimation = () => {
      if (tl.isActive()) {
        requestAnimationFrame(attendreAnimation);
      } else {
        var conteneurRect = conteneur.getBoundingClientRect();
        var barreRect = barre.getBoundingClientRect();
        var labelHauteur = label.getBoundingClientRect().height || 30; // Hauteur réelle ou 30px
        // Calculer Y pour que le bas du label soit au sommet de la barre (0px offset)
        var y = barreRect.top - conteneurRect.top - labelHauteur - 0;
        // Limiter pour rester dans le conteneur
        y = Math.max(10, Math.min(y, conteneurRect.height - labelHauteur - 0));
        // Animer avec GSAP (position Y et opacité)
        gsap.to(label, { y: y, opacity: 1, duration: 1, ease: "power2.out" });
        console.log(`Label ${region}: y=${y}, barreRect.top=${barreRect.top}, conteneurRect.top=${conteneurRect.top}, labelHauteur=${labelHauteur}`);
      }
    };
    requestAnimationFrame(attendreAnimation);
  } else {
    console.error(`Erreur: Label ou barre non trouvé pour ${region}`);
  }
};

// Appliquer le positionnement
positionnerLabel(labelEurope, barreEurope, "Europe");
positionnerLabel(labelUSA, barreUSA, "USA");
positionnerLabel(labelRussie, barreRussie, "Russie");
positionnerLabel(labelChine, barreChine, "Chine");

// Mettre à jour les ÉTIQUETTES (inchangé)
player.SetVar("txtLabelEurope", donnees.Europe.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelUSA", donnees.USA.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelRussie", donnees.Russie.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelChine", donnees.Chine.toLocaleString('fr-FR') || "Erreur");
}

window.Script4 = function()
{
  // Données (inchangées)
const donneesIngenieurs = {
  2023: { Europe: 6000000, USA: 3500000, Russie: 4000000, Chine: 6000000 },
  2024: { Europe: 6030000, USA: 3535000, Russie: 4012000, Chine: 6090000 },
  2025: { Europe: 6060000, USA: 3570000, Russie: 4024000, Chine: 6181000 }
};

// Récupérer l’année
var player = GetPlayer();
var annee = parseInt(player.GetVar("AnneeCourante"));

// Vérifier les données
var donnees = donneesIngenieurs[annee];
if (!donnees) {
  console.error("Données non trouvées pour l’année:", annee);
  return;
}

// Appeler les BARRES
var barreEurope = document.querySelector("[data-acc-text='barreEurope']");
var barreUSA = document.querySelector("[data-acc-text='barreUSA']");
var barreRussie = document.querySelector("[data-acc-text='barreRussie']");
var barreChine = document.querySelector("[data-acc-text='barreChine']");

// Appeler les ÉTIQUETTES
var labelEurope = document.querySelector("[data-acc-text='LabelEurope']");
var labelUSA = document.querySelector("[data-acc-text='LabelUSA']");
var labelRussie = document.querySelector("[data-acc-text='LabelRussie']");
var labelChine = document.querySelector("[data-acc-text='LabelChine']");

// Vérifier les éléments
if (!barreEurope || !barreUSA || !barreRussie || !barreChine || !labelEurope || !labelUSA || !labelRussie || !labelChine) {
  console.error("Certains éléments (barres ou labels) non trouvés dans le DOM");
  return;
}

// Obtenir le conteneur (parent direct des barres)
var conteneur = barreEurope.parentElement && barreEurope.parentElement.closest('div') || 
               document.querySelector('.slide-container') || 
               document.querySelector('.slide-content') || 
               document.querySelector('.cs-slide') || 
               document.body;
if (!conteneur) {
  console.error("Conteneur non trouvé");
  return;
}
var conteneurRect = conteneur.getBoundingClientRect();
var hauteurConteneur = conteneurRect.height;
var hauteurMaxBarre = hauteurConteneur * 0.45; // 45% de la hauteur (≈245px pour 540px)

// Échelle dynamique
var maxValeur = 6181000;
var echelle = hauteurMaxBarre / maxValeur; // Ex. 245 / 6181000 pour 540px

// Réinitialiser les transformations GSAP (barres seulement)
gsap.set([barreEurope, barreUSA, barreRussie, barreChine], { scaleY: 0, transformOrigin: 'bottom' });
// Rendre les labels invisibles au démarrage
gsap.set([labelEurope, labelUSA, labelRussie, labelChine], { opacity: 0 });

// Créer une timeline GSAP pour les barres
var tl = gsap.timeline();
if (barreEurope) tl.to(barreEurope, { scaleY: donnees.Europe / maxValeur, duration: 1, ease: "power2.out" }, 0);
if (barreUSA) tl.to(barreUSA, { scaleY: donnees.USA / maxValeur, duration: 1, ease: "power2.out" }, 0.2);
if (barreRussie) tl.to(barreRussie, { scaleY: donnees.Russie / maxValeur, duration: 1, ease: "power2.out" }, 0.4);
if (barreChine) tl.to(barreChine, { scaleY: donnees.Chine / maxValeur, duration: 1, ease: "power2.out" }, 0.6);

// Positionner les labels dynamiquement
const positionnerLabel = (label, barre, region) => {
  if (label && barre) {
    // Attendre la fin de l’animation avec requestAnimationFrame
    const attendreAnimation = () => {
      if (tl.isActive()) {
        requestAnimationFrame(attendreAnimation);
      } else {
        var conteneurRect = conteneur.getBoundingClientRect();
        var barreRect = barre.getBoundingClientRect();
        var labelHauteur = label.getBoundingClientRect().height || 30; // Hauteur réelle ou 30px
        // Calculer Y pour que le bas du label soit au sommet de la barre (0px offset)
        var y = barreRect.top - conteneurRect.top - labelHauteur - 0;
        // Limiter pour rester dans le conteneur
        y = Math.max(10, Math.min(y, conteneurRect.height - labelHauteur - 0));
        // Animer avec GSAP (position Y et opacité)
        gsap.to(label, { y: y, opacity: 1, duration: 1, ease: "power2.out" });
        console.log(`Label ${region}: y=${y}, barreRect.top=${barreRect.top}, conteneurRect.top=${conteneurRect.top}, labelHauteur=${labelHauteur}`);
      }
    };
    requestAnimationFrame(attendreAnimation);
  } else {
    console.error(`Erreur: Label ou barre non trouvé pour ${region}`);
  }
};

// Appliquer le positionnement
positionnerLabel(labelEurope, barreEurope, "Europe");
positionnerLabel(labelUSA, barreUSA, "USA");
positionnerLabel(labelRussie, barreRussie, "Russie");
positionnerLabel(labelChine, barreChine, "Chine");

// Mettre à jour les ÉTIQUETTES (inchangé)
player.SetVar("txtLabelEurope", donnees.Europe.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelUSA", donnees.USA.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelRussie", donnees.Russie.toLocaleString('fr-FR') || "Erreur");
player.SetVar("txtLabelChine", donnees.Chine.toLocaleString('fr-FR') || "Erreur");
}

};
