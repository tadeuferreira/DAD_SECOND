"use strict";
var card_1 = require("./card");
var gamePlayer_1 = require("./gamePlayer");
var table_1 = require("./table");
var Game = (function () {
    function Game(json) {
        this.players = [null, null, null, null];
        this.initializeGame(json);
        this.jsonGame = json;
    }
    Game.prototype.initializeGame = function (json) {
        var first_id = json.first;
        var first_team;
        var first_pos;
        var deck = [];
        var i = 0;
        var my_team = 0;
        var my_team_pos = 0;
        var my_id = sessionStorage.getItem('id');
        this.isFirst = (json.order[0] == my_id);
        for (i = 0; i < 40; ++i) {
            deck.splice(i, 0, new card_1.Card(json.pack.cards[i].type, json.pack.cards[i].suit, json.pack.cards[i].isOnHand, json.pack.cards[i].isUsed, null, false));
        }
        deck[0].isFirstTrump = true;
        this.TrumpSuit = deck[0].stype;
        //save my team and pos
        for (i = 0; i < 2; ++i) {
            if (json.team2[i].id == my_id) {
                my_team = 2;
                my_team_pos = i;
            }
            else if (json.team1[i].id == my_id) {
                my_team = 1;
                my_team_pos = i;
            }
        }
        //save my team mate id
        var team_mate_id;
        if (my_team == 1) {
            team_mate_id = json.team1[my_team_pos == 0 ? 1 : 0].id;
        }
        else if (my_team == 2) {
            team_mate_id = json.team2[my_team_pos == 0 ? 1 : 0].id;
        }
        var friend_order_pos = -1;
        var my_order_pos = -1;
        console.log(json.order);
        for (i = 0; i < 4; ++i) {
            //me
            if (json.order[i] == my_id) {
                this.createGamePlayer(deck, json, i, gamePlayer_1.PlayerType.Me, json.order[i]);
                my_order_pos = i;
            }
            else if (json.order[i] == team_mate_id) {
                this.createGamePlayer(deck, json, i, gamePlayer_1.PlayerType.Friend, json.order[i]);
                friend_order_pos = i;
            }
        }
        console.log('help');
        this.myTurnNumber = my_order_pos;
        this.onTurn = 0;
        var foe1_pos = (my_order_pos + 1 > 3 ? 0 : my_order_pos + 1);
        var foe2_pos = (my_order_pos - 1 < 0 ? 3 : my_order_pos - 1);
        this.createGamePlayer(deck, json, foe1_pos, gamePlayer_1.PlayerType.Foe1, json.order[foe1_pos]);
        this.createGamePlayer(deck, json, foe2_pos, gamePlayer_1.PlayerType.Foe2, json.order[foe2_pos]);
        this.table = new table_1.Table(deck[0]);
        console.log(this.players);
    };
    Game.prototype.getHand = function (deck, pos, player_id) {
        var hand = [];
        for (var k = pos * 10; k < 9 + (pos * 10); ++k) {
            var card = deck[k];
            card.isOnHand = true;
            card.player_id = player_id;
            hand.push(card);
        }
        return hand;
    };
    Game.prototype.getPlayer = function (json, id) {
        var player = null;
        for (var i = 0; i < 2; ++i) {
            if (json.team1[i].id == id) {
                player = { id: json.team1[i].id, avatar: json.team1[i].avatar, username: json.team1[i].username, team: 1, team_pos: i };
            }
            else if (json.team2[i].id == id) {
                player = { id: json.team2[i].id, avatar: json.team2[i].avatar, username: json.team2[i].username, team: 2, team_pos: i };
            }
        }
        return player;
    };
    Game.prototype.createGamePlayer = function (deck, json, i, player_type, id) {
        var player = this.getPlayer(json, id);
        var p = new gamePlayer_1.GamePlayer(player_type, player.avatar, player.username, player.id, player.team, player.team_pos);
        p.hand = this.getHand(deck, i, p.id);
        this.players[i] = p;
    };
    Game.prototype.getHandCards = function (type) {
        for (var i = 0; i < 4; ++i) {
            if (this.players[i].type == type) {
                return this.players[i].hand;
            }
        }
        return null;
    };
    Game.prototype.getTableCard = function (type) {
        for (var i = 0; i < 4; ++i) {
            if (this.players[i].type == type) {
                return this.players[i].tableCard;
            }
        }
        return null;
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map