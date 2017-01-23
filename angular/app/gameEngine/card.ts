export enum TypeCard {
    Ace,//0
    Two,//1
    Three,//2
    Four,//3
    Five,//4
    Six,//5
    Seven,//6
    Jack,//7
    Queen,//8
    King,//9
}

export enum SuitType{
	Hearts,
	Spades,
	Clubs,
	Diamonds
}


export class Card{

	public id:number;
  public ctype : TypeCard;
	public stype: SuitType;
  public isOnHand: boolean;
  public isOnTable : boolean;
  public isUsed: boolean;
  public player_id: string;
  public isFirstTrump: boolean;
  public imgUrl : string;


	public constructor (id:number, type: number, suit: number, isOnHand: boolean, isOnTable: boolean,isUsed: boolean, player_id: string, isFirstTrump: boolean){
       this.id = id;
       this.isOnHand = isOnHand;
       this.isUsed = isUsed;
       this.isOnTable = isOnTable;
       this.player_id = player_id;
       this.isFirstTrump = isFirstTrump;

       switch (suit) {
         case 0: this.stype = SuitType.Hearts;
         this.imgUrl = "/img/cards/c";
         break;
         case 1: this.stype = SuitType.Spades;
         this.imgUrl = "/img/cards/e";
         break;
         case 2: this.stype = SuitType.Clubs;
         this.imgUrl = "/img/cards/p";
         break;
         case 3: this.stype = SuitType.Diamonds;
         this.imgUrl = "/img/cards/o";
         break;
       }
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
       if(this.ctype <= 6){
          this.imgUrl += (this.ctype+1)+'.png';
       }else{
          this.imgUrl += (this.ctype+4)+'.png';
       }
       
     console.log(this.imgUrl+' '+this.id);
    }
}