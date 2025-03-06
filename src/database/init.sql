-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS matchmaking;
USE matchmaking;

-- Table des joueurs connectés
CREATE TABLE IF NOT EXISTS players (
    id_player INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des joueurs en attente (file d'attente)
CREATE TABLE IF NOT EXISTS queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_player INT NOT NULL,
    ip VARCHAR(255) NOT NULL,
    port INT NOT NULL,
    date_entry DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_player) REFERENCES players(id_player) ON DELETE CASCADE
);

-- Table des matchs
CREATE TABLE IF NOT EXISTS matchs (
    id_match INT AUTO_INCREMENT PRIMARY KEY,
    id_player1 INT NOT NULL,
    id_player2 INT NOT NULL,
    game_board CHAR(9) DEFAULT '---------',  -- 9 cases pour le morpion ('-' représente une case vide)
    status ENUM('pending', 'in_progress', 'finished') DEFAULT 'pending',
    id_winner INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_player1) REFERENCES players(id_player) ON DELETE CASCADE,
    FOREIGN KEY (id_player2) REFERENCES players(id_player) ON DELETE CASCADE,
    FOREIGN KEY (id_winner) REFERENCES players(id_player) ON DELETE SET NULL
);

-- Table des tours de jeu
CREATE TABLE IF NOT EXISTS turns (
    id_turn INT AUTO_INCREMENT PRIMARY KEY,
    id_match INT NOT NULL,
    id_player INT NOT NULL,
    position_played INT CHECK (position_played BETWEEN 0 AND 8),  -- Position jouée (0 à 8 pour les cases du morpion)
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_match) REFERENCES matchs(id_match) ON DELETE CASCADE,
    FOREIGN KEY (id_player) REFERENCES players(id_player) ON DELETE CASCADE
);


