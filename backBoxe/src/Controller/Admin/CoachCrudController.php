<?php

namespace App\Controller\Admin;

use App\Entity\Coach;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_COACH')]
class CoachCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Coach::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Coach')
            ->setEntityLabelInPlural('Coachs')
            ->setDefaultSort(['position' => 'ASC'])
            ->setSearchFields(['firstName', 'lastName', 'role']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('firstName', 'Prénom');
        yield TextField::new('lastName', 'Nom');
        yield TextField::new('slug', 'Slug')->setRequired(false)->setHelp('Laissez vide pour le générer.')->hideOnIndex();
        yield TextField::new('role', 'Fonction');
        yield AssociationField::new('disciplines', 'Disciplines')->setFormTypeOption('by_reference', false);
        yield TextField::new('diplomas', 'Diplômes')->hideOnIndex();
        yield TextareaField::new('bio', 'Présentation')->hideOnIndex();
        yield TextField::new('photo', 'Photo')->setHelp('Chemin (/img/…, /uploads/…) ou URL absolue.')->hideOnIndex();
        yield IntegerField::new('position', 'Ordre');
    }
}
