
	/**
	window.onload = function () {
		
		canvas.canvasID('myCanvas');
		canvas.setDiv("can");
		canvas.setBgImage('/img/lane.jpg');
		
		for (i=1; i<7; i++)
		cards.setCard(i,"/img/00"+i+".png");
		
		
		players.setNum(4);
		
		players.setPlayer("Ana","/img/avatar1.ico");
		players.setPlayer("Tijana","/img/avatar2.png");
		players.setPlayer("Dusan","/img/avatar3.png");
		players.setPlayer("Aleksa","/img/avatar4.png");
		
		//system.load();
		
		
		
	};**/
	
	function setState(st){
		state=st;
	}
	
	window.onresize = function () {
			switch (state) {
				case GameState.IDLE:
					game.loadIdle();
					break;
				case GameState.STORYTELLER:
					game.loadStoryteller();
					break;
				case GameState.CHOOSING:
					game.loadChoosing();
					break;
				case GameState.VOTING:
					game.loadVoting();
					break;
				case GameState.UNCOVER:
					game.loadUncover();
					break;
				default:
			}
		//system.load();
	};
	
	$("#toggle1").click(function(){
    $("#chat").animate({
        height: 'toggle'
    });
	});  
	
	
	
	$("#sresult").click(function(){
		$("#results").removeClass('hidden');
		$("#game").addClass('hidden');
		$("#lobby").addClass('hidden');
		
	});	

	//*************************************************
	function startGame(cardArr, userArr, stindex){
		$("#game").removeClass('hidden');
		$("#results").addClass('hidden');
		$("#lobby").addClass('hidden');
		canvas.canvasID('myCanvas');
		canvas.setDiv("can");
		//canvas.setBgImage('/img/table.jpg');

		submitted.setNum(userArr.length);

		for (i=0; i<6; i++){
			if (cardArr[i]<10) cardArr[i]="/img/00"+cardArr[i]+".png";
			else if (cardArr[i]>=10 && cardArr[i]<100) cardArr[i]="/img/0"+cardArr[i]+".png";
			else cardArr[i]="/img/"+cardArr[i]+".png";

		}
	//	for (i=1; i<7; i++)
	//		submitted.setCard(i,cardArr[i-1]);

		for (i=1; i<7; i++) {
			cards.setCard(i,cardArr[i-1]);
		}
		players.setNum(userArr.length);

		if (userArr.length >= 1)players.setPlayer(userArr[0],"/img/avatar1.ico");
		if (userArr.length >= 2)players.setPlayer(userArr[1],"/img/avatar2.png");
		if (userArr.length >= 3)players.setPlayer(userArr[2],"/img/avatar3.png");
		if (userArr.length >= 4)players.setPlayer(userArr[3],"/img/avatar4.png");
		if (userArr.length >= 5)players.setPlayer(userArr[4],"/img/avatar1.ico");
		if (userArr.length >= 6)players.setPlayer(userArr[5],"/img/avatar2.png");

		players.setStoryteller(stindex);

			switch (state) {
				case GameState.IDLE:
					game.loadIdle();
					break;
				case GameState.STORYTELLER:
					game.loadStoryteller();
					break;
				case GameState.CHOOSING:
					game.loadChoosing();
					break;
				case GameState.VOTING:
					game.loadVoting();
					break;
				case GameState.UNCOVER:
					game.loadUncover();
					break;
				default:
			}

		//
		//system.load();
		
	}
	

	$("#slobby").click(function(){
		$("#lobby").removeClass('hidden');
		$("#results").addClass('hidden');
		$("#game").addClass('hidden');
		
	});

	
	$("#smodal").click(function(){
		$('#leaveModal').modal('show');
	});
	
	$("#idle").click(function(){
		state=GameState.IDLE;
		game.loadIdle();
		$('#idle').addClass('active');
		$('#storyteller').removeClass('active');
		$('#choosing').removeClass('active');
		$('#voting').removeClass('active');
		$('#uncover').removeClass('active');
		$('#watching').removeClass('active');
	});
	
	$("#storyteller").click(function(){
		state=GameState.STORYTELLER;
		game.loadStoryteller();
		$('#idle').removeClass('active');
		$('#storyteller').addClass('active');
		$('#choosing').removeClass('active');
		$('#voting').removeClass('active');
		$('#uncover').removeClass('active');
		$('#watching').removeClass('active');
	});
	
	$("#choosing").click(function(){
		state=GameState.CHOOSING;
		game.loadChoosing();
		$('#idle').removeClass('active');
		$('#storyteller').removeClass('active');
		$('#choosing').addClass('active');
		$('#voting').removeClass('active');
		$('#uncover').removeClass('active');
		$('#watching').removeClass('active');
	});
	
	$("#voting").click(function(){
		state=GameState.VOTING;
		game.loadVoting();
		$('#idle').removeClass('active');
		$('#storyteller').removeClass('active');
		$('#choosing').removeClass('active');
		$('#voting').addClass('active');
		$('#uncover').removeClass('active');
		$('#watching').removeClass('active');
	});
	
	$("#uncover").click(function(){
		state=GameState.UNCOVER;
		game.loadUncover();
		$('#idle').removeClass('active');
		$('#storyteller').removeClass('active');
		$('#choosing').removeClass('active');
		$('#voting').removeClass('active');
		$('#uncover').addClass('active');
		$('#watching').removeClass('active');
	});
	
	$("#watching").click(function(){
		state=GameState.WATCHING;
		game.loadWatching();
		$('#idle').removeClass('active');
		$('#storyteller').removeClass('active');
		$('#choosing').removeClass('active');
		$('#voting').removeClass('active');
		$('#uncover').removeClass('active');
		$('#watching').addClass('active');
	});

	function setDeck(cardArr){
		for (i=0; i<cardArr.length; i++) {
			if (cardArr[i]<10) cardArr[i]="/img/00"+cardArr[i]+".png";
			else if (cardArr[i]>=10 && cardArr[i]<100) cardArr[i]="/img/0"+cardArr[i]+".png";
			else cardArr[i]="/img/"+cardArr[i]+".png";
			submitted.setCard(i + 1,cardArr[i]);
		}
	};
