import { Lesson } from '../lessons.model';

export const MODULE_4: Lesson[] = [
  {
    id: 31,
    slug: 'reperer-sa-distance',
    module: 4,
    title: 'Repérer sa distance de touche',
    level: 'découverte',
    durationMin: 15,
    objective:
      'Connaître sa propre allonge et distinguer trois distances : hors de portée, distance de touche, trop près.',
    prerequisites: ['Garde de base et position des appuis', 'Direct du bras avant dans le vide'],
    organisation: {
      space: 'Mur ou espalier dégagé, puis couloirs de quatre mètres balisés au sol.',
      material: ['Plots de trois couleurs', 'Ruban adhésif', 'Mètre ruban'],
      groups: 'Individuel, puis binômes d’allonge proche.',
    },
    schema: {
      kind: 'distance',
      phases: ['Zone longue (hors portée)', 'Zone de touche', 'Zone courte'],
    },
    steps: [
      'Face à un plot haut, lancer un direct dans le vide et ajuster sa position jusqu’à ce que le gant s’arrête juste avant le plot (5 essais).',
      'Marquer au sol trois zones avec les plots : rouge = trop près, vert = touche, bleu = hors portée (installation guidée).',
      'Se déplacer en pas chassés et annoncer à voix haute la zone où l’on se trouve (1 min).',
      'Sur un appel de couleur de l’entraîneur, rejoindre la zone en deux pas maximum (2 x 8).',
      'En binôme, l’un se place, l’autre estime à l’œil sa propre zone par rapport au partenaire puis vérifie au plot (2 x 6).',
    ],
    decision:
      'À l’appel « attaque », le boxeur décide s’il est déjà en zone verte ou s’il doit d’abord avancer d’un pas avant de lancer son direct dans le vide.',
    corrections: [
      { error: 'Le boxeur se penche pour « gagner » de l’allonge.', fix: 'Le buste reste au-dessus des appuis : c’est le pas qui règle la distance.' },
      { error: 'Confusion entre zones à cause de pas trop grands.', fix: 'Petits pas de la longueur d’un pied pour ajuster finement.' },
    ],
    criteria: [
      'Le boxeur s’arrête dans la bonne zone en deux pas maximum.',
      'Son direct dans le vide s’arrête à moins de dix centimètres du plot.',
      'Il estime correctement sa zone face au partenaire dans 4 cas sur 6.',
    ],
    adaptations: {
      enfants: 'Jeu des « trois maisons » de couleur ; zones larges et appels lents.',
      ados: 'Zones resserrées et appels enchaînés rapidement ; défi de précision.',
      jeunesAdultes: 'Mesurer son allonge réelle et la comparer à celle de partenaires de gabarits différents.',
    },
    safety:
      'Les directs se font vers un plot, jamais vers un partenaire ; dégager l’espace autour du mur ou de l’espalier.',
  },
  {
    id: 32,
    slug: 'entrer-et-sortir-de-distance',
    module: 4,
    title: 'Entrer et sortir de distance',
    level: 'découverte',
    durationMin: 15,
    objective:
      'Passer de la zone longue à la zone de touche et ressortir aussitôt, en un aller-retour rapide et équilibré.',
    prerequisites: ['Repérer sa distance de touche', 'Pas chassés avant/arrière'],
    organisation: {
      space: 'Couloirs de quatre mètres avec les trois zones de couleur au sol.',
      material: ['Plots de couleur', 'Plot haut comme cible fixe', 'Chronomètre'],
      groups: 'Individuel en couloir, puis vagues de quatre boxeurs.',
    },
    schema: {
      kind: 'deplacement',
      phases: ['Attente zone longue', 'Entrée + direct', 'Sortie immédiate'],
    },
    steps: [
      'Aller-retour lent zone bleue → zone verte → zone bleue en pas chassés, garde haute (2 x 8).',
      'Ajouter un direct dans le vide vers le plot haut à l’arrivée en zone verte (2 x 8).',
      'Accélérer l’entrée en gardant une sortie aussi rapide que l’entrée (2 x 6).',
      'Sur un claquement de mains, entrer ; sur deux claquements, rester et feinter (1 min).',
      'Vagues : quatre boxeurs exécutent dix allers-retours, l’entraîneur observe la stabilité à la sortie.',
    ],
    decision:
      'Après l’entrée, si l’entraîneur lève la main, le boxeur doit ressortir sans lancer son direct : il décide en zone verte s’il frappe dans le vide ou s’il repart.',
    corrections: [
      { error: 'Le boxeur reste planté en zone verte après le direct.', fix: 'Penser « entrer-toucher-sortir » comme un seul mouvement.' },
      { error: 'Sortie en reculant le buste uniquement.', fix: 'Le pied arrière pousse vers l’arrière, le corps suit en entier.' },
    ],
    criteria: [
      'Le temps passé en zone verte ne dépasse pas une seconde.',
      'La garde reste haute à l’entrée et à la sortie.',
      'Le boxeur respecte le signal « pas de direct » dans 8 cas sur 10.',
    ],
    adaptations: {
      enfants: 'Image du « chat qui vole un poisson et repart » ; pas de feinte, seulement entrée-sortie.',
      ados: 'Défi chronométré : nombre d’allers-retours propres en 30 s.',
      jeunesAdultes: 'Varier les angles d’entrée (axe et légèrement latéral) et ajouter le double direct dans le vide.',
    },
    safety:
      'Un seul boxeur par couloir ; les plots-cibles sont légers et le sol dégagé pour éviter les chutes en recul.',
  },
  {
    id: 33,
    slug: 'garder-la-distance-en-miroir',
    module: 4,
    title: 'Garder la distance en miroir',
    level: 'découverte',
    durationMin: 15,
    objective:
      'Maintenir une distance constante avec un partenaire mobile en suivant ses déplacements, sans aucun geste de frappe.',
    prerequisites: ['Entrer et sortir de distance', 'Pas chassés latéraux'],
    organisation: {
      space: 'Salle libre, binômes répartis avec deux mètres de marge autour.',
      material: ['Bâton léger en mousse ou corde de 2 m', 'Chronomètre'],
      groups: 'Binômes : un meneur, un suiveur ; inversion toutes les 45 s.',
    },
    schema: {
      kind: 'cooperation',
      phases: ['Meneur se déplace', 'Suiveur ajuste', 'Distance conservée'],
    },
    steps: [
      'Les deux partenaires tiennent chacun un bout de la corde tendue sans tirer : le meneur avance/recule lentement, le suiveur garde la corde tendue (1 min).',
      'Même exercice avec déplacements latéraux et pivots (1 min).',
      'Lâcher la corde : garder la même distance « à l’œil », le meneur change d’allure (2 x 45 s).',
      'Le meneur s’arrête brusquement : le suiveur doit s’arrêter sans franchir la distance (2 x 8).',
      'Le suiveur prend l’initiative de changer de zone (entrée feinte) au signal de l’entraîneur, puis revient à la distance de départ (1 min).',
    ],
    decision:
      'Quand le meneur recule vers un plot figurant les cordes, le suiveur choisit de le suivre de face ou de se décaler pour lui couper la sortie latérale.',
    corrections: [
      { error: 'Le suiveur réagit en retard et la distance se rallonge.', fix: 'Regarder les hanches du meneur, elles annoncent le déplacement.' },
      { error: 'Pieds qui se croisent sur les déplacements latéraux.', fix: 'Pas chassés courts, pied le plus proche de la direction en premier.' },
    ],
    criteria: [
      'La corde reste tendue sans tirer pendant tout l’exercice.',
      'Sans corde, la distance varie de moins d’un demi-pas.',
      'Le suiveur s’arrête à temps sur les arrêts brusques.',
    ],
    adaptations: {
      enfants: 'Jeu de « l’ombre » avec la corde uniquement ; meneur lent et trajets simples.',
      ados: 'Sans corde, rôle de meneur avec changements d’allure imprévisibles.',
      jeunesAdultes: 'Le suiveur doit en plus couper l’angle vers les plots-cordes à chaque recul.',
    },
    safety:
      'La corde n’est jamais enroulée autour du poignet et se lâche au moindre déséquilibre ; aucun geste de bras vers le partenaire.',
  },
  {
    id: 34,
    slug: 'changer-de-tempo',
    module: 4,
    title: 'Changer de tempo',
    level: 'intermédiaire',
    durationMin: 18,
    objective:
      'Varier volontairement la vitesse de ses déplacements et de ses coups dans le vide pour casser la régularité et surprendre.',
    prerequisites: ['Entrer et sortir de distance', 'Enchaînements du direct'],
    organisation: {
      space: 'Salle libre, chacun dans un espace de 2 x 2 m.',
      material: ['Musique ou métronome à tempo variable', 'Plots'],
      groups: 'Individuel, puis binômes observateur/boxeur.',
    },
    schema: {
      kind: 'enchainement',
      phases: ['Tempo lent installé', 'Rupture rapide', 'Retour au calme'],
    },
    steps: [
      'Shadow sur un tempo lent et régulier (métronome) : pas + direct dans le vide sur chaque temps (1 min).',
      'Sur le même tempo, insérer un enchaînement de deux coups rapides tous les quatre temps (2 x 1 min).',
      'Alterner « lent-lent-vite » sans métronome, l’observateur doit repérer le moment de rupture (2 x 45 s).',
      'Ralentir volontairement juste avant d’accélérer (temps mort trompeur) (2 x 6).',
      'Round de 1 min 30 : l’observateur frappe dans ses mains à chaque rupture vue ; s’il les annonce toutes, le boxeur est trop prévisible.',
    ],
    decision:
      'Le boxeur choisit le moment de sa rupture : juste après un déplacement de l’observateur ou au moment où celui-ci baisse les yeux.',
    corrections: [
      { error: 'Accélération uniquement des bras, pieds restés lents.', fix: 'Les pieds lancent la rupture, les bras suivent.' },
      { error: 'Ruptures toujours au même intervalle.', fix: 'Compter dans sa tête des cycles différents (3, 5, 2...).' },
      { error: 'Perte de garde pendant l’accélération.', fix: 'Raccourcir les coups plutôt que les allonger.' },
    ],
    criteria: [
      'Le passage du lent au rapide est net et visible.',
      'L’observateur n’anticipe pas plus de la moitié des ruptures.',
      'La garde reste haute pendant les phases rapides.',
    ],
    adaptations: {
      enfants: 'Jeu « tortue / lièvre » à l’appel de l’entraîneur, uniquement sur les déplacements.',
      ados: 'Ruptures choisies librement, défi contre l’observateur.',
      jeunesAdultes: 'Travail des trois vitesses (lent, moyen, explosif) et du temps mort trompeur.',
    },
    safety:
      'Chaque boxeur reste dans son carré pour éviter les collisions lors des accélérations ; coups toujours dans le vide.',
  },
  {
    id: 35,
    slug: 'feinte-et-observation',
    module: 4,
    title: 'Feinte et observation de la réaction',
    level: 'intermédiaire',
    durationMin: 18,
    objective:
      'Utiliser une feinte d’épaule ou de pied pour provoquer une réaction du partenaire, et apprendre à lire cette réaction.',
    prerequisites: ['Changer de tempo', 'Garder la distance en miroir'],
    organisation: {
      space: 'Binômes à trois mètres, distance balisée par deux plots.',
      material: ['Plots', 'Foulards', 'Fiche d’observation simple'],
      groups: 'Binômes ; inversion des rôles toutes les 2 min.',
    },
    schema: {
      kind: 'cooperation',
      phases: ['Feinte proposée', 'Réaction du partenaire', 'Décision du feinteur'],
    },
    steps: [
      'Au miroir, feinte d’épaule avant (petit départ de direct sans bras) et feinte de pied (petit appel au sol) (2 x 8).',
      'Le partenaire réagit de façon imposée : il lève les gants sur la feinte d’épaule (2 x 6).',
      'Le partenaire choisit sa réaction : lever les gants, reculer ou ne rien faire ; le feinteur nomme à voix haute la réaction vue (2 x 8).',
      'Feinte puis action dans le vide adaptée : si le partenaire lève les gants, direct au corps dans le vide ; s’il recule, entrée d’un pas (2 x 6).',
      'Round de 1 min 30 sans annonce ; à la fin, le feinteur dit quelle feinte « marche » le mieux sur ce partenaire.',
    ],
    decision:
      'Après la feinte, le boxeur décide entre attaquer dans le vide (réaction exploitée), refeinter (réaction absente) ou ressortir (partenaire qui avance).',
    corrections: [
      { error: 'Feinte trop ample qui déséquilibre le feinteur.', fix: 'La feinte est un « début » de geste, pas un geste raté.' },
      { error: 'Le feinteur ne regarde pas la réaction.', fix: 'Les yeux restent fixés sur les gants et le buste du partenaire.' },
    ],
    criteria: [
      'Le feinteur nomme correctement la réaction dans 8 cas sur 10.',
      'Il reste équilibré et en garde après chaque feinte.',
      'L’action qui suit correspond à la réaction observée.',
    ],
    adaptations: {
      enfants: 'Jeu « Jacques a dit » à l’envers : on fait semblant et le partenaire ne doit pas bouger ; uniquement feinte de pied.',
      ados: 'Réactions libres et fiche d’observation à cocher par un troisième élève.',
      jeunesAdultes: 'Enchaîner deux feintes différentes pour observer laquelle déclenche la réaction attendue.',
    },
    safety:
      'Toute action après la feinte se fait dans le vide, à côté du partenaire ; plots à trois mètres jamais franchis.',
  },
  {
    id: 36,
    slug: 'couper-la-sortie',
    module: 4,
    title: 'Couper la sortie',
    level: 'intermédiaire',
    durationMin: 20,
    objective:
      'Diriger un partenaire qui se déplace vers un coin ou des cordes en coupant ses angles de sortie par des pas latéraux, sans le poursuivre en ligne droite.',
    prerequisites: ['Garder la distance en miroir', 'Pivot sur le pied avant'],
    organisation: {
      space: 'Ring ou carré de 4 x 4 m délimité par des plots ; coins bien visibles.',
      material: ['Plots', 'Chasubles de deux couleurs', 'Chronomètre'],
      groups: 'Binômes : un « pilote » qui coupe, un « mobile » qui se déplace ; inversion toutes les minutes.',
    },
    schema: {
      kind: 'deplacement',
      phases: ['Mobile au centre', 'Pilote coupe l’angle', 'Mobile orienté vers le coin'],
    },
    steps: [
      'Démonstration à vitesse marchée : le pilote se place en diagonale et non face au mobile (2 passages commentés).',
      'Le mobile se déplace uniquement latéralement ; le pilote fait un pas latéral du même côté pour lui « fermer la porte » (2 x 45 s).',
      'Le mobile peut avancer, reculer ou tourner ; le pilote doit l’amener vers un coin en moins de 30 s (3 essais).',
      'Ajouter un direct dans le vide du pilote quand le mobile arrive près du coin, à distance de sécurité (2 x 30 s).',
      'Jeu : on compte combien de fois le pilote amène le mobile dans un coin en 1 min, à allure de marche rapide.',
    ],
    decision:
      'Quand le mobile hésite entre deux sorties, le pilote choisit de fermer la plus large et de laisser volontairement la plus étroite, qui mène au coin.',
    corrections: [
      { error: 'Le pilote suit le mobile en ligne droite.', fix: 'Faire un pas latéral avant tout pas avant : « couper avant de presser ».' },
      { error: 'Le pilote arrive trop près et doit reculer.', fix: 'S’arrêter en limite de zone longue, jamais en zone courte.' },
      { error: 'Pieds qui se croisent au moment de couper.', fix: 'Pas chassés courts, garde orientée vers le mobile.' },
    ],
    criteria: [
      'Le pilote se trouve en diagonale du mobile la majorité du temps.',
      'Le mobile est amené dans un coin en moins de 30 s.',
      'La distance de sécurité de deux mètres est toujours respectée.',
    ],
    adaptations: {
      enfants: 'Jeu du « berger et du mouton » en marchant, sans coup ; coins larges.',
      ados: 'Allure de marche rapide et comptage des réussites.',
      jeunesAdultes: 'Le mobile a le droit de feinter ; le pilote doit garder sa diagonale malgré les feintes.',
    },
    safety:
      'Allure de marche rapide maximum, aucun contact corporel ; distance minimale de deux mètres, l’exercice s’arrête si elle n’est pas respectée.',
  },
  {
    id: 37,
    slug: 'contrer-le-pas-avant',
    module: 4,
    title: 'Saisir le temps sur le pas avant',
    level: 'avancé',
    durationMin: 20,
    objective:
      'Repérer l’instant où le partenaire avance (pied en l’air) et choisir de lancer son action dans le vide à ce moment précis.',
    prerequisites: ['Feinte et observation de la réaction', 'Repérer sa distance de touche'],
    organisation: {
      space: 'Couloirs de cinq mètres avec zones de couleur au sol, binômes face à face.',
      material: ['Plots de couleur', 'Plot haut comme cible latérale', 'Chronomètre'],
      groups: 'Binômes ; l’entraîneur donne le rythme des avancées.',
    },
    schema: {
      kind: 'distance',
      phases: ['Partenaire avance', 'Pied en l’air = signal', 'Direct dans le vide'],
    },
    steps: [
      'Le partenaire avance d’un pas lent et exagéré ; le boxeur dit « top » quand le pied avant quitte le sol (2 x 8).',
      'Même travail, mais le boxeur lance un direct dans le vide vers le plot latéral sur le « top » (2 x 8).',
      'Le partenaire varie entre pas lent, pas rapide et faux départ (pied qui ne part pas) (2 x 8).',
      'Le boxeur ajoute un pas de sortie après son action (2 x 6).',
      'Round de 1 min 30 : le partenaire avance librement au rythme lent imposé, le boxeur choisit ses moments ; bilan des « tops » réussis.',
    ],
    decision:
      'Sur un faux départ, le boxeur doit choisir de ne pas partir ; sur un pas trop long qui le met en zone courte, il préfère sortir latéralement que lancer son action.',
    corrections: [
      { error: 'Départ sur le mouvement des épaules au lieu du pied.', fix: 'Regarder le bas du corps du partenaire, genoux et pieds.' },
      { error: 'Action lancée trop tard, après la pose du pied.', fix: 'Être déjà en appui prêt, poids légèrement sur l’avant.' },
    ],
    criteria: [
      'Le « top » est donné pendant que le pied est en l’air dans 8 cas sur 10.',
      'Aucune réaction sur les faux départs.',
      'La sortie suit l’action sans temps d’arrêt.',
    ],
    adaptations: {
      enfants: 'Jeu « feu rouge / feu vert » : on ne bouge que quand le pied du partenaire décolle ; uniquement le « top » vocal.',
      ados: 'Ajouter le direct dans le vide et les faux départs, défi à points.',
      jeunesAdultes: 'Travailler aussi le temps sur le recul du partenaire et comparer les deux situations.',
    },
    safety:
      'Le partenaire avance lentement et s’arrête toujours avant la zone courte ; les directs visent un plot latéral, jamais le partenaire.',
  },
  {
    id: 38,
    slug: 'jeu-de-distance-a-trois-zones',
    module: 4,
    title: 'Jeu de distance à trois zones',
    level: 'avancé',
    durationMin: 20,
    objective:
      'Choisir en continu la zone (longue, de touche, courte) la plus favorable selon la position du partenaire et l’espace restant.',
    prerequisites: ['Couper la sortie', 'Entrer et sortir de distance'],
    organisation: {
      space: 'Ring ou carré de 5 x 5 m, plots-cordes sur les bords.',
      material: ['Plots', 'Cartes de consigne', 'Chronomètre', 'Fiche d’observation'],
      groups: 'Groupes de trois : deux boxeurs en shadow face à face, un observateur.',
    },
    schema: {
      kind: 'distance',
      phases: ['Lecture de l’espace', 'Choix de zone', 'Action ou sortie'],
    },
    steps: [
      'Rappel des trois zones et de leur intérêt : longue pour observer, de touche pour agir, courte à éviter sans projet (5 min).',
      'Shadow face à face sans coup : chacun annonce la zone où il veut être et s’y place (2 x 1 min).',
      'Cartes de consigne tirées par l’observateur (« reste en longue », « entre et sors ») : le boxeur doit l’appliquer malgré les déplacements de l’autre (2 x 1 min).',
      'Ajouter les coups dans le vide uniquement en zone de touche et sur le côté du partenaire (2 x 1 min).',
      'Round libre de 2 min à rythme lent ; l’observateur note les moments passés en zone courte sans projet.',
    ],
    decision:
      'Près des plots-cordes, le boxeur choisit entre ressortir vers le centre (zone longue) ou entrer volontairement en zone de touche pour agir avant d’être coincé.',
    corrections: [
      { error: 'Le boxeur subit la distance imposée par l’autre.', fix: 'Annoncer intérieurement sa zone cible avant chaque déplacement.' },
      { error: 'Séjours prolongés en zone courte.', fix: 'Règle : en zone courte, on sort en moins de deux secondes.' },
    ],
    criteria: [
      'La consigne de zone est respectée au moins 70 % du round.',
      'Aucun séjour de plus de deux secondes en zone courte.',
      'Les coups dans le vide ne partent qu’en zone de touche.',
    ],
    adaptations: {
      enfants: 'Jeu de déplacement avec trois cerceaux de couleur posés au sol, sans partenaire face à soi.',
      ados: 'Shadow face à face avec cartes de consigne, rounds de 1 min.',
      jeunesAdultes: 'Cartes contradictoires entre les deux boxeurs (l’un veut la longue, l’autre la touche) pour créer un vrai rapport de force tactique.',
    },
    safety:
      'Les coups sont lancés dans le vide, à côté du partenaire ; la zone courte reste à plus d’un mètre et l’observateur arrête en cas de rapprochement.',
  },
  {
    id: 39,
    slug: 'gerer-l-effort-sur-le-round',
    module: 4,
    title: 'Gérer son effort sur le round',
    level: 'avancé',
    durationMin: 22,
    objective:
      'Répartir son énergie sur un round en alternant phases de récupération active et temps forts, et savoir quand placer ces derniers.',
    prerequisites: ['Changer de tempo', 'Jeu de distance à trois zones'],
    organisation: {
      space: 'Salle libre, un carré de 3 x 3 m par boxeur.',
      material: ['Chronomètre avec signal sonore', 'Fiche de ressenti (échelle de 1 à 10)', 'Gourdes'],
      groups: 'Individuel, puis binômes boxeur/coach.',
    },
    schema: {
      kind: 'enchainement',
      phases: ['Récupération active', 'Temps fort de 10 s', 'Retour au calme'],
    },
    steps: [
      'Shadow en récupération active (déplacements souples, respiration nasale) pendant 1 min ; noter son ressenti de 1 à 10.',
      'Round de 2 min : deux temps forts de 10 s placés au signal de l’entraîneur (fin de round incluse).',
      'Round de 2 min : le boxeur choisit lui-même où placer ses deux temps forts ; le binôme note les moments.',
      'Discussion de 2 min : où placer un temps fort (début pour marquer, fin pour conclure, après une sortie réussie) ?',
      'Round final de 2 min avec trois temps forts choisis ; comparer le ressenti avec le premier round.',
    ],
    decision:
      'À 30 s de la fin, fatigué, le boxeur décide entre un dernier temps fort ou une récupération pour finir lucide ; il justifie son choix au binôme.',
    corrections: [
      { error: 'Tout le round à fond puis effondrement.', fix: 'Garder un rythme où l’on peut encore parler en phase de récupération.' },
      { error: 'Récupération immobile, pieds plantés.', fix: 'Continuer à bouger et à garder la garde : la récupération est active.' },
      { error: 'Respiration bloquée pendant les temps forts.', fix: 'Souffler à chaque coup dans le vide.' },
    ],
    criteria: [
      'Les temps forts sont nettement distincts des phases de récupération.',
      'Le boxeur termine le round en garde et en mouvement.',
      'Il sait expliquer pourquoi il a placé ses temps forts à ces moments.',
    ],
    adaptations: {
      enfants: 'Rounds de 1 min, un seul temps fort de 5 s annoncé par l’entraîneur ; jeu de « la fusée qui décolle ».',
      ados: 'Rounds de 1 min 30, deux temps forts choisis et fiche de ressenti simplifiée.',
      jeunesAdultes: 'Rounds de 2 à 3 min, trois temps forts et suivi de la récupération entre rounds.',
    },
    safety:
      'Hydratation entre chaque round ; tout boxeur qui note 9 ou 10 de ressenti passe en récupération marchée. Shadow uniquement, aucun partenaire à portée.',
  },
  {
    id: 40,
    slug: 'scenarios-tactiques-sans-contact',
    module: 4,
    title: 'Scénarios tactiques sans contact',
    level: 'avancé',
    durationMin: 25,
    objective:
      'Mettre en œuvre distance, tempo, feintes et défense dans des scénarios imposés (adversaire plus grand, qui avance, qui fuit), en prenant des décisions argumentées.',
    prerequisites: ['Jeu de distance à trois zones', 'Saisir le temps sur le pas avant', 'Lecture des signaux et choix défensif'],
    organisation: {
      space: 'Ring ou carré de 5 x 5 m délimité par des plots-cordes, zone d’observation à l’extérieur.',
      material: ['Cartes scénario', 'Plots', 'Chronomètre', 'Fiche de débriefing'],
      groups: 'Groupes de trois : deux boxeurs en shadow face à face, un observateur ; rotation à chaque scénario.',
    },
    schema: {
      kind: 'cooperation',
      phases: ['Scénario tiré', 'Plan annoncé puis appliqué', 'Débriefing à trois'],
    },
    steps: [
      'Présenter trois scénarios : « il avance sans arrêt », « il garde la distance longue », « il fuit vers les côtés » (3 min).',
      'Le boxeur tire une carte et annonce son plan en une phrase à l’observateur (ex. « je coupe à gauche et je saisis le temps ») (1 min).',
      'Le partenaire joue le scénario à rythme lent, sans coup ; le boxeur applique son plan avec actions dans le vide (round de 1 min 30).',
      'Débriefing de 1 min : l’observateur dit si le plan a été suivi et ce qui a fonctionné.',
      'Rejouer le même scénario en corrigeant un point, puis rotation des rôles (round de 1 min 30).',
    ],
    decision:
      'Si le plan annoncé ne fonctionne pas après 30 s (ex. l’adversaire ne se laisse pas couper), le boxeur décide d’en changer et doit pouvoir dire lequel il a choisi et pourquoi.',
    corrections: [
      { error: 'Le boxeur oublie son plan dès le début du round.', fix: 'Le résumer en deux mots clés répétés intérieurement (« couper, temps »).' },
      { error: 'Le partenaire accélère et l’exercice devient un combat.', fix: 'L’observateur rappelle le rythme lent imposé et arrête si besoin.' },
    ],
    criteria: [
      'Le plan est annoncé clairement avant le round.',
      'L’observateur reconnaît au moins deux actions conformes au plan.',
      'Le boxeur identifie lui-même un point à améliorer lors du débriefing.',
    ],
    adaptations: {
      enfants: 'Scénarios sous forme d’histoires (« le géant », « le lapin qui fuit ») en déplacements seuls, débriefing guidé par l’entraîneur.',
      ados: 'Deux scénarios seulement, plans proposés sous forme de choix multiples.',
      jeunesAdultes: 'Scénarios combinés et changement de plan obligatoire à mi-round sur signal.',
    },
    safety:
      'Aucun coup en direction du partenaire : toutes les actions se font dans le vide, à plus d’un mètre ; rythme lent imposé et l’observateur peut stopper le scénario à tout moment.',
  },
];
