<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Constraints\Compound;

/**
 * Image : URL absolue (https://…) ou chemin servi par le site (/uploads/…, /img/…).
 */
#[\Attribute(\Attribute::TARGET_PROPERTY | \Attribute::TARGET_METHOD)]
final class ImagePath extends Compound
{
    /**
     * @param array<mixed> $options
     *
     * @return list<\Symfony\Component\Validator\Constraint>
     */
    protected function getConstraints(array $options): array
    {
        return [
            new Assert\Length(max: 500),
            new Assert\AtLeastOneOf(
                constraints: [
                    new Assert\Url(requireTld: true),
                    new Assert\Regex(pattern: '#^/[\w\-./]+$#'),
                ],
                message: 'Indiquez une URL absolue (https://…) ou un chemin commençant par « / » (ex. /uploads/photo.jpg).',
                includeInternalMessages: false,
            ),
        ];
    }
}
