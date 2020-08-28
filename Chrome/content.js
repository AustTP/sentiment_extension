var charCount = 0;
var date = new Date();
var time = date.getTime();
var data = {};
var temp = [];
var shouldSave = false;
var lastLog = time;
data[time] = "";

document.addEventListener("keydown", function (e) {
	e = e || window.event;
	
	if(e.target.type != 'password') {
		var charCode = e.keyCode;

		if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8) {
			log(String.fromCharCode(charCode));
			
			if (charCode == 8 && charCount > 0) {
				charCount -= 1;
			} else {
				charCount += 1;
			}
		} else {
			save();
		}	
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
		if (charCount >= 3) {
			chrome.runtime.sendMessage({"message": "getScore", "text": data[time].replace("undefined", ""), "charCount": charCount}, function(response) {
				var score = JSON.stringify(response["Summary"]);
				var parse = JSON.parse(score);
				
				if (parse["score"] != 0.5) {
					chrome.runtime.sendMessage({"message": "returnScore", "date": date.toLocaleDateString(), "wordCount": parse["wordCount"], "score": parse["score"]});
					
					if (parse["score"] < 0.5) {
						temp.push({"time": Math.round(date.getTime() / 1000), "score": parse["score"]});
					}
				}
			});
		}

		charCount = 0;
		data = {};
		shouldSave = false;
	}
}

setInterval(function() {
	var time = Math.round(date.getTime() / 1000);
	
	temp = temp.filter(function(item) {
		return time < item.time + 600;
	}); 
	
	if (temp.length >= 3) {
		alert("Cool yor jets!");
	}
}, 30000);
