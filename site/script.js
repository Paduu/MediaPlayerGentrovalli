var connection;
var cache = "";

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
			} else {
				cache = cache + message;
			}
		}
	};

	connection.onclose = function(e) {
		sendString("198");
	};

	connection.onerror = function(e) {
		alert("Error: " + e.data);
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

function readAllLinks() {
	$(".ilink, .songCol, .zeileZwei, .folder").click(function() {
		code = $(this).attr("data-value");
		sendString(code);
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