<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Platforms\AbstractMySQLPlatform;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/** Installation v2 sur une base dédiée et vide. Aucune reprise automatique de la base legacy. */
final class Version20261031203000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Schéma initial ESCT Boxe v2 — MariaDB 10.6';
    }

    public function isTransactional(): bool
    {
        return false; // MariaDB réalise des commits implicites sur les instructions DDL.
    }

    public function up(Schema $schema): void
    {
        $this->abortIf(!$this->connection->getDatabasePlatform() instanceof AbstractMySQLPlatform, 'Cette migration exige MariaDB/MySQL.');
        $this->addSql('CREATE TABLE gala (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(180) NOT NULL, slug VARCHAR(200) NOT NULL, type VARCHAR(20) NOT NULL, starts_at DATETIME NOT NULL, ends_at DATETIME DEFAULT NULL, venue VARCHAR(150) NOT NULL, address VARCHAR(255) DEFAULT NULL, city VARCHAR(100) NOT NULL, description LONGTEXT DEFAULT NULL, poster VARCHAR(500) DEFAULT NULL, ticket_url VARCHAR(500) DEFAULT NULL, price INT DEFAULT NULL, published TINYINT DEFAULT 0 NOT NULL, UNIQUE INDEX UNIQ_3D5DC4D4989D9B62 (slug), INDEX IDX_GALA_STARTS_AT (starts_at), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) DEFAULT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(80) NOT NULL, last_name VARCHAR(80) NOT NULL, phone VARCHAR(20) DEFAULT NULL, birth_date DATE DEFAULT NULL, roles JSON NOT NULL, email_verified_at DATETIME DEFAULT NULL, verification_token VARCHAR(64) DEFAULT NULL, verification_token_expires_at DATETIME DEFAULT NULL, consent_version VARCHAR(20) NOT NULL, consent_at DATETIME NOT NULL, created_at DATETIME NOT NULL, last_login_at DATETIME DEFAULT NULL, deletion_token VARCHAR(64) DEFAULT NULL, deletion_token_expires_at DATETIME DEFAULT NULL, anonymized_at DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_USER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE discipline (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, slug VARCHAR(200) NOT NULL, short_description VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, icon VARCHAR(50) DEFAULT NULL, image VARCHAR(500) DEFAULT NULL, min_age INT DEFAULT NULL, position INT DEFAULT 0 NOT NULL, UNIQUE INDEX UNIQ_75BEEE3F989D9B62 (slug), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE article (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(180) NOT NULL, slug VARCHAR(200) NOT NULL, category VARCHAR(20) NOT NULL, excerpt VARCHAR(400) NOT NULL, content LONGTEXT NOT NULL, cover_image VARCHAR(500) DEFAULT NULL, published_at DATETIME DEFAULT NULL, author_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_23A0E66989D9B62 (slug), INDEX IDX_ARTICLE_PUBLISHED_AT (published_at), INDEX IDX_23A0E66F675F31B (author_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE consent_log (id INT AUTO_INCREMENT NOT NULL, cgu_version VARCHAR(20) NOT NULL, ip_address VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, user_id INT NOT NULL, INDEX IDX_CONSENT_LOG_CREATED_AT (created_at), INDEX IDX_30113729A76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE coach (id INT AUTO_INCREMENT NOT NULL, first_name VARCHAR(80) NOT NULL, last_name VARCHAR(80) NOT NULL, slug VARCHAR(200) NOT NULL, role VARCHAR(120) NOT NULL, bio LONGTEXT DEFAULT NULL, photo VARCHAR(500) DEFAULT NULL, diplomas VARCHAR(255) DEFAULT NULL, position INT DEFAULT 0 NOT NULL, UNIQUE INDEX UNIQ_3F596DCC989D9B62 (slug), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE coach_discipline (coach_id INT NOT NULL, discipline_id INT NOT NULL, INDEX IDX_1B4399CC3C105691 (coach_id), INDEX IDX_1B4399CCA5522701 (discipline_id), PRIMARY KEY (coach_id, discipline_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE refresh_tokens (refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid DATETIME NOT NULL, id INT AUTO_INCREMENT NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE membership (id INT AUTO_INCREMENT NOT NULL, first_name VARCHAR(80) NOT NULL, last_name VARCHAR(80) NOT NULL, email VARCHAR(180) NOT NULL, phone VARCHAR(20) DEFAULT NULL, birth_date DATE NOT NULL, season VARCHAR(9) NOT NULL, legal_guardian VARCHAR(160) DEFAULT NULL, medical_certificate TINYINT DEFAULT 0 NOT NULL, message LONGTEXT DEFAULT NULL, status VARCHAR(20) NOT NULL, consent_at DATETIME NOT NULL, created_at DATETIME NOT NULL, processed_at DATETIME DEFAULT NULL, user_id INT DEFAULT NULL, discipline_id INT NOT NULL, pricing_id INT DEFAULT NULL, INDEX IDX_MEMBERSHIP_STATUS (status), INDEX IDX_86FFD285A76ED395 (user_id), INDEX IDX_86FFD285A5522701 (discipline_id), INDEX IDX_86FFD2858864AF73 (pricing_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE pricing (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(120) NOT NULL, audience VARCHAR(20) NOT NULL, price_cents INT NOT NULL, period VARCHAR(20) NOT NULL, description LONGTEXT DEFAULT NULL, highlighted TINYINT DEFAULT 0 NOT NULL, position INT DEFAULT 0 NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE boxer (id INT AUTO_INCREMENT NOT NULL, first_name VARCHAR(80) NOT NULL, last_name VARCHAR(80) NOT NULL, slug VARCHAR(200) NOT NULL, nickname VARCHAR(80) DEFAULT NULL, birth_date DATE DEFAULT NULL, sex VARCHAR(1) NOT NULL, weight_kg DOUBLE PRECISION DEFAULT NULL, weight_class VARCHAR(30) DEFAULT NULL, level VARCHAR(20) NOT NULL, photo VARCHAR(500) DEFAULT NULL, bio LONGTEXT DEFAULT NULL, wins INT DEFAULT 0 NOT NULL, losses INT DEFAULT 0 NOT NULL, draws INT DEFAULT 0 NOT NULL, kos INT DEFAULT 0 NOT NULL, active TINYINT DEFAULT 1 NOT NULL, featured TINYINT DEFAULT 0 NOT NULL, discipline_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_BAF6827F989D9B62 (slug), INDEX IDX_BAF6827FA5522701 (discipline_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE fight (id INT AUTO_INCREMENT NOT NULL, date DATE NOT NULL, opponent VARCHAR(120) NOT NULL, opponent_club VARCHAR(150) DEFAULT NULL, location VARCHAR(150) DEFAULT NULL, result VARCHAR(20) NOT NULL, method VARCHAR(20) NOT NULL, rounds INT DEFAULT NULL, boxer_id INT NOT NULL, event_id INT DEFAULT NULL, INDEX IDX_FIGHT_DATE (date), INDEX IDX_21AA445664874707 (boxer_id), INDEX IDX_21AA445671F7E88B (event_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE comment (id INT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, created_at DATETIME NOT NULL, status VARCHAR(20) NOT NULL, article_id INT NOT NULL, author_id INT NOT NULL, INDEX IDX_COMMENT_STATUS (status), INDEX IDX_9474526C7294869C (article_id), INDEX IDX_9474526CF675F31B (author_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE contact_message (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(120) NOT NULL, email VARCHAR(180) NOT NULL, subject VARCHAR(180) NOT NULL, message LONGTEXT NOT NULL, created_at DATETIME NOT NULL, handled TINYINT DEFAULT 0 NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE partner (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(120) NOT NULL, logo VARCHAR(500) DEFAULT NULL, url VARCHAR(500) DEFAULT NULL, position INT DEFAULT 0 NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE venue (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(120) NOT NULL, address VARCHAR(255) NOT NULL, postal_code VARCHAR(10) NOT NULL, city VARCHAR(100) NOT NULL, latitude DOUBLE PRECISION DEFAULT NULL, longitude DOUBLE PRECISION DEFAULT NULL, description LONGTEXT DEFAULT NULL, photo VARCHAR(500) DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE training_slot (id INT AUTO_INCREMENT NOT NULL, day_of_week SMALLINT NOT NULL, start_time VARCHAR(5) NOT NULL, end_time VARCHAR(5) NOT NULL, audience VARCHAR(20) NOT NULL, discipline_id INT NOT NULL, coach_id INT DEFAULT NULL, venue_id INT NOT NULL, INDEX IDX_A3946724A5522701 (discipline_id), INDEX IDX_A39467243C105691 (coach_id), INDEX IDX_A394672440A73EBA (venue_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, subject VARCHAR(180) NOT NULL, body LONGTEXT NOT NULL, created_at DATETIME NOT NULL, read_at DATETIME DEFAULT NULL, sender_id INT NOT NULL, recipient_id INT DEFAULT NULL, reply_to_id INT DEFAULT NULL, INDEX IDX_MESSAGE_CREATED_AT (created_at), INDEX IDX_B6BD307FF624B39D (sender_id), INDEX IDX_B6BD307FE92F8F78 (recipient_id), INDEX IDX_B6BD307FFFDF7169 (reply_to_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E66F675F31B FOREIGN KEY (author_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE consent_log ADD CONSTRAINT FK_30113729A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE coach_discipline ADD CONSTRAINT FK_1B4399CC3C105691 FOREIGN KEY (coach_id) REFERENCES coach (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE coach_discipline ADD CONSTRAINT FK_1B4399CCA5522701 FOREIGN KEY (discipline_id) REFERENCES discipline (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE membership ADD CONSTRAINT FK_86FFD285A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE membership ADD CONSTRAINT FK_86FFD285A5522701 FOREIGN KEY (discipline_id) REFERENCES discipline (id)');
        $this->addSql('ALTER TABLE membership ADD CONSTRAINT FK_86FFD2858864AF73 FOREIGN KEY (pricing_id) REFERENCES pricing (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE boxer ADD CONSTRAINT FK_BAF6827FA5522701 FOREIGN KEY (discipline_id) REFERENCES discipline (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE fight ADD CONSTRAINT FK_21AA445664874707 FOREIGN KEY (boxer_id) REFERENCES boxer (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE fight ADD CONSTRAINT FK_21AA445671F7E88B FOREIGN KEY (event_id) REFERENCES gala (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C7294869C FOREIGN KEY (article_id) REFERENCES article (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CF675F31B FOREIGN KEY (author_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE training_slot ADD CONSTRAINT FK_A3946724A5522701 FOREIGN KEY (discipline_id) REFERENCES discipline (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE training_slot ADD CONSTRAINT FK_A39467243C105691 FOREIGN KEY (coach_id) REFERENCES coach (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE training_slot ADD CONSTRAINT FK_A394672440A73EBA FOREIGN KEY (venue_id) REFERENCES venue (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FF624B39D FOREIGN KEY (sender_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FE92F8F78 FOREIGN KEY (recipient_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FFFDF7169 FOREIGN KEY (reply_to_id) REFERENCES message (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->throwIrreversibleMigrationException('Ne pas effacer les données du club : restaurer une sauvegarde validée.');
    }
}
