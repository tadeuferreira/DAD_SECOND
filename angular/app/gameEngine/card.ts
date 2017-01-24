export enum TypeCard {
    Two,//0
    Three,//1
    Four,//2
    Five,//3
    Six,//4
    Jack,//5
    Queen,//6
    King,//7
    Seven,//8
    Ace//9
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

       this.ctype = type;
       if(this.ctype <= 4){
          this.imgUrl += (this.ctype+2)+'.png';
       }else if(this.ctype <= 7 ){
          this.imgUrl += (this.ctype+6)+'.png';
       }else if(this.ctype == 9){
         this.imgUrl += 1+'.png';
       }else if(this.ctype == 8){
         this.imgUrl += 7+'.png';
       }
    }
}