/*--------------------------------------------------------- CANVAS CLASS ----------------------------------------------------------*/	
	{
	var Canvas = function ( ) {};
	
	Canvas.prototype.canvasID = function (ID) {
		this.can = document.getElementById(ID);
		this.context = this.can.getContext('2d');
	};
	
	Canvas.prototype.setDiv = function (div) {
		this.div = document.getElementById(div);
	};
	
	Canvas.prototype.size = function () {
		this.can.width= this.div.clientWidth;
		this.can.height= 0.65*this.div.clientWidth;
		};
	
	Canvas.prototype.setBgImage = function (img) {
		this.can.style.backgroundImage = "url('"+img+"')";
		this.can.style.backgroundImage.width = this.can.width;
		this.can.style.backgroundImage.height = this.can.height;
	};
	
	Canvas.prototype.message = function (msg) {
		//this.context.font = "bold "+0.07*this.can.height+"px newFont";
		//this.context.fillStyle = '#413C45';
		//this.context.fillText(msg, 0.15*this.can.width, 0.3*this.can.height);
		this.context.font = "bold "+0.071*this.can.height+"px newFont";
		this.context.strokeStyle ='#F2DCA6';
		this.context.strokeText(msg, 0.15*this.can.width, 0.3*this.can.height);
	};
	
	}
/*-------------------------------------------------------------------------------------------------------------------*/		
	
