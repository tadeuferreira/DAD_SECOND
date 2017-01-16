
export enum TypeCard {
    Hidden,
    Two,//0
    Three,//1
    Four,//2
    Five,//3
    Six,//4
    Seven,//5
    Queen,//6
    Jack,//7
    King,//8
    Ace//9
}

export enum Suit{
	Hidden,
	Hearts,
	Spades,
	Clubs,
	Diamonds
}


export class Card{

	public type : TypeCard;
	public suit: Suit;

	public constructor (type: number, suit: number){
       switch (type) {
       	case 0: this.type = TypeCard.Two;
       	break;
       	case 1: this.type = TypeCard.Three;
       	break;
       	case 2: this.type = TypeCard.Four;
       	break;
       	case 3: this.type = TypeCard.Five;
       	break;
       	case 4: this.type = TypeCard.Six;
       	break;
       	case 5: this.type = TypeCard.Seven;
       	break;
       	case 6: this.type = TypeCard.Queen;
       	break;
       	case 7: this.type = TypeCard.Jack;
       	break;
       	case 8: this.type = TypeCard.King;
       	break;
       	case 9: this.type = TypeCard.Ace;
       	break;
       	default: this.type = TypeCard.Hidden;
       	break;
       }
       switch (suit) {
       	case 0: this.suit = Suit.Hearts;
       	break;
       	case 1: this.suit = Suit.Spades;
       	break;
       	case 2: this.suit = Suit.Clubs;
       	break;
       	case 3: this.suit = Suit.Diamonds;
       	break;
       	default: this.suit = Suit.Hidden;
       	break;
       }


    }
}