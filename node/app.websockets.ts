const io = require('socket.io');
const mongodb = require('mongodb');
import {databaseConnection as database} from './app.database';


export class WebSocketServer {
  public io: any;


  public init = (server: any) => {
    this.io = io.listen(server);            
    this.io.sockets.on('connection', (client: any) => {
      client.on('chat', (data) => this.io.emit('chat', data));


      client.on('players', function  (msgData) {

        this.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false, 
          hour: "numeric", 
          minute: "numeric",
          second: "numeric"}) + ': Welcome to Sueca (card game) Global Chat');

        this.broadcast.emit('players', new Date().toLocaleTimeString('en-US', { hour12: false, 
          hour: "numeric", 
          minute: "numeric",
          second: "numeric"}) +': ' + msgData.username +' has enter the chat');
      });

      client.on('chatGame', function (msgData) {
        this.join(msgData.game_id);
        this.emit('chatGame', new Date().toLocaleTimeString('en-US', { hour12: false, 
          hour: "numeric", 
          minute: "numeric",
          second: "numeric"})+ ': ' +msgData.username + ': ' + msgData.msg);
        this.to(msgData.game_id).emit('chatGame', new Date().toLocaleTimeString('en-US', { hour12: false, 
          hour: "numeric", 
          minute: "numeric",
          second: "numeric"})+ ': ' + msgData.username + ': ' + msgData.msg);

      });

      client.on('gameNotification', function (msgData) {
        this.join(msgData.game_id);
        this.emit('gameNotification', new Date().toLocaleTimeString('en-US', { hour12: false, 
          hour: "numeric", 
          minute: "numeric",
          second: "numeric"})  + ': '+msgData.username + ': Welcome to Game Room');
        this.broadcast.to(msgData.game_id).emit('gameNotification', new Date().toLocaleTimeString('en-US', { hour12: false, 
          hour: "numeric", 
          minute: "numeric",
          second: "numeric"})  + ': ' + msgData.username + ' has arrived');
      });

      client.on('gameLobby', (msgData) => {
        console.log('gameLobby');
        switch(msgData.msg){
          case 'join': this.joinGame(msgData, client);
          break;
          case 'switch': this.changeTeamGame(msgData, client);
          break;
          case 'leave': this.leaveGame(msgData, client);
          break;
        }
      });