/*--------------------------------------------------------- CARD CLASS ----------------------------------------------------------*/	
	{
	var Card = function () {
		this.card = new Image();
		this.selected = false;
		this.x;
		this.y;
	};
	
	Card.prototype.setX = function (x) {
		this.x = x ;
	};
	
	Card.prototype.setY = function (y) {
		this.y = y;
	};
	
	Card.prototype.setCard = function (img) {
		this.card.src=img;
	};
	
	Card.prototype.select = function () {
		this.selected = true;
	};
	
	Card.prototype.deselect = function () {
	
		this.selected = false;
	};
	
	Card.prototype.draw = function (canvas) {
		this.w = 0.1*canvas.can.width;
		this.h = 0.2244*canvas.can.height;
		if (this.selected) this.drawRectangle(canvas,3);
		canvas.context.drawImage(this.card,this.x ,this.y ,this.w,this.h);
	} ;
	
	Card.prototype.zoom = function (canvas) {
		this.z = 0.13*canvas.can.height;
		this.wz = 0.16*canvas.can.width;
		this.hz = 0.35*canvas.can.height;
		if (this.selected) this.drawRectangle(canvas,2);
		canvas.context.drawImage(this.card,this.x, (this.y-this.z) , this.wz, this.hz);
	};
	
	Card.prototype.mouseOn = function (canvas, mx, my) {
		this.w = 0.1*canvas.can.width;
		this.h = 0.2244*canvas.can.height;
		if( mx >= this.x
		&& mx < (this.x+this.w)
		&& my >= this.y
		&& my < (this.y+this.h) 
		)
			return true;
		else return false;
	};

	Card.prototype.drawRectangle = function (canvas, scale, color) {
		if (color==undefined) color="green"
		this.z = 0.13*canvas.can.height;
		this.w = 0.1*canvas.can.width;
		this.h = 0.2244*canvas.can.height;
		this.wz = 0.16*canvas.can.width;
		this.hz = 0.35*canvas.can.height;
		canvas.context.beginPath();
		canvas.context.lineWidth = "8";
		canvas.context.strokeStyle = color;
		if (scale==3)
		canvas.context.rect(this.x, this.y, (this.w), (this.h));
		else 
		canvas.context.rect(this.x, (this.y-this.z), (this.wz), (this.hz));
		canvas.context.closePath();
		canvas.context.stroke();
	};	
	
	}
/*-------------------------------------------------------------------------------------------------------------------*/	
	
/*--------------------------------------------------------- CARDS CLASS ----------------------------------------------------------*/	
	{
	
	var Cards = function () {
		this.startW;
		this.endW;
		this.startH;
		
		
		
		this.card = new Array();
		this.card [0] = new Card();
		this.card [1] = new Card();
		this.card [2] = new Card();
		this.card [3] = new Card();
		this.card [4] = new Card();
		this.card [5] = new Card();
		
		this.back = new Card();
		this.back.setCard("/img/back.png");
		
		this.selected = 6;
		this.submitted = 6;
		
		
	};
	
	Cards.prototype.setCard = function (num,img) {
		this.card[num-1].setCard(img);
	};
	
	Cards.prototype.setWidth = function (w) {
		this.startW = w;
	};
	
	Cards.prototype.setHeight = function (h) {
		this.startH = h;
	};
	
	Cards.prototype.deselectAll = function () {
		for (i=0; i<6; i++)  this.card[i].deselect();;
	};
	
	Cards.prototype.setSelected = function (num) {
	this.deselectAll();
	
	this.card[num].select();
	this.selected=num;
	};

	Cards.prototype.getSelected = function (){
		return this.selected;
	};
		
	Cards.prototype.isSelected = function () {
		for (i=0; i<6; i++) 
			if (this.card[i].selected) return true;
		return false;	
	};
	
	Cards.prototype.setSubmitted = function() {
	this.submitted = this.selected;
	this.selected = 6;
	this.deselectAll();
	
	};
	
	Cards.prototype.drawCards = function (canvas) {
		this.startW = 0.09*canvas.can.width;
		this.endW = 0.72*canvas.can.width;
		this.startH = 0.75 * canvas.can.height;
		var k = (this.endW - this.startW)/(6-1);
		var w = this.startW;
		
		for ( i=0; i<6; i++) {
			if (this.submitted!=i) {
				this.card[i].setX(w);
				this.card[i].setY(this.startH);
				this.card[i].draw(canvas);
				w+=k;
			}
		}
		
		canvas.context.drawImage(this.back.card,(canvas.can.width*0.03), (canvas.can.height*0.45), (canvas.can.width*0.1), (canvas.can.height*0.2244));
	}; 
	}
