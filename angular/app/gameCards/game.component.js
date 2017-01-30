"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var user_service_1 = require("../auth/user.service");
var game_service_1 = require("../gameCards/game.service");
var websocket_service_1 = require("../notifications/websocket.service");
var GameComponent = (function () {
    function GameComponent(websocketService, gameService, userService, router) {
        this.websocketService = websocketService;
        this.gameService = gameService;
        this.userService = userService;
        this.router = router;
        this.game_id = sessionStorage.getItem('game_id');
        this.player_id = sessionStorage.getItem('id');
        this.isMyTurn = false;
        this.isGameReady = false;
        this.message = 'Wait';
        this.me = { cards: null, order: null, tableCard: null, avatar: sessionStorage.getItem('avatar'), username: sessionStorage.getItem('username') };
        this.friend = { cards: null, order: null, tableCard: null, avatar: null, username: null };
        this.foe1 = { cards: null, order: null, tableCard: null, avatar: null, username: null };
        this.foe2 = { cards: null, order: null, tableCard: null, avatar: null, username: null };
    }
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.userService.isLoggedIn()) {
            this.router.navigate(['login']);
        }
        else {
            console.log(this.player_id);
            this.websocketService.sendGame({ _id: this.game_id, player_id: this.player_id, msg: 'gameJoin' });
            this.websocketService.subGame().subscribe(function (response) {
                console.log(response);
                switch (response.msg) {
                    case 'update':
                        _this.websocketService.sendGame({ _id: _this.game_id, player_id: _this.player_id, msg: 'update' });
                        break;
                    case 'hand':
                        _this.loadHands(response);
                        break;
                    case 'play':
                        _this.isMyTurn = (response.order == _this.me.order);
                        if (_this.isMyTurn)
                            _this.message = 'Play!';
                        else
                            _this.message = 'Wait';
                        break;
                    case 'played':
                        _this.loadPlayedCard(response);
                        break;
                    case 'wonRound':
                        _this.loadRoundWon(response);
                        break;
                    case 'gameEnded':
                        _this.loadGameHasEnded(response);
                        break;
                    case 'players':
                        _this.loadPlayers(response);
                        break;
                }
            }, function (error) {
                console.log(error.text());
            });
        }
    };
    GameComponent.prototype.ngOnDestroy = function () {
        this.websocketService.sendGame({ _id: this.game_id, player_id: this.player_id, msg: 'leave' });
        this.websocketService.unsubGame();
    };
    GameComponent.prototype.getGameId = function () {
        return this.game_id;
    };
    GameComponent.prototype.playCard = function (event) {
        if (this.isMyTurn) {
            var id = event.target.id;
            var card = void 0;
            for (var i = 0; i < this.me.cards.length; ++i) {
                if (this.me.cards[i].id == id)
                    card = this.me.cards[i];
            }
            if (card != null)
                this.websocketService.sendGame({ _id: this.game_id, player_id: this.player_id, msg: 'try', card: card });
        }
    };
    GameComponent.prototype.loadPlayers = function (response) {
        this.friend.avatar = response.friend.avatar;
        this.friend.username = response.friend.username;
        this.foe1.avatar = response.foe1.avatar;
        this.foe1.username = response.foe1.username;
        this.foe2.avatar = response.foe2.avatar;
        this.foe2.username = response.foe2.username;
    };
    GameComponent.prototype.loadHands = function (response) {
        this.me.cards = this.loadMyCard(response.me.cards);
        this.me.order = response.me.order;
        this.me.tableCard = this.cardToImage(response.table.me);
        this.friend.cards = this.loadOthersHand(response.friend.cards);
        this.friend.order = response.friend.order;
        this.friend.tableCard = this.cardToImage(response.table.friend);
        this.foe1.cards = this.loadOthersHand(response.foe1.cards);
        this.foe1.order = response.foe1.order;
        this.foe1.tableCard = this.cardToImage(response.table.foe1);
        this.foe2.cards = this.loadOthersHand(response.foe2.cards);
        this.foe2.order = response.foe2.order;
        this.foe2.tableCard = this.cardToImage(response.table.foe2);
        this.isGameReady = true;
    };
    GameComponent.prototype.loadRoundWon = function (response) {
        var _this = this;
        if (response.order == this.me.order) {
            this.message = 'you won the round !!!';
            setTimeout(function () {
                _this.websocketService.sendGame({ _id: _this.game_id, player_id: _this.player_id, msg: 'startRound' });
            }, 4000);
        }
        else {
            this.message = response.order + ' won the round !!!';
            console.log(this.message);
        }
    };
    GameComponent.prototype.loadPlayedCard = function (response) {
        console.log(response);
        if (this.me.order == response.order) {
            this.me.tableCard = response.card;
            this.message = 'Wait!';
        }
        if (this.friend.order == response.order) {
            this.friend.tableCard = response.card;
        }
        if (this.foe1.order == response.order) {
            this.foe1.tableCard = response.card;
        }
        if (this.foe2.order == response.order) {
            this.foe2.tableCard = response.card;
        }
        this.clearPlayedCard(response);
    };
    GameComponent.prototype.loadGameHasEnded = function (response) {
        var _this = this;
        if (response.isDraw) {
            this.message = 'Draw !!';
        }
        else {
            if ((response.players[response.winner1].username == this.me.username && response.players[response.winner2].username == this.friend.username)
                || (response.players[response.winner2].username == this.me.username && response.players[response.winner1].username == this.friend.username)) {
                this.message = 'You Won!!! Points:' + response.points;
            }
            else {
                this.message = 'You Lost!!! Points:' + response.points;
            }
        }
        setTimeout(function () {
            _this.router.navigate(['dashboard']);
        }, 3000);
    };
    GameComponent.prototype.clearPlayedCard = function (response) {
        if (response.order == this.me.order) {
            var pos = -1;
            for (var i = 0; i < this.me.cards.length; ++i) {
                if (this.me.cards[i].id == response.card.id)
                    pos = i;
            }
            if (pos != -1) {
                this.me.cards.splice(pos, 1);
            }
        }
        else {
            if (response.order == this.friend.order) {
                var pos = this.getCardPos(this.friend.cards, response.card);
                if (pos != -1) {
                    this.friend.cards.splice(pos, 1);
                }
            }
            else if (response.order == this.foe1.order) {
                var pos = this.getCardPos(this.foe1.cards, response.card);
                if (pos != -1) {
                    this.foe1.cards.splice(pos, 1);
                }
            }
            else if (response.order == this.foe2.order) {
                var pos = this.getCardPos(this.foe2.cards, response.card);
                if (pos != -1) {
                    this.foe2.cards.splice(pos, 1);
                }
            }
        }
    };
    GameComponent.prototype.getCardPos = function (cards, card) {
        var pos = -1;
        for (var i = 0; i < cards.length; ++i) {
            if (card.isFirstTrump) {
                if (cards[i].isFirstTrump && cards[i].id == card.id) {
                    pos = i;
                    break;
                }
            }
            else {
                if (cards[i].dummy) {
                    pos = i;
                    break;
                }
            }
        }
        console.log(pos);
        return pos;
    };
    GameComponent.prototype.loadMyCard = function (cards) {
        var array = [];
        for (var i = 0; i < cards.length; ++i) {
            array.push(this.cardToImage(cards[i]));
        }
        return array;
    };
    GameComponent.prototype.loadOthersHand = function (cards) {
        var array = [];
        for (var i = 0; i < cards.length; ++i) {
            if (cards[i].dummy)
                array.push({ imgUrl: '/img/cards/semFace.png' });
            else
                array.push(this.cardToImage(cards[i]));
        }
        return array;
    };
    GameComponent.prototype.cardToImage = function (card) {
        if (card != null) {
            switch (card.suit) {
                case 0:
                    card.imgUrl = "/img/cards/c";
                    break;
                case 1:
                    card.imgUrl = "/img/cards/e";
                    break;
                case 2:
                    card.imgUrl = "/img/cards/p";
                    break;
                case 3:
                    card.imgUrl = "/img/cards/o";
                    break;
            }
            if (card.type <= 4) {
                card.imgUrl += (card.type + 2) + '.png';
            }
            else if (card.type <= 7) {
                card.imgUrl += (card.type + 6) + '.png';
            }
            else if (card.type == 9) {
                card.imgUrl += 1 + '.png';
            }
            else if (card.type == 8) {
                card.imgUrl += 7 + '.png';
            }
        }
        return card;
    };
    return GameComponent;
}());
GameComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'game-playing',
        templateUrl: 'game.component.html',
        styleUrls: ['../gameCards/game.component.css']
    }),
    __metadata("design:paramtypes", [websocket_service_1.WebSocketService, game_service_1.GameService, user_service_1.UserService, router_1.Router])
], GameComponent);
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map