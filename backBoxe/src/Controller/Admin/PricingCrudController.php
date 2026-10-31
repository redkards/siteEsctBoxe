<?php

namespace App\Controller\Admin;

use App\Entity\Pricing;
use App\Enum\Audience;
use App\Enum\PricingPeriod;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class PricingCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Pricing::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud->setEntityLabelInSingular('Tarif')->setEntityLabelInPlural('Tarifs')->setDefaultSort(['position' => 'ASC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('label', 'Libellé');
        yield ChoiceField::new('audience', 'Public')->setChoices(Audience::choices());
        yield MoneyField::new('priceCents', 'Prix')->setCurrency('EUR')->setStoredAsCents();
        yield ChoiceField::new('period', 'Période')->setChoices(PricingPeriod::choices());
        yield TextareaField::new('description', 'Description')->hideOnIndex();
        yield BooleanField::new('highlighted', 'Mis en avant');
        yield IntegerField::new('position', 'Ordre');
    }
}
