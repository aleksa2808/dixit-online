var canvas = document.getElementById("myCanvas");
	canvas.style.width='100%';
	canvas.style.height='100%';
	canvas.width  = canvas.offsetWidth;
  	canvas.height = canvas.offsetHeight;
	
var scaleW = canvas.width / 1114;
var scaleH = canvas.height / 874.5;

var c = canvas.getContext("2d");

var card1 = new Image(),
    card2 = new Image(),
    card3 = new Image(),
    card4 = new Image(),
    card5 = new Image(),
    card6 = new Image(),
    submit = new Image(),
    back = new Image(),
    selected = "",
    avatar1 = new Image(),
    avatar2 = new Image(),
    avatar3 = new Image(),
    avatar4 = new Image(),
    avatar5 = new Image(),
    points1=0,
    points2=0,
    points3=0,
    points4=0,
    points5=0,
    points6=0,
    submitted=false;

    card1.src = "img/001.png";
    card2.src = "img/002.png";
    card3.src = "img/003.png";
    card4.src = "img/004.png";
    card5.src = "img/005.png";
    card6.src = "img/006.png";
    submit.src = "img/submit.png";
    back.src = "img/back.png";
    avatar1.src = "img/avatar1.ico";
    avatar2.src = "img/avatar2.png";
    avatar3.src = "img/avatar3.png";
    avatar4.src = "img/avatar4.png";
    avatar5.src = "img/avatar5.png";
        
window.onload = function () {
    canvas.addEventListener('click', handleMoveEvent2, false);
    canvas.addEventListener('mousemove', handleMoveEvent1, false);
    loadPlayers(canvas);
    loadCards(canvas,submitted);
};

function loadPlayers(canvas) {
    var c = canvas.getContext("2d");

    c.drawImage(avatar1, scaleW * 100, scaleH * 20, scaleW * avatar1.width/3, scaleH * avatar1.height/3);
    c.drawImage(avatar2, scaleW * 300, scaleH * 20, scaleW * avatar1.width/3, scaleH * avatar1.height/3);
    c.drawImage(avatar3, scaleW * 500, scaleH * 20, scaleW * avatar1.width/3, scaleH * avatar1.height/3);
    c.drawImage(avatar4, scaleW * 700, scaleH * 20, scaleW * avatar1.width/3, scaleH * avatar1.height/3);
    c.drawImage(avatar5, scaleW * 900, scaleH * 20, scaleW * avatar1.width/3, scaleH * avatar1.height/3);
    
    //plavi je propovedac, zeleni je onaj koji je predao kartu, a crveni je izasao iz igre
    c.font="bold 20px Arial";
    c.fillStyle="green";
    c.fillText("player1", scaleW * 110, scaleH * 135);
    
    c.font=" italic 15px Arial";
    c.fillStyle="black";
    c.fillText(""+points1+" points",scaleW * 110,scaleH * 155);
    
    c.font="bold 20px Arial";
    c.fillStyle="black";
    c.fillText("player2", scaleW * 310, scaleH * 135);
    
    c.font=" italic 15px Arial";
    c.fillText(""+points2+" points",scaleW * 310,scaleH * 155);
    
    c.font="bold 20px Arial";
    c.fillText("player3", scaleW * 510, scaleH * 135);
    
    c.font=" italic 15px Arial";
    c.fillText(""+points3+" points",scaleW * 510,scaleH * 155);
    
    c.font="bold 20px Arial";
    c.fillStyle="blue";
    c.fillText("player4", scaleW * 710, scaleH * 135);
    
    c.font=" italic 15px Arial";
    c.fillStyle="black";
    c.fillText(""+points4+" points",scaleW * 710,scaleH * 155);
    
    c.font="bold 20px Arial";
    c.fillStyle="red";
    c.fillText("player5", scaleW * 910, scaleH * 135);
    
    c.font=" italic 15px Arial";
    c.fillStyle="black";
    c.fillText(""+points5+" points",scaleW * 910,scaleH * 155);
}		