/*-------------------------------------------------------------------------------------------------------------------*/	
	
/*--------------------------------------------------------- PLAYER CLASS ----------------------------------------------------------*/	
	{
	
	var Player = function () {
		this.name = "";
		this.avatar = new Image();
		this.points = 0;
		this.storyteller = false;
		this.inGame = true;
		this.voted = false;
		this.x;
		this.y;
	};
	
	Player.prototype.setX = function (x) {
		this.x = x- (this.avatar.width/(3.5))/2;
	};
	
	Player.prototype.setY = function (y) {
		this.y = y;
	};
	
	Player.prototype.setName = function(name) {
		this.name+=name;
	};
	
	Player.prototype.setAvatar = function (img) {
	this.avatar.src=img;
	};
	
	Player.prototype.isStoryteller = function() {
	this.storyteller=true;
	};
	
	Player.prototype.notStoryteller = function() {
		this.storyteller = false;
	};
	
	Player.prototype.justVoted = function () {
		this.voted = true;
	};
	
	Player.prototype.leftGame = function () {
		this.inGame = false;
	};
	
	Player.prototype.addPoints = function(pts) {
		this.points += pts;
	};
		
	Player.prototype.setPoints = function(pts){
		this.points = pts;
	}	
	
	Player.prototype.drawPlayer = function (canvas) {
		var nameStyle = [""+0.03*canvas.can.height+"px bodyFont", ""+0.03*canvas.can.height+"px italicFont"];
		var w = this.x;
		var h = this.y;
		var imgW = 0.0649*canvas.can.width;
		var imgH = 0.1*canvas.can.height;
		
		canvas.context.drawImage(this.avatar, w, h, imgW, imgH );
		if (this.storyteller ) canvas.context.fillStyle = "blue";
		else if (this.inGame) canvas.context.fillStyle = this.color;
		else canvas.context.fillStyle = "red";
		if (this.voted) canvas.context.fillStyle = "green";
		canvas.context.font = nameStyle[0];
		canvas.context.fillText(this.name, (this.x), (this.y+imgH+0.03*canvas.can.height));
		canvas.context.font = nameStyle[1];
		canvas.context.fillText (""+this.points+" points", (this.x), (this.y+imgH+0.06*canvas.can.height));
	}

		Player.prototype.setColor = function(i){
			this.color=colors[i];
		}
	}
/*-------------------------------------------------------------------------------------------------------------------*/	
	
/*--------------------------------------------------------- PLAYERS CLASS ----------------------------------------------------------*/	
	{
	
	var Players = function () {
		this.startW;
		this.startH;
		this.endW;
		this.num;
		this.player = new Array();
	}
	
	
	Players.prototype.setNum = function (num) {
		this.num=num;
		for (i=0; i<num; i++) 
			this.player[i]=new Player();
	};
	
	Players.prototype.setWidth = function (w) {
		this.startW = w;
	};
	
	Players.prototype.setHeight = function (h) {
		this.startH = h;
	};
	
	Players.prototype.setStoryteller = function (n) {
		for (i=0; i<this.num; i++) {
			if (i == n-1) this.player[i].isStoryteller();
			else this.player[i].notStoryteller();
		}
	};
	
	Players.prototype.setPlayer = function (name, avatar) {
		var v=-1;
		for (i=0; i<this.num; i++) {
			if (this.player[i].name=="" && v==-1) v=i;
		}
		this.player[v].setName(name);
		this.player[v].setAvatar(avatar);
	}
	
	Players.prototype.drawPlayers = function(canvas) {
		this.startW = 0.12*canvas.can.width;
		this.startH = 0.06*canvas.can.height;
		this.endW = 0.88*canvas.can.width;
		var k = (this.endW - this.startW) / (this.num - 1);
		var w = this.startW;
		
		for (i=0; i<this.num; i++) {
			this.player[i].setColor(i);
			this.player[i].setX(w);
			this.player[i].setY(this.startH);
			this.player[i].drawPlayer(canvas);
			w+=k;
		}
	};

	}
