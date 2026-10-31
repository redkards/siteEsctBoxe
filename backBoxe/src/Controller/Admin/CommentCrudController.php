<?php

namespace App\Controller\Admin;

use App\Entity\Comment;
use App\Enum\CommentStatus;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminRoute;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\ChoiceFilter;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Modération des commentaires des actualités
 */
#[IsGranted('ROLE_COACH')]
class CommentCrudController extends AbstractCrudController
{
    use BackToIndex;

    public static function getEntityFqcn(): string
    {
        return Comment::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Commentaire')
            ->setEntityLabelInPlural('Commentaires')
            ->setDefaultSort(['createdAt' => 'DESC'])
            ->setSearchFields(['body']);
    }

    public function configureActions(Actions $actions): Actions
    {
        $publish = Action::new('publish', 'Publier', 'fa fa-check')
            ->linkToCrudAction('publish')->renderAsForm()->asSuccessAction()
            ->displayIf(static fn (Comment $c) => CommentStatus::Publie !== $c->getStatus());
        $reject = Action::new('reject', 'Rejeter', 'fa fa-ban')
            ->linkToCrudAction('reject')->renderAsForm()->asDangerAction()
            ->displayIf(static fn (Comment $c) => CommentStatus::Rejete !== $c->getStatus());

        return $actions
            ->disable(Action::NEW)
            ->add(Crud::PAGE_INDEX, $publish)
            ->add(Crud::PAGE_INDEX, $reject)
            ->add(Crud::PAGE_DETAIL, $publish)
            ->add(Crud::PAGE_DETAIL, $reject)
            ->add(Crud::PAGE_INDEX, Action::DETAIL);
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters->add(ChoiceFilter::new('status', 'Statut')->setChoices(CommentStatus::choices()));
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield AssociationField::new('article', 'Actualité')->setFormTypeOption('disabled', true);
        yield AssociationField::new('author', 'Auteur')->setFormTypeOption('disabled', true);
        yield TextareaField::new('body', 'Commentaire');
        yield ChoiceField::new('status', 'Statut')->setChoices(CommentStatus::choices())->renderAsBadges([
            CommentStatus::EnAttente->value => 'warning',
            CommentStatus::Publie->value => 'success',
            CommentStatus::Rejete->value => 'danger',
        ]);
        yield DateTimeField::new('createdAt', 'Date')->hideOnForm();
    }

    #[AdminRoute('/{id}/publish', name: 'publish', options: ['methods' => ['POST']])]
    public function publish(#[MapEntity] Comment $comment, EntityManagerInterface $em): Response
    {
        $comment->setStatus(CommentStatus::Publie);
        $em->flush();

        return $this->backToIndex('Commentaire publié.');
    }

    #[AdminRoute('/{id}/reject', name: 'reject', options: ['methods' => ['POST']])]
    public function reject(#[MapEntity] Comment $comment, EntityManagerInterface $em): Response
    {
        $comment->setStatus(CommentStatus::Rejete);
        $em->flush();

        return $this->backToIndex('Commentaire rejeté.', 'warning');
    }
}