      client.on('gamePlay', (msgData) => {
        console.log('gamePlay');
        console.log(msgData);
        switch (msgData.msg) {
          case "gameJoin": this.hand(msgData, client);
          break;  
          case "play": this.play(msgData,client);
          break;
          case 'try': this.tryPlay(msgData,client);
          break;
          case 'leave':
          break;
          case 'startRound': this.hand(msgData, client);
          this.responseGamePlay(msgData,client,{msg: 'update'});
          this.play(msgData,client);
          break;
          case 'update':
          this.hand(msgData, client);
          break;
        }

      });
    });
  };

  public responseGameLobby = (msgData : any , client : any, response : any) =>{
    console.log('response');
    client.join(msgData._id);
    let data : any;
    switch (response) {
      case 'changed':
      case 'joined':
      case 'left':
      data = {msg: 'update'};
      break;
      case 'start':
      data = {msg: 'start'};
      break;
      case 'full':
      data = {msg: 'leave'};
      break;
      case 'switch_fail':
      data = {msg: 'switch_fail'};
      break;
      case 'terminated':
      data = {msg: 'terminated'};
      break;
    }
    console.log(data);
    client.emit('gameLobby', data); 
    if(response != 'switch_fail')
      client.to(msgData._id).emit('gameLobby', data);
  };

  public responseGamePlay = (msgData : any , client : any, response : any) =>{
    console.log('responseGamePlay');
    console.log(response.msg);
    let data : any = null;
    switch (response.msg) {
      case 'hand':
      data = response;
      break;
      case 'play':
      data = response;
      break;
      case 'played':
      this.play(msgData,client);
      data = response;
      break;
      case 'wonRound':
      data = response;
      break;
      case 'wonGame':
      break;
      case 'update':
      data = response;
      break;
    }
    console.log(data);
    client.join(msgData._id);
    client.emit('gamePlay', data); 
    if(response.msg != 'hand')
      client.to(msgData._id).emit('gamePlay', data);
  };

  public notifyAll = (channel: string, message: any) => {
    this.io.sockets.emit(channel, message);
  };

  public joinGame = (msgData : any, client : any) =>{
    console.log('join Game');
    return database.db.collection('games')
    .findOne({
      _id: new mongodb.ObjectID(msgData._id)
    }).then(game => {
      if (game !== null && game.state == 'pending') {
        console.log('Game');
        var ableToJoin = false;
        var alreadyIn = false;

        for (i = 0; i < 2; ++i) {
          if(game.team1[i].id == null){
            ableToJoin = true;
          }
          if( game.team2[i].id == null){
            ableToJoin = true;
          }
          if(game.team1[i].id == msgData.player_id || game.team2[i].id == msgData.player_id){
            alreadyIn = true;
          }
        }
        if(ableToJoin && !alreadyIn){
          for(var i = 0; i < 2; i++){
            if(game.team1[i].id == null){
              game.team1[i].id = msgData.player_id;
              game.team1[i].avatar = msgData.player_avatar;
              game.team1[i].username = msgData.player_username;
              break;
            }
            if(game.team2[i].id == null){
              game.team2[i].id = msgData.player_id;
              game.team2[i].avatar = msgData.player_avatar;
              game.team2[i].username = msgData.player_username;
              break;
            }
          }
          game.count++;           
          if(game.count == 4){
            game.state = 'in Progress';

            var first_team = this.getRandomInt(1,2);  
            var first_pos = this.getRandomInt(0,1);
            var first;

            //selects the first player to play;
            if(first_team == 1){
              first = game.team1[first_pos].id;
            }else if(first_team == 2){
              first = game.team2[first_pos].id;
            } 

            // third player is first's friend
            game.basicOrder[0] = (first_team == 1 ?  game.team1[first_pos].id :  game.team2[first_pos].id);
            game.basicOrder[1] = (first_team == 1 ?( first_pos == 0 ? game.team2[1].id : game.team2[0].id) : ( first_pos == 0 ? game.team1[1].id : game.team1[0].id));
            game.basicOrder[2] = (first_team == 1 ?( first_pos == 0 ? game.team1[1].id : game.team1[0].id) : ( first_pos == 0 ? game.team2[1].id : game.team2[0].id));
            game.basicOrder[3] = (first_team == 1 ?( first_pos == 0 ? game.team2[0].id : game.team2[1].id) : ( first_pos == 0 ? game.team1[0].id : game.team1[1].id));

            game.pack = this.createCards();
            game.firstTrump = game.pack.cards[0];
            this.updateCards(0, game.pack.cards,game.basicOrder[0]);
            this.updateCards(1, game.pack.cards, game.basicOrder[1]);
            this.updateCards(2, game.pack.cards, game.basicOrder[2]);
            this.updateCards(3, game.pack.cards, game.basicOrder[3]);
          }
          console.log('after startGame');

          var game_id = game._id;
          delete game._id;
          database.db.collection('games')
          .updateOne({
            _id: game_id
          }, {
            $set: game
          })
          .then(result => {

            if(game.count == 4){
              this.responseGameLobby(msgData,client,'start');
            }else{
              this.responseGameLobby(msgData,client,'joined');
            }  
          })
          .catch(err => console.log(err.msg));
        }else if(alreadyIn){
          this.responseGameLobby(msgData,client,'joined');
        }else{
          this.responseGameLobby(msgData,client,'full');
        }
      }else{
        console.log('game not found or not on pending');
      }
    }).catch(err => console.log(err.msg)); 
  };

  public updateCards(pos:number , cards:any , owner: string){
    for (var i = 0; i < cards.length; ++i) {
      if( i >= pos * 10 && i < 10 +(pos*10)){
        cards[i].playerOwner = owner;
        cards[i].isOnHand = true;
      }
    }
    return cards;   
  }

  public changeTeamGame = (msgData:any , client : any) =>{
    database.db.collection('games')
    .findOne({
      _id: new mongodb.ObjectID(msgData._id)
    })
    .then(game => {
      if (game !== null) {
        var team = 0;
        for (var i = 0; i < 2; ++i) {
          if(game.team1[i].id == msgData.player_id){
            team = 1;
          }
          if( game.team2[i].id == msgData.player_id){
            team = 2;
          }
        }
        var isChanged = false;
        if(team === 1){
          for (var j = 0; j < 2; ++j) {
            if( game.team2[j].id == null){
              game.team2[j].id = msgData.player_id;
              isChanged = true;
              for (var l = 0; l < 2; ++l) {
                if(game.team1[l].id == msgData.player_id){
                  game.team1[l].id = null;
                }
              }
              j=0;
              break;
            }
          }
        }else if(team === 2){
          for (var k = 0; k < 2; ++k) {
            if( game.team1[k].id == null){
              game.team1[k].id = msgData.player_id;
              isChanged = true;
              for (var d = 0; d < 2; ++d) {
                if(game.team2[d].id == msgData.player_id){
                  game.team2[d].id = null;
                }
              }
              k = 0;
              break;
            }
          } 
        }

        if(isChanged){
          delete game._id;
          database.db.collection('games')
          .updateOne({
            _id: new mongodb.ObjectID(msgData._id)
          }, {
            $set: game
          })
          .then(result => {
            this.responseGameLobby(msgData,client,'changed');
          })
          .catch(err => console.log(err.msg)); 
        }else{

          this.responseGameLobby(msgData,client,'switch_fail');

        }  
      } else {          
        console.log('game not found');         
      }
    })
    .catch(err => console.log(err.msg));
  };

  public leaveGame =  (msgData:any , client : any) => {
    database.db.collection('games')
    .findOne({
      _id: new mongodb.ObjectID(msgData._id)
    })
    .then(game => {
      var ownerPresent = false;
      if (game !== null) {
        if(game.owner == msgData.player_id){
          ownerPresent = true;
          game.state = 'terminated';
        }else{
          ownerPresent = false;
          for (var i = 0; i < 2; ++i) {
            if(game.team1[i].id == msgData.player_id){
              game.team1[i].id = null;
            }
            if( game.team2[i].id == msgData.player_id){
              game.team2[i].id = null;
            }
          }
        }
        var count = 0;
        for (var i = 0; i < 2; ++i) {
          if(game.team1[i].id != null){
            count++;
          }
          if( game.team2[i].id != null){
            count++;
          }
        }
        game.count = count;
        delete game._id;
        database.db.collection('games')
        .updateOne({
          _id: new mongodb.ObjectID(msgData._id)
        }, {
          $set: game
        })
        .then(result => {
          if(ownerPresent){
            this.responseGameLobby(msgData,client,'terminated');
          }else{
            this.responseGameLobby(msgData,client,'left');
          }
        })
        .catch(err => console.log(err.msg));    
      } else {
        console.log('game not found');   
      }
    })
    .catch(err => console.log(err.msg));
  };

  public hand = (msgData:any, client : any) =>{
    console.log('hand');
    database.db.collection('games')
    .findOne({
      _id: new mongodb.ObjectID(msgData._id)
    })
    .then(game => {
      if (game != null){
        if(game.state == 'in Progress'){
          let me : any;
          let friend : any;
          let foe1 : any;
          let foe2 : any;
          let my_order : number;
          //create myself
          for (var i = 0; i < game.basicOrder.length; ++i) {
            if(game.basicOrder[i] == msgData.player_id){
              my_order = i;
              me = {cards : this.getHand(i,game.pack,game.basicOrder[i]), order : i};
              break;
            }
          }
          //rest
          let stash : any = [];
          let table : any = {me: game.table[my_order], friend: null, foe1: null, foe2: null};
          let pos : number;


          pos = ( my_order - 2 < 0 ? my_order + 2 : my_order - 2);
          friend = {cards: this.switchOtherHand(this.getHand(pos,game.pack,game.basicOrder[pos])), order : pos};
          table.friend = game.table[pos];
          pos = (my_order + 1 > 3 ? 0 : my_order + 1);
          foe1 = {cards: this.switchOtherHand(this.getHand(pos,game.pack,game.basicOrder[pos])), order : pos};
          table.foe1 = game.table[pos];
          pos = (my_order - 1 < 0 ? 3 : my_order - 1);
          foe2 = {cards: this.switchOtherHand(this.getHand(pos,game.pack,game.basicOrder[pos])), order : pos};
          table.foe2= game.table[pos];

          for (var i = 0; i < game.pack.cards.length; ++i) {
            let card = game.pack.cards[i];
            if(card.playerOwner == msgData.player_id && card.isUsed)
              stash.push(card);

          }
          this.responseGamePlay(msgData,client,{ msg : 'hand', me: me, friend: friend, foe1: foe1, foe2: foe2, stash: stash, table: table})

          if(game.onPlay == my_order)
            this.play(msgData,client);
        }
      }
    }).catch(err => console.log(err.msg));
  };

  public play = (msgData:any, client : any) =>{
    console.log('play');
    database.db.collection('games')
    .findOne({
      _id: new mongodb.ObjectID(msgData._id)
    })
    .then(game => {
      if (game != null){
        if(game.state == 'in Progress'){
          this.responseGamePlay(msgData,client,{ msg : 'play', _id : game._id, order : game.onPlay});
        }
      }
    }).catch(err => console.log(err.msg));
  };

  public tryPlay = (msgData:any, client : any) =>{
    console.log('tryPlay');
    database.db.collection('games')
    .findOne({
      _id: new mongodb.ObjectID(msgData._id)
    })
    .then(game => {
      if (game != null){
        let originalCard : any;
        let sentCard : any = msgData.card;
        let cardPos : number = -1;
        for (var i = 0; i < game.pack.cards.length; ++i) {
          if(game.pack.cards[i].id == msgData.card.id){
            originalCard = game.pack.cards[i];
            cardPos = i;
            break;
          }
        }
        if(originalCard.playerOwner == sentCard.playerOwner && originalCard.playerOwner == msgData.player_id 
          && originalCard.isOnHand && !originalCard.isUsed && !originalCard.isOnTable){
          this.playCard(msgData,game,cardPos,client);
      }
    }
  }).catch(err => console.log(err.msg));
  };

  private playCard = (msgData:any, game: any, cardPos:number ,client : any) =>{

    let sentCard : any = msgData.card;
    let my_order : number;
    for (var i = 0; i < game.basicOrder.length; ++i) {
      if(game.basicOrder[i] == msgData.player_id){
        my_order = i;
        break;
      }
    }

    game.pack.cards[cardPos].isOnTable = true;
    game.pack.cards[cardPos].isOnHand = false;
    game.pack.cards[cardPos].isUsed = false;
    game.table[my_order] = sentCard;
    let gameWon : boolean = false;
    let roundWon : boolean = false;
    let finalWinner : number = -1;

    //check win
    let player_pos : number = -1;
    for (var i = 0; i < game.basicOrder.length; ++i) {
      if(game.basicOrder[i] == msgData.player_id){
        player_pos = i;
        break;
      }
    }
    if(player_pos == game.lastToPlay){
      let gameSuit : number = game.table[game.firstToPlay].suit;
      let trumpSuit : number = game.pack.suitTrump;

      let winnerNormal : number = -1;
      let winnerTrump : number = -1;

      //check for renounce
      for (var i = 0; i < game.basicOrder.length; ++i) {
        if(game.table[i].suit != gameSuit){
          let hand : any = this.getHand(i, game.pack , game.basicOrder[i]);
          let team : number = this.getTeam(game, game.basicOrder[i]);
          let renounce : boolean = false;
          for (var k = 0; k < hand.length; ++k) {
            if(hand[k].suit == gameSuit)
              renounce = true;
          }
          if(renounce){
            if(team == 1)
              game.renounce1 = true;
            else if(team == 2)
              game.renounce2 = true;
          } 
        }
      }
      for (var i = 0; i < game.table.length; ++i) {
        let card = game.table[i];
        if(card.suit == gameSuit ){
          if(winnerNormal == -1){
            winnerNormal = i;
          }else if(game.table[winnerNormal].type < card.type){
            winnerNormal = i;
          }
        }else if(card.suit == trumpSuit){
          if(winnerTrump == -1){
            winnerNormal = i;
          }else if(game.table[winnerTrump].type < card.type){
            winnerTrump = i;
          }
        }
      }
      finalWinner = (winnerTrump != -1 ? winnerTrump : winnerNormal);
      roundWon = true;
      for (var i = 0; i < game.pack.cards; ++i) {
        let card = game.pack.cards[i];
        if(card.id == game.table[0]){
          card.playerOwner = game.baseOrder[finalWinner]
          card.isUsed = true;
          card.isOnHand = false;
          card.isOnTable = false;
          game.pack.cards[i] = card;
        }else if(card.id == game.table[1]){
          card.playerOwner = game.baseOrder[finalWinner]
          card.isUsed = true;
          card.isOnHand = false;
          card.isOnTable = false;
          game.pack.cards[i] = card;
        }else if(card.id == game.table[2]){
          card.playerOwner = game.baseOrder[finalWinner]
          card.isUsed = true;
          card.isOnHand = false;
          card.isOnTable = false;
          game.pack.cards[i] = card;
        }else if(card.id == game.table[3]){
          card.playerOwner = game.baseOrder[finalWinner]
          card.isUsed = true;
          card.isOnHand = false;
          card.isOnTable = false;
          game.pack.cards[i] = card;
        }
      }
      game.table = [null, null, null, null];
      game.onPlay = finalWinner;
      game.firstToPlay = finalWinner
      game.lastToPlay = ( finalWinner - 1 < 0 ? 3 : finalWinner - 1);
    }else{
      game.onPlay = (game.onPlay + 1 > 3 ? 0 : game.onPlay + 1);
    }
    //end check win
    delete game._id;
    database.db.collection('games')
    .updateOne({
      _id: new mongodb.ObjectID(msgData._id)
    }, {
      $set: game
    })
    .then(result => {
      this.responseGamePlay(msgData,client,{ msg : 'played', _id : game._id, order: player_pos ,card: sentCard});
      if(roundWon)
        this.responseGamePlay(msgData,client,{ msg : 'wonRound', _id : game._id, order : finalWinner});
    })
    .catch(err => console.log(err.msg));  
  }

  private getTeam(game:any , id:string) : number{
    let team : number;
    for (var i = 0; i < game.team1.length; ++i) {
      if(game.team1[i].id == id)
        team = 1;
      else if(game.team2[i].id == id)
        team = 2;
    }
    return team;
  }

  public switchOtherHand(hand: any){
    for (var i = 0; i < hand.length; ++i) {
      if(!hand[i].isFirstTrump)
        hand[i] = {dummy: true};
      else
        hand[i].dummy = false;
    }
    return hand;
  }

  public getHand(pos : number, pack:any , playerOwner : string){
    let hand : any = [];
    for (var k = pos * 10; k < 10 +(pos*10); ++k) {
      let card = pack.cards[k];
      if(card.isOnHand && !card.isOnTable && !card.isUsed && card.playerOwner == playerOwner)
        hand.push(card);
    }
    return hand;
  }

  public createCards() {
    var pack = {
      suitTrump: -1,
      cards : {}
    };
    var cards = [];
    let count : number = 0;
    for (var i = 0; i < 4; ++i) {
      for (var j = 0; j < 10; ++j) {
        cards.push({id: count,type:j , suit: i , isOnHand: false, isOnTable:false, isUsed: false, playerOwner: null, isFirstTrump: false});
        count++;
      }
    }
    cards = this.shuffleArray(cards);
    cards[0].isFirstTrump = true;
    pack.suitTrump =  cards[0].suit;
    pack.cards = cards;
    return pack;
  };

  public shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  public getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
};