/*-------------------------------------------------------------------------------------------------------------------*/		
	
/*--------------------------------------------------------- BUTTONS CLASS ----------------------------------------------------------*/	
	{
	
	
	var Buttons = function () {
		this.submit = new Image();
		this.submit.src = "/img/submit.png";
		
	}; 
	
	
	Buttons.prototype.loadButtons = function (canvas) {
		this.submitX = 0.85*canvas.can.width;
		this.submitY = 0.9*canvas.can.height;
		this.w = 0.142*canvas.can.width;
		this.h = 0.054*canvas.can.height;
		if (cards.isSelected() || submitted.isSelected()) this.submit.src = "/img/submit_t.png";
		else this.submit.src = "/img/submit.png";
		canvas.context.drawImage(this.submit,this.submitX, this.submitY, this.w, this.h);
	};
	
	Buttons.prototype.mouseOn = function (canvas,mx, my) {
		this.submitX = 0.85*canvas.can.width;
		this.submitY = 0.9*canvas.can.height;
		this.w = 0.142*canvas.can.width;
		this.h = 0.054*canvas.can.height;
		if( mx >= this.submitX && mx < (this.submitX+this.w) && my >= this.submitY && my < (this.submitY+this.h))
			return true;
		else return false;
	};
	}
/*-------------------------------------------------------------------------------------------------------------------*/	
	
/*--------------------------------------------------------- SYSTEM CLASS ----------------------------------------------------------*/	
	{
	var System = function () {};
	
	System.prototype.getMousePos = function (evt) {
      var rect = canvas.div.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
       };
    };
	  
	}
/*-------------------------------------------------------------------------------------------------------------------*/		
	
