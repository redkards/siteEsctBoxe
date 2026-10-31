<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261028200000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'RGPD : date et version du consentement des utilisateurs';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user ADD consent_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD consent_version VARCHAR(20) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user DROP consent_at, DROP consent_version');
    }
}
