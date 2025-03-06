-- Sélectionner la base de données matchmaking
USE matchmaking;


-- Ajout de joueurs à la table des joueurs
INSERT INTO players (pseudo) VALUES
    ('player1'),
    ('player2'),
    ('player3'),
    ('player4');

-- Ajout de joueurs en attente (file d'attente)
-- Ici, nous supposons que player1 et player2 sont en attente pour commencer un match
INSERT INTO queue (id_player, ip, port) VALUES
    ((SELECT id_player FROM players WHERE pseudo = 'player1'), '192.168.1.10', 12345),
    ((SELECT id_player FROM players WHERE pseudo = 'player2'), '192.168.1.11', 12346);

-- Ajout de matchs
-- Création d'un match entre player1 et player2
-- Ce match est dans un état "pending" au début
INSERT INTO matchs (id_player1, id_player2, game_board, status) VALUES
    ((SELECT id_player FROM players WHERE pseudo = 'player1'),
     (SELECT id_player FROM players WHERE pseudo = 'player2'),
     '---------', 'pending');

-- Ajout de tours de jeu
-- Nous supposons qu'un match a déjà commencé entre player1 et player2
-- Nous ajoutons ici les premiers tours de jeu pour simuler un déroulement de partie
-- Tour 1: player1 joue la position 0
INSERT INTO turns (id_match, id_player, position_played) VALUES
    ((SELECT id_match FROM matchs WHERE id_player1 = (SELECT id_player FROM players WHERE pseudo = 'player1') AND id_player2 = (SELECT id_player FROM players WHERE pseudo = 'player2') AND status = 'pending'),
     (SELECT id_player FROM players WHERE pseudo = 'player1'),
     0);

-- Tour 2: player2 joue la position 1
INSERT INTO turns (id_match, id_player, position_played) VALUES
    ((SELECT id_match FROM matchs WHERE id_player1 = (SELECT id_player FROM players WHERE pseudo = 'player1') AND id_player2 = (SELECT id_player FROM players WHERE pseudo = 'player2') AND status = 'pending'),
     (SELECT id_player FROM players WHERE pseudo = 'player2'),
     1);

-- Tour 3: player1 joue la position 4
INSERT INTO turns (id_match, id_player, position_played) VALUES
    ((SELECT id_match FROM matchs WHERE id_player1 = (SELECT id_player FROM players WHERE pseudo = 'player1') AND id_player2 = (SELECT id_player FROM players WHERE pseudo = 'player2') AND status = 'pending'),
     (SELECT id_player FROM players WHERE pseudo = 'player1'),
     4);

-- Tour 4: player2 joue la position 3
INSERT INTO turns (id_match, id_player, position_played) VALUES
    ((SELECT id_match FROM matchs WHERE id_player1 = (SELECT id_player FROM players WHERE pseudo = 'player1') AND id_player2 = (SELECT id_player FROM players WHERE pseudo = 'player2') AND status = 'pending'),
     (SELECT id_player FROM players WHERE pseudo = 'player2'),
     3);

-- Tour 5: player1 joue la position 8 (c'est un jeu qui va probablement se terminer ici)
INSERT INTO turns (id_match, id_player, position_played) VALUES
    ((SELECT id_match FROM matchs WHERE id_player1 = (SELECT id_player FROM players WHERE pseudo = 'player1') AND id_player2 = (SELECT id_player FROM players WHERE pseudo = 'player2') AND status = 'pending'),
     (SELECT id_player FROM players WHERE pseudo = 'player1'),
     8);

-- Mise à jour de l'état du match à 'finished' une fois le match terminé
-- Ici, nous supposons que player1 a gagné
UPDATE matchs SET status = 'finished', id_winner = (SELECT id_player FROM players WHERE pseudo = 'player1') WHERE status = 'pending';

-- Ajout d'un autre match entre player3 et player4
-- Création d'un match entre player3 et player4
INSERT INTO matchs (id_player1, id_player2, game_board, status) VALUES
    ((SELECT id_player FROM players WHERE pseudo = 'player3'),
     (SELECT id_player FROM players WHERE pseudo = 'player4'),
     '---------', 'pending');

