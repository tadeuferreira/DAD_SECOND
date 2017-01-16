"use strict";
var gamePlayer_1 = require("./gamePlayer");
var table_1 = require("./table");
var Game = (function () {
    function Game() {
        this.players = [];
        this.table = new table_1.Table();
        players.push(new gamePlayer_1.GamePlayer(PlayerType.Me));
        players.push(new gamePlayer_1.GamePlayer(PlayerType.Friend));
        players.push(new gamePlayer_1.GamePlayer(PlayerType.Foe1));
        players.push(new gamePlayer_1.GamePlayer(PlayerType.Foe2));
    }
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map