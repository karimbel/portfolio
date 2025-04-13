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
  // Vérifier que le script s’exécute
console.log("Script JavaScript chargé");

// Récupérer le player Storyline
var player = GetPlayer();

// Générer une couleur hexadécimale aléatoire
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Définir une couleur aléatoire au lancement
var couleurInitiale = getRandomColor();
console.log("*** Couleur initiale aléatoire (pleine plage) :", couleurInitiale, "***");
player.SetVar("varCouleurTexte", couleurInitiale);

// Définir direction Aléatoire au lancement
console.log("*** Direction initiale : Aléatoire ***");
player.SetVar("varDirection", "Aléatoire");

// Variables globales
var animationActive = player.GetVar("varAnimationActive") || true;

var conteneur = document.querySelector("[data-acc-text='ConteneurAnim']");

// Importer Google Fonts
var link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Oswald:wght@400;700&family=Bebas+Neue&family=Pacifico&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

// Liste des polices
var polices = ["Poppins", "Roboto", "Montserrat", "Oswald", "Bebas Neue", "Pacifico"];

// Fonction pour générer un nombre aléatoire
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Fonction pour nettoyer le texte (pour la définition)
function cleanText(text) {
  return text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

// Fonction pour récupérer la définition
function recupererDefinition(champLibre) {
  console.log("Recherche de la définition pour :", champLibre);
  var url = "https://www.cnrtl.fr/definition/" + encodeURIComponent(champLibre);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(xhr.responseText, "text/html");
      var definitionElement = doc.querySelector(".tlf_cdefinition");
      var definition = definitionElement && definitionElement.textContent 
        ? cleanText(definitionElement.textContent)
        : "Aucune définition n'a été trouvée à votre mot";
      console.log("Définition récupérée :", definition);
      player.SetVar("varTxtDefinition", definition);
    } else if (xhr.readyState === 4) {
      var definition = "Aucune définition n'a été trouvée à votre mot";
      console.log("Erreur HTTP, définition par défaut :", definition);
      player.SetVar("varTxtDefinition", definition);
    }
  };

  xhr.onerror = function () {
    var definition = "Aucune définition n'a été trouvée à votre mot";
    console.log("Erreur réseau, définition par défaut :", definition);
    player.SetVar("varTxtDefinition", definition);
  };

  xhr.send();
}

// Fonction pour créer et animer un clone
function animerTexte() {
  if (!animationActive) return; // Stopper si désactivé

  // Relire les variables à chaque cycle
  var policeChoisie = player.GetVar("varPoliceChoisie") || "Aléatoire";
  var texte = player.GetVar("varChampLibre") || "Storyline360";
  var tailleTexteMax = player.GetVar("varTailleTexteMax") || 48;
  var couleurTexte = player.GetVar("varCouleurTexte") || "#FFFFFF";
  var direction = player.GetVar("varDirection") || "Aléatoire";

  console.log("Animation avec :", { texte, policeChoisie, tailleTexteMax, couleurTexte, direction });

  var span = document.createElement("span");
  span.innerText = texte;
  span.style.position = "absolute";
  
  // Couleur du texte
  span.style.color = couleurTexte;
  
  // Police du texte
  var policeUtilisee = policeChoisie;
  if (policeChoisie === "Aléatoire") {
    policeUtilisee = polices[Math.floor(random(0, polices.length))];
  }
  span.style.fontFamily = policeUtilisee + ", sans-serif";
  
  // Taille du texte
  span.style.fontSize = random(16, tailleTexteMax) + "px";
  span.style.pointerEvents = "none";
  conteneur.appendChild(span);

  // Position initiale
  var startX = random(0, window.innerWidth);
  var startY = random(0, window.innerHeight);
  span.style.left = startX + "px";
  span.style.top = startY + "px";

  // Direction
  var endX, endY;
  if (direction === "Aléatoire") {
    var dir = Math.floor(random(0, 4));
    switch (dir) {
      case 0: // Droite
        endX = window.innerWidth + 100;
        endY = random(0, window.innerHeight);
        break;
      case 1: // Gauche
        endX = -100;
        endY = random(0, window.innerHeight);
        break;
      case 2: // Bas
        endX = random(0, window.innerWidth);
        endY = window.innerHeight + 100;
        break;
      case 3: // Haut
        endX = random(0, window.innerWidth);
        endY = -100;
        break;
    }
  } else {
    switch (direction) {
      case "Droite":
        endX = window.innerWidth + 100;
        endY = random(0, window.innerHeight);
        break;
      case "Gauche":
        endX = -100;
        endY = random(0, window.innerHeight);
        break;
      case "Bas":
        endX = random(0, window.innerWidth);
        endY = window.innerHeight + 100;
        break;
      case "Haut":
        endX = random(0, window.innerWidth);
        endY = -100;
        break;
    }
  }

  // Animation GSAP
  gsap.to(span, {
    x: endX - startX,
    y: endY - startY,
    scale: random(0.5, 6),
    rotation: random(-180, 180),
    opacity: 0,
    duration: random(2, 5),
    ease: "sine.inOut",
    onComplete: function() {
      span.remove();
    }
  });
}

// Créer des clones en continu
var intervalId;
function lancerAnimationContinue() {
  console.log("lancerAnimationContinue appelé");

  if (!animationActive) {
    clearTimeout(intervalId);
    console.log("Animation désactivée");
    return;
  }

  // Relire varDelaiAnimation à chaque cycle
  var delaiAnimation = player.GetVar("varDelaiAnimation") || 300;

  // Récupérer la définition pour varTxtDefinition
  var texte = player.GetVar("varChampLibre") || "Storyline360";
  if (texte && texte !== "Storyline360") {
    recupererDefinition(texte);
  } else {
    player.SetVar("varTxtDefinition", "");
  }

  animerTexte();
  intervalId = setTimeout(lancerAnimationContinue, delaiAnimation);
}

// Lancer l'animation immédiatement
if (animationActive) {
  lancerAnimationContinue();
}
}

};
