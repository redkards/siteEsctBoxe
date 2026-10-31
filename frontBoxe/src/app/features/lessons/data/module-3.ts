import { Lesson } from '../lessons.model';

export const MODULE_3: Lesson[] = [
  {
    id: 21,
    slug: 'garde-haute-et-couverture',
    module: 3,
    title: 'Garde haute et couverture',
    level: 'découverte',
    durationMin: 15,
    objective:
      'Installer une garde protectrice stable : poings à hauteur des pommettes, coudes serrés, menton rentré. Savoir la retrouver instantanément après chaque geste.',
    prerequisites: ['Garde de base et position des appuis', 'Pas chassés avant/arrière'],
    organisation: {
      space: 'Salle libre ou ring, un mètre carré par boxeur, face aux miroirs si possible.',
      material: ['Miroir mural', 'Foulards de couleur', 'Chronomètre'],
      groups: 'Travail individuel au miroir, puis binômes observateur/boxeur.',
    },
    schema: {
      kind: 'defense',
      phases: ['Garde vérifiée au miroir', 'Couverture sur signal', 'Retour en garde'],
    },
    steps: [
      'Au miroir, prendre la garde : vérifier poings aux pommettes, coudes devant les côtes, menton rentré (3 x 20 s, relâcher entre chaque).',
      'Se déplacer en pas chassés (avant, arrière, côtés) pendant 30 s sans que la garde ne descende ; le partenaire signale toute main qui tombe.',
      'Sur un foulard levé par le partenaire, resserrer la garde en couverture (avant-bras collés, regard entre les gants) puis relâcher en garde normale (10 répétitions).',
      'Enchaîner un direct du bras avant dans le vide puis revenir en garde complète avant le signal suivant (2 x 8).',
      'Round de 1 min : déplacements libres, le partenaire lève le foulard au hasard ; on vérifie la couverture en moins d’une seconde.',
    ],
    decision:
      'Le partenaire montre un foulard rouge (couverture complète) ou bleu (garder la garde et continuer à bouger) : le boxeur choisit la bonne réponse sans s’arrêter de se déplacer.',
    corrections: [
      { error: 'Coudes écartés qui ouvrent les flancs.', fix: 'Imaginer serrer une feuille de papier entre coude et côtes.' },
      { error: 'Menton levé, regard au plafond en couverture.', fix: 'Regarder le partenaire « par-dessus les gants », menton vers la poitrine.' },
      { error: 'Main arrière qui tombe après le direct.', fix: 'Laisser la main arrière « collée » à la joue pendant tout le geste.' },
    ],
    criteria: [
      'Les poings restent au-dessus des épaules pendant 30 s de déplacement.',
      'La couverture est prise en moins d’une seconde après le signal.',
      'Le menton reste rentré pendant tout le round.',
    ],
    adaptations: {
      enfants: 'Jeu de la « maison fermée » : au signal, on ferme portes (avant-bras) et fenêtres (gants) ; signaux très visibles, durées de 20 s.',
      ados: 'Défi en binôme : l’observateur compte les mains qui tombent, objectif zéro sur le round ; on inverse les rôles.',
      jeunesAdultes: 'Ajouter la respiration (expirer à la couverture) et allonger les rounds à 2 min avec signaux plus rapprochés.',
    },
    safety:
      'Aucun geste du partenaire vers le visage : seuls les foulards servent de signal, tenus à bout de bras et à plus de deux mètres.',
  },
  {
    id: 22,
    slug: 'esquive-rotative-du-buste',
    module: 3,
    title: 'Esquive rotative du buste',
    level: 'découverte',
    durationMin: 15,
    objective:
      'Sortir la tête de l’axe par une rotation du buste et des hanches, sans perdre les appuis ni la garde.',
    prerequisites: ['Garde haute et couverture', 'Coordination hanches-épaules'],
    organisation: {
      space: 'Ligne au sol (ruban adhésif), un boxeur par ligne, deux mètres entre les lignes.',
      material: ['Ruban adhésif au sol', 'Balles en mousse', 'Miroir'],
      groups: 'Binômes : un lanceur de signal, un boxeur ; rotation toutes les 2 min.',
    },
    schema: {
      kind: 'defense',
      phases: ['Tête dans l’axe', 'Rotation hors de la ligne', 'Retour garde centrée'],
    },
    steps: [
      'Pieds de part et d’autre de la ligne au sol : faire passer la tête de l’autre côté de la ligne par rotation des hanches, lentement (10 de chaque côté).',
      'Au miroir, vérifier que l’épaule avant monte légèrement et que le regard reste sur le miroir (2 x 10).',
      'Le partenaire, à trois mètres, tend lentement la main gauche ou droite comme signal : esquive du côté opposé (15 répétitions).',
      'Esquive puis retour en garde centrée, en comptant à voix haute « un-deux » pour le rythme (2 x 10).',
      'Le partenaire lève une balle en mousse à droite ou à gauche au hasard : le boxeur esquive du bon côté et revient (1 min).',
    ],
    decision:
      'Selon le côté où la balle est levée, le boxeur choisit l’esquive extérieure ou intérieure ; si le partenaire lève les deux balles, il recule d’un pas au lieu d’esquiver.',
    corrections: [
      { error: 'Le boxeur se penche en avant en cassant la taille.', fix: 'Garder le buste droit et tourner autour d’une colonne imaginaire.' },
      { error: 'Talons qui décollent et perte d’équilibre.', fix: 'Pivoter sur l’avant du pied, genoux souples, poids réparti.' },
    ],
    criteria: [
      'La tête franchit la ligne au sol sans que les pieds bougent.',
      'Le regard reste orienté vers le partenaire pendant l’esquive.',
      'Le retour en garde est complet avant le signal suivant.',
    ],
    adaptations: {
      enfants: 'Jeu du « tunnel » : passer la tête d’une rive à l’autre de la rivière (ligne) ; signaux annoncés à la voix avant d’être visuels.',
      ados: 'Augmenter la fréquence des signaux et mesurer le nombre d’esquives correctes sur 30 s.',
      jeunesAdultes: 'Lier l’esquive à un direct dans le vide du côté libéré, en gardant la rotation comme source de puissance.',
    },
    safety:
      'Le partenaire reste à trois mètres et ne s’avance jamais ; mouvements de rotation sans à-coup pour protéger le bas du dos.',
  },
  {
    id: 23,
    slug: 'retrait-du-buste',
    module: 3,
    title: 'Retrait du buste',
    level: 'découverte',
    durationMin: 12,
    objective:
      'Éloigner la tête d’un direct annoncé en transférant le poids sur la jambe arrière, puis revenir en position de remise.',
    prerequisites: ['Garde haute et couverture', 'Transfert du poids avant-arrière'],
    organisation: {
      space: 'Couloirs de trois mètres, boxeurs face à face à distance de sécurité marquée par deux plots.',
      material: ['Plots', 'Miroir', 'Chronomètre'],
      groups: 'Binômes, rôles inversés à chaque série.',
    },
    schema: {
      kind: 'defense',
      phases: ['Poids au centre', 'Bascule sur l’arrière', 'Retour en appui'],
    },
    steps: [
      'Sans partenaire, basculer le poids sur la jambe arrière en gardant les pieds fixes : la tête recule d’une vingtaine de centimètres (2 x 10).',
      'Au miroir, contrôler que les gants restent devant le visage et que le menton ne monte pas (2 x 8).',
      'Le partenaire, derrière son plot, mime lentement un direct dans le vide : le boxeur recule le buste au moment où le bras se tend (12 répétitions).',
      'Après le retrait, revenir sur l’appui avant en lançant un direct du bras arrière dans le vide (2 x 8).',
      'Alterner sur signal vocal « retrait » ou « pas arrière » pour différencier les deux solutions (1 min).',
    ],
    decision:
      'Si le partenaire mime un seul direct, retrait du buste ; s’il annonce « double », le boxeur doit choisir un pas arrière complet car le retrait seul ne suffit plus.',
    corrections: [
      { error: 'Le boxeur recule en se cambrant fortement.', fix: 'Fléchir la jambe arrière : c’est le genou qui absorbe, pas le dos.' },
      { error: 'Les mains suivent la tête et s’écartent.', fix: 'Garder les gants à la même distance du visage pendant le retrait.' },
    ],
    criteria: [
      'Les pieds restent fixes pendant le retrait.',
      'Le retour en appui avant est fluide, sans temps mort.',
      'Le choix retrait / pas arrière correspond au signal dans 8 cas sur 10.',
    ],
    adaptations: {
      enfants: 'Image du « roseau qui plie » ; seulement le retrait sans remise, partenaire qui mime très lentement.',
      ados: 'Introduire la remise immédiate et compter les retours corrects en 30 s.',
      jeunesAdultes: 'Varier le rythme du mime (lent, moyen) et travailler le retrait en enchaînement de déplacements.',
    },
    safety:
      'Le partenaire mime derrière son plot, bras tendu à plus d’un mètre du visage du boxeur ; aucun mouvement brusque du dos.',
  },
  {
    id: 24,
    slug: 'parade-chassee-du-direct',
    module: 3,
    title: 'Parade chassée du direct',
    level: 'intermédiaire',
    durationMin: 18,
    objective:
      'Dévier latéralement un direct annoncé par un petit mouvement de la main arrière, sans aller chercher le coup ni ouvrir la garde.',
    prerequisites: ['Garde haute et couverture', 'Enchaînements du direct'],
    organisation: {
      space: 'Binômes face à face sur une ligne, distance de bras tendu plus un pas, marquée au sol.',
      material: ['Marques au sol', 'Foulards', 'Miroir'],
      groups: 'Binômes de gabarit proche, un attaquant mime et un défenseur.',
    },
    schema: {
      kind: 'defense',
      phases: ['Direct mimé à distance', 'Paume qui chasse', 'Main revenue à la joue'],
    },
    steps: [
      'Au miroir, petit geste de la paume arrière vers l’intérieur, amplitude d’une main, retour immédiat à la joue (2 x 15).',
      'Le partenaire tient un foulard tendu à bout de bras, immobile : le défenseur effleure le foulard du bout du gant et revient (10 répétitions).',
      'Le partenaire mime un direct lent et annoncé à voix haute, hors de portée : parade dans le vide au bon moment (2 x 10).',
      'Parade suivie d’un direct du bras avant dans le vide (2 x 8).',
      'Le partenaire annonce « direct » ou « rien » au dernier moment : le défenseur ne pare que s’il y a un direct (1 min).',
    ],
    decision:
      'Face à un direct du bras avant, choisir entre parade chassée (on reste sur place pour remiser) et retrait du buste (on préfère s’éloigner) selon la consigne « rester » ou « sortir ».',
    corrections: [
      { error: 'La main part loin à la rencontre du coup.', fix: 'Le mouvement reste devant le visage, amplitude maximale de la largeur d’un gant.' },
      { error: 'Les deux mains bougent ensemble.', fix: 'La main avant reste en place, prête à remiser.' },
      { error: 'Parade anticipée avant le geste du partenaire.', fix: 'Attendre le départ de l’épaule du partenaire avant de réagir.' },
    ],
    criteria: [
      'Le gant de parade revient à la joue en moins d’une seconde.',
      'La main avant ne bouge pas pendant la parade.',
      'Aucune parade sur l’annonce « rien ».',
    ],
    adaptations: {
      enfants: 'Jeu « chasser la mouche » avec le foulard immobile ; pas de mime de coup, uniquement des cibles fixes.',
      ados: 'Ajouter la remise et un comptage des réponses justes ; rotation des binômes toutes les 2 min.',
      jeunesAdultes: 'Travailler la parade des deux côtés (main avant sur direct arrière mimé) et varier le rythme des annonces.',
    },
    safety:
      'Le mime se fait à distance marquée, jamais à portée : le défenseur pare le vide, aucun gant ne doit se toucher en dehors du foulard immobile.',
  },
  {
    id: 25,
    slug: 'blocage-du-crochet-annonce',
    module: 3,
    title: 'Blocage haut contre crochet annoncé',
    level: 'intermédiaire',
    durationMin: 15,
    objective:
      'Protéger le côté de la tête en montant l’avant-bras et le gant contre la tempe sur un crochet mimé, puis rester stable pour enchaîner.',
    prerequisites: ['Garde haute et couverture', 'Crochet dans le vide'],
    organisation: {
      space: 'Ring ou salle, binômes espacés de trois mètres, plots matérialisant la distance de sécurité.',
      material: ['Plots', 'Foulards bicolores', 'Chronomètre'],
      groups: 'Binômes ; l’entraîneur passe pour vérifier les coudes.',
    },
    schema: {
      kind: 'defense',
      phases: ['Signal côté gauche ou droit', 'Gant à la tempe, coude bas', 'Remise croisée dans le vide'],
    },
    steps: [
      'Seul, monter alternativement chaque gant contre la tempe, coude pointé vers le bas, avant-bras vertical (2 x 10 par côté).',
      'Ajouter une légère flexion des jambes du côté du blocage pour absorber (2 x 8).',
      'Le partenaire mime un crochet lent derrière son plot en annonçant le côté : blocage du côté correspondant (2 x 10).',
      'Blocage puis crochet du bras opposé dans le vide (2 x 8).',
      'Le partenaire lève un foulard à gauche ou à droite sans annoncer : blocage du bon côté, puis remise (1 min 30).',
    ],
    decision:
      'Si le foulard est levé haut, blocage ; s’il est levé bas, esquive rotative à la place : le boxeur choisit la défense adaptée au signal.',
    corrections: [
      { error: 'Le coude monte et ouvre le flanc.', fix: 'Le coude descend vers la hanche, seul le gant monte.' },
      { error: 'Le boxeur tourne la tête vers le côté bloqué.', fix: 'Garder le regard droit devant, vers le partenaire.' },
    ],
    criteria: [
      'L’avant-bras est vertical et le coude bas au moment du blocage.',
      'Le côté du blocage correspond au signal dans 9 cas sur 10.',
      'La remise part sans que le gant de blocage ne quitte la tempe.',
    ],
    adaptations: {
      enfants: 'Image du « téléphone » : on décroche le combiné à l’oreille ; un seul côté à la fois, signaux annoncés.',
      ados: 'Alterner blocage et esquive selon la hauteur du foulard, en défi de rapidité.',
      jeunesAdultes: 'Enchaîner deux blocages successifs (gauche-droite) avant la remise, rounds de 2 min.',
    },
    safety:
      'Le partenaire mime toujours derrière son plot ; le blocage se fait sans contact, aucun bras ne vient toucher le gant du défenseur.',
  },
  {
    id: 26,
    slug: 'esquive-basse-par-flexion',
    module: 3,
    title: 'Esquive basse par flexion',
    level: 'intermédiaire',
    durationMin: 15,
    objective:
      'Passer sous une trajectoire haute en fléchissant les jambes, dos droit et regard vers l’avant, puis remonter en garde équilibrée.',
    prerequisites: ['Esquive rotative du buste', 'Garde haute et couverture'],
    organisation: {
      space: 'Salle libre, binômes à trois mètres ; un élastique tendu entre deux plots hauts pour certains ateliers.',
      material: ['Élastique ou corde légère', 'Deux plots hauts', 'Balles en mousse'],
      groups: 'Petits groupes de trois : deux tiennent l’élastique, un passe dessous.',
    },
    schema: {
      kind: 'defense',
      phases: ['Garde haute', 'Flexion sous la ligne', 'Remontée en garde'],
    },
    steps: [
      'Flexions lentes dos droit, regard devant : descendre de vingt centimètres et remonter (2 x 10).',
      'Passer sous l’élastique fixe tenu à hauteur d’épaule, sans le toucher (12 passages).',
      'Le partenaire fait balayer lentement l’élastique de gauche à droite à distance : flexion au bon moment (2 x 8).',
      'Flexion puis uppercut dans le vide en remontant (2 x 8).',
      'Le partenaire lève une balle haute (flexion) ou basse (rester debout et couvrir) : choix en 1 min.',
    ],
    decision:
      'Balle haute : flexion ; balle à hauteur de buste : couverture debout, car se baisser exposerait la tête : le boxeur doit choisir sans hésiter.',
    corrections: [
      { error: 'Le boxeur plonge la tête en avant en se penchant.', fix: 'Descendre comme sur une chaise : ce sont les genoux qui plient.' },
      { error: 'Regard vers le sol pendant la flexion.', fix: 'Fixer la poitrine du partenaire tout au long du mouvement.' },
    ],
    criteria: [
      'Le dos reste droit pendant la flexion.',
      'Les gants restent en garde en position basse.',
      'L’élastique n’est jamais touché sur 10 passages.',
    ],
    adaptations: {
      enfants: 'Jeu du « limbo boxe » avec l’élastique fixe et assez haut ; pas de balayage.',
      ados: 'Élastique en mouvement lent et ajout de l’uppercut en remontée.',
      jeunesAdultes: 'Combiner flexion et pas latéral pour sortir de l’axe en remontant.',
    },
    safety:
      'L’élastique est léger et tenu sans tension par des partenaires attentifs, toujours à hauteur d’épaule ou plus ; flexions limitées en amplitude pour protéger les genoux.',
  },
  {
    id: 27,
    slug: 'rouler-sous-le-crochet',
    module: 3,
    title: 'Rouler sous le crochet',
    level: 'intermédiaire',
    durationMin: 20,
    objective:
      'Enchaîner flexion et déplacement latéral du buste en « U » pour passer sous une trajectoire circulaire mimée et ressortir de l’autre côté, prêt à remiser.',
    prerequisites: ['Esquive basse par flexion', 'Esquive rotative du buste'],
    organisation: {
      space: 'Couloirs de quatre mètres, plots au sol formant un U de repère pour la tête.',
      material: ['Plots', 'Élastique léger', 'Miroir'],
      groups: 'Groupes de trois pour tenir l’élastique, puis binômes.',
    },
    schema: {
      kind: 'defense',
      phases: ['Départ côté gauche', 'Passage bas en U', 'Sortie côté droit'],
    },
    steps: [
      'Au miroir, dessiner un U avec la tête en fléchissant puis en se relevant de l’autre côté, très lentement (2 x 8).',
      'Passer sous l’élastique tenu en diagonale (de l’épaule à la hanche opposée) en suivant le U (2 x 8).',
      'Le partenaire mime lentement un crochet large derrière son plot : rouler dans le sens opposé à la trajectoire (2 x 10).',
      'Rouler puis crochet dans le vide du côté de sortie (2 x 8).',
      'Le partenaire annonce « crochet gauche », « crochet droit » ou « direct » : rouler sur les crochets, parer ou retirer sur le direct (1 min 30).',
    ],
    decision:
      'Sur crochet, rouler sous ; sur direct, rouler serait trop lent : le boxeur choisit une parade ou un retrait. Il distingue les deux trajectoires annoncées.',
    corrections: [
      { error: 'Le boxeur descend et remonte du même côté.', fix: 'Penser à « entrer d’un côté de la cuvette et sortir de l’autre ».' },
      { error: 'Les gants descendent avec le buste.', fix: 'Les gants restent collés au visage durant tout le U.' },
      { error: 'Les pieds se croisent pendant le mouvement.', fix: 'Pieds fixes au départ, puis petit pas latéral seulement à la sortie.' },
    ],
    criteria: [
      'La tête trace un U complet sans s’arrêter au point bas.',
      'Le boxeur sort du côté opposé à la trajectoire mimée.',
      'La remise part depuis une garde stable.',
    ],
    adaptations: {
      enfants: 'Version « passer sous le pont » avec élastique fixe, sans mime de coup, et images de mouvement de bateau.',
      ados: 'Mime de crochet lent et annonce du côté ; comptage des sorties du bon côté.',
      jeunesAdultes: 'Enchaîner deux roulés successifs puis remise en deux coups dans le vide.',
    },
    safety:
      'Flexion modérée, genoux dans l’axe des pieds ; le partenaire mime derrière son plot, sans aucune approche, et l’élastique est lâché au moindre accrochage.',
  },
  {
    id: 28,
    slug: 'sortir-de-l-axe-pas-lateral',
    module: 3,
    title: 'Sortir de l’axe par pas latéral',
    level: 'avancé',
    durationMin: 18,
    objective:
      'Combiner défense et déplacement : après un geste défensif, quitter la ligne d’attaque par un pas latéral ou un pivot pour se replacer en angle.',
    prerequisites: ['Parade chassée du direct', 'Pas chassés latéraux', 'Pivot sur le pied avant'],
    organisation: {
      space: 'Carré de quatre mètres matérialisé par des plots, une ligne centrale au sol représentant l’axe d’attaque.',
      material: ['Plots', 'Ruban adhésif', 'Foulards bicolores'],
      groups: 'Binômes, rôle de signaleur et de boxeur.',
    },
    schema: {
      kind: 'deplacement',
      phases: ['Sur la ligne d’attaque', 'Défense + pas latéral', 'Garde en angle'],
    },
    steps: [
      'Sur la ligne au sol, pas latéral vers l’extérieur du pied avant puis retour en garde, sans croiser (2 x 10).',
      'Pivot sur le pied avant d’un quart de tour pour se retrouver hors de la ligne (2 x 8 par côté).',
      'Parade dans le vide puis pas latéral immédiat sur un signal du partenaire (2 x 8).',
      'Le partenaire, placé à trois mètres, avance d’un pas lent : le boxeur sort de l’axe et se retrouve de profil par rapport à sa trajectoire (2 x 8).',
      'Round de 1 min 30 : foulard rouge = pas latéral à gauche, bleu = pivot, les deux = pas arrière.',
    ],
    decision:
      'Quand le partenaire avance en ligne droite, le boxeur choisit entre pas latéral (l’espace est libre sur le côté) et pivot (il est proche d’un plot qui figure les cordes).',
    corrections: [
      { error: 'Pas latéral sur le côté qui rapproche de la main arrière du partenaire.', fix: 'Sortir prioritairement du côté de son épaule avant (extérieur).' },
      { error: 'Les pieds se croisent pendant le pas.', fix: 'Le pied le plus proche de la direction part en premier, l’autre suit.' },
    ],
    criteria: [
      'Les pieds ne se croisent jamais.',
      'Après le déplacement, le boxeur est hors de la ligne au sol, en garde face au partenaire.',
      'Le choix pivot/pas latéral tient compte des plots-cordes.',
    ],
    adaptations: {
      enfants: 'Jeu du « taureau qui passe » : le partenaire avance doucement, l’enfant s’écarte comme un toréador, sans défense préalable.',
      ados: 'Ajouter la parade avant le pas et chronométrer le temps de réaction.',
      jeunesAdultes: 'Finir chaque sortie par un enchaînement de deux coups dans le vide depuis l’angle obtenu.',
    },
    safety:
      'Le partenaire avance lentement et s’arrête à un mètre minimum ; zone dégagée de tout obstacle, plots bas uniquement.',
  },
  {
    id: 29,
    slug: 'defense-remise-dans-le-vide',
    module: 3,
    title: 'Défense puis remise immédiate',
    level: 'avancé',
    durationMin: 20,
    objective:
      'Transformer chaque défense en point de départ d’une remise adaptée (direct, crochet ou uppercut dans le vide), sans temps mort ni déséquilibre.',
    prerequisites: ['Rouler sous le crochet', 'Parade chassée du direct', 'Enchaînements du direct'],
    organisation: {
      space: 'Ring ou salle, binômes à trois mètres derrière des plots.',
      material: ['Plots', 'Cartes illustrées défense / remise', 'Chronomètre'],
      groups: 'Binômes ; l’entraîneur tire les cartes pour l’ensemble du groupe.',
    },
    schema: {
      kind: 'enchainement',
      phases: ['Défense choisie', 'Remise adaptée', 'Retour en garde mobile'],
    },
    steps: [
      'Revoir les associations clés : parade → direct arrière, retrait → direct arrière, esquive → crochet, flexion → uppercut (1 répétition lente de chaque, 3 tours).',
      'L’entraîneur tire une carte défense, chacun exécute défense + remise dans le vide (2 x 6).',
      'Le partenaire mime lentement une attaque annoncée derrière son plot ; le boxeur défend et remise vers le vide, à côté du partenaire (2 x 8).',
      'Ajouter un pas de sortie après la remise (2 x 6).',
      'Round de 2 min : attaques mimées non annoncées, rythme lent ; le partenaire valide ou corrige chaque association.',
    ],
    decision:
      'Après une esquive à l’extérieur, le boxeur choisit entre remiser du bras libéré ou ressortir sans remise si le partenaire mime déjà une seconde attaque.',
    corrections: [
      { error: 'Pause entre défense et remise.', fix: 'Penser défense et remise comme un seul mot : « es-quive-cro-chet ».' },
      { error: 'Remise lancée vers le partenaire.', fix: 'Viser un point fixe à côté de lui (plot haut ou repère au mur).' },
      { error: 'Garde oubliée après la remise.', fix: 'Compter « trois » : défense, remise, garde.' },
    ],
    criteria: [
      'La remise part en moins d’une seconde après la défense.',
      'Le type de remise correspond à la défense dans 8 cas sur 10.',
      'Le boxeur termine chaque séquence en garde équilibrée.',
    ],
    adaptations: {
      enfants: 'Uniquement avec les cartes et sans partenaire mimant ; deux associations au choix maximum.',
      ados: 'Partenaire qui mime, attaques annoncées, défi de fluidité noté par l’observateur.',
      jeunesAdultes: 'Attaques non annoncées au rythme lent et ajout de la sortie en angle.',
    },
    safety:
      'Toute remise se fait dans le vide, jamais en direction du visage ou du corps du partenaire ; distance de trois mètres maintenue par les plots.',
  },
  {
    id: 30,
    slug: 'lecture-des-signaux-defensifs',
    module: 3,
    title: 'Lecture des signaux et choix défensif',
    level: 'avancé',
    durationMin: 25,
    objective:
      'Identifier rapidement le type d’attaque mimée à partir d’indices (épaule, pied, hauteur du bras) et choisir la défense la plus adaptée parmi celles du module.',
    prerequisites: ['Défense puis remise immédiate', 'Sortir de l’axe par pas latéral'],
    organisation: {
      space: 'Ring entier ou zone de 5 x 5 m, plots délimitant une distance de sécurité de trois mètres.',
      material: ['Plots', 'Balles en mousse de couleur', 'Fiche d’observation', 'Chronomètre'],
      groups: 'Groupes de trois : attaquant qui mime, défenseur, observateur qui note.',
    },
    schema: {
      kind: 'cooperation',
      phases: ['Indice observé', 'Défense choisie', 'Observateur valide'],
    },
    steps: [
      'Présentation des indices : épaule avant qui part = direct, coude qui s’ouvre = crochet, genoux qui fléchissent = uppercut (démonstration lente, 5 min).',
      'L’attaquant montre l’indice seul, sans le coup : le défenseur nomme l’attaque à voix haute (2 x 8).',
      'L’attaquant mime le coup complet très lentement : le défenseur choisit et exécute une défense (2 x 8).',
      'Ajouter une remise et une sortie, l’observateur coche la fiche (2 x 6).',
      'Round de 2 min à rythme lent avec attaques variées, puis échange de rôles et bilan collectif sur les erreurs de lecture.',
    ],
    decision:
      'Face à un même indice, plusieurs défenses sont possibles : le défenseur justifie son choix après le round (« j’ai roulé car j’étais près des plots »).',
    corrections: [
      { error: 'Le défenseur réagit à la voix et non à l’indice visuel.', fix: 'L’attaquant reste silencieux ; seuls les gestes renseignent.' },
      { error: 'Toujours la même défense quelle que soit l’attaque.', fix: 'L’observateur interdit pendant 30 s la défense trop utilisée.' },
    ],
    criteria: [
      'L’attaque est correctement nommée dans au moins 8 cas sur 10.',
      'Au moins trois défenses différentes sont utilisées pendant le round.',
      'Le défenseur sait expliquer un choix à l’observateur.',
    ],
    adaptations: {
      enfants: 'Balles de couleur à la place des mimes (rouge = esquive, jaune = couverture, vert = pas arrière) ; parties courtes de 45 s.',
      ados: 'Mimes réels mais très lents, fiche d’observation simplifiée à deux colonnes.',
      jeunesAdultes: 'Indices plus discrets, feintes d’indice ajoutées, discussion tactique à la fin de chaque round.',
    },
    safety:
      'Les mimes se font derrière les plots, trois mètres minimum, à vitesse lente imposée ; l’observateur peut arrêter l’exercice à tout moment.',
  },
];
