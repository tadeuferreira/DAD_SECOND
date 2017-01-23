"use strict";
var PlayerType;
(function (PlayerType) {
    PlayerType[PlayerType["Me"] = 0] = "Me";
    PlayerType[PlayerType["Friend"] = 1] = "Friend";
    PlayerType[PlayerType["Foe1"] = 2] = "Foe1";
    PlayerType[PlayerType["Foe2"] = 3] = "Foe2";
})(PlayerType = exports.PlayerType || (exports.PlayerType = {}));
var GamePlayer = (function () {
    function GamePlayer(type, avatar, username, id, team, team_pos) {
        this.hand = [];
        this.type = type;
        this.isTurn = false;
        this.id = id;
        this.avatar = avatar;
        this.username = username;
        this.team = team;
        this.team_pos = team_pos;
        this.tableCard = null;
        this.stash = [];
    }
    GamePlayer.prototype.updateCard = function (card) {
        var card_pos = -1;
        for (var i = 0; i < this.hand.length; ++i) {
            if (this.hand[i].id == card.id) {
                card_pos = i;
            }
        }
        this.hand.splice(card_pos, 1);
        this.tableCard = card;
    };
    GamePlayer.prototype.playCard = function (id) {
        var card_pos = -1;
        for (var i = 0; i < this.hand.length; ++i) {
            if (this.hand[i].id == id) {
                card_pos = i;
            }
        }
        this.tableCard = this.hand[card_pos];
        this.hand.splice(card_pos, 1);
        this.tableCard.isOnHand = false;
        this.tableCard.isOnTable = true;
        this.tableCard.isUsed = false;
    };
    return GamePlayer;
}());
exports.GamePlayer = GamePlayer;
//# sourceMappingURL=gamePlayer.js.map