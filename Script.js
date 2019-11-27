
var modeHardcore = false;
var modeFacile = false;

var states = {
	RESET: 0,
	SHOWING: 1,
	USERTURN: 2,
	LOST: 3,
	WON: 4
};
var state = states.RESET;
var colorOn = false;
var colors = [".rouge", ".jaune", ".vert", ".bleu"];
var curCol = 0;

var orderColors = [];
var orderMax = 1;
var orderCurrent = 0;

var showInterval;

var audioR = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
var audioG = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
var audioY = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
var audioB = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
var audios= [audioR,audioG,audioY,audioB];

$(document).ready(function() {
	console.log("readys");
	
	
});
$(".start").click(function() {
	if (state == states.RESET) {
		console.log("pas de probleme");
		state = states.SHOWING;
		$(".output-text").html("Okay. regarde bien !");
		showInterval = window.setInterval(showing, 1000);
		$(".start").html("RESET");
    updateRounds(1);
	} else {
		$(".start").html("START");
		state=states.RESET;
		colorOn=false;
		curCol=0;
		orderColors=[];
		orderMax=1;
		orderCurrent=0;
		window.clearInterval(showInterval);
		$(".output-text").html("");
		$(".col-b").each(function() {
			$(this).removeClass("active");
		});
    updateRounds(0);
	}
});

function showing() {
	if (state!= states.SHOWING) return;
	if (colorOn) {
		colorOn=false;
		$(colors[curCol]).removeClass("active");
		if (orderCurrent == orderMax) {
			orderCurrent=0;
			state = states.USERTURN;
			clearInterval(showInterval);
			$(".output-text").html("A toi maintenant");
		}
	} else {
		if (orderColors[orderCurrent] == undefined) {
		
			curCol = Math.floor(Math.random() *4);
			//console.log("picked "+colors[curCol]);
			
			orderColors.push(colors[curCol]);
		} else {
			
			var colName = orderColors[orderCurrent];
			curCol = colors.indexOf(colName);
			//console.log("remembered "+colors[curCol]);
		}
		$(colors[curCol]).addClass("active");
    audios[curCol].play();
		colorOn = true;
		orderCurrent++;
		
		
	}
}

$(".col-b").click(function() {
	//console.log("clicked butt");
	if (state != states.USERTURN) return;
	
	
	var correct = orderColors[orderCurrent].slice(1);
	if ($(this).hasClass(correct)) {
		
		var positives = ["Bravo", "Il en reste encore", "Bon choix", "Bien"]
		var randPos = positives[Math.floor(Math.random()*positives.length)];
		orderCurrent++;
		if (orderCurrent >= 10) {
			window.clearInterval(showInterval);
			removeActives();
			$(".output-text").html("Tu as fait dix round félicitations");
			state = states.WON;
			showInterval = window.setInterval(winInterval,100);
		} else if (orderCurrent == orderMax) {
			orderMax++;
			if (modeFacile) {
				orderColors=[];
				
			}
			orderCurrent=0;
      updateRounds(orderMax);
			
			window.clearInterval(showInterval);
			removeActives();
			showInterval = window.setInterval(removeActives, 3050);
			$(".output-text").html("Prépare toi pour le round "+orderMax);
			state = states.SHOWING;
		} else {
			
			window.clearInterval(showInterval);
			removeActives();
			showInterval = window.setInterval(removeActives, 750);
			
			$(".output-text").html(randPos);
		}
		
	} else {
		window.clearInterval(showInterval);
		if (modeHardcore) {
			$(".output-text").html("FAUX ! Tu as perdu !");
			state = states.LOST;
		} else {
			if (modeFacile) {
				orderColors=[];
				
			}
			orderCurrent=0;
			removeActives();
			showInterval = window.setInterval(removeActives, 3050);
			$(".output-text").html("C'est faux, aller réessaye");
			state = states.SHOWING;
		}
	}
	
	$(this).addClass("active");
  
  for (var i=0; i<4; i++) {
    if ($(this).hasClass(colors[i].slice(1))) {
          if (audios[i].currentTime > 0) {
            audios[i].pause();
            audios[i].currentTime = 0;
          }
          audios[i].play();
    }
  }
  
	
});

function removeActives() {
	$(".col-b").each(function() {
		$(this).removeClass("active");
	});
	$(".output-text").html("");
	window.clearInterval(showInterval);
	if (state == states.SHOWING) {
		showInterval = window.setInterval(showing, 500);
		$(".output-text").html("Aller regarde bien");
	}
}

function winInterval() {
	$(".col-b").each(function() {
		$(this).removeClass("active");
	});
	curCol++;
	if (curCol >= colors.length) curCol = 0;
	$(colors[curCol]).addClass("active");
  for (var i=0; i<audios.length; i++) {
    audios[i].pause();
    audios[i].currentTime = 0;
  }
  audios[curCol].play();
}