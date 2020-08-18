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

		if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 46 || charCode == 32) {
			log(String.fromCharCode(charCode));
			charCount += 1;
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
		if (charCount > 0) {
			var pull = read("today");
			pull = JSON.parse(pull);
			
			chrome.runtime.sendMessage({"message": "getScore", "text": data[time].replace("undefined", ""), "charCount": charCount, "wordCount": pull['wordCount'], "score": pull['score']}, function(response) {
				var score = JSON.stringify(response["Summary"]);
				var parse = JSON.parse(score);
				
				var object = {'date': date.toLocaleDateString(), 'score': parse["score"], 'wordCount': parse["wordCount"]};
				update('today', JSON.stringify(object));
				
				chrome.runtime.sendMessage({"message":"returnScore", "wordCount": parse["wordCount"], "score": parse["score"]});
			});
		}
		
		charCount = 0;
		data = {};
		shouldSave = false;
	}
}

function autoDelete() {
	// remove();
}

// Save data on window close
window.onbeforeunload = function() {
	save();
}

setInterval(function() {
	save();
}, 10000);
// }, 600000);

setInterval(function() {
	if (localStorage.getItem('austin') === null) {
		var bookmarks = [];
	} else {
		var bookmarks = JSON.parse(localStorage.getItem('austin'));
	}

	bookmarks.push(read('today'));
	
	update('austin', JSON.stringify(bookmarks));
	
	var notnow = JSON.parse(localStorage.getItem('austin'));
	console.log(notnow);

	var test = JSON.parse(notnow[0]);
	console.log(test["score"]);
}, 20000);

setInterval(function() {
	
}, 86400000);

function update(key, value) {
	return localStorage.setItem(key, value);
}

function read(key) {
	if (localStorage.getItem(key) === null) {
		return [];
	} else {
		return localStorage.getItem(key);
	}
}

function remove(key) {
	localStorage.removeItem(key);
}