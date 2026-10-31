<?php

namespace App\Controller\Admin;

use App\Entity\Membership;
use App\Enum\MembershipStatus;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminRoute;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TelephoneField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\ChoiceFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\EntityFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\TextFilter;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Demandes d'inscription : validation ou refus par les coachs
 */
#[IsGranted('ROLE_COACH')]
class MembershipCrudController extends AbstractCrudController
{
    use BackToIndex;

    public static function getEntityFqcn(): string
    {
        return Membership::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Inscription')
            ->setEntityLabelInPlural('Inscriptions')
            ->setDefaultSort(['createdAt' => 'DESC'])
            ->setSearchFields(['firstName', 'lastName', 'email', 'phone']);
    }

    public function configureActions(Actions $actions): Actions
    {
        $validate = Action::new('validate', 'Valider', 'fa fa-check')
            ->linkToCrudAction('validate')->renderAsForm()->asSuccessAction()
            ->displayIf(static fn (Membership $m) => MembershipStatus::Validee !== $m->getStatus());
        $refuse = Action::new('refuse', 'Refuser', 'fa fa-xmark')
            ->linkToCrudAction('refuse')->renderAsForm()->asDangerAction()
            ->displayIf(static fn (Membership $m) => MembershipStatus::Refusee !== $m->getStatus());

        return $actions
            ->add(Crud::PAGE_INDEX, $validate)
            ->add(Crud::PAGE_INDEX, $refuse)
            ->add(Crud::PAGE_DETAIL, $validate)
            ->add(Crud::PAGE_DETAIL, $refuse)
            ->add(Crud::PAGE_INDEX, Action::DETAIL);
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(ChoiceFilter::new('status', 'Statut')->setChoices(MembershipStatus::choices()))
            ->add(EntityFilter::new('discipline', 'Discipline'))
            ->add(TextFilter::new('season', 'Saison'));
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield ChoiceField::new('status', 'Statut')->setChoices(MembershipStatus::choices())->renderAsBadges([
            MembershipStatus::EnAttente->value => 'warning',
            MembershipStatus::Validee->value => 'success',
            MembershipStatus::Refusee->value => 'danger',
        ]);
        yield TextField::new('season', 'Saison');
        yield TextField::new('firstName', 'Prénom');
        yield TextField::new('lastName', 'Nom');
        yield DateField::new('birthDate', 'Naissance');
        yield EmailField::new('email', 'Email')->hideOnIndex();
        yield TelephoneField::new('phone', 'Téléphone');
        yield AssociationField::new('discipline', 'Discipline');
        yield AssociationField::new('pricing', 'Tarif')->hideOnIndex();
        yield TextField::new('legalGuardian', 'Représentant légal')->hideOnIndex()->setHelp('Obligatoire pour un mineur.');
        yield BooleanField::new('medicalCertificate', 'Certificat médical')->renderAsSwitch(false);
        yield TextareaField::new('message', 'Message')->hideOnIndex();
        yield AssociationField::new('user', 'Compte')->hideOnIndex()->hideOnForm();
        yield DateTimeField::new('consentAt', 'Consentement RGPD')->hideOnIndex()->hideOnForm();
        yield DateTimeField::new('createdAt', 'Reçue le')->hideOnForm();
        yield DateTimeField::new('processedAt', 'Traitée le')->hideOnIndex()->hideOnForm();
    }

    public function createEntity(string $entityFqcn): Membership
    {
        // Saisie au guichet du club : le consentement est recueilli sur la fiche papier
        return (new Membership())->setConsentAt(new \DateTimeImmutable());
    }

    #[AdminRoute('/{id}/validate', name: 'validate', options: ['methods' => ['POST']])]
    public function validate(#[MapEntity] Membership $membership, EntityManagerInterface $em): Response
    {
        $membership->validate();
        $em->flush();

        return $this->backToIndex(sprintf('Inscription de %s %s validée.', $membership->getFirstName(), $membership->getLastName()));
    }

    #[AdminRoute('/{id}/refuse', name: 'refuse', options: ['methods' => ['POST']])]
    public function refuse(#[MapEntity] Membership $membership, EntityManagerInterface $em): Response
    {
        $membership->refuse();
        $em->flush();

        return $this->backToIndex(sprintf('Inscription de %s %s refusée.', $membership->getFirstName(), $membership->getLastName()), 'warning');
    }
}
