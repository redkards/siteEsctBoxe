<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240928092203 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE palmares (id INT AUTO_INCREMENT NOT NULL, boxeur_id INT NOT NULL, categorie_id INT NOT NULL, victoires INT NOT NULL, defaites INT NOT NULL, nul INT NOT NULL, INDEX IDX_FF4EE64973ED14B4 (boxeur_id), INDEX IDX_FF4EE649BCF5E72D (categorie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE palmares ADD CONSTRAINT FK_FF4EE64973ED14B4 FOREIGN KEY (boxeur_id) REFERENCES boxeur (id)');
        $this->addSql('ALTER TABLE palmares ADD CONSTRAINT FK_FF4EE649BCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE palmares DROP FOREIGN KEY FK_FF4EE64973ED14B4');
        $this->addSql('ALTER TABLE palmares DROP FOREIGN KEY FK_FF4EE649BCF5E72D');
        $this->addSql('DROP TABLE palmares');
    }
}
