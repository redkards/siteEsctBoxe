<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240912090459 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE adresse DROP FOREIGN KEY FK_C35F081667B3B43D');
        $this->addSql('CREATE TABLE entrainement_salle (entrainement_id INT NOT NULL, salle_id INT NOT NULL, INDEX IDX_11F458BDA15E8FD (entrainement_id), INDEX IDX_11F458BDDC304035 (salle_id), PRIMARY KEY(entrainement_id, salle_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entraineur (id INT AUTO_INCREMENT NOT NULL, trainer_nom VARCHAR(100) NOT NULL, trainer_prenom VARCHAR(100) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entraineur_entrainement (entraineur_id INT NOT NULL, entrainement_id INT NOT NULL, INDEX IDX_4305A234F8478A1 (entraineur_id), INDEX IDX_4305A234A15E8FD (entrainement_id), PRIMARY KEY(entraineur_id, entrainement_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entraineur_boxeur (entraineur_id INT NOT NULL, boxeur_id INT NOT NULL, INDEX IDX_50E20583F8478A1 (entraineur_id), INDEX IDX_50E2058373ED14B4 (boxeur_id), PRIMARY KEY(entraineur_id, boxeur_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, messagerie_id INT DEFAULT NULL, expediteur VARCHAR(150) NOT NULL, destinataire VARCHAR(150) NOT NULL, contenu LONGTEXT NOT NULL, msg_date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_B6BD307F836C1031 (messagerie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, messagerie_id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, nom VARCHAR(120) NOT NULL, prenom VARCHAR(120) NOT NULL, tel VARCHAR(50) NOT NULL, date_naissance DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_8D93D649836C1031 (messagerie_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE entrainement_salle ADD CONSTRAINT FK_11F458BDA15E8FD FOREIGN KEY (entrainement_id) REFERENCES entrainement (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entrainement_salle ADD CONSTRAINT FK_11F458BDDC304035 FOREIGN KEY (salle_id) REFERENCES salle (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entraineur_entrainement ADD CONSTRAINT FK_4305A234F8478A1 FOREIGN KEY (entraineur_id) REFERENCES entraineur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entraineur_entrainement ADD CONSTRAINT FK_4305A234A15E8FD FOREIGN KEY (entrainement_id) REFERENCES entrainement (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entraineur_boxeur ADD CONSTRAINT FK_50E20583F8478A1 FOREIGN KEY (entraineur_id) REFERENCES entraineur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entraineur_boxeur ADD CONSTRAINT FK_50E2058373ED14B4 FOREIGN KEY (boxeur_id) REFERENCES boxeur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F836C1031 FOREIGN KEY (messagerie_id) REFERENCES messagerie (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649836C1031 FOREIGN KEY (messagerie_id) REFERENCES messagerie (id)');
        $this->addSql('ALTER TABLE users DROP FOREIGN KEY FK_1483A5E9836C1031');
        $this->addSql('ALTER TABLE messages DROP FOREIGN KEY FK_DB021E96836C1031');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE messages');
        $this->addSql('DROP INDEX IDX_C35F081667B3B43D ON adresse');
        $this->addSql('ALTER TABLE adresse ADD salle_id INT NOT NULL, CHANGE numero numero INT DEFAULT NULL, CHANGE type_voie type_voie VARCHAR(100) NOT NULL, CHANGE complement_adresse complement_adresse VARCHAR(150) DEFAULT NULL, CHANGE ville ville VARCHAR(100) NOT NULL, CHANGE nom_voie nom_voie VARCHAR(100) NOT NULL, CHANGE users_id user_id INT NOT NULL');
        $this->addSql('ALTER TABLE adresse ADD CONSTRAINT FK_C35F0816A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE adresse ADD CONSTRAINT FK_C35F0816DC304035 FOREIGN KEY (salle_id) REFERENCES salle (id)');
        $this->addSql('CREATE INDEX IDX_C35F0816A76ED395 ON adresse (user_id)');
        $this->addSql('CREATE INDEX IDX_C35F0816DC304035 ON adresse (salle_id)');
        $this->addSql('ALTER TABLE boxe_type ADD type_boxe_nom VARCHAR(150) NOT NULL, DROP type');
        $this->addSql('ALTER TABLE boxeur DROP boxeur_birth_date, CHANGE boxeur_nom boxeur_nom VARCHAR(100) NOT NULL, CHANGE boxeur_prenom boxeur_prenom VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE categorie ADD categorie_nom VARCHAR(255) NOT NULL, DROP nom_categorie');
        $this->addSql('ALTER TABLE entrainement ADD lieu VARCHAR(255) NOT NULL, CHANGE training_date training_date DATE NOT NULL COMMENT \'(DC2Type:date_immutable)\', CHANGE start_time start_time TIME NOT NULL COMMENT \'(DC2Type:time_immutable)\', CHANGE end_time end_time TIME NOT NULL COMMENT \'(DC2Type:time_immutable)\'');
        $this->addSql('ALTER TABLE gala ADD nom VARCHAR(255) NOT NULL, ADD gala_time TIME NOT NULL COMMENT \'(DC2Type:time_immutable)\', DROP nom_gala, CHANGE lieu lieu VARCHAR(255) NOT NULL, CHANGE gala_date gala_date DATE NOT NULL COMMENT \'(DC2Type:date_immutable)\'');
        $this->addSql('ALTER TABLE salle CHANGE nom nom VARCHAR(150) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE adresse DROP FOREIGN KEY FK_C35F0816A76ED395');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, messagerie_id INT NOT NULL, nom VARCHAR(120) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, prenom VARCHAR(80) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, email VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, telephone VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, password VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, date_naissance DATE NOT NULL, role VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_1483A5E9836C1031 (messagerie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE messages (id INT AUTO_INCREMENT NOT NULL, messagerie_id INT DEFAULT NULL, expediteur VARCHAR(120) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, destinataire VARCHAR(120) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, contenu LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, msg_date DATE NOT NULL, INDEX IDX_DB021E96836C1031 (messagerie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE users ADD CONSTRAINT FK_1483A5E9836C1031 FOREIGN KEY (messagerie_id) REFERENCES messagerie (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE messages ADD CONSTRAINT FK_DB021E96836C1031 FOREIGN KEY (messagerie_id) REFERENCES messagerie (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE entrainement_salle DROP FOREIGN KEY FK_11F458BDA15E8FD');
        $this->addSql('ALTER TABLE entrainement_salle DROP FOREIGN KEY FK_11F458BDDC304035');
        $this->addSql('ALTER TABLE entraineur_entrainement DROP FOREIGN KEY FK_4305A234F8478A1');
        $this->addSql('ALTER TABLE entraineur_entrainement DROP FOREIGN KEY FK_4305A234A15E8FD');
        $this->addSql('ALTER TABLE entraineur_boxeur DROP FOREIGN KEY FK_50E20583F8478A1');
        $this->addSql('ALTER TABLE entraineur_boxeur DROP FOREIGN KEY FK_50E2058373ED14B4');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F836C1031');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649836C1031');
        $this->addSql('DROP TABLE entrainement_salle');
        $this->addSql('DROP TABLE entraineur');
        $this->addSql('DROP TABLE entraineur_entrainement');
        $this->addSql('DROP TABLE entraineur_boxeur');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE user');
        $this->addSql('ALTER TABLE adresse DROP FOREIGN KEY FK_C35F0816DC304035');
        $this->addSql('DROP INDEX IDX_C35F0816A76ED395 ON adresse');
        $this->addSql('DROP INDEX IDX_C35F0816DC304035 ON adresse');
        $this->addSql('ALTER TABLE adresse ADD users_id INT NOT NULL, DROP user_id, DROP salle_id, CHANGE numero numero INT NOT NULL, CHANGE type_voie type_voie VARCHAR(150) NOT NULL, CHANGE nom_voie nom_voie VARCHAR(150) NOT NULL, CHANGE complement_adresse complement_adresse VARCHAR(255) DEFAULT NULL, CHANGE ville ville VARCHAR(150) NOT NULL');
        $this->addSql('ALTER TABLE adresse ADD CONSTRAINT FK_C35F081667B3B43D FOREIGN KEY (users_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_C35F081667B3B43D ON adresse (users_id)');
        $this->addSql('ALTER TABLE entrainement DROP lieu, CHANGE training_date training_date DATE NOT NULL, CHANGE start_time start_time TIME NOT NULL, CHANGE end_time end_time TIME NOT NULL');
        $this->addSql('ALTER TABLE salle CHANGE nom nom VARCHAR(120) NOT NULL');
        $this->addSql('ALTER TABLE boxe_type ADD type VARCHAR(80) NOT NULL, DROP type_boxe_nom');
        $this->addSql('ALTER TABLE boxeur ADD boxeur_birth_date DATE NOT NULL, CHANGE boxeur_nom boxeur_nom VARCHAR(120) NOT NULL, CHANGE boxeur_prenom boxeur_prenom VARCHAR(120) NOT NULL');
        $this->addSql('ALTER TABLE categorie ADD nom_categorie VARCHAR(120) NOT NULL, DROP categorie_nom');
        $this->addSql('ALTER TABLE gala ADD nom_gala VARCHAR(120) NOT NULL, DROP nom, DROP gala_time, CHANGE lieu lieu VARCHAR(120) NOT NULL, CHANGE gala_date gala_date DATE NOT NULL');
    }
}
