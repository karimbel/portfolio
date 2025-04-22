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
  // Données
const donneesIngenieurs = {
  2023: { Europe: 250000, USA: 180000, Russie: 90000, Chine: 450000 },
  2024: { Europe: 260000, USA: 190000, Russie: 95000, Chine: 470000 },
  2025: { Europe: 270000, USA: 200000, Russie: 100000, Chine: 490000 }
};

// Récupérer l’année
var player = GetPlayer();
var annee = parseInt(player.GetVar("AnneeCourante"));

// Vérifier les données
var donnees = donneesIngenieurs[annee];
if (!donnees) return;

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

// Injecter une feuille de style CSS dynamique
var style = document.createElement("style");
style.innerHTML = `
  [data-acc-text='barreEurope'], [data-acc-text='barreUSA'], [data-acc-text='barreRussie'], [data-acc-text='barreChine'] {
    background-color: rgba(0, 0, 255, 0.1) !important; /* Test visuel */
  }
  [data-acc-text='barreEurope'] img, [data-acc-text='barreUSA'] img, [data-acc-text='barreRussie'] img, [data-acc-text='barreChine'] img {
    width: 100% !important;
    height: auto !important;
    object-fit: contain !important;
    position: absolute !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
  }
`;
document.head.appendChild(style);

// Échelle (245px pour 490,000 ingénieurs)
var echelle = 245 / 490000; // ≈ 0.0005
var maxValeur = 490000;
var hauteurMaxDiapositive = 540;

