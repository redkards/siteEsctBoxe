<?php

namespace App\Controller\Admin;

use App\Entity\Discipline;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_COACH')]
class DisciplineCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Discipline::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Discipline')
            ->setEntityLabelInPlural('Disciplines')
            ->setDefaultSort(['position' => 'ASC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('name', 'Nom');
        yield TextField::new('slug', 'Slug')->setRequired(false)->setHelp('Laissez vide pour le générer depuis le nom.')->hideOnIndex();
        yield TextField::new('shortDescription', 'Accroche');
        yield TextEditorField::new('description', 'Description')->hideOnIndex();
        yield TextField::new('icon', 'Icône')->setHelp('Nom de l’icône utilisée par le site (ex. gloves, child, heart, venus).')->hideOnIndex();
        yield TextField::new('image', 'Image')->setHelp('Chemin (/img/…, /uploads/…) ou URL absolue.')->hideOnIndex();
        yield IntegerField::new('minAge', 'Âge minimum');
        yield IntegerField::new('position', 'Ordre');
    }
}
