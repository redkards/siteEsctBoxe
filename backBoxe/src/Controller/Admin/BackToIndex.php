<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGeneratorInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Actions personnalisées des CRUD : message flash puis retour à la page d'origine (ou à la liste).
 */
trait BackToIndex
{
    private function backToIndex(string $flash, string $type = 'success'): RedirectResponse
    {
        $this->addFlash($type, $flash);

        $referer = $this->container->get('request_stack')->getCurrentRequest()?->headers->get('referer');
        if ($referer && str_contains($referer, '/admin')) {
            return $this->redirect($referer);
        }

        return $this->redirect($this->container->get(AdminUrlGeneratorInterface::class)
            ->setController(static::class)
            ->setAction(Action::INDEX)
            ->generateUrl());
    }
}
