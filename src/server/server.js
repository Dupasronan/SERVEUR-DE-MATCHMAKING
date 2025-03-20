"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var connection_1 = require("../database/connection");
var matchmakingRoutes_1 = require("./routes/matchmakingRoutes");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connexion à la base de données
(0, connection_1.connectDB)()
    .then(function () { return console.log('✅ Connexion à la base de données réussie.'); })
    .catch(function (err) { return console.error('❌ Erreur de connexion à la BDD:', err); });
// Routes
app.use('/api/matchmaking', matchmakingRoutes_1.default);
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Serveur lanc\u00E9 sur http://localhost:".concat(PORT));
});
