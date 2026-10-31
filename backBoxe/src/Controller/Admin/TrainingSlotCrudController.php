<?php

namespace App\Controller\Admin;

use App\Entity\TrainingSlot;
use App\Enum\Audience;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\ChoiceFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\EntityFilter;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_COACH')]
class TrainingSlotCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return TrainingSlot::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Créneau')
            ->setEntityLabelInPlural('Planning')
            ->setDefaultSort(['dayOfWeek' => 'ASC', 'startTime' => 'ASC'])
            ->setPaginatorPageSize(50);
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(ChoiceFilter::new('dayOfWeek', 'Jour')->setChoices(array_flip(TrainingSlot::DAYS)))
            ->add(EntityFilter::new('discipline', 'Discipline'))
            ->add(EntityFilter::new('venue', 'Salle'));
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield ChoiceField::new('dayOfWeek', 'Jour')->setChoices(array_flip(TrainingSlot::DAYS));
        yield TextField::new('startTime', 'Début')->setHelp('Format HH:MM, ex. 18:00');
        yield TextField::new('endTime', 'Fin')->setHelp('Format HH:MM, ex. 19:30');
        yield AssociationField::new('discipline', 'Discipline');
        yield ChoiceField::new('audience', 'Public')->setChoices(Audience::choices());
        yield AssociationField::new('coach', 'Coach')->setRequired(false);
        yield AssociationField::new('venue', 'Salle');
    }
}
