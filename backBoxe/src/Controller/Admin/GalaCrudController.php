<?php

namespace App\Controller\Admin;

use App\Entity\Gala;
use App\Enum\GalaType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\UrlField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\BooleanFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\ChoiceFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\DateTimeFilter;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_COACH')]
class GalaCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Gala::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Événement')
            ->setEntityLabelInPlural('Galas & événements')
            ->setDefaultSort(['startsAt' => 'DESC'])
            ->setSearchFields(['title', 'venue', 'city']);
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(ChoiceFilter::new('type', 'Type')->setChoices(GalaType::choices()))
            ->add(DateTimeFilter::new('startsAt', 'Date'))
            ->add(BooleanFilter::new('published', 'Publié'));
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('title', 'Titre');
        yield TextField::new('slug', 'Slug')->setRequired(false)->setHelp('Laissez vide pour le générer.')->hideOnIndex();
        yield ChoiceField::new('type', 'Type')->setChoices(GalaType::choices())->renderAsBadges();
        yield DateTimeField::new('startsAt', 'Début');
        yield DateTimeField::new('endsAt', 'Fin')->hideOnIndex();
        yield TextField::new('venue', 'Lieu');
        yield TextField::new('address', 'Adresse')->hideOnIndex();
        yield TextField::new('city', 'Ville');
        yield TextEditorField::new('description', 'Description')->hideOnIndex();
        yield TextField::new('poster', 'Affiche')->setHelp('Chemin (/img/…, /uploads/…) ou URL absolue.')->hideOnIndex();
        yield UrlField::new('ticketUrl', 'Billetterie')->hideOnIndex();
        yield MoneyField::new('price', 'Entrée')->setCurrency('EUR')->setStoredAsCents()->setRequired(false)->setHelp('Vide = non communiqué, 0 = gratuit.');
        yield BooleanField::new('published', 'Publié');
    }
}
