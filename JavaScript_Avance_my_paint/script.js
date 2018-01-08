//remplir les formes, corriger les bug formes, adapter img a la taille du paint 
var figure = null;
var state = null;
var canvas = document.getElementById('paint');
var ctx = canvas.getContext('2d');
var bool;
var full;
var positionX;
var positionY;
var endPositionX;
var endPositionY;
var canvasOffset = $("#paint").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var posX;
var posY;
var couleurs =  document.getElementById("favcolor").value;
var content = document.getElementById('content');
var content_style = getComputedStyle(content);
var sizeW = 300;
var sizeH = 300;

canvas.width = 1000;
canvas.height = 1000;
sizeW = document.getElementById("sizeW").value;
sizeH = document.getElementById("sizeH").value;

var mouse = {x: 0, y: 0};
canvas.addEventListener('mousemove', function(e) {
	mouse.x = e.pageX - offsetX;
	mouse.y = e.pageY - offsetY;
}, false);

/* value default */
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = "black";
document.getElementById("favcolor").onchange=function() {getColor()};

/* Couleurs */
function getColor(){
	ctx.strokeStyle =  document.getElementById("favcolor").value; 
}
var couleurs =  document.getElementById("favcolor").value;
/* Taille */
function getSize(size){
	ctx.lineWidth = size;
}

/*Gomme */
function choice(){
	bool = document.getElementById('bool').value;
	if(bool === "true") {
		ctx.globalCompositeOperation = "destination-out";
	}
	else {

		ctx.globalCompositeOperation="source-over";

	}
}
var funcs = {line:{during:lineDuring, begin:lineBegin, end:lineEnd}, pince:{during:pinceDuring, begin:pinceBegin, end:pinceEnd}, square:{during:squareDuring, begin:squareBegin, end:squareEnd}, circle:{during:circleDuring, begin:circleBegin, end:circleEnd} };

canvas.addEventListener('mousedown', function(e) {
  //BeginPath commence un chemin ou réinitialise le chemin actuel
  positionX = parseInt(e.pageX - offsetX);
  positionY = parseInt(e.pageY - offsetY); 
  funcs[figure].begin();
  canvas.addEventListener('mousemove', funcs[figure].during, false);
}, false);


canvas.addEventListener('mouseup', function(e) {
  endPositionX = (e.pageX - offsetX);
  endPositionY = (e.pageY - offsetY);
  funcs[figure].end();
  canvas.removeEventListener('mousemove', funcs[figure].during, false);
}, false);




/*Remplir les formes */
full = document.getElementById('rempl').value;
console.log(full);
/* Pinceau */
function pinceBegin()
{
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y);
}

function pinceDuring() {

  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
}

function pinceEnd() {
  ctx.closePath();
}


/*ligne */
function lineBegin()
{
}

function lineDuring()
{
}

function lineEnd()
{

  ctx.beginPath();
  ctx.moveTo(positionX, positionY);
  ctx.lineTo(endPositionX, endPositionY);
  ctx.stroke();
  ctx.closePath();
}


/* rectangle */
function squareBegin()
{
  ctx.beginPath();
  posX = positionX;
  posY = positionY;

}

function squareDuring()
{
}

function squareEnd()
{
  ctx.rect(posX, posY,(endPositionX - posX), (endPositionY - posY));
  var couleurs =  document.getElementById("favcolor").value;
  full = document.getElementById('rempl').value;
  if(full === "true"){
    ctx.fillStyle = couleurs;
    ctx.fill();

  }
  else{
   ctx.stroke();

 }
 ctx.closePath(); 
}



/* Cercle */
function circleBegin()
{
  ctx.beginPath();
  posX = positionX;
  posY = positionY;
}

function circleDuring()
{
}

function circleEnd()
{
  var r = Math.sqrt(((endPositionX - positionX)*(endPositionX - positionX))+((endPositionY - positionY)*(endPositionY - positionY)));
  ctx.arc(posX, posY, r, 0, 2 * Math.PI);

  
  couleurs =  document.getElementById("favcolor").value;
  full = document.getElementById('rempl').value;

  if(full === "true"){
    ctx.fillStyle = couleurs;
    ctx.fill();

  }
  else{
   ctx.stroke();

 }
 ctx.closePath(); 
}



var fileN;
var anch = document.querySelector('a');
var link = document.getElementById('a');
anch.addEventListener('click', onClickAnchor);

function onClickAnchor(e){
  fileN = 'img' + Math.floor((Math.random() * 10000) + 1) + '.png';
  link.setAttribute('download', fileN);
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
}

$(function () {
  $(":file").change(function () {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = imageIsLoaded;
      reader.readAsDataURL(this.files[0]);
    }
  });
});

function imageIsLoaded(e) {
  var imgs = new Image();
  imgs.src = e.target.result;
  imgs.onload = function(){
    ctx.drawImage(imgs,150,150,250,250);
  }
};



var sun = new Image();
var moon = new Image();
var earth = new Image();

function init(){
  sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
  moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
  earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
  window.requestAnimationFrame(draw);
}
function draw() {
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0,0,300,300); // effacer le canvas

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.strokeStyle = 'rgba(0,153,255,0.4)';
  ctx.save();
  ctx.translate(150,150);

  // Terre
  var time = new Date();
  ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
  ctx.translate(105,0);
  ctx.fillRect(0,-12,50,24); // Ombre
  ctx.drawImage(earth,-12,-12);

  // Lune
  ctx.save();
  ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
  ctx.translate(0,28.5);
  ctx.drawImage(moon,-3.5,-3.5);
  ctx.restore();

  ctx.restore();
  
  ctx.beginPath();
  ctx.arc(150,150,105,0,Math.PI*2,false); // Orbite terrestre
  ctx.stroke();

  ctx.drawImage(sun,0,0,300,300);

  window.requestAnimationFrame(draw);
}

var timein;
setInterval(function() {
  timein = document.getElementById('timing').value;
  if(timein === "true"){
    init();
  }
}, 300);


$('#figure input').on('change', function() {
  figure = $('input[name=figure]:checked').val(); 
});