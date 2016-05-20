
/*--------------------------------------------------------- CANVAS CLASS ----------------------------------------------------------*/	
	{
	var Canvas = function ( ) {
	
		this.can;
		this.context;
		this.scaleW;
		this.scaleH;
		//this.can.style.backgroundImage="";
		
	};
	
	Canvas.prototype.canvasID = function (ID) {
		this.can = document.getElementById(ID);
		this.context = this.can.getContext('2d');
		this.can.style.width = "60%";
		this.can.style.height = "80%";
		this.can.width=this.can.offsetWidth;
		this.can.height=this.can.offsetHeight;
	};
	
	Canvas.prototype.setWidth = function (w) {
		this.scaleW = this.can.width/w;
	};
	
	Canvas.prototype.setHeight = function (h) {
		this.scaleH = this.can.height/h;
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
		//this.card.src="";
		this.x;
		this.y;
	};
	
	Card.prototype.setX = function (x) {
		this.x = x;
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
		canvas.context.drawImage(this.card,this.x*canvas.scaleW ,this.y*canvas.scaleH ,this.card.width/(3*2)*canvas.scaleW,this.card.height/(3*2)*canvas.scaleH);
	} ;
	
	Card.prototype.zoom = function (canvas) {
		if (this.selected) this.drawRectangle(canvas,2);
		canvas.context.drawImage(this.card,this.x*canvas.scaleW, (this.y-this.card.height/(6*2))*canvas.scaleH , (this.card.width/(2*2))*canvas.scaleW, (this.card.height/(2*2))*canvas.scaleH);
	};
	
	Card.prototype.mouseOn = function (canvas, mx, my) {
		var s = scale();
		if( mx >= this.x*canvas.scaleW && mx < ((this.x+this.card.width/(3*2))*canvas.scaleW) && my >= this.y*canvas.scaleH && my < ((this.y+this.card.height/(3*2))*canvas.scaleH) )
			return true;
		else return false;
	};

	Card.prototype.drawRectangle = function (canvas, scale) {
		canvas.context.beginPath();
		canvas.context.lineWidth = "8";
		canvas.context.strokeStyle = "green";
		if (scale==3)
		canvas.context.rect(this.x*canvas.scaleW, this.y*canvas.scaleH, (this.card.width/(3*2))*canvas.scaleW, (this.card.height/(3*2))*canvas.scaleH);
		else 
		canvas.context.rect(this.x*canvas.scaleW, (590/2)*canvas.scaleH, (this.card.width/(2*2))*canvas.scaleW, (this.card.height/(2*2))*canvas.scaleH);
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
		this.startH;
		
		
		this.card = new Array();
		this.card [0] = new Card();
		this.card [1] = new Card();
		this.card [2] = new Card();
		this.card [3] = new Card();
		this.card [4] = new Card();
		this.card [5] = new Card();
		
		this.back = new Image();
		this.back.src = "back.png";
		
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
		var w = this.startW, h = this.startH;
		
		for ( i=0; i<6; i++) {
			this.card[i].setX(w);
			this.card[i].setY(h);
			this.card[i].draw(canvas);
			w+=(150/2);
		}
		
		canvas.context.drawImage(this.back,(25/2)*canvas.scaleW, (300/2)*canvas.scaleH, (this.card[0].card.width/(3*2))*canvas.scaleW, (this.card[0].card.height/(3*2))*canvas.scaleH);
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
		this.x = x;
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
		var nameStyle = ["bold 20px Arial", "italic 15px Arial"];
		
		canvas.context.drawImage(this.avatar, this.x*canvas.scaleW, this.y*canvas.scaleH, (this.avatar.width/(3*2))*canvas.scaleW, (this.avatar.height/(3*2))*canvas.scaleH );
		if (this.storyteller ) canvas.context.fillStyle = "blue";
		else if (this.inGame) canvas.context.fillStyle = "black";
		else canvas.context.fillStyle = "red";
		if (this.voted) canvas.context.fillStyle = "green";
		canvas.context.font = nameStyle[0];
		canvas.context.fillText(this.name, (this.x+10/2)*canvas.scaleW, (this.y+115/2)*canvas.scaleH);
		canvas.context.font = nameStyle[1];
		canvas.context.fillText (""+this.points+" points", (this.x+10/2)*canvas.scaleW, (this.y+135/2)*canvas.scaleH);
	}
	}
/*-------------------------------------------------------------------------------------------------------------------*/	
	
/*--------------------------------------------------------- PLAYERS CLASS ----------------------------------------------------------*/	
	{
	
	var Players = function () {
		this.startW;
		this.startH;
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
		var w=this.startW, h=this.startH;
		for (i=0; i<this.num; i++) {
			this.player[i].setX(w);
			this.player[i].setY(h);
			this.player[i].drawPlayer(canvas);
			w+=(200/2);
		}
	};

	}
/*-------------------------------------------------------------------------------------------------------------------*/		
	
