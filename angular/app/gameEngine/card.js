"use strict";
var TypeCard;
(function (TypeCard) {
    TypeCard[TypeCard["Ace"] = 0] = "Ace";
    TypeCard[TypeCard["Two"] = 1] = "Two";
    TypeCard[TypeCard["Three"] = 2] = "Three";
    TypeCard[TypeCard["Four"] = 3] = "Four";
    TypeCard[TypeCard["Five"] = 4] = "Five";
    TypeCard[TypeCard["Six"] = 5] = "Six";
    TypeCard[TypeCard["Seven"] = 6] = "Seven";
    TypeCard[TypeCard["Jack"] = 7] = "Jack";
    TypeCard[TypeCard["Queen"] = 8] = "Queen";
    TypeCard[TypeCard["King"] = 9] = "King";
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
        switch (suit) {
            case 0:
                this.stype = SuitType.Hearts;
                this.imgUrl = "/img/cards/c";
                break;
            case 1:
                this.stype = SuitType.Spades;
                this.imgUrl = "/img/cards/e";
                break;
            case 2:
                this.stype = SuitType.Clubs;
                this.imgUrl = "/img/cards/p";
                break;
            case 3:
                this.stype = SuitType.Diamonds;
                this.imgUrl = "/img/cards/o";
                break;
        }
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
        if (this.ctype <= 6) {
            this.imgUrl += (this.ctype + 1) + '.png';
        }
        else {
            this.imgUrl += (this.ctype + 4) + '.png';
        }
    }
    return Card;
}());
exports.Card = Card;
//# sourceMappingURL=card.js.map