<?php

namespace App\DataFixtures;

use App\Content\ClubInfo;
use App\Entity\{Article, Boxer, Coach, Discipline, Fight, Gala, Membership, Message, Partner, Pricing, TrainingSlot, User, Venue};
use App\Enum\{ArticleCategory, Audience, BoxerLevel, FightMethod, FightResult, GalaType, PricingPeriod, Sex};
use App\Service\GdprService;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/** Données fictives pour le développement. Ne jamais charger sur une base de production. */
class AppFixtures extends Fixture
{
    public const DEMO_PASSWORD = 'Demo1234!';

    public function __construct(
        private readonly UserPasswordHasherInterface $hasher,
        private readonly GdprService $gdpr,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $users = [];
        foreach ([['demo', 'Léa', []], ['coach', 'Camille', ['ROLE_COACH']], ['admin', 'Alex', ['ROLE_ADMIN']]] as [$key, $name, $roles]) {
            $user = (new User())->setEmail($key.'@esctboxe.local')->setFirstName($name)->setLastName('Démo')
                ->setBirthDate(new \DateTimeImmutable('2000-05-12'))->setRoles($roles)->setIsVerified(true);
            $user->setPassword($this->hasher->hashPassword($user, self::DEMO_PASSWORD));
            $this->gdpr->recordConsent($user, '127.0.0.1');
            $manager->persist($user);
            $users[$key] = $user;
        }

        $disciplines = [];
        foreach ([
            ['boxe-anglaise', 'Boxe anglaise', 'Technique, déplacements et précision.', 14, 'training1.jpg'],
            ['boxe-educative', 'Boxe éducative', 'Apprendre à boxer dans le respect et sans recherche de puissance.', 6, 'training2.jpg'],
            ['boxe-loisir', 'Boxe loisir', 'Bouger et progresser à son rythme.', 16, 'training3.jpg'],
        ] as $i => [$slug, $name, $description, $age, $image]) {
            $discipline = (new Discipline())->setSlug($slug)->setName($name)->setShortDescription($description)
                ->setDescription('<p>Démonstration : '.$description.' Les modalités réelles sont à confirmer avec le club.</p>')
                ->setMinAge($age)->setImage('/img/'.$image)->setPosition($i);
            $manager->persist($discipline);
            $disciplines[] = $discipline;
        }
        $coach = (new Coach())->setFirstName('Camille')->setLastName('Démo')->setSlug('camille-demo')
            ->setRole('Entraîneur — démonstration')->setBio('Profil fictif pour la présentation du site.');
        foreach ($disciplines as $discipline) $coach->addDiscipline($discipline);
        $manager->persist($coach);
        $venue = (new Venue())->setName('Salle de démonstration')->setAddress('Adresse à confirmer avec le club')
            ->setPostalCode('02700')->setCity('Tergnier')->setDescription('Salle fictive : ne pas utiliser pour se déplacer.');
        $manager->persist($venue);
        foreach ([1, 3, 5] as $i => $day) {
            $manager->persist((new TrainingSlot())->setDayOfWeek($day)->setStartTime('18:00')->setEndTime('19:30')
                ->setDiscipline($disciplines[$i])->setAudience(Audience::Tous)->setCoach($coach)->setVenue($venue));
        }
        $pricings = [];
        foreach ([['Jeunes — démonstration', Audience::Enfants, 9000], ['Adultes — démonstration', Audience::Adultes, 15000]] as $i => [$label, $audience, $price]) {
            $pricing = (new Pricing())->setLabel($label)->setAudience($audience)->setPriceCents($price)
                ->setPeriod(PricingPeriod::Saison)->setDescription('Tarif fictif, à confirmer avant toute inscription.')
                ->setHighlighted($i === 1)->setPosition($i);
            $manager->persist($pricing);
            $pricings[] = $pricing;
        }
        $past = (new Gala())->setTitle('Rencontre de démonstration')->setSlug('rencontre-demo')->setType(GalaType::Competition)
            ->setStartsAt(new \DateTimeImmutable('-14 days'))->setCity('Tergnier')->setVenue('Salle de démonstration')
            ->setDescription('<p>Événement fictif pour tester les résultats.</p>')->setPublished(true);
        $manager->persist($past);
        $manager->persist((new Gala())->setTitle('Gala — démonstration')->setSlug('gala-demo')->setType(GalaType::Gala)
            ->setStartsAt(new \DateTimeImmutable('+30 days 19:00'))->setCity('Tergnier')->setVenue('Salle de démonstration')
            ->setDescription('<p>Événement fictif. Aucune billetterie ni date réelle annoncée.</p>')->setPrice(0)->setPublished(true));
        foreach ([['Alex', Sex::M], ['Sam', Sex::F]] as $i => [$name, $sex]) {
            $boxer = (new Boxer())->setFirstName($name)->setLastName('Démo')->setSlug(strtolower($name).'-demo')
                ->setSex($sex)->setBirthDate(new \DateTimeImmutable('2001-06-15'))->setWeightKg(63.5)
                ->setWeightClass('-63,5 kg')->setLevel(BoxerLevel::Amateur)->setDiscipline($disciplines[0])
                ->setBio('Boxeur fictif — palmarès de démonstration.')->setWins(1)->setFeatured(true)->setActive(true);
            $manager->persist($boxer);
            $manager->persist((new Fight())->setBoxer($boxer)->setDate(new \DateTimeImmutable('-14 days'))
                ->setOpponent('Adversaire fictif')->setLocation('Tergnier')->setEvent($past)
                ->setResult(FightResult::Victoire)->setMethod(FightMethod::Points)->setRounds(3));
        }
        foreach (['Bienvenue au club — démonstration', 'Préparer sa première séance — démonstration'] as $i => $title) {
            $manager->persist((new Article())->setTitle($title)->setSlug('actualite-demo-'.($i + 1))->setCategory(ArticleCategory::Club)
                ->setExcerpt('Contenu de démonstration à remplacer par les actualités du club.')
                ->setContent('<p>Cette actualité est fictive et permet de vérifier la présentation du site.</p>')
                ->setCoverImage('/img/training'.($i + 1).'.jpg')->setPublishedAt(new \DateTimeImmutable('-'.($i + 1).' days'))->setAuthor($users['admin']));
        }
        $manager->persist((new Membership())->setUser($users['demo'])->setFirstName('Léa')->setLastName('Démo')
            ->setEmail('demo@esctboxe.local')->setBirthDate(new \DateTimeImmutable('2000-05-12'))
            ->setDiscipline($disciplines[0])->setPricing($pricings[1])->setSeason(ClubInfo::currentSeason())
            ->setConsentAt(new \DateTimeImmutable())->setMessage('Inscription fictive pour tester le suivi.'));
        $manager->persist((new Message())->setSender($users['coach'])->setRecipient($users['demo'])
            ->setSubject('Bienvenue — démonstration')->setBody('Message fictif du club pour tester votre messagerie.'));
        $manager->persist((new Partner())->setName('Partenaire de démonstration')->setPosition(0));
        $manager->flush();
    }
}
