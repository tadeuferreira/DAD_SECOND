"use strict";
var TypeCard;
(function (TypeCard) {
    TypeCard[TypeCard["Two"] = 0] = "Two";
    TypeCard[TypeCard["Three"] = 1] = "Three";
    TypeCard[TypeCard["Four"] = 2] = "Four";
    TypeCard[TypeCard["Five"] = 3] = "Five";
    TypeCard[TypeCard["Six"] = 4] = "Six";
    TypeCard[TypeCard["Seven"] = 5] = "Seven";
    TypeCard[TypeCard["Queen"] = 6] = "Queen";
    TypeCard[TypeCard["Jack"] = 7] = "Jack";
    TypeCard[TypeCard["King"] = 8] = "King";
    TypeCard[TypeCard["Ace"] = 9] = "Ace"; //9
})(TypeCard = exports.TypeCard || (exports.TypeCard = {}));
var SuitType;
(function (SuitType) {
    SuitType[SuitType["Hearts"] = 0] = "Hearts";
    SuitType[SuitType["Spades"] = 1] = "Spades";
    SuitType[SuitType["Clubs"] = 2] = "Clubs";
    SuitType[SuitType["Diamonds"] = 3] = "Diamonds";
})(SuitType = exports.SuitType || (exports.SuitType = {}));
var Card = (function () {
    function Card(type, suit, isOnHand, isUsed, player_id, isFirstTrump) {
        this.isOnHand = isOnHand;
        this.isUsed = isUsed;
        this.player_id = player_id;
        this.isFirstTrump = isFirstTrump;
        switch (type) {
            case 0:
                this.ctype = TypeCard.Two;
                break;
            case 1:
                this.ctype = TypeCard.Three;
                break;
            case 2:
                this.ctype = TypeCard.Four;
                break;
            case 3:
                this.ctype = TypeCard.Five;
                break;
            case 4:
                this.ctype = TypeCard.Six;
                break;
            case 5:
                this.ctype = TypeCard.Seven;
                break;
            case 6:
                this.ctype = TypeCard.Queen;
                break;
            case 7:
                this.ctype = TypeCard.Jack;
                break;
            case 8:
                this.ctype = TypeCard.King;
                break;
            case 9:
                this.ctype = TypeCard.Ace;
                break;
        }
        switch (suit) {
            case 0:
                this.stype = SuitType.Hearts;
                break;
            case 1:
                this.stype = SuitType.Spades;
                break;
            case 2:
                this.stype = SuitType.Clubs;
                break;
            case 3:
                this.stype = SuitType.Diamonds;
                break;
        }
    }
    return Card;
}());
exports.Card = Card;
//# sourceMappingURL=card.js.map