"use strict";
var TypeCard;
(function (TypeCard) {
    TypeCard[TypeCard["Hidden"] = 0] = "Hidden";
    TypeCard[TypeCard["Two"] = 1] = "Two";
    TypeCard[TypeCard["Three"] = 2] = "Three";
    TypeCard[TypeCard["Four"] = 3] = "Four";
    TypeCard[TypeCard["Five"] = 4] = "Five";
    TypeCard[TypeCard["Six"] = 5] = "Six";
    TypeCard[TypeCard["Seven"] = 6] = "Seven";
    TypeCard[TypeCard["Queen"] = 7] = "Queen";
    TypeCard[TypeCard["Jack"] = 8] = "Jack";
    TypeCard[TypeCard["King"] = 9] = "King";
    TypeCard[TypeCard["Ace"] = 10] = "Ace"; //9
})(TypeCard = exports.TypeCard || (exports.TypeCard = {}));
var Suit;
(function (Suit) {
    Suit[Suit["Hidden"] = 0] = "Hidden";
    Suit[Suit["Hearts"] = 1] = "Hearts";
    Suit[Suit["Spades"] = 2] = "Spades";
    Suit[Suit["Clubs"] = 3] = "Clubs";
    Suit[Suit["Diamonds"] = 4] = "Diamonds";
})(Suit = exports.Suit || (exports.Suit = {}));
var Card = (function () {
    function Card(type, suit, isOnHand, isUsed, playerOwner, isFirstTrump) {
        this.isOnHand = isOnHand;
        this.isUsed = isUsed;
        this.playerOwner = playerOwner;
        this.isFirstTrump = isFirstTrump;
        switch (type) {
            case 0:
                this.type = TypeCard.Two;
                break;
            case 1:
                this.type = TypeCard.Three;
                break;
            case 2:
                this.type = TypeCard.Four;
                break;
            case 3:
                this.type = TypeCard.Five;
                break;
            case 4:
                this.type = TypeCard.Six;
                break;
            case 5:
                this.type = TypeCard.Seven;
                break;
            case 6:
                this.type = TypeCard.Queen;
                break;
            case 7:
                this.type = TypeCard.Jack;
                break;
            case 8:
                this.type = TypeCard.King;
                break;
            case 9:
                this.type = TypeCard.Ace;
                break;
            default:
                this.type = TypeCard.Hidden;
                break;
        }
        switch (suit) {
            case 0:
                this.suit = Suit.Hearts;
                break;
            case 1:
                this.suit = Suit.Spades;
                break;
            case 2:
                this.suit = Suit.Clubs;
                break;
            case 3:
                this.suit = Suit.Diamonds;
                break;
            default:
                this.suit = Suit.Hidden;
                break;
        }
    }
    return Card;
}());
exports.Card = Card;
//# sourceMappingURL=card.js.map