# SERVEUR DE MATCHMAKING

Un serveur de matchmaking en temps réel pour les parties de Tic Tac Toe avec une interface client.

## 📋 Description

Ce projet implémente un système de matchmaking complet pour le jeu de Morpion (Tic Tac Toe), permettant aux joueurs de s'affronter en temps réel. Le système gère une file d'attente de joueurs, les associe, et supervise les parties en cours.

## 🏗️ Architecture du Projet

```
SERVEUR-DE-MATCHMAKING/
├── server/                        # Serveur de matchmaking et logique de jeu
│   ├── services/                  # Services métier
│   │   ├── MatchmakingService.ts  # Gestion de la file d'attente et matchmaking
│   │   └── GameService.ts         # Logique de jeu et gestion des états
│   ├── entities/                  # Entités de base de données
│   │   ├── QueueEntry.ts          # Entité pour les joueurs en attente
│   │   ├── Match.ts               # Entité pour les parties
│   │   └── Turn.ts                # Entité pour les coups joués
│   ├── database/                  # Configuration de la base de données
│   │   └── config.ts              # Configuration de TypeORM et SQLite
│   ├── socket/                    # Gestion des communications en temps réel
│   │   └── SocketHandler.ts       # Gestionnaire des événements socket
│   └── index.ts                   # Point d'entrée du serveur
├── client/                        # Client en ligne de commande
│   ├── index.ts                   # Point d'entrée du client
│   └── README.md                  # Documentation spécifique au client
├── shared/                        # Code partagé entre client et serveur
│   └── types.ts                   # Types et interfaces communs
├── package.json                   # Dépendances et scripts npm
├── tsconfig.json                  # Configuration TypeScript
└── README.md                      # Documentation principale
```

## 🚀 Technologies Utilisées

- **TypeScript** - Langage de programmation typé
- **Socket.IO** - Communication en temps réel entre client et serveur
- **SQLite** - Base de données légère pour la persistance des données
- **TypeORM** - ORM pour interagir avec la base de données
- **Express.js** - Serveur HTTP

## ✨ Fonctionnalités

- **Système de matchmaking** - File d'attente et association des joueurs
- **Communication en temps réel** - Mises à jour instantanées de l'état du jeu
- **Logique de jeu complète** - Gestion des tours, détection des victoires/égalités
- **Interface en ligne de commande** - Client simple pour jouer
- **Persistance des données** - Historique des parties stocké en base de données

## 🛠️ Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

### Installation des dépendances

```bash
npm install
```

## 🎮 Utilisation

### Démarrer le serveur

```bash
npm run start:server
```

### Démarrer le client

```bash
npm run start:client
```

## 📊 Structure de la Base de Données

Le projet utilise SQLite avec TypeORM pour la gestion des données :

- **QueueEntry** - Joueurs en attente d'être associés
- **Match** - Parties actives et terminées
- **Turn** - Coups individuels joués dans chaque partie

## 🧩 Composants Principaux

### Serveur

- **MatchmakingService** - Gère la file d'attente et l'association des joueurs
- **GameService** - Implémente la logique de jeu et gère l'état des parties
- **Gestion des sockets** - Communication en temps réel avec les clients

### Client

- **Interface CLI** - Interaction utilisateur en ligne de commande
- **Gestion d'état** - Suivi de l'état du jeu en local

## 👥 Participants

- Ronan Dupas
- Christian NGONO ABANDA