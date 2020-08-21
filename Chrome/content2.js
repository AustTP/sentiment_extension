var charCount = 0;
var date = new Date();
var time = date.getTime();
var data = {};
var shouldSave = false;
var lastLog = time;
data[time] = "";

document.addEventListener("keydown", function (e) {
	e = e || window.event;
	
	if(e.target.type != 'password') {
		var charCode = e.keyCode;

		if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 46 || charCode == 32) {
			log(String.fromCharCode(charCode));
		} else if (charCode == 8) {
			log("[BKSP]");
		}
		
		charCount += 1;
	}
});

function log(input) {
	var now = new Date().getTime();
	
	// Remove duplicate keys
	// if (now - lastLog < 10) return; 
	
	data[time] += input;
	shouldSave = true;
	lastLog = now;
}

function save() {
	if (shouldSave) {
		if (charCount > 0) {
			chrome.runtime.sendMessage({"message": "getScore", "text": data[time].replace("undefined", ""), "charCount": charCount}, function(response) {
				var score = JSON.stringify(response["Summary"]);
				var parse = JSON.parse(score);
				
				chrome.runtime.sendMessage({"message": "returnScore", "date": date.toLocaleDateString(), "wordCount": parse["wordCount"], "score": parse["score"]});
			});
		}
		
		charCount = 0;
		data = {};
		shouldSave = false;
	}
}

// Save data on window close
window.onbeforeunload = function() {
	save();
}

setInterval(function() {
	save();
}, 10000);
// }, 900000);
