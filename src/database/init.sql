CREATE DATABASE IF NOT EXISTS matchmaking;
USE matchmaking;

-- Table des joueurs en attente (queue)
CREATE TABLE IF NOT EXISTS queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(255) NOT NULL,
    port INT NOT NULL,
    pseudo VARCHAR(255) NOT NULL,
    dates_entries DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des matchs
CREATE TABLE IF NOT EXISTS matchs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_player1 INT NOT NULL,
    id_player2 INT NOT NULL,
    game_board JSON DEFAULT NULL,
    status BOOLEAN DEFAULT FALSE,
    id_winner INT DEFAULT NULL
);

-- Table des tours de jeu
CREATE TABLE IF NOT EXISTS turns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_match INT NOT NULL,
    id_player INT NOT NULL,
    shot_played VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_match) REFERENCES matchs(id) ON DELETE CASCADE
);
