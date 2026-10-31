<?php

namespace App\Controller\Admin;

use App\Entity\Fight;
use App\Enum\FightMethod;
use App\Enum\FightResult;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\ChoiceFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\EntityFilter;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Palmarès détaillé (le bilan V/D/N/KO du boxeur est saisi sur sa fiche)
 */
#[IsGranted('ROLE_COACH')]
class FightCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Fight::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Combat')
            ->setEntityLabelInPlural('Palmarès')
            ->setDefaultSort(['date' => 'DESC'])
            ->setSearchFields(['opponent', 'opponentClub', 'location']);
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(EntityFilter::new('boxer', 'Boxeur'))
            ->add(EntityFilter::new('event', 'Événement'))
            ->add(ChoiceFilter::new('result', 'Résultat')->setChoices(FightResult::choices()));
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield AssociationField::new('boxer', 'Boxeur');
        yield DateField::new('date', 'Date');
        yield TextField::new('opponent', 'Adversaire');
        yield TextField::new('opponentClub', 'Club adverse')->hideOnIndex();
        yield TextField::new('location', 'Lieu')->hideOnIndex();
        yield AssociationField::new('event', 'Événement')->setRequired(false);
        yield ChoiceField::new('result', 'Résultat')->setChoices(FightResult::choices())->renderAsBadges([
            FightResult::Victoire->value => 'success',
            FightResult::Defaite->value => 'danger',
            FightResult::Nul->value => 'secondary',
        ]);
        yield ChoiceField::new('method', 'Décision')->setChoices(FightMethod::choices());
        yield IntegerField::new('rounds', 'Reprises')->hideOnIndex();
    }
}
