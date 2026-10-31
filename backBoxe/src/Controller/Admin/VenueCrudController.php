<?php

namespace App\Controller\Admin;

use App\Entity\Venue;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_COACH')]
class VenueCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Venue::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud->setEntityLabelInSingular('Salle')->setEntityLabelInPlural('Salles');
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('name', 'Nom');
        yield TextField::new('address', 'Adresse');
        yield TextField::new('postalCode', 'Code postal');
        yield TextField::new('city', 'Ville');
        yield NumberField::new('latitude', 'Latitude')->setNumDecimals(6)->hideOnIndex();
        yield NumberField::new('longitude', 'Longitude')->setNumDecimals(6)->hideOnIndex();
        yield TextareaField::new('description', 'Description')->hideOnIndex();
        yield TextField::new('photo', 'Photo')->setHelp('Chemin (/img/…, /uploads/…) ou URL absolue.')->hideOnIndex();
    }
}
