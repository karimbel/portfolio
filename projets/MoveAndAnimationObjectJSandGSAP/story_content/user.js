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
  // Récupérer l'objet cercleRouge : ID 5jqq23Z5RNx
const cercleRouge = object('5jqq23Z5RNx');
// Récupérer l'objet sablier : ID 6OydTkUHyTL
const sablier = object('6OydTkUHyTL');

// Initialiser le player
var player = GetPlayer();

// Récupérer la variable PositionCercle de Storyline
var positionCercleInitiale = player.GetVar("PositionCercle");

// Définir les positions du plateau (coordonnées pour chaque intersection A1 à I9)
const positions = {
  "A1": { x: 60, y: 60 }, "A2": { x: 110, y: 60 }, "A3": { x: 160, y: 60 }, "A4": { x: 210, y: 60 }, "A5": { x: 260, y: 60 }, "A6": { x: 310, y: 60 }, "A7": { x: 360, y: 60 }, "A8": { x: 410, y: 60 }, "A9": { x: 460, y: 60 },
  "B1": { x: 60, y: 110 }, "B2": { x: 110, y: 110 }, "B3": { x: 160, y: 110 }, "B4": { x: 210, y: 110 }, "B5": { x: 260, y: 110 }, "B6": { x: 310, y: 110 }, "B7": { x: 360, y: 110 }, "B8": { x: 410, y: 110 }, "B9": { x: 460, y: 110 },
  "C1": { x: 60, y: 160 }, "C2": { x: 110, y: 160 }, "C3": { x: 160, y: 160 }, "C4": { x: 210, y: 160 }, "C5": { x: 260, y: 160 }, "C6": { x: 310, y: 160 }, "C7": { x: 360, y: 160 }, "C8": { x: 410, y: 160 }, "C9": { x: 460, y: 160 },
  "D1": { x: 60, y: 210 }, "D2": { x: 110, y: 210 }, "D3": { x: 160, y: 210 }, "D4": { x: 210, y: 210 }, "D5": { x: 260, y: 210 }, "D6": { x: 310, y: 210 }, "D7": { x: 360, y: 210 }, "D8": { x: 410, y: 210 }, "D9": { x: 460, y: 210 },
  "E1": { x: 60, y: 260 }, "E2": { x: 110, y: 260 }, "E3": { x: 160, y: 260 }, "E4": { x: 210, y: 260 }, "E5": { x: 260, y: 260 }, "E6": { x: 310, y: 260 }, "E7": { x: 360, y: 260 }, "E8": { x: 410, y: 260 }, "E9": { x: 460, y: 260 },
  "F1": { x: 60, y: 310 }, "F2": { x: 110, y: 310 }, "F3": { x: 160, y: 310 }, "F4": { x: 210, y: 310 }, "F5": { x: 260, y: 310 }, "F6": { x: 310, y: 310 }, "F7": { x: 360, y: 310 }, "F8": { x: 410, y: 310 }, "F9": { x: 460, y: 310 },
  "G1": { x: 60, y: 360 }, "G2": { x: 110, y: 360 }, "G3": { x: 160, y: 360 }, "G4": { x: 210, y: 360 }, "G5": { x: 260, y: 360 }, "G6": { x: 310, y: 360 }, "G7": { x: 360, y: 360 }, "G8": { x: 410, y: 360 }, "G9": { x: 460, y: 360 },
  "H1": { x: 60, y: 410 }, "H2": { x: 110, y: 410 }, "H3": { x: 160, y: 410 }, "H4": { x: 210, y: 410 }, "H5": { x: 260, y: 410 }, "H6": { x: 310, y: 410 }, "H7": { x: 360, y: 410 }, "H8": { x: 410, y: 410 }, "H9": { x: 460, y: 410 },
  "I1": { x: 60, y: 460 }, "I2": { x: 110, y: 460 }, "I3": { x: 160, y: 460 }, "I4": { x: 210, y: 460 }, "I5": { x: 260, y: 460 }, "I6": { x: 310, y: 460 }, "I7": { x: 360, y: 460 }, "I8": { x: 410, y: 460 }, "I9": { x: 460, y: 460 }
};

