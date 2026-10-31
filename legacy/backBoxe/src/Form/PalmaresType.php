<?php

namespace App\Form;

use App\Entity\Boxeur;
use App\Entity\Categorie;
use App\Entity\Palmares;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PalmaresType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('victoires')
            ->add('defaites')
            ->add('nul')
            ->add('boxeur', EntityType::class, [
                'class' => Boxeur::class,
                'choice_label' => 'id',
            ])
            ->add('categorie', EntityType::class, [
                'class' => Categorie::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Palmares::class,
        ]);
    }
}
