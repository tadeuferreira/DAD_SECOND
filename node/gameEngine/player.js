"use strict";
var PlayerClass;
(function (PlayerClass) {
    PlayerClass[PlayerClass["owner"] = 0] = "owner";
    PlayerClass[PlayerClass["two"] = 1] = "two";
    PlayerClass[PlayerClass["three"] = 2] = "three";
    PlayerClass[PlayerClass["four"] = 3] = "four";
})(PlayerClass = exports.PlayerClass || (exports.PlayerClass = {}));
var Player = (function () {
    function Player(type, avatar, username, id) {
        this.type = type;
        this.avatar = avatar;
        this.username = username;
        this.id = id;
    }
    return Player;
}());
exports.Player = Player;
