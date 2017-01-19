import {Card} from "./card";
import {Hand} from "./hand";
import {GamePlayer} from "./gamePlayer";
import {Table} from "./table";


export class Game{
	public players: GamePlayer[];
	public table: Table;


	public constructor(json: any){
	this.players = [];
	this.table = new Table();
	/*this.players.push(new GamePlayer(PlayerType.Me));
	this.players.push(new GamePlayer(PlayerType.Friend));
	this.players.push(new GamePlayer(PlayerType.Foe1));
	this.players.push(new GamePlayer(PlayerType.Foe2));*/
	}
}