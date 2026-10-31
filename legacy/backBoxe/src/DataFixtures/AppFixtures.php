<?php

namespace App\DataFixtures;

use App\Entity\Adresse;
use App\Entity\BoxeType;
use App\Entity\Boxeur;
use App\Entity\Categorie;
use App\Entity\Entrainement;
use App\Entity\Entraineur;
use App\Entity\Gala;
use App\Entity\Message;
use App\Entity\Messagerie;
use App\Entity\Salle;
use App\Entity\User;
use App\Entity\News;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $userPasswordHasher;

    public function __construct(UserPasswordHasherInterface $userPasswordHasher)
    {
        $this->userPasswordHasher = $userPasswordHasher;
    }

    public function load(ObjectManager $manager): void
    {

          // Création des messages
        $listMessages = [];
        for ($i = 0; $i < 5; $i++) {
            $message = new Message();
            $message->setExpediteur('expediteur' . $i);
            $message->setDestinataire('destinataire' . $i);
            $message->setContenu('hello world boxe is very amazing' . $i);
            $message->setMsgDate(new \DateTimeImmutable());

            $manager->persist($message);
            $listMessages[] = $message;
        }

        // Création des messageries
        $listMessagerie = [];
        for ($i = 0; $i < 5; $i++) {
            $messagerie = new Messagerie();

            // Associer une messagerie à un utilisateur
            if (!empty($listUsers)) {
                $user = $listUsers[$i % count($listUsers)];
                $messagerie->addMessagerieUser($user);
                $user->setMessagerie($messagerie);
            }

            // Associer des messages à la messagerie
            $numMessages = rand(1, 3); // Nombre aléatoire de messages associés à la messagerie
            $selectedMessages = array_rand($listMessages, min($numMessages, count($listMessages)));
            if (!is_array($selectedMessages)) {
                $selectedMessages = [$selectedMessages];
            }
            foreach ($selectedMessages as $messageIndex) {
                $message = $listMessages[$messageIndex];
                $messagerie->addMessagerieMsg($message);
                $message->setMessagerie($messagerie); // Assurez-vous que la méthode setMessagerie est correcte dans Message
            }

            $manager->persist($messagerie);
            $listMessagerie[] = $messagerie;
        }
        // Création des utilisateurs
        $baseEmails = [
            'user0@api.com',
            'user1@api.com',
            'user2@api.com',
            'user3@api.com',
        ];

        $roles = ['ROLE_USER', 'ROLE_ADMIN'];
        $listUsers = [];

        for ($i = 0; $i < count($baseEmails); $i++) {
            $email = $baseEmails[$i];

            $user = new User();
            $user->setNom('nom' . $i);
            $user->setPrenom('prenom' . $i);
            $user->setEmail($email);
            $user->setTel('0123456789');
            $user->setPassword($this->userPasswordHasher->hashPassword($user, 'password'));
            $user->setDateNaissance(new \DateTimeImmutable('1990-01-01'));
            $user->setRoles([$roles[$i % count($roles)]]);
            $user->setMessagerie($listMessagerie[array_rand($listMessagerie)]);
            $manager->persist($user);
            $listUsers[] = $user;
            echo "Insère utilisateur avec l'email : " . $email . "\n";
        }

            // Création des galas
        $listGalas = [];
        for ($i = 0; $i < 5; $i++) {
            $gala = new Gala();
            $gala->setNom('gala' . $i);
            $gala->setLieu('lieu' . $i);
            $gala->setGalaDate(new \DateTimeImmutable());
            $gala->setGalaTime(new \DateTimeImmutable());

            $manager->persist($gala);
            $listGalas[] = $gala;
        }

                // Création des salles
 $listSalles = [];
 $salles = ['salle1', 'salle2', 'salle3'];

 for ($i = 0; $i < 10; $i++) {
     $salle = new Salle();
     $salleName = $salles[$i % count($salles)];
     $salle->setNom($salleName);
     $salle->setGala($gala);

     // Associer une adresse à chaque salle
     if (!empty($listAdresse)) {
         $adresse = $listAdresse[$i % count($listAdresse)];
         $salle->addSalleAdresse($adresse);
     }
     $manager->persist($salle);
     //
     $listSalles[] = $salle;
    }

        // Création des adresses
        $listAdresse = [];
        $listVoies = ['chemin', 'rue', 'boulevard', 'avenue'];

        for ($i = 0; $i < 5; $i++) {
            $adresse = new Adresse();
            $adresse->setNumero(sprintf('%03d', $i));
            $adresse->setTypeVoie($listVoies[$i % count($listVoies)]);
            $adresse->setNomVoie('victor hugo ' . $i);
            $adresse->setComplementAdresse('complement ' . $i);
            $adresse->setVille('ville ' . $i);
            $adresse->setCodePostal(sprintf('%05d', $i));
            $adresse->setPays('pays ' . $i);

            // Associer une adresse à un utilisateur
            $adresse->setUser($listUsers[$i % count($listUsers)]);
            $adresse->setSalle($salle);

            $manager->persist($adresse);
            $listAdresse[] = $adresse;
        }

            //Création des boxeurs
        $listBoxeurs = [];
        for ($i = 0; $i < 5; $i++) {
            $boxeur = new Boxeur();
            $boxeur->setBoxeurNom('nom' . $i);
            $boxeur->setBoxeurPrenom('prenom' . $i);
            $boxeur->setBoxeurDateNaissance(new \DateTimeImmutable('2000-01-01'));
            $boxeur->setPoids(55 + $i);

            // Associer une catégorie et un type de boxe au boxeur
            if (!empty($listCategories)) {
                $boxeur->addBoxeurCategorie($listCategories[$i % count($listCategories)]);
            }
            if (!empty($listBoxeType)) {
                $boxeur->addBoxeurTypeBoxe($listBoxeType[$i % count($listBoxeType)]);
            }

            $manager->persist($boxeur);
            $listBoxeurs[] = $boxeur;
        }






        // Création des types de boxe
        $typesOfBoxes = ['amateur', 'pro', 'educatif'];
        $listBoxeType = [];

        for ($i = 0; $i < 5; $i++) {
            $boxeType = new BoxeType();
            $boxeTypeName = $typesOfBoxes[$i % count($typesOfBoxes)];
            $boxeType->setTypeBoxeNom($boxeTypeName);
            $boxeType->setBoxeur($listBoxeurs[array_rand($listBoxeurs)]);
            $manager->persist($boxeType);
            $listBoxeType[] = $boxeType;
        }

        // Création des catégories
        $listCategories = [];
        $categories = ['amateur', 'pro', 'educatif'];

        for ($i = 0; $i < 5; $i++) {
            $categorie = new Categorie();
            $categorieName = $categories[$i % count($categories)];
            $categorie->setCategorieNom($categorieName);
            $categorie->setBoxeur($listBoxeurs[array_rand($listBoxeurs)]);

            $manager->persist($categorie);
            $listCategories[] = $categorie;
        }



        // Création des entraîneurs
        $listEntraineurs = [];
        for ($i = 0; $i < 5; $i++) {
            $entraineur = new Entraineur();
            $entraineur->setTrainerNom('nom' . $i);
            $entraineur->setTrainerPrenom('prenom' . $i);

            $manager->persist($entraineur);
            $listEntraineurs[] = $entraineur;
        }

        // Associer des entraîneurs aux boxeurs
        foreach ($listBoxeurs as $boxeur) {
            $numEntraineurs = rand(1, 3); // Nombre aléatoire d'entraîneurs associés au boxeur
            $selectedEntraineurs = array_rand($listEntraineurs, min($numEntraineurs, count($listEntraineurs)));
            if (!is_array($selectedEntraineurs)) {
                $selectedEntraineurs = [$selectedEntraineurs];
            }
            foreach ($selectedEntraineurs as $entraineurIndex) {
                $entraineur = $listEntraineurs[$entraineurIndex];
                $boxeur->addEntraineur($entraineur);
                $entraineur->addEntraineurBoxeur($boxeur);
            }
        }

        // Création des entraînements
        $listEntrainements = [];
        for ($i = 0; $i < 5; $i++) {
            $entrainement = new Entrainement();
            $entrainement->setTrainingDate(new \DateTimeImmutable());
            $entrainement->setStartTime(new \DateTimeImmutable());
            $entrainement->setEndTime(new \DateTimeImmutable());
            $entrainement->setLieu('lieu' . $i);



            // Associer des entraîneurs à l'entraînement
            if (!empty($listEntraineurs)) {
                $numEntraineurs = rand(1, 3); // Nombre aléatoire d'entraîneurs associés à l'entraînement
                $selectedEntraineurs = array_rand($listEntraineurs, min($numEntraineurs, count($listEntraineurs)));
                if (!is_array($selectedEntraineurs)) {
                    $selectedEntraineurs = [$selectedEntraineurs];
                }
                foreach ($selectedEntraineurs as $entraineurIndex) {
                    $entraineur = $listEntraineurs[$entraineurIndex];
                    $entrainement->addEntraineur($entraineur);
                    $entraineur->addEntraineurTraining($entrainement);
                }
            }

            // Associer des salles à l'entraînement
            $numSalles = rand(1, 3); // Nombre aléatoire de salles associées à l'entraînement
            $selectedSalles = array_rand($listSalles, min($numSalles, count($listSalles)));
            if (!is_array($selectedSalles)) {
                $selectedSalles = [$selectedSalles];
            }
            foreach ($selectedSalles as $salleIndex) {
                $salle = $listSalles[$salleIndex];
                $entrainement->addTrainingSalle($salle);
                $salle->addEntrainement($entrainement);
            }

            $manager->persist($entrainement);
            $listEntrainements[] = $entrainement;
        }

        $listNews= [];
        for ($i = 1; $i <= 3; $i++) {
            $news = new News();
            $news->setTitre('Titre de l\'actualité ' . $i)
                 ->setNewsContent('Ceci est le contenu de l\'actualité ' . $i)
                 ->setNewsPictures("cuba-66f45d7c80ee2.jpg")
                 ->setPublishedAt(new \DateTimeImmutable());

            $manager->persist($news);
            $listNews[]= $news;

        }

        $manager->flush();
    }




}