/*--------------------------------------------------------- EVENTS CLASS ----------------------------------------------------------*/	
	{
	var Events = function () {};

	Events.prototype.setEventListener = function () {
		canvas.can.addEventListener('mousemove', this.eventMouseMove, false);
		canvas.can.addEventListener('click', this.eventClick, false);
	};
	
	Events.prototype.eventClick = function (evt) {
		var mousePos = system.getMousePos(evt);
		switch (state) {
			case GameState.IDLE:
				game.loadIdle();
				break;
				
			case GameState.STORYTELLER:
				if (cards.card[0].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(0);
					game.loadStoryteller();
				}
				 else if (cards.card[1].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(1);
					game.loadStoryteller();
				}
				else if (cards.card[2].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(2);
					game.loadStoryteller();
				}
				else if (cards.card[3].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(3);
					game.loadStoryteller();
				}
				else if (cards.card[4].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(4);
					game.loadStoryteller();
				}
				else if (cards.card[5].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(5);
					game.loadStoryteller();
				}
				if (buttons.mouseOn(canvas, mousePos.x, mousePos.y)) {
					if (cards.isSelected()) {
						//cards.setSubmitted();
						$('#addDescriptionModal').modal('show');
						//cards.deselectAll();
					}
				}
				break;
				
			case GameState.CHOOSING:
				if (cards.card[0].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(0);
					game.loadChoosing();
				}
				 else if (cards.card[1].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(1);
					game.loadChoosing();
				}
				else if (cards.card[2].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(2);
					game.loadChoosing();
				}
				else if (cards.card[3].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(3);
					game.loadChoosing();
				}
				else if (cards.card[4].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(4);
					game.loadChoosing();
				}
				else if (cards.card[5].mouseOn(canvas, mousePos.x, mousePos.y)) {
					cards.setSelected(5);
					game.loadChoosing();
				}
				if (buttons.mouseOn(canvas, mousePos.x, mousePos.y)) {
					if (cards.isSelected()) {
						sess.publish("acme/"+roomNum, {type:"submit", sel: cards.getSelected()});
						cards.deselectAll();
						state=GameState.IDLE_CH;
						game.loadIdle_ch();
					}
				}
				break;
				
			case GameState.VOTING:
				if (submitted.cards[0].mouseOn(canvas, mousePos.x, mousePos.y)) {
					submitted.setSelected(0);
					game.loadVoting();
				}
				else if (submitted.cards[1].mouseOn(canvas, mousePos.x, mousePos.y)) {
					submitted.setSelected(1);
					game.loadVoting();
				}
				else if (submitted.num >=3 && submitted.cards[2].mouseOn(canvas, mousePos.x, mousePos.y)) {
					submitted.setSelected(2);
					game.loadVoting();
				}
				else if (submitted.num >=4 && submitted.cards[3].mouseOn(canvas, mousePos.x, mousePos.y)) {
					submitted.setSelected(3);
					game.loadVoting();
				}
				else if (submitted.num >= 5) {
					if (submitted.cards[4].mouseOn(canvas, mousePos.x, mousePos.y)) {
						submitted.setSelected(4);
						game.loadVoting();
					}
					else if (submitted.cards[5].mouseOn(canvas, mousePos.x, mousePos.y)) {
						submitted.setSelected(5);
						game.loadVoting();
					}
				}
				if (buttons.mouseOn(canvas, mousePos.x, mousePos.y)) {
					if (submitted.isSelected()) {
						sess.publish("acme/"+roomNum, {type:"vote", sel: submitted.getSelected()});
						submitted.deselectAll();
						state=GameState.WATCHING;
						game.loadWatching();
					}
				}
				break;
				
			case GameState.UNCOVER:
				game.loadUncover();
				break;
				
			case GameState.WATCHING:
				game.loadWatching();
				break;
				
			case GameState.IDLE_CH:
				game.loadIdle_ch();
				break;
				
			default:
		} 
	  
	};
	
	Events.prototype.eventMouseMove = function (evt) {
        var mousePos = system.getMousePos(evt);
		switch (state) {
			case GameState.IDLE:
				game.loadIdle();
				break;
				
			case GameState.STORYTELLER:
				if (cards.card[0].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadStoryteller();
					cards.card[0].zoom(canvas);
					}
				else if (cards.card[1].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadStoryteller();
					cards.card[1].zoom(canvas);
					}
				else if (cards.card[2].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadStoryteller();
					cards.card[2].zoom(canvas);
					}
				else if (cards.card[3].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadStoryteller();
					cards.card[3].zoom(canvas);
					}
				else if (cards.card[4].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadStoryteller();
					cards.card[4].zoom(canvas);
					}
				else if (cards.card[5].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadStoryteller();
					cards.card[5].zoom(canvas);
					}
				break;
				
			case GameState.CHOOSING:
				if (cards.card[0].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadChoosing();
					cards.card[0].zoom(canvas);
					}
				else if (cards.card[1].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadChoosing();
					cards.card[1].zoom(canvas);
					}
				else if (cards.card[2].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadChoosing();
					cards.card[2].zoom(canvas);
					}
				else if (cards.card[3].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadChoosing();
					cards.card[3].zoom(canvas);
					}
				else if (cards.card[4].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadChoosing();
					cards.card[4].zoom(canvas);
					}
				else if (cards.card[5].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadChoosing();
					cards.card[5].zoom(canvas);
					}
				break;
				
			case GameState.VOTING:
				if (submitted.cards[0].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadVoting();
					submitted.cards[0].zoom(canvas);
					}
				else if (submitted.cards[1].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadVoting();
					submitted.cards[1].zoom(canvas);
					}
				else if (submitted.num >=3 && submitted.cards[2].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadVoting();
					submitted.cards[2].zoom(canvas);
					}
				else if (submitted.num >=4 && submitted.cards[3].mouseOn(canvas, mousePos.x, mousePos.y)) {
					game.loadVoting();
					submitted.cards[3].zoom(canvas);
					}
				else if (submitted.num >= 5) {
					if (submitted.cards[4].mouseOn(canvas, mousePos.x, mousePos.y)) {
						game.loadVoting();
						submitted.cards[4].zoom(canvas);
					}
					else if (submitted.cards[5].mouseOn(canvas, mousePos.x, mousePos.y)) {
						game.loadVoting();
						submitted.cards[5].zoom(canvas);
					}
				}
				break;
				
			case GameState.UNCOVER:
				game.loadUncover();
				break;
				
			case GameState.WATCHING:
				game.loadWatching();
				break;
				
			case GameState.IDLE_CH:
				game.loadIdle_ch();
				break;
				
			default:
		}
	};
	}
