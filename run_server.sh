#!/bin/bash

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "Les dépendances ne sont pas installées. Installation en cours..."
    npm install
fi

# Lancer le serveur avec ts-node
echo "Lancement du serveur..."
npx ts-node src/server/server.ts # Assurez-vous que le fichier serveur est situé dans src/server.ts
