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

function trouverElementsDoubles(tableau, chaineParDefaut = "Aucun doublon trouvé") {
  const occurrences = {};

  // Compter les occurrences de chaque élément
  tableau.forEach(element => {
    occurrences[element] = (occurrences[element] || 0) + 1;
  });

  // Filtrer les éléments qui apparaissent exactement 2 fois
  const doubles = Object.keys(occurrences).filter(key => occurrences[key] === 2);

  // Retourner les doublons ou la chaîne par défaut si aucun doublon
  return doubles.length > 0 ? doubles : chaineParDefaut;
}

// Récupération des variables
let varTxtOption1 = player.GetVar("varTxtOption1");
let varTxtOption2 = player.GetVar("varTxtOption2");
let varTxtOption3 = player.GetVar("varTxtOption3");
let varTxtOption4 = player.GetVar("varTxtOption4");
let varTxtOption5 = player.GetVar("varTxtOption5");
let varTxtOption6 = player.GetVar("varTxtOption6");
let varTxtOption7 = player.GetVar("varTxtOption7");
let varTxtOption8 = player.GetVar("varTxtOption8");
let varTxtOption9 = player.GetVar("varTxtOption9");
let varTxtOption10 = player.GetVar("varTxtOption10");

const varOptions = [varTxtOption1, varTxtOption2, varTxtOption3, varTxtOption4, 
                   varTxtOption5, varTxtOption6, varTxtOption7, varTxtOption8, 
                   varTxtOption9, varTxtOption10];
console.log(varOptions);

// Trouver les doublons
let optionProfil = trouverElementsDoubles(varOptions, "Aucun Profil dominant ne ressort de votre sélection.");

// Si optionProfil est un tableau, prendre le premier élément
if (Array.isArray(optionProfil)) {
    optionProfil = optionProfil.length > 0 ? optionProfil[0] : "Aucun Profil dominant ne ressort de votre sélection.";
}

// Switch case avec différents textes pour A à E
switch (optionProfil) {
    case "C":
        optionProfil = "Pour vous, le but principal de l’évaluation est de contrôler les acquis et également de communiquer dessus. À noter que cette évaluation certificative n’a pas besoin d’être sanctionnée par une évaluation finale. Ce but de contrôle et de communication est important, notamment pour le commanditaire.";
        //console.log("Profil C détecté");
        break;
    
    case "RA":
        optionProfil = "Pour vous, le but principal de l’évaluation est la régulation de l’activité de l’apprenant. C’est-à-dire qu’elle doit permettre à l’apprenant de mieux apprendre. Bonne nouvelle, c’est le rôle le plus important de l’évaluation et il est souvent sous-évalué. ";
        //console.log("Profil RA détecté");
        break;
    
    case "RF":
        optionProfil = "Pour vous, le but principal de l’évaluation est de piloter votre travail. Vous vous servez de l’évaluation comme d’une boussole pour organiser votre formation. Grâce aux informations recueillies lors des évaluations, vous allez passer plus vite sur les points déjà acquis, insister sur certains points quand vous voyez qu’ils ne passent pas bien.";
        //console.log("Profil RF détecté");
        break;
    
    case "L":
        optionProfil = "Pour vous, l’évaluation sert d’abord au formateur à se légitimer et à motiver les apprenants. Cette position peut être dangereuse. En effet, si vous êtes un formateur, c’est parce que vous avez une expertise à valoriser. Et c’est bien cette expertise qui doit être reconnue par les apprenants, pas votre capacité à les valider ou non en fin de formation. De même, l’évaluation comme source de motivation est assez limitée. On sait tous qu’une semaine après le baccalauréat, on avait tout oublié. Le cerveau est programmé pour oublier, c’est comme ça. De plus, pour jouer sur la motivation des apprenants, l’évaluation peut rentrer en compétition avec des outils nettement plus puissants comme le sentiment de maîtrise.";
        //console.log("Profil L détecté");
        break;
    
    case "S":
        optionProfil = "Pour vous, le rôle de l’évaluation est la sélection. C’est un rôle effectivement endossé par l’évaluation, notamment dans l’évaluation scolaire, comme nous allons le voir par la suite. En revanche, ce rôle de sélection est souvent en contradiction avec la formation : en sélectionnant, on minimise l’apprentissage de nos apprenants et cela est bien dommage. Or, dans nos contextes, souvent, on ne nous demande pas de sélectionner. Même si vous amenez des étudiants à un concours, la sélection se fait par l’évaluation externe (le concours), et pas par vous. Je vous conseille donc fortement de vous focaliser sur votre rôle de formateur et d’organiser votre évaluation en fonction. Pour cela, vous pouvez commencer par travailler votre changement de positionnement, en analysant votre rapport à l’évaluation scolaire, comme je vous le propose dans la suite de ce cours.";
        //console.log("Profil S détecté");
        break;
    
    default:
        optionProfil = "Désolé ! Aucun profil ne correspond de votre sélection.";
        //console.log("Aucun profil spécifique identifié");
}

player.SetVar("varXTxtProfil", optionProfil);
}

window.Script2 = function()
{
  var player = GetPlayer();

let optionsProfil = "Aucun choix n'est sélectionné !";

player.SetVar("varXTxtProfil",optionsProfil);
}

};
