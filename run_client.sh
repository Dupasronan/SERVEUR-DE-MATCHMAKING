#!/bin/bash

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "Les dépendances ne sont pas installées. Installation en cours..."
    npm install
fi

# Compiler le code TypeScript vers JavaScript
echo "Compilation du code client..."
npx tsc  # ou `npm run build` si vous avez un script personnalisé dans package.json

# Lancer le client (par exemple avec React)
echo "Lancement du client..."
npm run start  # Cela pourrait être `react-scripts start` si vous utilisez Create React App