function loadCards(canvas, submitted, selected) {
    var c = canvas.getContext("2d");
    
    c.drawImage(card1, scaleW * 75,scaleH * 675,scaleW * card1.width/3,scaleH * card1.height/3);
    if (selected==card1) drawRectangle(canvas,scaleW * 75,scaleH * 675,"green");
    
    c.drawImage(card2, scaleW * 225,scaleH * 675,scaleW * card2.width/3,scaleH * card2.height/3);
    if (selected==card2) drawRectangle(canvas,scaleW * 225,scaleH * 675,"green");
    
    c.drawImage(card3, scaleW * 375,scaleH * 675,scaleW * card1.width/3,scaleH * card1.height/3);
    if (selected==card3) drawRectangle(canvas,scaleW * 375,scaleH * 675,"green");
    
    c.drawImage(card4, scaleW * 525,scaleH * 675,scaleW * card2.width/3,scaleH * card2.height/3);
    if (selected==card4) drawRectangle(canvas,scaleW * 525,scaleH * 675,"green");
    
    c.drawImage(card5, scaleW * 675,scaleH * 675,scaleW * card1.width/3,scaleH * card1.height/3);
    if (selected==card5) drawRectangle(canvas,scaleW * 675,scaleH * 675,"green");
    
    c.drawImage(card6, scaleW * 825,scaleH * 675,scaleW * card2.width/3,scaleH * card2.height/3);
    if (selected==card6) drawRectangle(canvas,scaleW * 825,scaleH * 675,"green");
    
    c.drawImage(submit, scaleW * 955, scaleH * 750, scaleW * submit.width/3, scaleH * submit.height/3);
    c.drawImage(back, scaleW * 25,scaleH * 300,scaleW * card2.width/3,scaleH * card2.height/3);
    if (submitted) c.drawImage(back, scaleW * 275,scaleH * 300,scaleW * card2.width/3,scaleH * card2.height/3); 
}

function writeMessage(canvas, message) {
    var c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'red';
    c.font = '18px Arial';
    c.fillText(message, scaleW * 10, scaleH * 25);
    c.fill();
}
    
function drawRectangle(canvas, x, y,color) {
    var c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
    loadPlayers(canvas);
    loadCards(canvas,submitted);
    
    c.beginPath();
    c.lineWidth="10";
    c.strokeStyle=color;
    c.rect(x, y, scaleW * 363/3, scaleH * 527/3);
    
    c.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
    
function addPoints (player) {}
    
function storyteller (player) {}
    
function leftGame(player) {}
    
function zoom(canvas,x, img) {
    var c = canvas.getContext("2d");
    c.drawImage(img, x - scaleW * 30,scaleH * 590,scaleW * img.width/2,scaleH * img.height/2);
}
    
function handleMoveEvent(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    loadPlayers(canvas);
    loadCards(canvas, submitted,selected);
    if (mousePos.x>=scaleW * 75 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+75) && mousePos.y<scaleH * ((527/3)+675)) {
        loadPlayers(canvas);
        loadCards(canvas,submitted, selected);
    }
    else if (mousePos.x>=scaleW * 225 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+225) && mousePos.y<scaleH * ((527/3)+675)) {
        drawRectangle(canvas,scaleW * 225,scaleH * 675,"green");
        loadPlayers(canvas);
        loadCards(canvas, submitted, selected);
    }
    else if (mousePos.x>=scaleW * 375 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+375) && mousePos.y<scaleH * ((527/3)+675)) {
        drawRectangle(canvas,scaleW * 375,scaleH * 675,"green");
        loadPlayers(canvas);
        loadCards(canvas, submitted, selected);
    }
    else if (mousePos.x>=scaleW * 525 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+525) && mousePos.y<scaleH * ((527/3)+675)) {
        drawRectangle(canvas,scaleW * 525,scaleH * 675,"green");
        loadPlayers(canvas);
        loadCards(canvas, submitted, selected);
    }
    else if (mousePos.x>=scaleW * 675 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+675) && mousePos.y<scaleH * ((527/3)+675)) {
        drawRectangle(canvas,675,675,"green");
        loadPlayers(canvas);
        loadCards(canvas, submitted, selected);
    }
    else if (mousePos.x>=scaleW * 825 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+825) && mousePos.y<scaleH * ((527/3)+675)) {
        drawRectangle(canvas,scaleW * 825,scaleH * 675,"green");
        loadPlayers(canvas);
        loadCards(canvas, submitted, selected);
    }
    else if (mousePos.x>=scaleW * 25 && mousePos.y>=scaleH * 300 && mousePos.x<scaleW * ((363/3)+25) && mousePos.y<scaleH * ((527/3)+300)) {
        drawRectangle(canvas,scaleW * 25,scaleH * 300,"green");
        loadPlayers(canvas);
        loadCards(canvas, submitted, selected);
    }
    else {
        loadPlayers(canvas);
        loadCards(canvas, submitted, selected);
    }
}
    
