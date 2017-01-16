import {Card} from "./card";
import {Hand} from "./hand";
import {GamePlayer} from "./gamePlayer";
import {Table} from "./table";


export class Game{
	public players: GamePlayer[];
	public table: Table;


	public constructor(){
	this.players = [];
	this.table = new Table();
	players.push(new GamePlayer(PlayerType.Me));
	players.push(new GamePlayer(PlayerType.Friend));
	players.push(new GamePlayer(PlayerType.Foe1));
	players.push(new GamePlayer(PlayerType.Foe2));
	}
}