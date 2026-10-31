<?php

namespace App\Controller\Admin;

use App\Entity\Article;
use App\Entity\User;
use App\Enum\ArticleCategory;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\ChoiceFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\DateTimeFilter;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_COACH')]
class ArticleCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Article::class;
    }

    public function createEntity(string $entityFqcn): Article
    {
        $article = new Article();
        $user = $this->getUser();
        if ($user instanceof User) {
            $article->setAuthor($user);
        }

        return $article;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Actualité')
            ->setEntityLabelInPlural('Actualités')
            ->setDefaultSort(['publishedAt' => 'DESC', 'id' => 'DESC'])
            ->setSearchFields(['title', 'excerpt']);
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(ChoiceFilter::new('category', 'Catégorie')->setChoices(ArticleCategory::choices()))
            ->add(DateTimeFilter::new('publishedAt', 'Publication'));
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield TextField::new('title', 'Titre');
        yield TextField::new('slug', 'Slug')
            ->setRequired(false)
            ->setHelp("Adresse de l'actualité. Laissez vide pour la générer depuis le titre.")
            ->hideOnIndex();
        yield ChoiceField::new('category', 'Catégorie')->setChoices(ArticleCategory::choices())->renderAsBadges();
        yield TextareaField::new('excerpt', 'Chapô')->setHelp('Résumé affiché sur les cartes (400 caractères max).')->hideOnIndex();
        yield TextEditorField::new('content', 'Contenu')->hideOnIndex();
        yield TextField::new('coverImage', 'Image de couverture')->setHelp('Chemin (/img/…, /uploads/…) ou URL absolue.')->hideOnIndex();
        yield DateTimeField::new('publishedAt', 'Publication')
            ->setHelp('Vide = brouillon. Une date future programme la publication.');
        yield AssociationField::new('author', 'Auteur')->hideOnForm();
    }
}