function handleMoveEvent1 (evt) {
    var mousePos = getMousePos(canvas, evt);
    c.clearRect(0, 0, canvas.width, canvas.height);
    loadPlayers(canvas);
    loadCards(canvas, submitted, selected);
    if (mousePos.x>=scaleW * 75 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+75) && mousePos.y<scaleH * ((527/3)+675)) {
        zoom(canvas,scaleW * 75,card1);
    }
    else if (mousePos.x>=scaleW * 225 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+225) && mousePos.y<scaleH * ((527/3)+675)) {
        zoom(canvas,scaleW * 225,card2);
    }
    else if (mousePos.x>=scaleW * 375 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+375) && mousePos.y<scaleH * ((527/3)+675)) {
        zoom(canvas,scaleW * 375,card3);
    }
    else if (mousePos.x>=scaleW * 525 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+525) && mousePos.y<scaleH * ((527/3)+675)) {
        zoom(canvas,scaleW * 525,card4);
    }
    else if (mousePos.x>=scaleW * 675 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+675) && mousePos.y<scaleH * ((527/3)+675)) {
        zoom(canvas,scaleW * 675,card5);
    }
    else if (mousePos.x>=scaleW * 825 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+825) && mousePos.y<scaleH * ((527/3)+675)) {
        zoom(canvas,scaleW * 825,card6);
    }
    else if (mousePos.x>=scaleW * 25 && mousePos.y>=scaleH * 300 && mousePos.x<scaleW * ((363/3)+25) && mousePos.y<scaleH * ((527/3)+300)) {
        zoom(canvas,25,300);
    }		
}
    
function handleMoveEvent2 (evt) {
    var mousePos = getMousePos(canvas, evt);
    if (mousePos.x>=scaleW * 75 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+75) && mousePos.y<scaleH * ((527/3)+675) ) {
        selected=card1;
        drawRectangle(canvas,scaleW * 75,scaleH * 675,"green");
    }
    else if (mousePos.x>=scaleW * 225 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+225) && mousePos.y<scaleH * ((527/3)+675)) {
        selected=card2;
        drawRectangle(canvas,scaleW * 225,scaleH * 675,"green");
    }
    else if (mousePos.x>=scaleW * 375 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+375) && mousePos.y<scaleH * ((527/3)+675)) {
        selected=card3;
        drawRectangle(canvas,scaleW * 375,scaleH * 675,"green");
    }
    else if (mousePos.x>=scaleW * 525 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+525) && mousePos.y<scaleH * ((527/3)+675)) {
        selected=card4;
        drawRectangle(canvas,scaleW * 525,scaleH * 675,"green");
    }
    else if (mousePos.x>=scaleW * 675 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+675) && mousePos.y<scaleH * ((527/3)+675)) {
        selected=card5;
        drawRectangle(canvas,scaleW * 675,scaleH * 675,"green");
    }
    else if (mousePos.x>=scaleW * 825 && mousePos.y>=scaleH * 675 && mousePos.x<scaleW * ((363/3)+825) && mousePos.y<scaleH * ((527/3)+675)) {
        selected=card6;
        drawRectangle(canvas,scaleW * 825,scaleH * 675,"green");
    }
    if (mousePos.x>=scaleW * 955 && mousePos.y>=scaleH * 750 && mousePos.x<scaleW * ((submit.width/3)+955) && mousePos.y<scaleH * ((submit.height/3)+750) && selected!="") {
        submitted=true;
        selected="";
    }
}