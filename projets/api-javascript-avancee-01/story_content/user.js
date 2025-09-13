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
  // Récupérer l'ID initial de la zone de texte '5pWUn2CSOCK'
const blocCompteur = object('5pWUn2CSOCK');
// Récupérer la valeur initiale de la variable Storyline 'nombreCompteur'
const nombreCompteur = getVar("nombreCompteur") || 0; // Valeur par défaut 0 si non définie

// Objet temporaire pour l'animation GSAP
var compteur = { value: nombreCompteur };

// Animation GSAP
var animation = gsap.to(compteur, {
    value: 100, // Valeur finale
    duration: 2, // 2 secondes
    ease: "circ.out", // Easing circOut
    onUpdate: function() {
        // Met à jour la variable Storyline à chaque frame
        setVar("nombreCompteur", Math.round(compteur.value));
        // Met à jour la transparence avec filter opacity (en pourcentage)
        blocCompteur.style.filter = 'opacity(' + Math.round(compteur.value) + '%)';
    }
});

// Ajoute l'animation à la timeline de Storyline
addToTimeline(animation);
}

};
