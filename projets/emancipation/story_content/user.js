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
window.Script5 = function()
{
  // Fonction pour générer un nombre aléatoire entre 1 et 6
function nombreAleatoireDeUnASix() {
  return Math.floor(Math.random() * 6) + 1;
}

// Fonction pour additionner un nombre aléatoire entre 1 et 6 et la position du joueur
function nouvellePosition(nombreAleatoireDeUnASix, positionJoueur) {
  // Additionne le nombre aléatoire et la position actuelle du joueur
  let nouvellePosition = nombreAleatoireDeUnASix + positionJoueur;
  
    // Vérifier si le joueur a atteint ou dépassé la dernière case
    if (nouvellePosition > 36) {
        nouvPosition = nouvellePosition - nombreAleatoireDeUnASix;
        surplusPosition = nouvellePosition - 36;
        alert("Aie !!! Tu sors des limites du jeu, recules de " + surplusPosition + " cases.");
        return nouvPosition;
    }
  
  // Retourne la nouvelle position
  return nouvellePosition;
}

function verifierNouvellePosition(nombreAleatoireDeUnASix, positionJoueur) {
  const nouvellePosition = nombreAleatoireDeUnASix + positionJoueur;
  let message = ""; // Variable pour stocker le message

  // Vérifie les différentes conditions de déplacement spéciales
  switch (nouvellePosition) {
    case 1:
      difference = 0;
      message = "C'est parti !";
      return { position: 1, message, difference };
    case 3:
      difference = 7;
      message = "Wow ! Tu avances de " + difference + " cases en plus grâce à l'échelle.";
      return { position: 10, message, difference };
    case 6:
      difference = 1;
      message = "Aie !!! Tu recules d'" + difference + " case à cause du serpent rôdeur qui bloque ton parcours.";
      return { position: 5, message, difference };
    case 11:
      difference = 1;
      message = "Aie !!! Tu recules d'" + difference + " case à cause du serpent danseur qui bloque ton parcours.";
      return { position: 10, message, difference };
    case 12:
      difference = 1;
      message = "Super ! Tu avances d'" + difference + " case en plus grâce aux lianes.";
      return { position: 13, message, difference };
    case 15:
      difference = 6;
      message = "Wow ! Tu avances de " + difference + " cases en plus grâce aux lianes et à l'échelle.";
      return { position: 15 + difference, message, difference };
    case 16:
      difference = 5;
      message = "Génial ! Tu avances de " + difference + " cases en plus grâce à l'échelle.";
      return { position: 22, message, difference };
    case 18:
      difference = 11;
      message = "Wow ! Tu avances de " + difference + " cases en plus grâce aux lianes et à l'échelle.";
      return { position: 26, message, difference };
    case 19:
      difference = 7;
      message = "Wow ! Tu avances de " + difference + " case en plus grâce aux lianes.";
      return { position: 26, message, difference };
    case 20:
      difference = 6;
      message = "Génial ! Tu avances de " + difference + " cases en plus grâce à l'échelle.";
      return { position: 26, message, difference };
    case 21:
      // Si la nouvelle position dépasse la case 36
      if (nouvellePosition == 21) {
      	difference = 1;
      	message = "Wow ! Tu avances d'" + difference + " case en plus grâce aux lianes.";
      	return { position: 22, message, difference };
      } else {
      	difference = 1;
      	message = "Wow ! Tu avances d'" + difference + " case en plus grâce aux lianes.";
      	return { position: 22, message, difference };
      }
    case 23:
      difference = 1;
      message = "Aie !!! Tu recules d'" + difference + " case à cause du serpent rôdeur qui bloque ton parcours.";
      return { position: 22, message, difference };
    case 25:
      difference = 1;
      message = "Aie !!! Tu recules d'" + difference + " case à cause du serpent danseur qui bloque ton parcours.";
      return { position: 24, message, difference };
    case 28:
      difference = 1;
      message = "Wow ! Tu avances d'" + difference + " case grâce aux lianes.";
      return { position: 29, message, difference };
    default:
      // Si la nouvelle position dépasse la case 36
      if (nouvellePosition == 35) {
        difference = 1;
        message = "Wow ! Tu avances d'" + difference + " case et tu as terminé le module.";
        return { position: 36, message, difference };
      } else if (nouvellePosition == 36) {
        difference = 0;
        message = "Bravo ! Tu as terminé, n'oublie pas de découvrir tous les freins";
        return { position: 36, message, difference };
      } else if (nouvellePosition > 36) {
        difference = nouvellePosition - 36;
        message = "Tu es hors jeu, tu recules de " + difference + " case(s).";
        return { position: 36 - difference, message, difference };
      } else {
        // Si aucune condition spéciale n'est rencontrée, retourne simplement la nouvelle position
        difference = 0;
        message = "";
        return { position: nouvellePosition, message, difference };
      }
  }
}


// Initialisation du lecteur
var player = GetPlayer();

// Exemple d'utilisation :
const varPositionActuelle = player.GetVar("varPositionJoueur"); // Position en cours du joueur
const varDes = nombreAleatoireDeUnASix(); // Obtient un nombre aléatoire de 1 à 6 pour le dé
//const varNouvellePosition = nouvellePosition(varDes, varPositionActuelle); // Vérifie la nouvelle position
const varNouvellePosition = verifierNouvellePosition(varDes, varPositionActuelle); // Vérifie la nouvelle position

// Récupération de la Nouvele valeur du dès
player.SetVar("varPositionAleatoire",varDes);

// Récupération de la Nouvele position du joueur
player.SetVar("varPositionJoueur",varNouvellePosition.position);

// Récupération du message
player.SetVar("varPositionMessage",varNouvellePosition.message);

// Récupération de la différence
player.SetVar("varPositionDifference",varNouvellePosition.difference);
}

};