/*--------------------------------------------------------- BUTTONS CLASS ----------------------------------------------------------*/	
	{
	
	
	var Buttons = function () {
		
		this.submit = new Image();
		this.submit.src = "submit.png";
		this.submitX = 955/2;
		this.submitY = 750/2;
		
	}; 
	
	
	Buttons.prototype.loadButtons = function (canvas) {
		if (cards.isSelected()) this.submit.src = "submit_t.png";
		else this.submit.src = "submit.png";
		canvas.context.drawImage(this.submit,this.submitX*canvas.scaleW, this.submitY*canvas.scaleH, (this.submit.width/(3*2))*canvas.scaleW, (this.submit.height/(3*2))*canvas.scaleH);
	};
	
	Buttons.prototype.mouseOn = function (canvas,mx, my) {
		if( mx >= this.submitX*canvas.scaleW && mx < (this.submitX+this.submit.width/(3*2))*canvas.scaleW && my >= this.submitY*canvas.scaleH && my < (this.submitY+this.submit.height/(3*2))*canvas.scaleH )
			return true;
		else return false;
	};
	}
/*-------------------------------------------------------------------------------------------------------------------*/	
	
/*--------------------------------------------------------- SYSTEM CLASS ----------------------------------------------------------*/	
	{
	var System = function () {};
	
	System.prototype.getMousePos = function (evt) {
      var rect = canvas.can.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
       };
    };

	System.prototype.load = function () {
	  canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);
	  players.drawPlayers(canvas);
	  cards.drawCards(canvas);
	  buttons.loadButtons(canvas);
	  };
	}
/*-------------------------------------------------------------------------------------------------------------------*/		
	
/*--------------------------------------------------------- EVENTS CLASS ----------------------------------------------------------*/	
	{
	var Events = function () {};
	
	
	
	Events.prototype.setEventListener = function () {
		canvas.can.addEventListener('mousemove', this.eventMouseMove, false);
		canvas.can.addEventListener('click', this.eventClick, false);
		canvas.can.addEventListener('resize', this.eventResize, false);
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
		//cards.setSubmitted();
		//system.load();
	  }
	};
	
	Events.prototype.eventMouseMove = function (evt) {
      var mousePos = system.getMousePos(evt);
	  var s = scale();
	  if (cards.card[0].mouseOn(canvas, mousePos.x*s.x, mousePos.y*s.y)) {
	  system.load();
	  cards.card[0].zoom(canvas);}
	  else if (cards.card[1].mouseOn(canvas, mousePos.x*s.x, mousePos.y*s.y)) {
	  system.load();
	  cards.card[1].zoom(canvas);}
	  else if (cards.card[2].mouseOn(canvas, mousePos.x*s.x, mousePos.y*s.y)) {
	  system.load();
	  cards.card[2].zoom(canvas);}
	  else if (cards.card[3].mouseOn(canvas, mousePos.x*s.x, mousePos.y*s.y)) {
	  system.load();
	  cards.card[3].zoom(canvas);}
	  else if (cards.card[4].mouseOn(canvas, mousePos.x*s.x, mousePos.y*s.y)) {
	  system.load();
	  cards.card[4].zoom(canvas);}
	  else if (cards.card[5].mouseOn(canvas, mousePos.x*s.x, mousePos.y*s.y)) {
	  system.load();
	  cards.card[5].zoom(canvas);}
	  else system.load();
	  
	document.getElementById("demo").innerHTML = "x: " + mousePos.x + "<br>y: " + mousePos.y;
	  
	};

	Events.prototype.resize = function () {
	    canvas.can.width = window.innerWidth;
        canvas.can.height = window.innerHeight;
	};
	}
/*-------------------------------------------------------------------------------------------------------------------*/	

	
/*--------------------------------------------------------- GLOBALS ----------------------------------------------------------*/	
	{
	var canvas = new Canvas();
	var players = new Players();
	var cards = new Cards();
	var buttons = new Buttons();
	var events = new Events();
	var system = new System();
	}
/*-------------------------------------------------------------------------------------------------------------------*/	
	
	function scale() {
	var w =  window.innerWidth;
	var h = window.innerHeight;
	return {
		x: w/1366,
		y: h/635
	};
	}
	
	function myFunction() {
    //var w = window.innerWidth;
    //var h = window.innerHeight;
	var w = canvas.can.width;
    var h = canvas.can.height;
    document.getElementById("demo").innerHTML = "Width: " + w + "<br>Height: " + h;
}
	
	window.onload = function () {
		
		//scale buttons & cards
		
		canvas.canvasID('myCanvas');
		canvas.setBgImage('lane.jpg');
		canvas.setWidth(1114/2);
		canvas.setHeight(874.5/2);
		
		for (i=1; i<7; i++)
		cards.setCard(i,"00"+i+".png");
		cards.setWidth(75/2);
		cards.setHeight(675/2);
		
		
		players.setNum(4);
		
		players.setPlayer("Ana","avatar1.ico");
		players.setPlayer("Tijana","avatar2.png");
		players.setPlayer("Dusan","avatar3.png");
		players.setPlayer("Aleksa","avatar4.png");
		
		//players.player[0].isStoryteller();
		//players.player[2].justVoted();
		
		players.setWidth(100/2);
		players.setHeight(20/2);
		
		system.load();
		events.setEventListener();
		
		
		
	};
