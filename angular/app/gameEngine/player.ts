export enum PlayerClass{
	owner,
	two,
	three,
	four
}

export class Player{

public type: PlayerClass;
public avatar: string;
public username: string;
public id: string;

public constructor(type: PlayerClass, avatar: string, username: string, id: string){
	this.type = type;
	this.avatar = avatar;
	this.username = username;
	this.id = id;
}
}