"use strict";
var TypeCard;
(function (TypeCard) {
    TypeCard[TypeCard["Two"] = 0] = "Two";
    TypeCard[TypeCard["Three"] = 1] = "Three";
    TypeCard[TypeCard["Four"] = 2] = "Four";
    TypeCard[TypeCard["Five"] = 3] = "Five";
    TypeCard[TypeCard["Six"] = 4] = "Six";
    TypeCard[TypeCard["Jack"] = 5] = "Jack";
    TypeCard[TypeCard["Queen"] = 6] = "Queen";
    TypeCard[TypeCard["King"] = 7] = "King";
    TypeCard[TypeCard["Seven"] = 8] = "Seven";
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
    function Card(id, type, suit, isOnHand, isOnTable, isUsed, player_id, isFirstTrump) {
        this.id = id;
        this.isOnHand = isOnHand;
        this.isUsed = isUsed;
        this.isOnTable = isOnTable;
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
        this.ctype = type;
        if (this.ctype <= 4) {
            this.imgUrl += (this.ctype + 2) + '.png';
        }
        else if (this.ctype <= 7) {
            this.imgUrl += (this.ctype + 6) + '.png';
        }
        else if (this.ctype == 9) {
            this.imgUrl += 1 + '.png';
        }
        else if (this.ctype == 8) {
            this.imgUrl += 7 + '.png';
        }
    }
    return Card;
}());
exports.Card = Card;
//# sourceMappingURL=card.js.map