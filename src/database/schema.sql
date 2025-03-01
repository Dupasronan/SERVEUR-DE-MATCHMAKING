USE matchmaking;

-- Définition détaillée des tables avec contraintes

ALTER TABLE queue
    MODIFY COLUMN ip VARCHAR(255) NOT NULL,
    MODIFY COLUMN port INT NOT NULL,
    MODIFY COLUMN pseudo VARCHAR(255) NOT NULL;

ALTER TABLE matchs
    ADD CONSTRAINT fk_match_player1 FOREIGN KEY (id_player1) REFERENCES queue(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_match_player2 FOREIGN KEY (id_player2) REFERENCES queue(id) ON DELETE CASCADE;

ALTER TABLE turns
    ADD CONSTRAINT fk_turns_match FOREIGN KEY (id_match) REFERENCES matchs(id) ON DELETE CASCADE;
