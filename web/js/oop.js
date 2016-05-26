
	
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
		
		
		system.load();
		
		
		
	};
	
	
	
	window.onresize = function () {
		system.load();
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
	
	$("#sgame").click(function(){
		$("#game").removeClass('hidden');
		$("#results").addClass('hidden');
		$("#lobby").addClass('hidden');
		
	}); 
	
	$("#slobby").click(function(){
		$("#lobby").removeClass('hidden');
		$("#results").addClass('hidden');
		$("#game").addClass('hidden');
		
	}); 
	
	
	
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
		if (this.selected) this.drawRectangle(canvas,3);
		canvas.context.drawImage(this.card,this.x ,this.y ,(this.card.width/(5.5)),(this.card.height/(5.5)));
	} ;
	
	Card.prototype.zoom = function (canvas) {
		if (this.selected) this.drawRectangle(canvas,2);
		canvas.context.drawImage(this.card,this.x, (this.y-this.card.height/(9.5)) , (this.card.width/(3.5)), (this.card.height/(3.5)));
	};
	
	Card.prototype.mouseOn = function (canvas, mx, my) {
		if( mx >= this.x
		&& mx < (this.x+this.card.width/(5.5))
		&& my >= this.y
		&& my < ((this.y+this.card.height/(5.5))) 
		)
			return true;
		else return false;
	};

	Card.prototype.drawRectangle = function (canvas, scale) {
		canvas.context.beginPath();
		canvas.context.lineWidth = "8";
		canvas.context.strokeStyle = "green";
		if (scale==3)
		canvas.context.rect(this.x, this.y, (this.card.width/(5.5)), (this.card.height/(5.5)));
		else 
		canvas.context.rect(this.x, (this.y-this.card.height/(9.5)), (this.card.width/(3.5)), (this.card.height/(3.5)));
		canvas.context.stroke();
	};	
	
	Card.prototype.remove = function () {
		this.card.src="";
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
		
		this.back = new Image();
		this.back.src = "/img/back.png";
		
		this.selected = 6;
		this.submitted = false;
		
		
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
	
	Cards.prototype.isSelected = function () {
		for (i=0; i<6; i++) 
			if (this.card[i].selected) return true;
		return false;	
	};
	
	Cards.prototype.setSubmitted = function() {
	this.submitted=true;
	this.deselectAll();
	this.card[this.selected].remove();
	
	};
	
	Cards.prototype.drawCards = function (canvas) {
		this.startW = 0.12*canvas.can.width;
		this.endW = 0.75*canvas.can.width;
		this.startH = 0.7 * canvas.can.height;
		var k = (this.endW - this.startW)/(6-1);
		var w = this.startW;
		
		for ( i=0; i<6; i++) {
			this.card[i].setX(w);
			this.card[i].setY(this.startH);
			this.card[i].draw(canvas);
			w+=k;
		}
		
		canvas.context.drawImage(this.back,(canvas.can.width*0.03), (canvas.can.height*0.4), (this.card[0].card.width/(5.5)), (this.card[0].card.height/(5.5)));
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
	
	Player.prototype.justVoted = function () {
		this.voted = true;
	};
	
	Player.prototype.leftGame = function () {
		this.inGame = false;
	};
	
	Player.prototype.addPoints = function(pts) {
	this.points += pts;
	};
	
	Player.prototype.drawPlayer = function (canvas) {
		var nameStyle = ["bold 12px Arial", "italic 11px Arial"];
		var w = this.x;
		var h = this.y;
		var imgW = (this.avatar.width/(6));
		var imgH = (this.avatar.height/(6));
		
		canvas.context.drawImage(this.avatar, w, h, imgW, imgH );
		if (this.storyteller ) canvas.context.fillStyle = "blue";
		else if (this.inGame) canvas.context.fillStyle = "black";
		else canvas.context.fillStyle = "red";
		if (this.voted) canvas.context.fillStyle = "green";
		canvas.context.font = nameStyle[0];
		canvas.context.fillText(this.name, (this.x), (this.y+this.y*2.4));
		canvas.context.font = nameStyle[1];
		canvas.context.fillText (""+this.points+" points", (this.x), (this.y+this.y*2.8));
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
		this.submitY = 0.85*canvas.can.height;
		if (cards.isSelected()) this.submit.src = "/img/submit_t.png";
		else this.submit.src = "/img/submit.png";
		canvas.context.drawImage(this.submit,this.submitX, this.submitY, (this.submit.width/(5)), (this.submit.height/(5)));
	};
	
	Buttons.prototype.mouseOn = function (canvas,mx, my) {
		this.submitX = 0.85*canvas.can.width;
		this.submitY = 0.85*canvas.can.height;
		if( mx >= this.submitX && mx < (this.submitX+this.submit.width/(5)) && my >= this.submitY && my < (this.submitY+this.submit.height/(5)))
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

	System.prototype.load = function () {
	  canvas.size();
	  canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);
	  
	  players.drawPlayers(canvas);
	  cards.drawCards(canvas);
	  buttons.loadButtons(canvas);
	  
	  events.setEventListener();
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
	  if (cards.card[0].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  cards.setSelected(0);
	  system.load();
	 }
	  else if (cards.card[1].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  cards.setSelected(1);
	  system.load();
	  }
	  else if (cards.card[2].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  cards.setSelected(2);
	  system.load();
	  }
	  else if (cards.card[3].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  cards.setSelected(3);
	  system.load();
	  }
	  else if (cards.card[4].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  cards.setSelected(4);
	  system.load();
	  }
	  else if (cards.card[5].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  cards.setSelected(5);
	  system.load();
	  }
	  if (buttons.mouseOn(canvas, mousePos.x, mousePos.y)) {
		if (cards.isSelected()) {
			$('#addDescriptionModal').modal('show');
		}
	  }
	};
	
	Events.prototype.eventMouseMove = function (evt) {
      var mousePos = system.getMousePos(evt);
	  if (cards.card[0].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  system.load();
	  cards.card[0].zoom(canvas);}
	  else if (cards.card[1].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  system.load();
	  cards.card[1].zoom(canvas);}
	  else if (cards.card[2].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  system.load();
	  cards.card[2].zoom(canvas);}
	  else if (cards.card[3].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  system.load();
	  cards.card[3].zoom(canvas);}
	  else if (cards.card[4].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  system.load();
	  cards.card[4].zoom(canvas);}
	  else if (cards.card[5].mouseOn(canvas, mousePos.x, mousePos.y)) {
	  system.load();
	  cards.card[5].zoom(canvas);}
	  else system.load();
	  
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
	originalW, originalH, newW, newH, rw, rh;
	}
/*-------------------------------------------------------------------------------------------------------------------*/	