// Fonction pour générer une position aléatoire (A à I, 1 à 9)
function genererPositionAleatoire() {
  const lettres = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const chiffres = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const lettreAleatoire = lettres[Math.floor(Math.random() * lettres.length)];
  const chiffreAleatoire = chiffres[Math.floor(Math.random() * chiffres.length)];
  return lettreAleatoire + chiffreAleatoire;
}

positionAleatoire = genererPositionAleatoire();

// Fonction pour initialiser la position de cercleRouge
function initialiserCercle(positionCercleInitiale, positionAleatoire) {
  // Position Initiale : positionCercleInitiale
  // Position Aléatoire : positionAleatoire
  deplacerCercle(positionAleatoire);
  positionCercleInitiale = positionAleatoire;
}

// Fonction pour déplacer cercleRouge de la position actuelle vers une nouvelle position en pas
function deplacerCercle(nouvellePosition) {
  let positionActuelle = positionCercleInitiale || positionAleatoire;
  const lettres = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const chiffres = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const lettreActuelle = positionActuelle[0];
  const chiffreActuel = parseInt(positionActuelle.slice(1));
  const lettreNouvelle = nouvellePosition[0];
  const chiffreNouveau = parseInt(nouvellePosition.slice(1));

  // Calculer les étapes du chemin, incluant la position initiale
  const chemin = [positionActuelle];
  // Étape initiale : positionActuelle

  // Animation verticale (changement de lettre, ex. A1 -> E1)
  const indexLettreActuelle = lettres.indexOf(lettreActuelle);
  const indexLettreNouvelle = lettres.indexOf(lettreNouvelle);
  if (indexLettreActuelle < indexLettreNouvelle) {
    for (let i = indexLettreActuelle + 1; i <= indexLettreNouvelle; i++) {
      const position = lettres[i] + chiffreActuel;
      chemin.push(position);
      // Étape verticale ${i - indexLettreActuelle}: ${position}
    }
  } else if (indexLettreActuelle > indexLettreNouvelle) {
    for (let i = indexLettreActuelle - 1; i >= indexLettreNouvelle; i--) {
      const position = lettres[i] + chiffreActuel;
      chemin.push(position);
      // Étape verticale ${indexLettreActuelle - i}: ${position}
    }
  }

  // Animation horizontale (changement de chiffre, ex. E1 -> E5)
  const indexChiffreActuel = chiffres.indexOf(chiffreActuel);
  const indexChiffreNouveau = chiffres.indexOf(chiffreNouveau);
  const lettreVerticaleFinale = chemin.length > 1 ? chemin[chemin.length - 1][0] : lettreActuelle;
  const chiffreVerticalFinal = chemin.length > 1 ? parseInt(chemin[chemin.length - 1].slice(1)) : chiffreActuel;
  if (indexChiffreActuel < indexChiffreNouveau) {
    for (let i = chiffreVerticalFinal + 1; i <= chiffreNouveau; i++) {
      const position = lettreVerticaleFinale + i;
      chemin.push(position);
      // Étape horizontale ${i - chiffreVerticalFinal}: ${position}
    }
  } else if (indexChiffreActuel > indexChiffreNouveau) {
    for (let i = chiffreVerticalFinal - 1; i >= chiffreNouveau; i--) {
      const position = lettreVerticaleFinale + i;
      chemin.push(position);
      // Étape horizontale ${chiffreVerticalFinal - i}: ${position}
    }
  }

  // Chemin de déplacement : chemin

  const tl = gsap.timeline({
    onComplete: function() {
      player.SetVar("PositionCercle", nouvellePosition);
      positionCercleInitiale = nouvellePosition;
    }
  });

  // Animer chaque étape du chemin
  chemin.forEach((position, index) => {
    tl.to(cercleRouge, {
      x: positions[position].x,
      y: positions[position].y,
      duration: 0.15,
      ease: "power2.inOut"
    }, index * 0.15); // Synchronisation des étapes
    tl.to(sablier, {
      rotation: "+=90", // Rotation de 90° dans le sens horaire (réduite pour une vitesse plus lente)
      duration: 0.15,
      ease: "power2.inOut"
    }, index * 0.15); // Même timing que le déplacement
  });
}

// Appeler la fonction d'initialisation avec la variable PositionCercle et positionAleatoire
initialiserCercle(positionCercleInitiale, positionAleatoire);
}

};
