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
  // Projet : entretienSim360 - Simulation d’entretien d’embauche pour formateur professionnel
// Avatar : Claire Dubois, Fondatrice de FormaConnect
// Thématiques : Q1 (Décrochage), Q2 (Évaluation), QMS (Individualisation d’un parcours)

function entretienSim360(action, params = {}) {
    // Charger les variables Storyline
    let candidatReponseQ1 = getVar("candidatReponseQ1") || "";
    let candidatReponseQ2 = getVar("candidatReponseQ2") || "";
    let candidatReponseMS = getVar("candidatReponseMS") || "";
    let candidatNiveauNombre = getVar("candidatNiveauNombre") || "0";
    let scorePedagogie = parseInt(getVar("scorePedagogie")) || 0;
    let scoreEmpathie = parseInt(getVar("scoreEmpathie")) || 0;
    let scoreGestion = parseInt(getVar("scoreGestion")) || 0;
    let progressionSatisfaction = parseInt(getVar("progressionSatisfaction")) || 0;

    // Convertir niveau en entier avec validation
    let niveau = parseInt(candidatNiveauNombre);
    if (isNaN(niveau) || niveau < 1 || niveau > 3) {
        niveau = 1; // Par défaut : Débutant si niveau invalide
        // console.log("Erreur: candidatNiveauNombre invalide (" + candidatNiveauNombre + "), niveau forcé à 1");
    }
    // console.log("Valeur brute de candidatNiveauNombre: " + candidatNiveauNombre);
    // console.log("Niveau après parseInt: " + niveau);

    // Débogage : Afficher les valeurs des réponses
    // console.log("candidatReponseQ1: " + candidatReponseQ1);
    // console.log("candidatReponseQ2: " + candidatReponseQ2);
    // console.log("candidatReponseMS: " + candidatReponseMS);

    // Fonction pour gérer la réponse à la question 1 (Décrochage)
    function gererReponseQ1() {
        let reponse = candidatReponseQ1;
        let poidsP = 0.5, poidsE = 0.4, poidsG = 0.1; // Poids pour Q1 (pédagogie dominante)
        let scorePartielPedagogie = 0, scorePartielEmpathie = 0, scorePartielGestion = 0;

        if (niveau === 1) { // Débutant
            if (reponse === "A") { // jeux ludiques
                scorePartielPedagogie = 6;
                scorePartielEmpathie = 3;
                scorePartielGestion = 1;
                scorePedagogie += scorePartielPedagogie;
                scoreEmpathie += scorePartielEmpathie;
                scoreGestion += scorePartielGestion;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ1", "Super choix avec les jeux ludiques ! Claire Dubois apprécie cette approche pédagogique engageante, augmentant fortement sa satisfaction. Renforcez l’empathie pour mieux répondre aux besoins individuels et la gestion pour plus de structure.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration : partagez une anecdote où un jeu a transformé l’ambiance d’un groupe. Ajoutez une Action : intégrez des discussions pour écouter les besoins. Terminez par un Transfert : appliquez des jeux interactifs dans vos formations débutantes.");
            } else if (reponse === "B") { // devoirs
                scorePartielGestion = 2;
                scorePedagogie += 0;
                scoreEmpathie += 0;
                scoreGestion += scorePartielGestion;
                setVar("scoreGestion", scoreGestion);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackQ1", "Donner des devoirs structure le groupe, mais réduit la satisfaction de Claire Dubois. Privilégiez une approche pédagogique et empathique pour un meilleur impact.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, définissez une Motivation, comme encourager la participation active, et un Plan avec des activités ludiques. Dans vos formations, équilibrez structure et engagement empathique.");
                progressionSatisfaction = Math.max(progressionSatisfaction - 1, 0);
                setVar("progressionSatisfaction", progressionSatisfaction);
                // console.log("Pénalité appliquée pour Q1-B: -1");
                return;
            } else if (reponse === "C") { // discussion
                scorePartielEmpathie = 6;
                scorePartielPedagogie = 3;
                scorePartielGestion = 1;
                scoreEmpathie += scorePartielEmpathie;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ1", "Très bonne initiative avec la discussion ! Claire Dubois valorise cette approche empathique, augmentant fortement sa satisfaction. Renforcez la pédagogie pour plus de structure.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, ajoutez une Action : organisez des discussions structurées en petits groupes. Terminez par un Transfert : appliquez l’écoute active dans vos formations débutantes pour motiver.");
            } else {
                setVar("systemeFeedbackQ1", "Oups, réponse non enregistrée. Choisissez une option (ex. : jeux ludiques, devoirs, discussion) pour augmenter la satisfaction de Claire Dubois.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration, comme une anecdote sur un groupe motivé, et terminez par un Transfert pour vos formations.");
                // console.log("Erreur: Réponse Q1 invalide: " + reponse);
            }
        } else if (niveau === 2) { // Expérimenté
            if (reponse === "A") { // activités variées
                scorePartielPedagogie = 7;
                scorePartielEmpathie = 3;
                scorePartielGestion = 1;
                scorePedagogie += scorePartielPedagogie;
                scoreEmpathie += scorePartielEmpathie;
                scoreGestion += scorePartielGestion;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ1", "Bravo pour les activités variées ! Claire Dubois apprécie cette approche pédagogique engageante, augmentant fortement sa satisfaction. Renforcez l’empathie pour mieux personnaliser et la gestion pour plus de structure.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, racontez une expérience où une activité variée a boosté l’énergie. Ajoutez un Transfert : appliquez des activités diversifiées dans des formations expérimentées.");
            } else if (reponse === "B") { // objectifs stricts
                scorePartielGestion = 3;
                scorePedagogie += 0;
                scoreEmpathie += 0;
                scoreGestion += scorePartielGestion;
                setVar("scoreGestion", scoreGestion);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackQ1", "Fixer des objectifs stricts est structuré, mais réduit la satisfaction de Claire Dubois. Privilégiez une approche pédagogique et empathique pour un meilleur impact.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, précisez une Motivation, comme renforcer la cohésion, et un Plan avec des activités collaboratives. Équilibrez structure et engagement dans vos formations.");
                progressionSatisfaction = Math.max(progressionSatisfaction - 1, 0);
                setVar("progressionSatisfaction", progressionSatisfaction);
                // console.log("Pénalité appliquée pour Q1-B: -1");
                return;
            } else if (reponse === "C") { // personnalisation
                scorePartielEmpathie = 7;
                scorePartielPedagogie = 3;
                scorePartielGestion = 1;
                scoreEmpathie += scorePartielEmpathie;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ1", "La personnalisation est puissante ! Claire Dubois valorise cette approche empathique, augmentant fortement sa satisfaction. Renforcez la pédagogie pour plus de structure.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, détaillez une Action, comme adapter le contenu aux intérêts des apprenants. Terminez par un Transfert : appliquez la personnalisation dans vos formations expérimentées.");
            } else {
                setVar("systemeFeedbackQ1", "Oups, réponse non enregistrée. Choisissez une option (ex. : activités variées, objectifs stricts, personnalisation) pour augmenter la satisfaction de Claire Dubois.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration, comme une anecdote sur un groupe motivé, et terminez par un Transfert pour vos formations.");
                // console.log("Erreur: Réponse Q1 invalide: " + reponse);
            }
        } else if (niveau === 3) { // Expert
            if (reponse === "A") { // techniques de médiation
                scorePartielPedagogie = 8;
                scorePartielEmpathie = 4;
                scorePartielGestion = 1;
                scorePedagogie += scorePartielPedagogie;
                scoreEmpathie += scorePartielEmpathie;
                scoreGestion += scorePartielGestion;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ1", "Remarquable ! Les techniques de médiation captent l’attention du groupe. Claire Dubois apprécie cette approche pédagogique, augmentant fortement sa satisfaction. Renforcez l’empathie pour une personnalisation accrue.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, racontez une situation où une médiation a résolu un conflit. Ajoutez un Transfert : appliquez des techniques de médiation dans vos formations expertes.");
            } else if (reponse === "B") { // restructuration
                scorePartielGestion = 3;
                scorePedagogie += 0;
                scoreEmpathie += 0;
                scoreGestion += scorePartielGestion;
                setVar("scoreGestion", scoreGestion);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackQ1", "La restructuration est organisée, mais réduit la satisfaction de Claire Dubois. Privilégiez une approche pédagogique et empathique pour un meilleur impact.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, précisez une Motivation, comme dynamiser le groupe, et un Plan avec des techniques de médiation. Équilibrez structure et engagement dans vos formations.");
                progressionSatisfaction = Math.max(progressionSatisfaction - 1, 0);
                setVar("progressionSatisfaction", progressionSatisfaction);
                // console.log("Pénalité appliquée pour Q1-B: -1");
                return;
            } else if (reponse === "C") { // gestion des conflits
                scorePartielEmpathie = 8;
                scorePartielPedagogie = 4;
                scorePartielGestion = 1;
                scoreEmpathie += scorePartielEmpathie;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ1", "Excellente approche ! La gestion des conflits montre une forte empathie. Claire Dubois valorise cette approche, augmentant fortement sa satisfaction.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, détaillez une Action, comme une médiation réussie dans un groupe. Terminez par un Transfert : appliquez la gestion des conflits dans vos formations expertes.");
            } else {
                setVar("systemeFeedbackQ1", "Oups, réponse non enregistrée. Choisissez une option (ex. : techniques de médiation, restructuration, gestion des conflits) pour augmenter la satisfaction de Claire Dubois.");
                setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration, comme une anecdote sur un groupe motivé, et terminez par un Transfert pour vos formations.");
                // console.log("Erreur: Réponse Q1 invalide: " + reponse);
            }
        } else {
            setVar("systemeFeedbackQ1", "Erreur : Aucun niveau sélectionné. Choisissez un niveau pour augmenter la satisfaction de Claire Dubois.");
            setVar("impactFeedbackQ1", "Pour maximiser votre impact avec la méthode IMPACT, structurez vos réponses avec une Inspiration et un Transfert clair pour vos formations.");
            // console.log("Erreur: Niveau invalide: " + niveau);
        }

        // Calculer la satisfaction partielle pour Q1 (sauf pour B)
        let scorePartielTotal = scorePartielPedagogie * poidsP + scorePartielEmpathie * poidsE + scorePartielGestion * poidsG;
        let satisfactionPartielle = Math.floor(scorePartielTotal);
        progressionSatisfaction = Math.min(progressionSatisfaction + satisfactionPartielle, 10);
        setVar("progressionSatisfaction", progressionSatisfaction);

        // Débogage
        // console.log("Action: gererReponseQ1");
        // console.log("Niveau choisi: " + niveau);
        // console.log("Réponse Q1: " + reponse);
        // console.log("Score Partiel Pédagogie: " + scorePartielPedagogie);
        // console.log("Score Partiel Empathie: " + scorePartielEmpathie);
        // console.log("Score Partiel Gestion: " + scorePartielGestion);
        // console.log("Score Total Pédagogie: " + scorePedagogie);
        // console.log("Score Total Empathie: " + scoreEmpathie);
        // console.log("Score Total Gestion: " + scoreGestion);
        // console.log("Satisfaction Partielle Q1: " + satisfactionPartielle);
        // console.log("Satisfaction de Claire Dubois: " + progressionSatisfaction);
    }

    // Fonction pour gérer la réponse à la question 2 (Évaluation)
    function gererReponseQ2() {
        let reponse = candidatReponseQ2;
        let poidsE = 0.5, poidsP = 0.4, poidsG = 0.1; // Poids pour Q2 (empathie dominante)
        let scorePartielPedagogie = 0, scorePartielEmpathie = 0, scorePartielGestion = 0;

        if (niveau === 1) { // Débutant
            if (reponse === "A") { // feedback positif
                scorePartielEmpathie = 6;
                scorePartielPedagogie = 3;
                scorePartielGestion = 1;
                scoreEmpathie += scorePartielEmpathie;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ2", "Excellent choix ! Le feedback positif motive les débutants. Claire Dubois apprécie cette approche empathique, augmentant fortement sa satisfaction. Renforcez la pédagogie et la gestion pour plus de structure.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, racontez une situation où un feedback positif a boosté la confiance. Ajoutez un Transfert : intégrez des feedbacks structurés dans vos formations débutantes.");
            } else if (reponse === "B") { // tests standardisés
                scorePartielGestion = 2;
                scorePedagogie += 0;
                scoreEmpathie += 0;
                scoreGestion += scorePartielGestion;
                setVar("scoreGestion", scoreGestion);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackQ2", "Les tests standardisés sont utiles, mais réduisent la satisfaction de Claire Dubois. Privilégiez l’empathie et la pédagogie pour un meilleur impact.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, définissez une Motivation, comme encourager la progression, et un Plan avec des évaluations formatives. Équilibrez structure et empathie dans vos formations.");
                progressionSatisfaction = Math.max(progressionSatisfaction - 1, 0);
                setVar("progressionSatisfaction", progressionSatisfaction);
                // console.log("Pénalité appliquée pour Q2-B: -1");
                return;
            } else if (reponse === "C") { // ignorer
                scorePartielEmpathie = 3;
                scorePartielPedagogie = 1;
                scorePartielGestion = 0;
                scoreEmpathie += scorePartielEmpathie;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ2", "Ignorer l’évaluation évite le stress, mais limite la progression. Claire Dubois recommande plus d’empathie et de pédagogie pour augmenter sa satisfaction.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, ajoutez une Action, comme un quiz informel avec feedback. Terminez par un Transfert : utilisez l’évaluation pour guider les débutants.");
            } else {
                setVar("systemeFeedbackQ2", "Oups, réponse non enregistrée. Choisissez une option (ex. : feedback positif, tests, ignorer) pour augmenter la satisfaction de Claire Dubois.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration, comme une anecdote sur un apprenant motivé, et terminez par un Transfert pour vos formations.");
                // console.log("Erreur: Réponse Q2 invalide: " + reponse);
            }
        } else if (niveau === 2) { // Expérimenté
            if (reponse === "A") { // bilans réguliers
                scorePartielEmpathie = 7;
                scorePartielPedagogie = 3;
                scorePartielGestion = 1;
                scoreEmpathie += scorePartielEmpathie;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ2", "Superbe approche ! Les bilans réguliers permettent une personnalisation empathique. Claire Dubois valorise cette approche, augmentant fortement sa satisfaction. Renforcez la pédagogie pour plus de structure.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, partagez une expérience où un bilan formatif a adapté un parcours. Ajoutez un Transfert : appliquez des bilans réguliers dans vos formations expérimentées.");
            } else if (reponse === "B") { // tests standardisés
                scorePartielGestion = 3;
                scorePedagogie += 0;
                scoreEmpathie += 0;
                scoreGestion += scorePartielGestion;
                setVar("scoreGestion", scoreGestion);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackQ2", "Les tests standardisés sont structurés, mais réduisent la satisfaction de Claire Dubois. Privilégiez l’empathie et la pédagogie pour un meilleur impact.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, précisez une Motivation, comme personnaliser l’apprentissage, et un Plan avec des bilans formatifs. Équilibrez structure et empathie dans vos formations.");
                progressionSatisfaction = Math.max(progressionSatisfaction - 1, 0);
                setVar("progressionSatisfaction", progressionSatisfaction);
                // console.log("Pénalité appliquée pour Q2-B: -1");
                return;
            } else if (reponse === "C") { // feedbacks informels
                scorePartielEmpathie = 4;
                scorePartielPedagogie = 2;
                scorePartielGestion = 0;
                scoreEmpathie += scorePartielEmpathie;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ2", "Les feedbacks informels sont engageants, mais moins structurés. Claire Dubois recommande plus de pédagogie pour augmenter sa satisfaction.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, structurez une Action, comme des bilans réguliers avec des feedbacks positifs. Terminez par un Transfert : combinez feedbacks informels et diagnostics dans vos formations.");
            } else {
                setVar("systemeFeedbackQ2", "Oups, réponse non enregistrée. Choisissez une option (ex. : bilans réguliers, tests, feedbacks informels) pour augmenter la satisfaction de Claire Dubois.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration, comme une anecdote sur une personnalisation réussie, et terminez par un Transfert pour vos formations.");
                // console.log("Erreur: Réponse Q2 invalide: " + reponse);
            }
        } else if (niveau === 3) { // Expert
            if (reponse === "A") { // évaluation sur mesure
                scorePartielEmpathie = 8;
                scorePartielPedagogie = 4;
                scorePartielGestion = 1;
                scoreEmpathie += scorePartielEmpathie;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ2", "Remarquable ! L’évaluation sur mesure répond aux besoins variés. Claire Dubois est impressionnée, augmentant fortement sa satisfaction. Renforcez la pédagogie pour plus de structure.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, racontez une expérience où une évaluation adaptée a motivé un groupe hétérogène. Ajoutez un Transfert : appliquez des évaluations sur mesure dans vos formations expertes.");
            } else if (reponse === "B") { // tests standardisés
                scorePartielGestion = 3;
                scorePedagogie += 0;
                scoreEmpathie += 0;
                scoreGestion += scorePartielGestion;
                setVar("scoreGestion", scoreGestion);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackQ2", "Les tests standardisés sont structurés, mais réduisent la satisfaction de Claire Dubois. Privilégiez l’empathie et la pédagogie pour un meilleur impact.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, précisez une Motivation, comme personnaliser l’apprentissage, et un Plan avec des évaluations adaptées. Équilibrez structure et empathie dans vos formations.");
                progressionSatisfaction = Math.max(progressionSatisfaction - 1, 0);
                setVar("progressionSatisfaction", progressionSatisfaction);
                // console.log("Pénalité appliquée pour Q2-B: -1");
                return;
            } else if (reponse === "C") { // feedbacks collectifs
                scorePartielEmpathie = 4;
                scorePartielPedagogie = 2;
                scorePartielGestion = 0;
                scoreEmpathie += scorePartielEmpathie;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackQ2", "Les feedbacks collectifs sont inclusifs, mais moins précis. Claire Dubois recommande plus d’empathie et de pédagogie pour augmenter sa satisfaction.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, structurez une Action, comme des feedbacks individualisés après un collectif. Terminez par un Transfert : combinez feedbacks collectifs et individuels dans vos formations.");
            } else {
                setVar("systemeFeedbackQ2", "Oups, réponse non enregistrée. Choisissez une option (ex. : évaluation sur mesure, tests, feedbacks collectifs) pour augmenter la satisfaction de Claire Dubois.");
                setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration, comme une anecdote sur une personnalisation réussie, et terminez par un Transfert pour vos formations.");
                // console.log("Erreur: Réponse Q2 invalide: " + reponse);
            }
        } else {
            setVar("systemeFeedbackQ2", "Erreur : Aucun niveau sélectionné. Choisissez un niveau pour augmenter la satisfaction de Claire Dubois.");
            setVar("impactFeedbackQ2", "Pour maximiser votre impact avec la méthode IMPACT, structurez vos réponses avec une Inspiration et un Transfert clair pour vos formations.");
            // console.log("Erreur: Niveau invalide: " + niveau);
        }

        // Calculer la satisfaction partielle pour Q2 (sauf pour B)
        let scorePartielTotal = scorePartielPedagogie * poidsP + scorePartielEmpathie * poidsE + scorePartielGestion * poidsG;
        let satisfactionPartielle = Math.floor(scorePartielTotal);
        progressionSatisfaction = Math.min(progressionSatisfaction + satisfactionPartielle, 10);
        setVar("progressionSatisfaction", progressionSatisfaction);

        // Débogage
        // console.log("Action: gererReponseQ2");
        // console.log("Niveau choisi: " + niveau);
        // console.log("Réponse Q2: " + reponse);
        // console.log("Score Partiel Pédagogie: " + scorePartielPedagogie);
        // console.log("Score Partiel Empathie: " + scorePartielEmpathie);
        // console.log("Score Partiel Gestion: " + scorePartielGestion);
        // console.log("Score Total Pédagogie: " + scorePedagogie);
        // console.log("Score Total Empathie: " + scoreEmpathie);
        // console.log("Score Total Gestion: " + scoreGestion);
        // console.log("Satisfaction Partielle Q2: " + satisfactionPartielle);
        // console.log("Satisfaction de Claire Dubois: " + progressionSatisfaction);
    }

    // Fonction pour gérer la mini-simulation (Individualisation d’un parcours, dialogue vidéo)
    function gererMiniSimulation() {
        let reponse = candidatReponseMS;
        let poidsP = 0.5, poidsE = 0.4, poidsG = 0.1; // Poids pour QMS (pédagogie dominante)
        let scorePartielPedagogie = 0, scorePartielEmpathie = 0, scorePartielGestion = 0;

        if (niveau === 1) { // Débutant
            if (reponse === "diagnostic") {
                scorePartielPedagogie = 6;
                scorePartielEmpathie = 3;
                scorePartielGestion = 1;
                scorePedagogie += scorePartielPedagogie;
                scoreEmpathie += scorePartielEmpathie;
                scoreGestion += scorePartielGestion;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackMS", "Excellent choix ! Poser un diagnostic en posant des questions à Paul permet une personnalisation précise. Claire Dubois apprécie cette approche pédagogique, augmentant fortement sa satisfaction.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, racontez une situation où un diagnostic a adapté un parcours (ex. : identifier un blocage sur Excel). Ajoutez un Transfert : appliquez des diagnostics dans vos formations débutantes.");
            } else if (reponse === "activités") {
                scorePartielPedagogie = 3;
                scorePartielGestion = 1;
                scorePartielEmpathie = 0;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                scoreEmpathie += scorePartielEmpathie;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackMS", "Les activités simplifiées sont engageantes, mais moins efficaces sans diagnostic préalable. Claire Dubois recommande plus de pédagogie et d’empathie pour augmenter sa satisfaction.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, précisez une Motivation, comme rendre Excel accessible, et un Plan avec un diagnostic préalable. Équilibrez pédagogie et empathie dans vos formations.");
            } else if (reponse === "outils") {
                scorePartielPedagogie = 2;
                scorePartielGestion = 0;
                scorePartielEmpathie = 0;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                scoreEmpathie += scorePartielEmpathie;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackMS", "Les outils numériques sont utiles, mais sans diagnostic, ils réduisent la satisfaction de Claire Dubois. Privilégiez une approche personnalisée.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, structurez un Plan avec un diagnostic avant d’introduire des outils. Terminez par un Transfert : combinez diagnostics et outils dans vos formations.");
                progressionSatisfaction = Math.max(progressionSatisfaction - 1, 0);
                setVar("progressionSatisfaction", progressionSatisfaction);
                // console.log("Pénalité appliquée pour QMS-C: -1");
                return;
            } else {
                setVar("systemeFeedbackMS", "Oups, réponse non enregistrée. Choisissez une option (ex. : diagnostic, activités, outils) pour augmenter la satisfaction de Claire Dubois.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration, comme une anecdote sur une personnalisation réussie, et terminez par un Transfert pour vos formations.");
                // console.log("Erreur: Réponse Mini-Simulation invalide: " + reponse);
            }
        } else if (niveau === 2) { // Expérimenté
            if (reponse === "diagnostic") {
                scorePartielPedagogie = 7;
                scorePartielEmpathie = 3;
                scorePartielGestion = 1;
                scorePedagogie += scorePartielPedagogie;
                scoreEmpathie += scorePartielEmpathie;
                scoreGestion += scorePartielGestion;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackMS", "Excellent choix ! Analyser le projet de Paul permet une personnalisation précise. Claire Dubois apprécie cette approche pédagogique, augmentant fortement sa satisfaction.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, racontez une situation où un diagnostic a adapté un diagramme de Gantt. Ajoutez un Transfert : appliquez des diagnostics dans vos formations expérimentées.");
            } else if (reponse === "activités") {
                scorePartielPedagogie = 4;
                scorePartielGestion = 2;
                scorePartielEmpathie = 0;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                scoreEmpathie += scorePartielEmpathie;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackMS", "Les cas pratiques sont engageants, mais moins efficaces sans diagnostic préalable. Claire Dubois recommande plus de pédagogie et d’empathie pour augmenter sa satisfaction.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, précisez une Motivation, comme rendre la gestion de projet concrète, et un Plan avec un diagnostic préalable. Équilibrez pédagogie et empathie dans vos formations.");
            } else if (reponse === "outils") {
                scorePartielPedagogie = 3;
                scorePartielGestion = 0;
                scorePartielEmpathie = 0;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                scoreEmpathie += scorePartielEmpathie;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackMS", "Les outils comme Trello sont utiles, mais sans diagnostic, ils réduisent la satisfaction de Claire Dubois. Privilégiez une approche personnalisée.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, structurez un Plan avec un diagnostic avant d’introduire des outils. Terminez par un Transfert : combinez diagnostics et outils dans vos formations.");
                progressionSatisfaction = Math.max(progressionSatisfaction - 1, 0);
                setVar("progressionSatisfaction", progressionSatisfaction);
                // console.log("Pénalité appliquée pour QMS-C: -1");
                return;
            } else {
                setVar("systemeFeedbackMS", "Oups, réponse non enregistrée. Choisissez une option (ex. : diagnostic, activités, outils) pour augmenter la satisfaction de Claire Dubois.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration, comme une anecdote sur une personnalisation réussie, et terminez par un Transfert pour vos formations.");
                // console.log("Erreur: Réponse Mini-Simulation invalide: " + reponse);
            }
        } else if (niveau === 3) { // Expert
            if (reponse === "diagnostic") {
                scorePartielPedagogie = 8;
                scorePartielEmpathie = 4;
                scorePartielGestion = 1;
                scorePedagogie += scorePartielPedagogie;
                scoreEmpathie += scorePartielEmpathie;
                scoreGestion += scorePartielGestion;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("scoreGestion", scoreGestion);
                setVar("systemeFeedbackMS", "Excellent choix ! Analyser une situation d’équipe permet une personnalisation précise. Claire Dubois apprécie cette approche pédagogique, augmentant fortement sa satisfaction.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, racontez une situation où un diagnostic a adapté un style de leadership multiculturel. Ajoutez un Transfert : appliquez des diagnostics dans vos formations expertes.");
            } else if (reponse === "activités") {
                scorePartielPedagogie = 5;
                scorePartielGestion = 2;
                scorePartielEmpathie = 0;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                scoreEmpathie += scorePartielEmpathie;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackMS", "Les jeux de rôle sont engageants, mais moins efficaces sans diagnostic préalable. Claire Dubois recommande plus de pédagogie et d’empathie pour augmenter sa satisfaction.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, précisez une Motivation, comme renforcer la cohésion multiculturelle, et un Plan avec un diagnostic préalable. Équilibrez pédagogie et empathie dans vos formations.");
            } else if (reponse === "outils") {
                scorePartielPedagogie = 3;
                scorePartielGestion = 0;
                scorePartielEmpathie = 0;
                scorePedagogie += scorePartielPedagogie;
                scoreGestion += scorePartielGestion;
                scoreEmpathie += scorePartielEmpathie;
                setVar("scorePedagogie", scorePedagogie);
                setVar("scoreGestion", scoreGestion);
                setVar("scoreEmpathie", scoreEmpathie);
                setVar("systemeFeedbackMS", "Les outils d’évaluation culturelle sont utiles, mais sans diagnostic, ils réduisent la satisfaction de Claire Dubois. Privilégiez une approche personnalisée.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, structurez un Plan avec un diagnostic avant d’introduire des outils. Terminez par un Transfert : combinez diagnostics et outils dans vos formations.");
                progressionSatisfaction = Math.max(progressionSatisfaction - 1, 0);
                setVar("progressionSatisfaction", progressionSatisfaction);
                // console.log("Pénalité appliquée pour QMS-C: -1");
                return;
            } else {
                setVar("systemeFeedbackMS", "Oups, réponse non enregistrée. Choisissez une option (ex. : diagnostic, activités, outils) pour augmenter la satisfaction de Claire Dubois.");
                setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, commencez par une Inspiration, comme une anecdote sur une personnalisation réussie, et terminez par un Transfert pour vos formations.");
                // console.log("Erreur: Réponse Mini-Simulation invalide: " + reponse);
            }
        } else {
            setVar("systemeFeedbackMS", "Erreur : Aucun niveau sélectionné. Choisissez un niveau pour augmenter la satisfaction de Claire Dubois.");
            setVar("impactFeedbackMS", "Pour maximiser votre impact avec la méthode IMPACT, structurez vos réponses avec une Inspiration et un Transfert clair pour vos formations.");
            // console.log("Erreur: Niveau invalide: " + niveau);
        }

        // Calculer la satisfaction partielle pour QMS (sauf pour C)
        let scorePartielTotal = scorePartielPedagogie * poidsP + scorePartielEmpathie * poidsE + scorePartielGestion * poidsG;
        let satisfactionPartielle = Math.floor(scorePartielTotal);
        progressionSatisfaction = Math.min(progressionSatisfaction + satisfactionPartielle, 10);
        setVar("progressionSatisfaction", progressionSatisfaction);

        // Débogage
        // console.log("Action: gererMiniSimulation");
        // console.log("Niveau choisi: " + niveau);
        // console.log("Réponse Mini-Simulation: " + reponse);
        // console.log("Score Partiel Pédagogie: " + scorePartielPedagogie);
        // console.log("Score Partiel Empathie: " + scorePartielEmpathie);
        // console.log("Score Partiel Gestion: " + scorePartielGestion);
        // console.log("Score Total Pédagogie: " + scorePedagogie);
        // console.log("Score Total Empathie: " + scoreEmpathie);
        // console.log("Score Total Gestion: " + scoreGestion);
        // console.log("Satisfaction Partielle QMS: " + satisfactionPartielle);
        // console.log("Satisfaction de Claire Dubois: " + progressionSatisfaction);
    }

    // Fonction pour calculer le résultat final
    function calculerResultatFinal() {
        // Charger les variables Storyline
        let scorePedagogie = parseInt(getVar("scorePedagogie")) || 0;
        let scoreEmpathie = parseInt(getVar("scoreEmpathie")) || 0;
        let scoreGestion = parseInt(getVar("scoreGestion")) || 0;
        let progressionSatisfaction = parseInt(getVar("progressionSatisfaction")) || 0;
        let candidatNiveauNombre = parseInt(getVar("candidatNiveauNombre")) || 1;

        // Définir le niveau en texte
        let niveauTexte = candidatNiveauNombre === 1 ? "Débutant" :
                          candidatNiveauNombre === 2 ? "Expérimenté" : "Expert";
        setVar("candidatNiveauTexte", niveauTexte);

        // Calculer le résultat final (basé sur progressionSatisfaction)
        let resultatFinal = progressionSatisfaction;
        let systemeFeedbackFinal = "";
        let impactFeedbackFinal = "";

        // Définir les commentaires selon la satisfaction
        if (resultatFinal >= 8) {
            systemeFeedbackFinal = "Excellent travail ! Claire Dubois est très satisfaite de vos choix pédagogiques, empathiques et structurés.";
            impactFeedbackFinal = "Pour maximiser votre choix avec la méthode IMPACT, continuez à inspirer avec des anecdotes engageantes, structurez vos actions avec des diagnostics précis, et transférez vos compétences dans vos formations.";
        } else if (resultatFinal >= 5) {
            systemeFeedbackFinal = "Bon travail ! Claire Dubois apprécie vos efforts, mais recommande de renforcer la pédagogie et l’empathie pour maximiser les commentaires.";
            impactFeedbackFinal = "Pour maximiser votre choix avec la méthode IMPACT, ajoutez une inspiration claire, comme une réussite pédagogique, et un transfert pratique pour vos formations.";
        } else {
            systemeFeedbackFinal = "Effort à améliorer. Claire Dubois suggère de privilégier des approches plus pédagogiques et empathiques pour améliorer les commentaires.";
            impactFeedbackFinal = "Pour maximiser votre choix avec la méthode IMPACT, commencez par une motivation forte, comme répondre aux besoins individuels, et terminez par un transfert clair.";
        }

        // Définir les variables Storyline
        setVar("progressionResultatFinal", resultatFinal.toString() + "/10");
        setVar("systemeFeedbackFinal", systemeFeedbackFinal);
        setVar("impactFeedbackFinal", impactFeedbackFinal);

        // Débogage
        // console.log("Action: calculerResultatFinal");
        // console.log("Niveau choisi: " + candidatNiveauNombre);
        // console.log("Score Total Pédagogie: " + scorePedagogie);
        // console.log("Score Total Empathie: " + scoreEmpathie);
        // console.log("Score Total Gestion: " + scoreGestion);
        // console.log("Satisfaction de Claire Dubois: " + progressionSatisfaction);
        // console.log("progressionResultatFinal: " + resultatFinal + "/10");
        // console.log("systemeFeedbackFinal: " + systemeFeedbackFinal);
        // console.log("impactFeedbackFinal: " + impactFeedbackFinal);
    }

    // Exécuter l’action demandée
    switch (action) {
        case "gererReponseQ1":
            gererReponseQ1();
            break;
        case "gererReponseQ2":
            gererReponseQ2();
            break;
        case "gererMiniSimulation":
            gererMiniSimulation();
            break;
        case "calculerResultatFinal":
            calculerResultatFinal();
            break;
        default:
            // console.log("Action inconnue: " + action);
    }
}

// Rendre la fonction accessible globalement
window.entretienSim360 = entretienSim360;
}

window.Script2 = function()
{
  entretienSim360("gererReponseQ1");
}

window.Script3 = function()
{
  entretienSim360("gererReponseQ2");
}

window.Script4 = function()
{
  entretienSim360("gererMiniSimulation");
}

window.Script5 = function()
{
  entretienSim360("calculerResultatFinal");
}

};
