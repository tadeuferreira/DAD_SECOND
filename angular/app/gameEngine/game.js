"use strict";
var table_1 = require("./table");
var Game = (function () {
    function Game(json) {
        this.players = [];
        this.table = new table_1.Table();
        /*this.players.push(new GamePlayer(PlayerType.Me));
        this.players.push(new GamePlayer(PlayerType.Friend));
        this.players.push(new GamePlayer(PlayerType.Foe1));
        this.players.push(new GamePlayer(PlayerType.Foe2));*/
    }
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map