// Créer une timeline GSAP
var tl = gsap.timeline();
if (barreEurope) tl.to(barreEurope, { scaleY: donnees.Europe / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0);
if (barreUSA) tl.to(barreUSA, { scaleY: donnees.USA / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0.2);
if (barreRussie) tl.to(barreRussie, { scaleY: donnees.Russie / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0.4);
if (barreChine) tl.to(barreChine, { scaleY: donnees.Chine / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0.6);

// Animer les ÉTIQUETTES (position Y)
if (labelEurope) {
  var yEurope = Math.max(20, hauteurMaxDiapositive - donnees.Europe * echelle - 30);
  gsap.to(labelEurope, { y: yEurope, duration: 1, ease: "power2.out" });
}
if (labelUSA) {
  var yUSA = Math.max(20, hauteurMaxDiapositive - donnees.USA * echelle - 30);
  gsap.to(labelUSA, { y: yUSA, duration: 1, ease: "power2.out", delay: 0.2 });
}
if (labelRussie) {
  var yRussie = Math.max(20, hauteurMaxDiapositive - donnees.Russie * echelle - 30);
  gsap.to(labelRussie, { y: yRussie, duration: 1, ease: "power2.out", delay: 0.4 });
}
if (labelChine) {
  var yChine = Math.max(20, hauteurMaxDiapositive - donnees.Chine * echelle - 30);
  gsap.to(labelChine, { y: yChine, duration: 1, ease: "power2.out", delay: 0.6 });
}

// Mettre à jour les ÉTIQUETTES
player.SetVar("LabelEurope", donnees.Europe || "Erreur");
player.SetVar("LabelUSA", donnees.USA || "Erreur");
player.SetVar("LabelRussie", donnees.Russie || "Erreur");
player.SetVar("LabelChine", donnees.Chine || "Erreur");
}

window.Script2 = function()
{
  // Données
const donneesIngenieurs = {
  2023: { Europe: 250000, USA: 180000, Russie: 90000, Chine: 450000 },
  2024: { Europe: 260000, USA: 190000, Russie: 95000, Chine: 470000 },
  2025: { Europe: 270000, USA: 200000, Russie: 100000, Chine: 490000 }
};

// Récupérer l’année
var player = GetPlayer();
var annee = parseInt(player.GetVar("AnneeCourante"));

// Vérifier les données
var donnees = donneesIngenieurs[annee];
if (!donnees) return;

// Appeler les BARRES
var barreEurope = document.querySelector("[data-acc-text='barreEurope']");
var barreUSA = document.querySelector("[data-acc-text='barreUSA']");
var barreRussie = document.querySelector("[data-acc-text='barreRussie']");
var barreChine = document.querySelector("[data-acc-text='barreChine']");

// Ajuster les styles des images de fond (intégrées via Storyline)
if (barreEurope) {
  barreEurope.style.setProperty("background-color", "rgba(0, 0, 255, 0.1)", "important"); // Test visuel
  let imgEurope = barreEurope.querySelector("img");
  if (imgEurope) {
    imgEurope.style.setProperty("width", "100%", "important");
    imgEurope.style.setProperty("height", "auto", "important");
    imgEurope.style.setProperty("object-fit", "contain", "important");
    imgEurope.style.setProperty("position", "absolute", "important");
    imgEurope.style.setProperty("top", "50%", "important");
    imgEurope.style.setProperty("transform", "translateY(-50%)", "important");
  }
}
if (barreUSA) {
  barreUSA.style.setProperty("background-color", "rgba(0, 0, 255, 0.1)", "important"); // Test visuel
  let imgUSA = barreUSA.querySelector("img");
  if (imgUSA) {
    imgUSA.style.setProperty("width", "100%", "important");
    imgUSA.style.setProperty("height", "auto", "important");
    imgUSA.style.setProperty("object-fit", "contain", "important");
    imgUSA.style.setProperty("position", "absolute", "important");
    imgUSA.style.setProperty("top", "50%", "important");
    imgUSA.style.setProperty("transform", "translateY(-50%)", "important");
  }
}
if (barreRussie) {
  barreRussie.style.setProperty("background-color", "rgba(0, 0, 255, 0.1)", "important"); // Test visuel
  let imgRussie = barreRussie.querySelector("img");
  if (imgRussie) {
    imgRussie.style.setProperty("width", "100%", "important");
    imgRussie.style.setProperty("height", "auto", "important");
    imgRussie.style.setProperty("object-fit", "contain", "important");
    imgRussie.style.setProperty("position", "absolute", "important");
    imgRussie.style.setProperty("top", "50%", "important");
    imgRussie.style.setProperty("transform", "translateY(-50%)", "important");
  }
}
if (barreChine) {
  barreChine.style.setProperty("background-color", "rgba(0, 0, 255, 0.1)", "important"); // Test visuel
  let imgChine = barreChine.querySelector("img");
  if (imgChine) {
    imgChine.style.setProperty("width", "100%", "important");
    imgChine.style.setProperty("height", "auto", "important");
    imgChine.style.setProperty("object-fit", "contain", "important");
    imgChine.style.setProperty("position", "absolute", "important");
    imgChine.style.setProperty("top", "50%", "important");
    imgChine.style.setProperty("transform", "translateY(-50%)", "important");
  }
}

// Appeler les ÉTIQUETTES
var labelEurope = document.querySelector("[data-acc-text='LabelEurope']");
var labelUSA = document.querySelector("[data-acc-text='LabelUSA']");
var labelRussie = document.querySelector("[data-acc-text='LabelRussie']");
var labelChine = document.querySelector("[data-acc-text='LabelChine']");

// Échelle (245px pour 490,000 ingénieurs)
var echelle = 245 / 490000; // ≈ 0.0005
var maxValeur = 490000;
var hauteurMaxDiapositive = 540;

// Créer une timeline GSAP
var tl = gsap.timeline();
if (barreEurope) tl.to(barreEurope, { scaleY: donnees.Europe / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0);
if (barreUSA) tl.to(barreUSA, { scaleY: donnees.USA / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0.2);
if (barreRussie) tl.to(barreRussie, { scaleY: donnees.Russie / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0.4);
if (barreChine) tl.to(barreChine, { scaleY: donnees.Chine / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0.6);

// Animer les ÉTIQUETTES (position Y)
if (labelEurope) {
  var yEurope = Math.max(20, hauteurMaxDiapositive - donnees.Europe * echelle - 30);
  gsap.to(labelEurope, { y: yEurope, duration: 1, ease: "power2.out" });
}
if (labelUSA) {
  var yUSA = Math.max(20, hauteurMaxDiapositive - donnees.USA * echelle - 30);
  gsap.to(labelUSA, { y: yUSA, duration: 1, ease: "power2.out", delay: 0.2 });
}
if (labelRussie) {
  var yRussie = Math.max(20, hauteurMaxDiapositive - donnees.Russie * echelle - 30);
  gsap.to(labelRussie, { y: yRussie, duration: 1, ease: "power2.out", delay: 0.4 });
}
if (labelChine) {
  var yChine = Math.max(20, hauteurMaxDiapositive - donnees.Chine * echelle - 30);
  gsap.to(labelChine, { y: yChine, duration: 1, ease: "power2.out", delay: 0.6 });
}

// Mettre à jour les ÉTIQUETTES
player.SetVar("LabelEurope", donnees.Europe || "Erreur");
player.SetVar("LabelUSA", donnees.USA || "Erreur");
player.SetVar("LabelRussie", donnees.Russie || "Erreur");
player.SetVar("LabelChine", donnees.Chine || "Erreur");
}

window.Script3 = function()
{
  // Données
const donneesIngenieurs = {
  2023: { Europe: 250000, USA: 180000, Russie: 90000, Chine: 450000 },
  2024: { Europe: 260000, USA: 190000, Russie: 95000, Chine: 470000 },
  2025: { Europe: 270000, USA: 200000, Russie: 100000, Chine: 490000 }
};

// Récupérer l’année
var player = GetPlayer();
var annee = parseInt(player.GetVar("AnneeCourante"));

// Vérifier les données
var donnees = donneesIngenieurs[annee];
if (!donnees) return;

// Appeler les BARRES
var barreEurope = document.querySelector("[data-acc-text='barreEurope']");
var barreUSA = document.querySelector("[data-acc-text='barreUSA']");
var barreRussie = document.querySelector("[data-acc-text='barreRussie']");
var barreChine = document.querySelector("[data-acc-text='barreChine']");

// Ajuster les styles des images de fond (intégrées via Storyline)
if (barreEurope) {
  barreEurope.style.setProperty("background-color", "rgba(0, 0, 255, 0.1)", "important"); // Test visuel
  let imgEurope = barreEurope.querySelector("img");
  if (imgEurope) {
    imgEurope.style.setProperty("width", "100%", "important");
    imgEurope.style.setProperty("height", "auto", "important");
    imgEurope.style.setProperty("object-fit", "contain", "important");
    imgEurope.style.setProperty("position", "absolute", "important");
    imgEurope.style.setProperty("top", "50%", "important");
    imgEurope.style.setProperty("transform", "translateY(-50%)", "important");
  }
}
if (barreUSA) {
  barreUSA.style.setProperty("background-color", "rgba(0, 0, 255, 0.1)", "important"); // Test visuel
  let imgUSA = barreUSA.querySelector("img");
  if (imgUSA) {
    imgUSA.style.setProperty("width", "100%", "important");
    imgUSA.style.setProperty("height", "auto", "important");
    imgUSA.style.setProperty("object-fit", "contain", "important");
    imgUSA.style.setProperty("position", "absolute", "important");
    imgUSA.style.setProperty("top", "50%", "important");
    imgUSA.style.setProperty("transform", "translateY(-50%)", "important");
  }
}
if (barreRussie) {
  barreRussie.style.setProperty("background-color", "rgba(0, 0, 255, 0.1)", "important"); // Test visuel
  let imgRussie = barreRussie.querySelector("img");
  if (imgRussie) {
    imgRussie.style.setProperty("width", "100%", "important");
    imgRussie.style.setProperty("height", "auto", "important");
    imgRussie.style.setProperty("object-fit", "contain", "important");
    imgRussie.style.setProperty("position", "absolute", "important");
    imgRussie.style.setProperty("top", "50%", "important");
    imgRussie.style.setProperty("transform", "translateY(-50%)", "important");
  }
}
if (barreChine) {
  barreChine.style.setProperty("background-color", "rgba(0, 0, 255, 0.1)", "important"); // Test visuel
  let imgChine = barreChine.querySelector("img");
  if (imgChine) {
    imgChine.style.setProperty("width", "100%", "important");
    imgChine.style.setProperty("height", "auto", "important");
    imgChine.style.setProperty("object-fit", "contain", "important");
    imgChine.style.setProperty("position", "absolute", "important");
    imgChine.style.setProperty("top", "50%", "important");
    imgChine.style.setProperty("transform", "translateY(-50%)", "important");
  }
}

// Appeler les ÉTIQUETTES
var labelEurope = document.querySelector("[data-acc-text='LabelEurope']");
var labelUSA = document.querySelector("[data-acc-text='LabelUSA']");
var labelRussie = document.querySelector("[data-acc-text='LabelRussie']");
var labelChine = document.querySelector("[data-acc-text='LabelChine']");

// Échelle (245px pour 490,000 ingénieurs)
var echelle = 245 / 490000; // ≈ 0.0005
var maxValeur = 490000;
var hauteurMaxDiapositive = 540;

// Créer une timeline GSAP
var tl = gsap.timeline();
if (barreEurope) tl.to(barreEurope, { scaleY: donnees.Europe / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0);
if (barreUSA) tl.to(barreUSA, { scaleY: donnees.USA / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0.2);
if (barreRussie) tl.to(barreRussie, { scaleY: donnees.Russie / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0.4);
if (barreChine) tl.to(barreChine, { scaleY: donnees.Chine / maxValeur, duration: 1, ease: "power2.out", transformOrigin: "bottom" }, 0.6);

// Animer les ÉTIQUETTES (position Y)
if (labelEurope) {
  var yEurope = Math.max(20, hauteurMaxDiapositive - donnees.Europe * echelle - 30);
  gsap.to(labelEurope, { y: yEurope, duration: 1, ease: "power2.out" });
}
if (labelUSA) {
  var yUSA = Math.max(20, hauteurMaxDiapositive - donnees.USA * echelle - 30);
  gsap.to(labelUSA, { y: yUSA, duration: 1, ease: "power2.out", delay: 0.2 });
}
if (labelRussie) {
  var yRussie = Math.max(20, hauteurMaxDiapositive - donnees.Russie * echelle - 30);
  gsap.to(labelRussie, { y: yRussie, duration: 1, ease: "power2.out", delay: 0.4 });
}
if (labelChine) {
  var yChine = Math.max(20, hauteurMaxDiapositive - donnees.Chine * echelle - 30);
  gsap.to(labelChine, { y: yChine, duration: 1, ease: "power2.out", delay: 0.6 });
}

// Mettre à jour les ÉTIQUETTES
player.SetVar("LabelEurope", donnees.Europe || "Erreur");
player.SetVar("LabelUSA", donnees.USA || "Erreur");
player.SetVar("LabelRussie", donnees.Russie || "Erreur");
player.SetVar("LabelChine", donnees.Chine || "Erreur");
}

};
