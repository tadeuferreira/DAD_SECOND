"use strict";
var io = require('socket.io');
var mongodb = require('mongodb');
var app_database_1 = require("./app.database");
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.init = function (server) {
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (client) {
                client.on('chat', function (data) { return _this.io.emit('chat', data); });
                client.on('players', function (msgData) {
                    this.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': Welcome to Sueca (card game) Global Chat');
                    this.broadcast.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ' has enter the chat');
                });
                client.on('chatGame', function (msgData) {
                    this.join(msgData.game_id);
                    this.emit('chatGame', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ': ' + msgData.msg);
                    this.to(msgData.game_id).emit('chatGame', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ': ' + msgData.msg);
                });
                client.on('gameNotification', function (msgData) {
                    this.join(msgData.game_id);
                    this.emit('gameNotification', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ': Welcome to Game Room');
                    this.broadcast.to(msgData.game_id).emit('gameNotification', new Date().toLocaleTimeString('en-US', { hour12: false,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric" }) + ': ' + msgData.username + ' has arrived');
                });
                client.on('gameLobby', function (msgData) {
                    console.log('gameLobby');
                    switch (msgData.msg) {
                        case 'join':
                            _this.joinGame(msgData, client);
                            break;
                        case 'switch':
                            _this.changeTeamGame(msgData, client);
                            break;
                        case 'leave':
                            _this.leaveGame(msgData, client);
                            break;
                    }
                });
                client.on('gamePlay', function (msgData) {
                    console.log('gamePlay');
                    console.log(msgData);
                    switch (msgData.msg) {
                        case "gameJoin":
                            _this.hand(msgData, client);
                            break;
                        case "play":
                            _this.play(msgData, client);
                            break;
                        case 'try':
                            _this.tryPlay(msgData, client);
                            break;
                        case 'leave':
                            break;
                        case 'startRound':
                            _this.hand(msgData, client);
                            _this.responseGamePlay(msgData, client, { msg: 'update' });
                            _this.play(msgData, client);
                            break;
                        case 'update':
                            _this.hand(msgData, client);
                            break;
                    }
                });
            });
        };
        this.responseGameLobby = function (msgData, client, response) {
            console.log('response');
            client.join(msgData._id);
            var data;
            switch (response) {
                case 'changed':
                case 'joined':
                case 'left':
                    data = { msg: 'update' };
                    break;
                case 'start':
                    data = { msg: 'start' };
                    break;
                case 'full':
                    data = { msg: 'leave' };
                    break;
                case 'switch_fail':
                    data = { msg: 'switch_fail' };
                    break;
                case 'terminated':
                    data = { msg: 'terminated' };
                    break;
            }
            console.log(data);
            client.emit('gameLobby', data);
            if (response != 'switch_fail')
                client.to(msgData._id).emit('gameLobby', data);
        };
        this.responseGamePlay = function (msgData, client, response) {
            console.log('responseGamePlay');
            console.log(response.msg);
            var data = null;
            switch (response.msg) {
                case 'hand':
                    data = response;
                    break;
                case 'play':
                    data = response;
                    break;
                case 'played':
                    _this.play(msgData, client);
                    data = response;
                    break;
                case 'wonRound':
                    data = response;
                    break;
                case 'wonGame':
                    break;
                case 'update':
                    data = response;
                    break;
            }
            console.log(data);
            client.join(msgData._id);
            client.emit('gamePlay', data);
            if (response.msg != 'hand')
                client.to(msgData._id).emit('gamePlay', data);
        };
        this.notifyAll = function (channel, message) {
            _this.io.sockets.emit(channel, message);
        };
        this.joinGame = function (msgData, client) {
            console.log('join Game');
            return app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(msgData._id)
            }).then(function (game) {
                if (game !== null && game.state == 'pending') {
                    console.log('Game');
                    var ableToJoin = false;
                    var alreadyIn = false;
                    for (i = 0; i < 2; ++i) {
                        if (game.team1[i].id == null) {
                            ableToJoin = true;
                        }
                        if (game.team2[i].id == null) {
                            ableToJoin = true;
                        }
                        if (game.team1[i].id == msgData.player_id || game.team2[i].id == msgData.player_id) {
                            alreadyIn = true;
                        }
                    }
                    if (ableToJoin && !alreadyIn) {
                        for (var i = 0; i < 2; i++) {
                            if (game.team1[i].id == null) {
                                game.team1[i].id = msgData.player_id;
                                game.team1[i].avatar = msgData.player_avatar;
                                game.team1[i].username = msgData.player_username;
                                break;
                            }
                            if (game.team2[i].id == null) {
                                game.team2[i].id = msgData.player_id;
                                game.team2[i].avatar = msgData.player_avatar;
                                game.team2[i].username = msgData.player_username;
                                break;
                            }
                        }
                        game.count++;
                        if (game.count == 4) {
                            game.state = 'in Progress';
                            var first_team = _this.getRandomInt(1, 2);
                            var first_pos = _this.getRandomInt(0, 1);
                            var first;
                            //selects the first player to play;
                            if (first_team == 1) {
                                first = game.team1[first_pos].id;
                            }
                            else if (first_team == 2) {
                                first = game.team2[first_pos].id;
                            }
                            // third player is first's friend
                            game.basicOrder[0] = (first_team == 1 ? game.team1[first_pos].id : game.team2[first_pos].id);
                            game.basicOrder[1] = (first_team == 1 ? (first_pos == 0 ? game.team2[1].id : game.team2[0].id) : (first_pos == 0 ? game.team1[1].id : game.team1[0].id));
                            game.basicOrder[2] = (first_team == 1 ? (first_pos == 0 ? game.team1[1].id : game.team1[0].id) : (first_pos == 0 ? game.team2[1].id : game.team2[0].id));
                            game.basicOrder[3] = (first_team == 1 ? (first_pos == 0 ? game.team2[0].id : game.team2[1].id) : (first_pos == 0 ? game.team1[0].id : game.team1[1].id));
                            game.pack = _this.createCards();
                            game.firstTrump = game.pack.cards[0];
                            _this.updateCards(0, game.pack.cards, game.basicOrder[0]);
                            _this.updateCards(1, game.pack.cards, game.basicOrder[1]);
                            _this.updateCards(2, game.pack.cards, game.basicOrder[2]);
                            _this.updateCards(3, game.pack.cards, game.basicOrder[3]);
                        }
                        console.log('after startGame');
                        var game_id = game._id;
                        delete game._id;
                        app_database_1.databaseConnection.db.collection('games')
                            .updateOne({
                            _id: game_id
                        }, {
                            $set: game
                        })
                            .then(function (result) {
                            if (game.count == 4) {
                                _this.responseGameLobby(msgData, client, 'start');
                            }
                            else {
                                _this.responseGameLobby(msgData, client, 'joined');
                            }
                        })
                            .catch(function (err) { return console.log(err.msg); });
                    }
                    else if (alreadyIn) {
                        _this.responseGameLobby(msgData, client, 'joined');
                    }
                    else {
                        _this.responseGameLobby(msgData, client, 'full');
                    }
                }
                else {
                    console.log('game not found or not on pending');
                }
            }).catch(function (err) { return console.log(err.msg); });
        };
        this.changeTeamGame = function (msgData, client) {
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(msgData._id)
            })
                .then(function (game) {
                if (game !== null) {
                    var team = 0;
                    for (var i = 0; i < 2; ++i) {
                        if (game.team1[i].id == msgData.player_id) {
                            team = 1;
                        }
                        if (game.team2[i].id == msgData.player_id) {
                            team = 2;
                        }
                    }
                    var isChanged = false;
                    if (team === 1) {
                        for (var j = 0; j < 2; ++j) {
                            if (game.team2[j].id == null) {
                                game.team2[j].id = msgData.player_id;
                                isChanged = true;
                                for (var l = 0; l < 2; ++l) {
                                    if (game.team1[l].id == msgData.player_id) {
                                        game.team1[l].id = null;
                                    }
                                }
                                j = 0;
                                break;
                            }
                        }
                    }
                    else if (team === 2) {
                        for (var k = 0; k < 2; ++k) {
                            if (game.team1[k].id == null) {
                                game.team1[k].id = msgData.player_id;
                                isChanged = true;
                                for (var d = 0; d < 2; ++d) {
                                    if (game.team2[d].id == msgData.player_id) {
                                        game.team2[d].id = null;
                                    }
                                }
                                k = 0;
                                break;
                            }
                        }
                    }
                    if (isChanged) {
                        delete game._id;
                        app_database_1.databaseConnection.db.collection('games')
                            .updateOne({
                            _id: new mongodb.ObjectID(msgData._id)
                        }, {
                            $set: game
                        })
                            .then(function (result) {
                            _this.responseGameLobby(msgData, client, 'changed');
                        })
                            .catch(function (err) { return console.log(err.msg); });
                    }
                    else {
                        _this.responseGameLobby(msgData, client, 'switch_fail');
                    }
                }
                else {
                    console.log('game not found');
                }
            })
                .catch(function (err) { return console.log(err.msg); });
        };
        this.leaveGame = function (msgData, client) {
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(msgData._id)
            })
                .then(function (game) {
                var ownerPresent = false;
                if (game !== null) {
                    if (game.owner == msgData.player_id) {
                        ownerPresent = true;
                        game.state = 'terminated';
                    }
                    else {
                        ownerPresent = false;
                        for (var i = 0; i < 2; ++i) {
                            if (game.team1[i].id == msgData.player_id) {
                                game.team1[i].id = null;
                            }
                            if (game.team2[i].id == msgData.player_id) {
                                game.team2[i].id = null;
                            }
                        }
                    }
                    var count = 0;
                    for (var i = 0; i < 2; ++i) {
                        if (game.team1[i].id != null) {
                            count++;
                        }
                        if (game.team2[i].id != null) {
                            count++;
                        }
                    }
                    game.count = count;
                    delete game._id;
                    app_database_1.databaseConnection.db.collection('games')
                        .updateOne({
                        _id: new mongodb.ObjectID(msgData._id)
                    }, {
                        $set: game
                    })
                        .then(function (result) {
                        if (ownerPresent) {
                            _this.responseGameLobby(msgData, client, 'terminated');
                        }
                        else {
                            _this.responseGameLobby(msgData, client, 'left');
                        }
                    })
                        .catch(function (err) { return console.log(err.msg); });
                }
                else {
                    console.log('game not found');
                }
            })
                .catch(function (err) { return console.log(err.msg); });
        };
        this.hand = function (msgData, client) {
            console.log('hand');
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(msgData._id)
            })
                .then(function (game) {
                if (game != null) {
                    if (game.state == 'in Progress') {
                        var me = void 0;
                        var friend = void 0;
                        var foe1 = void 0;
                        var foe2 = void 0;
                        var my_order = void 0;
                        //create myself
                        for (var i = 0; i < game.basicOrder.length; ++i) {
                            if (game.basicOrder[i] == msgData.player_id) {
                                my_order = i;
                                me = { cards: _this.getHand(i, game.pack, game.basicOrder[i]), order: i };
                                break;
                            }
                        }
                        //rest
                        var stash = [];
                        var table = { me: game.table[my_order], friend: null, foe1: null, foe2: null };
                        var pos = void 0;
                        pos = (my_order - 2 < 0 ? my_order + 2 : my_order - 2);
                        friend = { cards: _this.switchOtherHand(_this.getHand(pos, game.pack, game.basicOrder[pos])), order: pos };
                        table.friend = game.table[pos];
                        pos = (my_order + 1 > 3 ? 0 : my_order + 1);
                        foe1 = { cards: _this.switchOtherHand(_this.getHand(pos, game.pack, game.basicOrder[pos])), order: pos };
                        table.foe1 = game.table[pos];
                        pos = (my_order - 1 < 0 ? 3 : my_order - 1);
                        foe2 = { cards: _this.switchOtherHand(_this.getHand(pos, game.pack, game.basicOrder[pos])), order: pos };
                        table.foe2 = game.table[pos];
                        for (var i = 0; i < game.pack.cards.length; ++i) {
                            var card = game.pack.cards[i];
                            if (card.playerOwner == msgData.player_id && card.isUsed)
                                stash.push(card);
                        }
                        _this.responseGamePlay(msgData, client, { msg: 'hand', me: me, friend: friend, foe1: foe1, foe2: foe2, stash: stash, table: table });
                        if (game.onPlay == my_order)
                            _this.play(msgData, client);
                    }
                }
            }).catch(function (err) { return console.log(err.msg); });
        };
        this.play = function (msgData, client) {
            console.log('play');
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(msgData._id)
            })
                .then(function (game) {
                if (game != null) {
                    if (game.state == 'in Progress') {
                        _this.responseGamePlay(msgData, client, { msg: 'play', _id: game._id, order: game.onPlay });
                    }
                }
            }).catch(function (err) { return console.log(err.msg); });
        };
        this.tryPlay = function (msgData, client) {
            console.log('tryPlay');
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: new mongodb.ObjectID(msgData._id)
            })
                .then(function (game) {
                if (game != null) {
                    var originalCard = void 0;
                    var sentCard = msgData.card;
                    var cardPos = -1;
                    for (var i = 0; i < game.pack.cards.length; ++i) {
                        if (game.pack.cards[i].id == msgData.card.id) {
                            originalCard = game.pack.cards[i];
                            cardPos = i;
                            break;
                        }
                    }
                    if (originalCard.playerOwner == sentCard.playerOwner && originalCard.playerOwner == msgData.player_id
                        && originalCard.isOnHand && !originalCard.isUsed && !originalCard.isOnTable) {
                        _this.playCard(msgData, game, cardPos, client);
                    }
                }
            }).catch(function (err) { return console.log(err.msg); });
        };
        this.playCard = function (msgData, game, cardPos, client) {
            var sentCard = msgData.card;
            var my_order;
            for (var i = 0; i < game.basicOrder.length; ++i) {
                if (game.basicOrder[i] == msgData.player_id) {
                    my_order = i;
                    break;
                }
            }
            game.pack.cards[cardPos].isOnTable = true;
            game.pack.cards[cardPos].isOnHand = false;
            game.pack.cards[cardPos].isUsed = false;
            game.table[my_order] = sentCard;
            var gameWon = false;
            var roundWon = false;
            var finalWinner = -1;
            //check win
            var player_pos = -1;
            for (var i = 0; i < game.basicOrder.length; ++i) {
                if (game.basicOrder[i] == msgData.player_id) {
                    player_pos = i;
                    break;
                }
            }
            if (player_pos == game.lastToPlay) {
                var gameSuit = game.table[game.firstToPlay].suit;
                var trumpSuit = game.pack.suitTrump;
                var winnerNormal = -1;
                var winnerTrump = -1;
                //check for renounce
                for (var i = 0; i < game.basicOrder.length; ++i) {
                    if (game.table[i].suit != gameSuit) {
                        var hand = _this.getHand(i, game.pack, game.basicOrder[i]);
                        var team = _this.getTeam(game, game.basicOrder[i]);
                        var renounce = false;
                        for (var k = 0; k < hand.length; ++k) {
                            if (hand[k].suit == gameSuit)
                                renounce = true;
                        }
                        if (renounce) {
                            if (team == 1)
                                game.renounce1 = true;
                            else if (team == 2)
                                game.renounce2 = true;
                        }
                    }
                }
                for (var i = 0; i < game.table.length; ++i) {
                    var card = game.table[i];
                    if (card.suit == gameSuit) {
                        if (winnerNormal == -1) {
                            winnerNormal = i;
                        }
                        else if (game.table[winnerNormal].type < card.type) {
                            winnerNormal = i;
                        }
                    }
                    else if (card.suit == trumpSuit) {
                        if (winnerTrump == -1) {
                            winnerNormal = i;
                        }
                        else if (game.table[winnerTrump].type < card.type) {
                            winnerTrump = i;
                        }
                    }
                }
                finalWinner = (winnerTrump != -1 ? winnerTrump : winnerNormal);
                roundWon = true;
                for (var i = 0; i < game.pack.cards; ++i) {
                    var card = game.pack.cards[i];
                    if (card.id == game.table[0]) {
                        card.playerOwner = game.baseOrder[finalWinner];
                        card.isUsed = true;
                        card.isOnHand = false;
                        card.isOnTable = false;
                        game.pack.cards[i] = card;
                    }
                    else if (card.id == game.table[1]) {
                        card.playerOwner = game.baseOrder[finalWinner];
                        card.isUsed = true;
                        card.isOnHand = false;
                        card.isOnTable = false;
                        game.pack.cards[i] = card;
                    }
                    else if (card.id == game.table[2]) {
                        card.playerOwner = game.baseOrder[finalWinner];
                        card.isUsed = true;
                        card.isOnHand = false;
                        card.isOnTable = false;
                        game.pack.cards[i] = card;
                    }
                    else if (card.id == game.table[3]) {
                        card.playerOwner = game.baseOrder[finalWinner];
                        card.isUsed = true;
                        card.isOnHand = false;
                        card.isOnTable = false;
                        game.pack.cards[i] = card;
                    }
                }
                game.table = [null, null, null, null];
                game.onPlay = finalWinner;
                game.firstToPlay = finalWinner;
                game.lastToPlay = (finalWinner - 1 < 0 ? 3 : finalWinner - 1);
            }
            else {
                game.onPlay = (game.onPlay + 1 > 3 ? 0 : game.onPlay + 1);
            }
            //end check win
            delete game._id;
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: new mongodb.ObjectID(msgData._id)
            }, {
                $set: game
            })
                .then(function (result) {
                _this.responseGamePlay(msgData, client, { msg: 'played', _id: game._id, order: player_pos, card: sentCard });
                if (roundWon)
                    _this.responseGamePlay(msgData, client, { msg: 'wonRound', _id: game._id, order: finalWinner });
            })
                .catch(function (err) { return console.log(err.msg); });
        };
    }
    WebSocketServer.prototype.updateCards = function (pos, cards, owner) {
        for (var i = 0; i < cards.length; ++i) {
            if (i >= pos * 10 && i < 10 + (pos * 10)) {
                cards[i].playerOwner = owner;
                cards[i].isOnHand = true;
            }
        }
        return cards;
    };
    WebSocketServer.prototype.getTeam = function (game, id) {
        var team;
        for (var i = 0; i < game.team1.length; ++i) {
            if (game.team1[i].id == id)
                team = 1;
            else if (game.team2[i].id == id)
                team = 2;
        }
        return team;
    };
    WebSocketServer.prototype.switchOtherHand = function (hand) {
        for (var i = 0; i < hand.length; ++i) {
            if (!hand[i].isFirstTrump)
                hand[i] = { dummy: true };
            else
                hand[i].dummy = false;
        }
        return hand;
    };
    WebSocketServer.prototype.getHand = function (pos, pack, playerOwner) {
        var hand = [];
        for (var k = pos * 10; k < 10 + (pos * 10); ++k) {
            var card = pack.cards[k];
            if (card.isOnHand && !card.isOnTable && !card.isUsed && card.playerOwner == playerOwner)
                hand.push(card);
        }
        return hand;
    };
    WebSocketServer.prototype.createCards = function () {
        var pack = {
            suitTrump: -1,
            cards: {}
        };
        var cards = [];
        var count = 0;
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 10; ++j) {
                cards.push({ id: count, type: j, suit: i, isOnHand: false, isOnTable: false, isUsed: false, playerOwner: null, isFirstTrump: false });
                count++;
            }
        }
        cards = this.shuffleArray(cards);
        cards[0].isFirstTrump = true;
        pack.suitTrump = cards[0].suit;
        pack.cards = cards;
        return pack;
    };
    ;
    WebSocketServer.prototype.shuffleArray = function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };
    ;
    WebSocketServer.prototype.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    ;
    return WebSocketServer;
}());
exports.WebSocketServer = WebSocketServer;
;
