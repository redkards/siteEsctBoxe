<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240920115424 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE adresse (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, salle_id INT DEFAULT NULL, numero INT DEFAULT NULL, type_voie VARCHAR(100) NOT NULL, nom_voie VARCHAR(100) NOT NULL, complement_adresse VARCHAR(150) DEFAULT NULL, ville VARCHAR(100) NOT NULL, code_postal VARCHAR(50) NOT NULL, pays VARCHAR(100) NOT NULL, INDEX IDX_C35F0816A76ED395 (user_id), INDEX IDX_C35F0816DC304035 (salle_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE boxe_type (id INT AUTO_INCREMENT NOT NULL, boxeur_id INT DEFAULT NULL, type_boxe_nom VARCHAR(150) NOT NULL, INDEX IDX_D30DF1173ED14B4 (boxeur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE boxeur (id INT AUTO_INCREMENT NOT NULL, poids DOUBLE PRECISION NOT NULL, boxeur_nom VARCHAR(100) NOT NULL, boxeur_prenom VARCHAR(100) NOT NULL, boxeur_date_naissance DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE categorie (id INT AUTO_INCREMENT NOT NULL, boxeur_id INT DEFAULT NULL, categorie_nom VARCHAR(255) NOT NULL, INDEX IDX_497DD63473ED14B4 (boxeur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entrainement (id INT AUTO_INCREMENT NOT NULL, training_date DATE NOT NULL COMMENT \'(DC2Type:date_immutable)\', start_time TIME NOT NULL COMMENT \'(DC2Type:time_immutable)\', end_time TIME NOT NULL COMMENT \'(DC2Type:time_immutable)\', lieu VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entrainement_salle (entrainement_id INT NOT NULL, salle_id INT NOT NULL, INDEX IDX_11F458BDA15E8FD (entrainement_id), INDEX IDX_11F458BDDC304035 (salle_id), PRIMARY KEY(entrainement_id, salle_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entraineur (id INT AUTO_INCREMENT NOT NULL, trainer_nom VARCHAR(100) NOT NULL, trainer_prenom VARCHAR(100) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entraineur_entrainement (entraineur_id INT NOT NULL, entrainement_id INT NOT NULL, INDEX IDX_4305A234F8478A1 (entraineur_id), INDEX IDX_4305A234A15E8FD (entrainement_id), PRIMARY KEY(entraineur_id, entrainement_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entraineur_boxeur (entraineur_id INT NOT NULL, boxeur_id INT NOT NULL, INDEX IDX_50E20583F8478A1 (entraineur_id), INDEX IDX_50E2058373ED14B4 (boxeur_id), PRIMARY KEY(entraineur_id, boxeur_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE gala (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, lieu VARCHAR(255) NOT NULL, gala_date DATE NOT NULL COMMENT \'(DC2Type:date_immutable)\', gala_time TIME NOT NULL COMMENT \'(DC2Type:time_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, messagerie_id INT DEFAULT NULL, expediteur VARCHAR(150) NOT NULL, destinataire VARCHAR(150) NOT NULL, contenu VARCHAR(500) NOT NULL, msg_date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_B6BD307F836C1031 (messagerie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messagerie (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE salle (id INT AUTO_INCREMENT NOT NULL, gala_id INT DEFAULT NULL, nom VARCHAR(150) NOT NULL, capacité INT DEFAULT NULL, INDEX IDX_4E977E5C568D67E2 (gala_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, messagerie_id INT DEFAULT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, nom VARCHAR(120) NOT NULL, prenom VARCHAR(120) NOT NULL, tel VARCHAR(50) NOT NULL, date_naissance DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_8D93D649836C1031 (messagerie_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE adresse ADD CONSTRAINT FK_C35F0816A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE adresse ADD CONSTRAINT FK_C35F0816DC304035 FOREIGN KEY (salle_id) REFERENCES salle (id)');
        $this->addSql('ALTER TABLE boxe_type ADD CONSTRAINT FK_D30DF1173ED14B4 FOREIGN KEY (boxeur_id) REFERENCES boxeur (id)');
        $this->addSql('ALTER TABLE categorie ADD CONSTRAINT FK_497DD63473ED14B4 FOREIGN KEY (boxeur_id) REFERENCES boxeur (id)');
        $this->addSql('ALTER TABLE entrainement_salle ADD CONSTRAINT FK_11F458BDA15E8FD FOREIGN KEY (entrainement_id) REFERENCES entrainement (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entrainement_salle ADD CONSTRAINT FK_11F458BDDC304035 FOREIGN KEY (salle_id) REFERENCES salle (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entraineur_entrainement ADD CONSTRAINT FK_4305A234F8478A1 FOREIGN KEY (entraineur_id) REFERENCES entraineur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entraineur_entrainement ADD CONSTRAINT FK_4305A234A15E8FD FOREIGN KEY (entrainement_id) REFERENCES entrainement (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entraineur_boxeur ADD CONSTRAINT FK_50E20583F8478A1 FOREIGN KEY (entraineur_id) REFERENCES entraineur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entraineur_boxeur ADD CONSTRAINT FK_50E2058373ED14B4 FOREIGN KEY (boxeur_id) REFERENCES boxeur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F836C1031 FOREIGN KEY (messagerie_id) REFERENCES messagerie (id)');
        $this->addSql('ALTER TABLE salle ADD CONSTRAINT FK_4E977E5C568D67E2 FOREIGN KEY (gala_id) REFERENCES gala (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649836C1031 FOREIGN KEY (messagerie_id) REFERENCES messagerie (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE adresse DROP FOREIGN KEY FK_C35F0816A76ED395');
        $this->addSql('ALTER TABLE adresse DROP FOREIGN KEY FK_C35F0816DC304035');
        $this->addSql('ALTER TABLE boxe_type DROP FOREIGN KEY FK_D30DF1173ED14B4');
        $this->addSql('ALTER TABLE categorie DROP FOREIGN KEY FK_497DD63473ED14B4');
        $this->addSql('ALTER TABLE entrainement_salle DROP FOREIGN KEY FK_11F458BDA15E8FD');
        $this->addSql('ALTER TABLE entrainement_salle DROP FOREIGN KEY FK_11F458BDDC304035');
        $this->addSql('ALTER TABLE entraineur_entrainement DROP FOREIGN KEY FK_4305A234F8478A1');
        $this->addSql('ALTER TABLE entraineur_entrainement DROP FOREIGN KEY FK_4305A234A15E8FD');
        $this->addSql('ALTER TABLE entraineur_boxeur DROP FOREIGN KEY FK_50E20583F8478A1');
        $this->addSql('ALTER TABLE entraineur_boxeur DROP FOREIGN KEY FK_50E2058373ED14B4');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F836C1031');
        $this->addSql('ALTER TABLE salle DROP FOREIGN KEY FK_4E977E5C568D67E2');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649836C1031');
        $this->addSql('DROP TABLE adresse');
        $this->addSql('DROP TABLE boxe_type');
        $this->addSql('DROP TABLE boxeur');
        $this->addSql('DROP TABLE categorie');
        $this->addSql('DROP TABLE entrainement');
        $this->addSql('DROP TABLE entrainement_salle');
        $this->addSql('DROP TABLE entraineur');
        $this->addSql('DROP TABLE entraineur_entrainement');
        $this->addSql('DROP TABLE entraineur_boxeur');
        $this->addSql('DROP TABLE gala');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE messagerie');
        $this->addSql('DROP TABLE salle');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
