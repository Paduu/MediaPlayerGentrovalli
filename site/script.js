var connection;
var cache = "";
var touchBox;

function connect() {
	connection = new WebSocket('ws://{0}:{1}');

	// Log messages from the server
	connection.onmessage = function(e) {
		var splitted = e.data.split("|", 2);
		var typ = splitted[0];
		var message = splitted[1];

		if (typ == "197") {
			alert("Message: " + message);
		} else if (typ == "101") {
			if (message == "++end++") {
				document.getElementById('all').innerHTML = cache;
				cache = "";
				readAllLinks();
				showSwipeBox();
			} else {
				cache = cache + message;
			}
		}
	};

	connection.onclose = function(e) {
		sendString("198");
	};

	connection.onerror = function(e) {
		//alert("Error: " + e.data);
		document.getElementById("error").innerHTML = "# " + e.data;
	};
	console.log("connected to: " + "{0}:{1}");
}

function sendString(string) {
	connection.send(string);
}

function saveSettings() {
	musicPath = document.getElementById('musicPath').value;
	videoPath = document.getElementById('videoPath').value;
	
	sendString("150" + musicPath + ";" + videoPath);
}

function screenKeyUp(){
	var key = document.getElementById('screenkey').value;
	sendString("407;" + key);
	document.getElementById('screenkey').value = "";
}

function readAllLinks() {
	$(".ilink, .songCol, .zeileZwei, .folder").click(function() {
		code = $(this).attr("data-value");
		sendString(code);
	});
	$("#search").submit(function( event ) {
		text = document.getElementById("stext").value;
		//alert(text);
		sendString("209;" + text);
		event.preventDefault();
	});
	/*$("tr").click(function() {
		code = $(this).attr("data-value");
		if(code != null){
			sendString(code);
		}
	});
	$("td").click(function() {
		code = $(this).attr("data-value");
		if(code != null){
			sendString(code);
		}
	});*/
}

function showSwipeBox(){
	//document.getElementById("box1").className = "box";
	touchBox = document.getElementById('touchBox');
	addEvents();
}

function addEvents(){
 
    //var box1 = document.getElementById('box1'); 
    var afterX = 0;
	var afterY = 0;
	var hasMoved = false;
 
    touchBox.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)		
		afterX = parseInt(touchobj.clientX);
		afterY = parseInt(touchobj.clientY);
		hasMoved = false;
        e.preventDefault()
    }, false)
 
    touchBox.addEventListener('touchmove', function(e){
        var touchobj = e.changedTouches[0] // reference first touch point for this event
		var nowX = parseInt(touchobj.clientX);
		var nowY = parseInt(touchobj.clientY);
		
		var hasMinX = false;
		if(nowX > afterX){
			var dif = nowX - afterX;
			if(dif > 10){
				hasMinX = true;
			}
		} else {
			var dif = afterX - nowX;
			if(dif > 10){
				hasMinX = true;
			}
		}
		
		var hasMinY = false;
		if(nowY > afterY){
			var dif = nowY - afterY;
			if(dif > 10){
				hasMinY = true;
			}
		} else {
			var dif = afterY - nowY;
			if(dif > 10){
				hasMinY = true;
			}
		}

		if(hasMinX){
			if(nowX > afterX){
				//statusdiv.innerHTML = 'right: ' + nowX + ':' + afterX
				sendString("405");
			} else {
				//statusdiv.innerHTML = 'left: ' + nowX + ':' + afterX 
				sendString("406");
			}
			afterX = nowX;
			hasMoved = true;
		}
			
		if(hasMinY){
			if(nowY > afterY){
				//statusdivH.innerHTML = 'down: ' + nowY + ':' + afterY
				sendString("404");
			} else {
				//statusdivH.innerHTML = 'up: ' + nowY + ':' + afterY
				sendString("403");
			}
			afterY = nowY;
			hasMoved = true;
		}

        e.preventDefault()
    }, false)
 
    touchBox.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0] // reference first touch point for this event
		if(!hasMoved){
			sendString("402");
		}
        e.preventDefault()
    }, false)
 
};