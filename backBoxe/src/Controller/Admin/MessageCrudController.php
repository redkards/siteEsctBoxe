<?php

namespace App\Controller\Admin;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminRoute;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\DateTimeFilter;
use EasyCorp\Bundle\EasyAdminBundle\Filter\NullFilter;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGeneratorInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Messagerie membre ↔ club. Un message sans destinataire est adressé au club.
 * « Répondre » ouvre un nouveau message prérempli vers l'expéditeur.
 */
#[IsGranted('ROLE_COACH')]
class MessageCrudController extends AbstractCrudController
{
    use BackToIndex;

    public function __construct(private readonly MessageRepository $messages)
    {
    }

    public static function getEntityFqcn(): string
    {
        return Message::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Message')
            ->setEntityLabelInPlural('Messagerie')
            ->setDefaultSort(['createdAt' => 'DESC'])
            ->setSearchFields(['subject', 'body']);
    }

    public function configureActions(Actions $actions): Actions
    {
        $reply = Action::new('reply', 'Répondre', 'fa fa-reply')
            ->linkToUrl(fn (Message $m) => $this->container->get(AdminUrlGeneratorInterface::class)
                ->setController(self::class)->setAction(Action::NEW)->set('replyTo', $m->getId())->generateUrl())
            ->asPrimaryAction()
            ->displayIf(static fn (Message $m) => $m->isToClub() && !$m->getSender()?->isAnonymized());
        $markRead = Action::new('markRead', 'Marquer comme lu', 'fa fa-envelope-open')
            ->linkToCrudAction('markRead')->renderAsForm()
            ->displayIf(static fn (Message $m) => $m->isToClub() && null === $m->getReadAt());

        return $actions
            ->add(Crud::PAGE_INDEX, $reply)
            ->add(Crud::PAGE_INDEX, $markRead)
            ->add(Crud::PAGE_DETAIL, $reply)
            ->add(Crud::PAGE_DETAIL, $markRead)
            ->add(Crud::PAGE_INDEX, Action::DETAIL)
            ->disable(Action::EDIT);
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(NullFilter::new('recipient', 'Destinataire')->setChoiceLabels('Le club', 'Un membre'))
            ->add(NullFilter::new('readAt', 'Lecture')->setChoiceLabels('Non lu', 'Lu'))
            ->add(DateTimeFilter::new('createdAt', 'Date'));
    }

    public function createEntity(string $entityFqcn): Message
    {
        $message = new Message();
        $user = $this->getUser();
        if ($user instanceof User) {
            $message->setSender($user);
        }

        $replyTo = $this->container->get('request_stack')->getCurrentRequest()?->query->getInt('replyTo');
        $original = $replyTo ? $this->messages->find($replyTo) : null;
        if ($original) {
            $message->setReplyTo($original)
                ->setRecipient($original->getSender())
                ->setSubject(str_starts_with((string) $original->getSubject(), 'Re : ') ? $original->getSubject() : 'Re : '.$original->getSubject());
            $original->setReadAt($original->getReadAt() ?? new \DateTimeImmutable());
        }

        return $message;
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->onlyOnIndex();
        yield AssociationField::new('sender', 'Expéditeur')->hideOnForm();
        yield AssociationField::new('recipient', 'Destinataire')
            ->setHelp('Vide = message adressé au club.')
            ->formatValue(static fn ($value) => $value ?? 'Le club');
        yield TextField::new('subject', 'Sujet');
        yield TextareaField::new('body', 'Message')->hideOnIndex();
        yield DateTimeField::new('createdAt', 'Envoyé le')->hideOnForm();
        yield DateTimeField::new('readAt', 'Lu le')->hideOnForm();
    }

    #[AdminRoute('/{id}/read', name: 'mark_read', options: ['methods' => ['POST']])]
    public function markRead(#[MapEntity] Message $message, EntityManagerInterface $em): Response
    {
        $message->setReadAt($message->getReadAt() ?? new \DateTimeImmutable());
        $em->flush();

        return $this->backToIndex('Message marqué comme lu.');
    }
}
