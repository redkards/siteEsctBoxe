<?php

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\Response;

/**
 * En-têtes Cache-Control communs de l'API.
 */
trait PublicCache
{
    /**
     * Contenu public : mis en cache 5 minutes par le navigateur et les proxys.
     */
    private function publicCache(Response $response, int $maxAge = 300): Response
    {
        return $response->setPublic()->setMaxAge($maxAge);
    }

    /**
     * Données personnelles : jamais mises en cache.
     */
    private function noStore(Response $response): Response
    {
        $response->headers->set('Cache-Control', 'no-store, private');

        return $response;
    }
}
