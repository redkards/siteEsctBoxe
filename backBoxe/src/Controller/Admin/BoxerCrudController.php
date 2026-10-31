<?php

namespace App\Controller\Admin;

use App\Entity\Boxer;
use App\Enum\BoxerLevel;
use App\Enum\Sex;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\BooleanFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\ChoiceFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\EntityFilter;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_COACH')]
class BoxerCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Boxer::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Boxeur')
            ->setEntityLabelInPlural('Boxeurs')
            ->setDefaultSort(['lastName' => 'ASC'])
            ->setSearchFields(['firstName', 'lastName', 'nickname']);
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(EntityFilter::new('discipline', 'Discipline'))
            ->add(ChoiceFilter::new('level', 'Niveau')->setChoices(BoxerLevel::choices()))
            ->add(ChoiceFilter::new('sex', 'Sexe')->setChoices(Sex::choices()))
            ->add(BooleanFilter::new('active', 'Actif'));
    }

    public function configureFields(string $pageName): iterable
    {
        yield FormField::addFieldset('Identité');
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('firstName', 'Prénom');
        yield TextField::new('lastName', 'Nom');
        yield TextField::new('nickname', 'Surnom')->hideOnIndex();
        yield TextField::new('slug', 'Slug')->setRequired(false)->setHelp('Laissez vide pour le générer.')->hideOnIndex();
        yield DateField::new('birthDate', 'Naissance')->hideOnIndex()->setHelp('Jamais affichée sur le site : seule la catégorie d’âge l’est.');
        yield ChoiceField::new('sex', 'Sexe')->setChoices(Sex::choices());
        yield TextField::new('photo', 'Photo')->setHelp('Chemin (/img/…, /uploads/…) ou URL absolue.')->hideOnIndex();
        yield TextareaField::new('bio', 'Présentation')->hideOnIndex();

        yield FormField::addFieldset('Sport');
        yield AssociationField::new('discipline', 'Discipline');
        yield ChoiceField::new('level', 'Niveau')->setChoices(BoxerLevel::choices())->renderAsBadges();
        yield NumberField::new('weightKg', 'Poids (kg)')->setNumDecimals(1)->hideOnIndex();
        yield TextField::new('weightClass', 'Catégorie de poids');

        yield FormField::addFieldset('Bilan')->setHelp('Peut inclure des combats antérieurs non détaillés dans le palmarès.');
        yield IntegerField::new('wins', 'V');
        yield IntegerField::new('losses', 'D');
        yield IntegerField::new('draws', 'N');
        yield IntegerField::new('kos', 'KO');
        yield BooleanField::new('active', 'Actif');
        yield BooleanField::new('featured', 'À la une');
    }
}
