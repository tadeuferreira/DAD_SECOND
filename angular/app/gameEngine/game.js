"use strict";
var card_1 = require("./card");
var hand_1 = require("./hand");
var gamePlayer_1 = require("./gamePlayer");
var Game = (function () {
    function Game(json) {
        console.log('help');
        this.players = [];
        this.initializeGame(json);
    }
    Game.prototype.initializeGame = function (json) {
        var first_id = json.first;
        var first_team;
        var first_pos;
        var deck = [];
        var i = 0;
        var my_team = 0;
        var my_pos = 0;
        console.log(json.pack);
        for (i = 0; i < 40; ++i) {
            deck.push(new card_1.Card(json.pack.cards[i].type, json.pack.cards[i].suit, json.pack.cards[i].isOnHand, json.pack.cards[i].isUsed, null, false));
        }
        deck[0].isFirstTrump = true;
        this.TrumpSuit = deck[0].suit;
        for (i = 0; i < 2; ++i) {
            if (json.team1[i].id == first_id) {
                first_team = 1;
                first_pos = i;
            }
            if (json.team2[i].id == first_id) {
                first_team = 2;
                first_pos = i;
            }
            if (json.team2[i].id == sessionStorage.getItem('id')) {
                my_team = 2;
                my_pos = i;
            }
            else if (json.team1[i].id == sessionStorage.getItem('id')) {
                my_team = 1;
                my_pos = i;
            }
        }
        var player_list = [];
        // third player is first's friend
        player_list.push(first_team == 1 ? this.getPlayer(json.team1[first_pos], 1, first_pos) : this.getPlayer(json.team2[first_pos], 2, first_pos));
        player_list.push(first_team == 1 ? (first_pos == 0 ? this.getPlayer(json.team2[1], 2, 1) : this.getPlayer(json.team2[0], 2, 0)) : (first_pos == 0 ? this.getPlayer(json.team1[1], 1, 1) : this.getPlayer(json.team1[0], 1, 0)));
        player_list.push(first_team == 1 ? (first_pos == 0 ? this.getPlayer(json.team1[1], 1, 1) : this.getPlayer(json.team1[0], 1, 0)) : (first_pos == 0 ? this.getPlayer(json.team2[1], 2, 1) : this.getPlayer(json.team2[0], 2, 0)));
        player_list.push(first_team == 1 ? (first_pos == 0 ? this.getPlayer(json.team2[0], 2, 0) : this.getPlayer(json.team2[1], 2, 1)) : (first_pos == 0 ? this.getPlayer(json.team1[0], 1, 0) : this.getPlayer(json.team1[1], 1, 1)));
        var me_pos = -1;
        var friend_pos = -1;
        for (i = 0; i < 4; ++i) {
            //me
            if (player_list[i].id == sessionStorage.getItem('id')) {
                this.createGamePlayer(deck, player_list, i, gamePlayer_1.PlayerType.Me);
                me_pos = i;
            }
            else if (player_list[i].team == my_team) {
                this.createGamePlayer(deck, player_list, i, gamePlayer_1.PlayerType.Friend);
                friend_pos = i;
            }
        }
        var foe1_pos = (me_pos + 1 > 3 ? 1 : me_pos + 1);
        var foe2_pos = (me_pos - 1 < 0 ? 3 : me_pos - 1);
        this.createGamePlayer(deck, player_list, foe1_pos, gamePlayer_1.PlayerType.Foe1);
        this.createGamePlayer(deck, player_list, foe2_pos, gamePlayer_1.PlayerType.Foe2);
        console.log(this.players);
    };
    Game.prototype.getHand = function (deck, pos, owner) {
        var hand = new hand_1.Hand();
        for (var k = pos * 10; k < 9 + (pos * 10); ++k) {
            var card = deck[k];
            card.isOnHand = true;
            card.playerOwner = owner;
            hand.cards.push(card);
        }
        return hand;
    };
    Game.prototype.getPlayer = function (player, team, pos) {
        return { id: player.id, avatar: player.avatar, username: player.username, team: team, team_pos: pos };
    };
    Game.prototype.createGamePlayer = function (deck, player_list, i, player_type) {
        var p = new gamePlayer_1.GamePlayer(player_type, player_list[i].avatar, player_list[i].username, player_list[i].id);
        p.hand = this.getHand(deck, i, p);
        this.players.push(p);
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map