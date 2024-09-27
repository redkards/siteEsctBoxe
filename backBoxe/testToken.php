require 'vendor/autoload.php';

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Signer\Rsa\Sha256;

$privateKey = file_get_contents('C:\\Users\\redka\\OneDrive\\Bureau\\siteEsctBoxe\\backBoxe\\config\\jwt\\private.pem');
$passphrase = 'votre_phrase_de_passe';

$token = (new Builder())
    ->issuedBy('http://example.com') // Émetteur
    ->canOnlyBeUsedBy('http://example.com') // Destinataire
    ->expiresAt((new DateTimeImmutable())->add(new DateInterval('PT1H'))) // Expiration
    ->getToken(new Sha256(), Key::fromString($privateKey, $passphrase));

echo $token->toString();
