export enum TypeCard {
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

export enum SuitType{
	Hearts,
	Spades,
	Clubs,
	Diamonds
}


export class Card{

	public ctype : TypeCard;
	public stype: SuitType;
  public isOnHand: boolean;
  public isUsed: boolean;
  public player_id: string;
  public isFirstTrump: boolean;

	public constructor (type: number, suit: number, isOnHand: boolean, isUsed: boolean, player_id: string, isFirstTrump: boolean){
       this.isOnHand = isOnHand;
       this.isUsed = isUsed;
       this.player_id = player_id;
       this.isFirstTrump = isFirstTrump;
       switch (type) {
       	case 0: this.ctype = TypeCard.Two;
       	break;
       	case 1: this.ctype = TypeCard.Three;
       	break;
       	case 2: this.ctype = TypeCard.Four;
       	break;
       	case 3: this.ctype = TypeCard.Five;
       	break;
       	case 4: this.ctype = TypeCard.Six;
       	break;
       	case 5: this.ctype = TypeCard.Seven;
       	break;
       	case 6: this.ctype = TypeCard.Queen;
       	break;
       	case 7: this.ctype = TypeCard.Jack;
       	break;
       	case 8: this.ctype = TypeCard.King;
       	break;
       	case 9: this.ctype = TypeCard.Ace;
       	break;
       }
       switch (suit) {
       	case 0: this.stype = SuitType.Hearts;
       	break;
       	case 1: this.stype = SuitType.Spades;
       	break;
       	case 2: this.stype = SuitType.Clubs;
       	break;
       	case 3: this.stype = SuitType.Diamonds;
       	break;
       }
     
    }
}