"use strict";
var card_1 = require("./card");
var gamePlayer_1 = require("./gamePlayer");
var Game = (function () {
    function Game(json) {
        this.players = [null, null, null, null];
        this.initializeGame(json);
        this.jsonGame = json;
        this.isMyTurn = false;
        this.roundHasEnded = false;
    }
    Game.prototype.initializeGame = function (json) {
        var deck = [];
        var my_team = 0;
        var my_id = sessionStorage.getItem('id');
        var my_order = 0;
        for (var i = 0; i < 40; ++i) {
            deck.splice(i, 0, this.jsonToCard(json.pack.cards[i], i, null));
        }
        deck[0].isFirstTrump = true;
        this.TrumpSuit = deck[0].stype;
        //create myself
        for (var i = 0; i < json.basicOrder.length; ++i) {
            if (json.basicOrder[i] == my_id) {
                this.createGamePlayer(deck, json, i, gamePlayer_1.PlayerType.Me, json.basicOrder[i]);
                my_order = i;
            }
        }
        //generate the rest
        var pos;
        pos = (my_order - 2 < 0 ? my_order + 2 : my_order - 2);
        this.createGamePlayer(deck, json, pos, gamePlayer_1.PlayerType.Friend, json.basicOrder[pos]);
        pos = (my_order + 1 > 3 ? 0 : my_order + 1);
        this.createGamePlayer(deck, json, pos, gamePlayer_1.PlayerType.Foe1, json.basicOrder[pos]);
        pos = (my_order - 1 < 0 ? 3 : my_order - 1);
        this.createGamePlayer(deck, json, pos, gamePlayer_1.PlayerType.Foe2, json.basicOrder[pos]);
        // final setup
        this.myTurnNumber = my_order;
        this.onTurn = 0;
        this.lastToPlay = 3;
        this.isFirst = (this.onTurn == this.myTurnNumber);
        this.firstToPlay = 0;
        this.isMyTurn = this.isFirst;
    };
    Game.prototype.getHand = function (deck, pos, player_id) {
        var hand = [];
        for (var k = pos * 10; k < 10 + (pos * 10); ++k) {
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
    // game functions
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
    Game.prototype.played = function (pos, card) {
        this.players[pos].updateCard(card);
    };
    Game.prototype.play = function (pos) {
        this.onTurn = pos;
    };
    Game.prototype.getPlayedCard = function (pos) {
        return this.players[pos].tableCard;
    };
    Game.prototype.playCard = function (pos) {
        if (this.myTurnNumber == this.onTurn) {
            this.players[this.myTurnNumber].playCard(pos);
            this.isMyTurn = false;
            if (this.myTurnNumber == this.lastToPlay) {
                this.checkGameRound();
            }
        }
    };
    Game.prototype.checkGameRound = function () {
        //check if there is a trump
        var trumpCardWinner = null;
        var cardWinner = null;
        var winnerTrump;
        var winnerCard;
        var winnerTeamNumber;
        var winnerTeamPosNumber;
        var suit = this.players[this.firstToPlay].tableCard.stype;
        for (var i = 0; i < this.players.length; ++i) {
            var card = this.players[i].tableCard;
            if (card.stype == this.TrumpSuit) {
                if (trumpCardWinner == null) {
                    trumpCardWinner = card;
                    winnerTrump = i;
                }
                else if (trumpCardWinner.ctype < card.ctype) {
                    trumpCardWinner = card;
                    winnerTrump = i;
                }
            }
            else {
                if (cardWinner == null) {
                    if (card.stype == suit) {
                        cardWinner = card;
                        winnerCard = i;
                    }
                }
                else if (cardWinner.ctype < card.ctype && card.stype == suit) {
                    cardWinner = card;
                    winnerCard = i;
                }
            }
        }
        for (var i = 0; i < this.players.length; ++i) {
            var player = this.players[i];
            var renounce = false;
            if (player.tableCard.stype != this.TrumpSuit && player.tableCard.stype != suit) {
                for (var j = 0; j < player.hand.length; ++j) {
                    if (player.hand[j].stype == this.TrumpSuit || player.hand[j].stype == suit)
                        renounce = true;
                }
            }
            if (renounce) {
                if (player.team == 1) {
                    this.jsonGame.renounce1 = true;
                }
                else {
                    this.jsonGame.renounce2 = true;
                }
            }
        }
        if (trumpCardWinner != null) {
            //add cards 
            this.winHand(winnerTrump);
            this.firstToPlay = winnerTrump;
            winnerTeamNumber = this.players[winnerTrump].team;
            winnerTeamPosNumber = this.players[winnerTrump].team_pos;
        }
        else {
            this.winHand(winnerCard);
            this.firstToPlay = winnerCard;
            winnerTeamNumber = this.players[winnerCard].team;
            winnerTeamPosNumber = this.players[winnerCard].team_pos;
        }
        console.log('set toundhasEnded = true');
        this.roundHasEnded = true;
        this.lastToPlay = (this.firstToPlay - 1 < 0 ? 3 : this.firstToPlay - 1);
        console.log(this.firstToPlay + ' ' + this.lastToPlay);
        this.updateJsonGame();
    };
    Game.prototype.winHand = function (winnerPos) {
        for (var i = 0; i < this.players.length; ++i) {
            var card = this.players[i].tableCard;
            card.isUsed = true;
            card.isOnHand = false;
            card.isOnTable = false;
            this.players[winnerPos].stash.push(card);
        }
    };
    Game.prototype.updateJsonGame = function () {
        var pack = [];
        console.log(pack);
        console.log(this.jsonGame);
        for (var i = 0; i < this.players.length; ++i) {
            var player = this.players[i];
            for (var k = 0; k < player.hand.length; ++k) {
                pack.push(this.cardToJson(player.hand[k], player.id));
            }
            for (var k = 0; k < player.stash.length; ++k) {
                pack.push(this.cardToJson(player.stash[k], player.id));
            }
        }
        console.log(pack);
        this.jsonGame.pack = pack;
        for (var i = 0; i < 2; ++i) {
            this.jsonGame.team1[i].ready = false;
            this.jsonGame.team2[i].ready = false;
        }
    };
    Game.prototype.cardToJson = function (card, owner_id) {
        return { type: card.ctype, suit: card.stype, isOnHand: card.isOnHand, isOnTable: card.isOnTable, isUsed: card.isUsed, playerOwner: owner_id, isTrump: (card.stype == this.TrumpSuit), isFirstTrump: card.isFirstTrump };
    };
    Game.prototype.jsonToCard = function (card, i, owner) {
        return new card_1.Card(i, card.type, card.suit, card.isOnHand, card.isOnTable, card.isUsed, owner, card.isFirstTrump);
    };
    Game.prototype.update = function (json, response) {
        this.jsonGame = json.game;
        this.firstToPlay = response.firstToPlay;
        this.lastToPlay = response.lastToPlay;
        this.onTurn = this.firstToPlay;
        this.isMyTurn = this.myTurnNumber == this.firstToPlay;
        this.isFirst = this.isMyTurn;
        this.roundHasEnded = false;
        console.log(this.isFirst);
        console.log(this.isMyTurn);
        console.log(this.onTurn);
        console.log(this.lastToPlay);
        console.log(this.firstToPlay);
        for (var i = 0; i < this.players.length; ++i) {
            var player = this.players[i];
            var hand = [];
            var stash = [];
            for (var k = 0; k < json.pack.length; ++k) {
                var card = json.pack[k];
                if (card.playerOwner == player.id) {
                    if (card.isUsed == true) {
                        stash.push(this.jsonToCard(card, k, player.id));
                    }
                    else if (card.isOnHand == true) {
                        hand.push(this.jsonToCard(card, k, player.id));
                    }
                }
            }
            player.tableCard = null;
            player.stash = stash;
            player.hand = hand;
        }
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map