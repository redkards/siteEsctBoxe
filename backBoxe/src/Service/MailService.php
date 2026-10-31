<?php

namespace App\Service;

use App\Content\ClubInfo;
use App\Entity\ContactMessage;
use App\Entity\Membership;
use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

/**
 * Emails transactionnels (gabarits Twig HTML + texte dans templates/emails).
 * Toutes les méthodes peuvent lever une TransportExceptionInterface : à l'appelant de la journaliser.
 */
class MailService
{
    public function __construct(
        private readonly MailerInterface $mailer,
        #[Autowire(env: 'MAILER_FROM')]
        private readonly string $from,
        #[Autowire(env: 'FRONTEND_URL')]
        private readonly string $frontendUrl,
        #[Autowire(env: 'CLUB_NOTIFICATION_EMAIL')]
        private readonly string $clubEmail,
    ) {
    }

    /**
     * Lien d'activation (valable 24 h) vers la page /verify-email du front.
     */
    public function sendVerificationEmail(User $user, string $plainToken, \DateTimeImmutable $expiresAt): void
    {
        $this->send(
            $this->member($user),
            'Confirmez votre adresse email — '.ClubInfo::SHORT_NAME,
            'verification',
            [
                'firstName' => $user->getFirstName(),
                'link' => $this->frontLink('/verify-email?token='.urlencode($plainToken)),
                'expiresAt' => $expiresAt,
            ],
        );
    }

    /**
     * Confirmation de la suppression du compte (lien valable 1 h).
     */
    public function sendAccountDeletionConfirmation(User $user, string $plainToken, \DateTimeImmutable $expiresAt): void
    {
        $this->send(
            $this->member($user),
            'Confirmez la suppression de votre compte — '.ClubInfo::SHORT_NAME,
            'account_deletion',
            [
                'firstName' => $user->getFirstName(),
                'link' => $this->frontLink('/suppression-compte?token='.urlencode($plainToken)),
                'expiresAt' => $expiresAt,
            ],
        );
    }

    /**
     * Accusé de réception d'une demande d'inscription, envoyé au demandeur.
     */
    public function sendMembershipAcknowledgement(Membership $membership): void
    {
        $this->send(
            new Address((string) $membership->getEmail(), trim($membership->getFirstName().' '.$membership->getLastName())),
            'Votre demande d’inscription a bien été reçue — '.ClubInfo::SHORT_NAME,
            'membership_ack',
            ['membership' => $membership, 'club' => ClubInfo::NAME, 'accountLink' => $this->frontLink('/espace-membre')],
        );
    }

    /**
     * Notification au club : nouvelle demande d'inscription à traiter dans le back-office.
     */
    public function sendMembershipNotification(Membership $membership, string $adminUrl): void
    {
        $this->send(
            new Address($this->clubEmail, ClubInfo::NAME),
            sprintf('Nouvelle inscription : %s %s (%s)', $membership->getFirstName(), $membership->getLastName(), $membership->getDiscipline()?->getName()),
            'membership_club',
            ['membership' => $membership, 'adminUrl' => $adminUrl],
            replyTo: (string) $membership->getEmail(),
        );
    }

    /**
     * Notification au club : nouveau message du formulaire de contact.
     */
    public function sendContactNotification(ContactMessage $message): void
    {
        $this->send(
            new Address($this->clubEmail, ClubInfo::NAME),
            'Contact : '.$message->getSubject(),
            'contact_club',
            ['contact' => $message],
            replyTo: (string) $message->getEmail(),
        );
    }

    /**
     * @param array<string, mixed> $context
     */
    private function send(Address $to, string $subject, string $template, array $context, ?string $replyTo = null): void
    {
        $email = (new TemplatedEmail())
            ->from(new Address($this->from, ClubInfo::SHORT_NAME))
            ->to($to)
            ->subject($subject)
            ->htmlTemplate(sprintf('emails/%s.html.twig', $template))
            ->textTemplate(sprintf('emails/%s.txt.twig', $template))
            ->context($context);

        if ($replyTo) {
            $email->replyTo($replyTo);
        }

        $this->mailer->send($email);
    }

    private function member(User $user): Address
    {
        return new Address((string) $user->getEmail(), $user->getFullName());
    }

    private function frontLink(string $path): string
    {
        return rtrim($this->frontendUrl, '/').$path;
    }
}