/*-------------------------------------------------------------------------------------------------------------------*/	

/*--------------------------------------------------------- GAME ----------------------------------------------------------*/
{
	var Game = function () {};
	
	Game.prototype.loadIdle = function () {	
	  canvas.size();
	  canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);

		cards.card.submitted=6;
		players.drawPlayers(canvas);
	  cards.drawCards(canvas);
	  buttons.loadButtons(canvas);
	  
	  events.setEventListener();
	};
	
	Game.prototype.loadStoryteller = function () {
	  canvas.size();
	  canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);

		cards.card.submitted=6;

		players.drawPlayers(canvas);
	  cards.drawCards(canvas);
	  buttons.loadButtons(canvas);
	  
	  //postaviti pripovedaca
	  //players.player[i].isStoryteller();
	  
	  events.setEventListener();
		
	};
	
	Game.prototype.loadChoosing = function () {	
	  canvas.size();
	  canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);
	  
	  players.drawPlayers(canvas);
	  cards.drawCards(canvas);
	  buttons.loadButtons(canvas);
	  //submitted.drawCards(canvas);
	  submitted.drawDescription(canvas);
	  
	  events.setEventListener();
	};
	
	Game.prototype.loadVoting = function () {	
	  canvas.size();
	  canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);
	  
	  players.drawPlayers(canvas);
	  cards.drawCards(canvas);
	  buttons.loadButtons(canvas);
	  submitted.drawCards(canvas);
	  submitted.drawDescription(canvas);
	  
	  events.setEventListener();
	};
	
	Game.prototype.loadUncover = function () {
	  canvas.size();
	  canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);
	  
	  players.drawPlayers(canvas);
	  cards.drawCards(canvas);
	  buttons.loadButtons(canvas);
	  
	  //nacrtaj submitted karte
	  submitted.drawVoted(canvas);
	  //ali sada oznaci koja je cija karta i ko je glasao za koju kartu
	  //update poena
	  
	  events.setEventListener();
		
	};
	
	Game.prototype.loadWatching = function () {
		canvas.size();
	    canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);
		
	  players.drawPlayers(canvas);
	  cards.drawCards(canvas);
	  buttons.loadButtons(canvas);
	  
	  //nacrtaj submitted karte
	  submitted.drawCards(canvas);
	  submitted.drawDescription(canvas);
	  
	  events.setEventListener();
	};
	
	Game.prototype.loadIdle_ch = function () {	
	  canvas.size();
	  canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);
	  canvas.message("Players are picking cards");
	  
	  players.drawPlayers(canvas);
	  cards.drawCards(canvas);
	  buttons.loadButtons(canvas);

	  events.setEventListener();
	};
}
/*-------------------------------------------------------------------------------------------------------------------*/	

