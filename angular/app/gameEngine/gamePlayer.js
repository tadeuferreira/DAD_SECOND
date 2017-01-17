"use strict";
var PlayerType;
(function (PlayerType) {
    PlayerType[PlayerType["Me"] = 0] = "Me";
    PlayerType[PlayerType["Friend"] = 1] = "Friend";
    PlayerType[PlayerType["Foe1"] = 2] = "Foe1";
    PlayerType[PlayerType["Foe2"] = 3] = "Foe2";
})(PlayerType = exports.PlayerType || (exports.PlayerType = {}));
var GamePlayer = (function () {
    function GamePlayer(type, avatar, username, id) {
        this.hand = [];
        this.type = type;
        this.isTurn = false;
    }
    return GamePlayer;
}());
exports.GamePlayer = GamePlayer;
//# sourceMappingURL=gamePlayer.js.map