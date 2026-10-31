# PARADOXX DÉVELOPPEMENT — Studio expert applications

Source de pilotage : Notion QG, pôle PARADOXX DÉVELOPPEMENT.
Mission : concevoir, développer, sécuriser, tester et livrer des applications professionnelles.
ESCT Boxe est le premier pilote ; la méthode est réutilisable, sans partager données ni secrets entre projets.

## Six experts responsables

1. Produit et UX : besoins, parcours, accessibilité et critères d'acceptation.
2. Architecture et données : découpage logiciel, contrats, modèle et migrations.
3. Développement : front-end, back-end, métier et intégration.
4. Sécurité et données personnelles : menaces, accès, secrets et minimisation.
5. Qualité : tests, recette, régression et preuves indépendantes.
6. Livraison, fiabilité et coûts : environnements, sauvegarde, reprise et budgets.

Chaque profil dispose de son fichier EXPERT-*.md : mission, entrées/sorties, compétences, outils/skills,
critères de fin et prochaine tâche. Six agents ont réalisé des sous-tâches bornées sur les démos.
Cela ne crée pas six services permanents, une synchronisation automatique ou un entraînement de modèles.

## Contrat d'une tâche

ID ; besoin source ; expert responsable ; périmètre fichiers ; résultat attendu ; critères d'acceptation ;
dépendances ; outils/skills utiles ; preuve ; coût/tokens observables ; statut ; prochaine action.
États : À cadrer → Prête → En cours → À revoir → Vérifiée. Blocage distinct avec cause et action.

## Architecture d'une application

Interface → contrat API → cas d'usage métier → accès aux données. Les validations et autorisations
sont contrôlées côté serveur. Secrets hors Git, données de test distinctes, environnements séparés.
Commencer par une architecture modulaire simple ; ne pas ajouter de services distribués sans besoin démontré.

## Cycle et garde-fous

Cadrage → lot borné → réalisation → revue croisée → tests → démo → arbitrage → livraison après GO → bilan.
Relire les références officielles utiles en cas d'incertitude. Les skills sont chargés à la demande.
Artefacts : code, contrats, démos, résultats de tests et mémoire courte ; PDF seulement si utile ou demandé.
Outils gratuits/libres privilégiés : Git, Symfony, Angular, MariaDB, SQLite, PHPUnit, Karma,
Docker/Podman, outils d'accessibilité et d'analyse adaptés. Disponibilité/configuration à vérifier avant usage.
Aucune facturation externe ou installation de service payant sans accord. Les outils locaux gratuits ne rendent
pas les quotas des modèles illimités : lectures ciblées, sorties courtes et absence de relances redondantes.

## Conversation ChatGPT / Claude

Notion conserve la conversation de coordination ; Git conserve le code et les preuves.
Un seul intégrateur modifie une branche donnée à la fois. Les experts travaillent sur des fichiers bornés.
Avant reprise : lire le dernier commit distant, MEMOIRE.md et la file de messages.
Après lot : preuve, fichiers, anomalies, prochaine étape ; laisser une demande de revue précise.
Un message À lire ne signifie pas Reçu. Pas d'accès à la mémoire privée ni de canal direct Claude établi.