/*--------------------------------------------------------- SUBMITTED ----------------------------------------------------------*/
{
	var Submitted = function () {
	};
	
	Submitted.prototype.setNum = function (num) {
		this.cards = new Array();
		this.num = num;
		for (i=0; i<this.num; i++) 
			this.cards[i] = new Card();
		//odakle uzimam sada image source?
	};
	
	Submitted.prototype.setCard = function (num,img) {
	this.cards[num-1].setCard(img);
	};
	
	Submitted.prototype.drawCards = function (canvas) {
		this.startW = 0.19*canvas.can.width;
		this.endW = 0.82*canvas.can.width;
		this.startH = 0.45 * canvas.can.height;
		var k = (this.endW - this.startW)/(this.num-1);
		var w = this.startW;
		
		for ( i=0; i<this.num; i++) {
			this.cards[i].setX(w);
			this.cards[i].setY(this.startH);
			this.cards[i].draw(canvas);
			w+=k;
		}
	};
	
	
	Submitted.prototype.drawDescription = function (canvas) {
		//uzeti tekst
		canvas.context.font = "bold "+0.07*canvas.can.height+"px newFont";
		canvas.context.fillStyle = '#F2DCA6';
		canvas.context.fillText(phrase, 0.15*canvas.can.width, 0.3*canvas.can.height);
		//canvas.context.font = "bold "+0.071*canvas.can.height+"px newFont";
		//canvas.context.strokeStyle ='#F2DCA6';
		//canvas.context.strokeText(phrase, 0.15*canvas.can.width, 0.3*canvas.can.height);
	}; 
	
	Submitted.prototype.drawVotes = function (canvas) {
		for (j=0; j<this.num; j++) {  //za karte
			this.cards[j].drawRectangle(canvas,3,colors[ownerArr[j]]);
			var k = (this.cards[j].w)/(5);
			var radius = 0.3*k;
			var start = this.cards[j].x + radius/2;
			for (i=0; i<this.num; i++) { //za igrace
				if(j==voterArr[i]){
					canvas.context.beginPath();
					canvas.context.arc(start, this.cards[j].y-5, radius, 0, 2 * Math.PI, false);
					//boja treba da bude boja onog igraca koji je glasao za tu kartu
					canvas.context.fillStyle = players.player[i].color;
					canvas.context.fill();
					canvas.context.closePath();
					canvas.context.stroke();
					start+=k;
				}
			}
		
		}
	};
	
	Submitted.prototype.drawVoted = function (canvas) {
		this.drawCards(canvas);
		this.drawDescription(canvas);
		//this.drawRectangle(canvas);
		this.drawVotes(canvas);
	};
	
	Submitted.prototype.deselectAll = function () {
		for (i=0; i<this.num; i++)  this.cards[i].deselect();
	};
	
	Submitted.prototype.setSelected = function (num) {
	this.deselectAll();
	
	this.cards[num].select();
	this.selected=num;
	};
	
	Submitted.prototype.isSelected = function () {
		for (i=0; i<this.num; i++) 
			if (this.cards[i].selected) return true;
		return false;	
	};

	Submitted.prototype.getSelected = function(){
		return this.selected;
	};
	
	Submitted.prototype.setSubmitted = function() {
	this.submitted=true;
	this.deselectAll();
	this.cards[this.selected].remove();
	
	};
}
/*-------------------------------------------------------------------------------------------------------------------*/	

	
/*--------------------------------------------------------- GLOBALS ----------------------------------------------------------*/	
	{
	var canvas = new Canvas(),
	players = new Players(),
	cards = new Cards(),
	buttons = new Buttons(),
	events = new Events(),
	system = new System(),
	submitted = new Submitted(),
	game = new Game(),
	phrase = "",
	sess,
	roomNum,
	voterArr,
	ownerArr,	
	GameState = {
		IDLE:1, 
		STORYTELLER:2, 
		CHOOSING:3, 
		VOTING:4, 
		UNCOVER:5,
		WATCHING:6, 
		IDLE_CH:7
		},
	state = GameState.IDLE,
	colors = [
		"#8fb118",
		"#b992e4",
		"#e69b33",
		"#41c594",
		"#e2e6dd",
		"#ecdd20"

	]
	}
/*-------------------------------------------------------------------------------------------------------------------*/	
