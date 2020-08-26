var toSave = {};
var calendar = {};
var today = [];
var temp = [];
var full = [];
var d = new Date();
var startPatterns = [d.getMonth() + 1, d.getMonth()];

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get(["toSave"], function(logs) {
		for (var key in logs) {
			today.push(...logs[key]);
		}
	});
	
	chrome.storage.sync.get(["calendar"], function(logs) {
		for (var key in logs) {
			full.push(...logs[key]);
		}
	});
});

window.addEventListener("load", function(event) {
	full = full.filter(name => (startPatterns.some(pattern => name.date.startsWith(pattern))));
	// full.pop();
	
	console.log(today);
	console.log(full);
	
	addScoreToUI(0, 0);
});

chrome.runtime.onMessage.addListener (
	function (request, sender, sendResponse) {
		if (request.message === "returnScore") {
			today.push({"date": request.date, "wordCount": request.wordCount, "score": request.score});

			today = Object.values(today.reduce((acc, {wordCount, score, ...r}) => {
				const key = JSON.stringify(r);
				acc[key] = (acc[key]  || {...r, wordCount: 0, score: 0});

				const maths = (acc[key].wordCount / (wordCount + acc[key].wordCount) * acc[key].score) + (wordCount / (wordCount + acc[key].wordCount) * score);
				
				return (acc[key].wordCount += wordCount, acc[key].score = maths.toFixed(2), acc);
			}, {}));

			let redCars = today.filter(redCars => redCars.date != d.toLocaleDateString());
			let notRed = today.find(notRed => notRed.date == d.toLocaleDateString());

			if (redCars.length > 0) {
				temp.push(notRed);

				full = full.concat(redCars);

				chrome.storage.sync.set({"calendar": full}, function() { console.log("Calendar", full); });
				chrome.storage.sync.set({"toSave": temp}, function() { console.log("Today", temp); });
			} else {
				chrome.storage.sync.set({"calendar": full}, function() { console.log("Calendar", full); });
				chrome.storage.sync.set({"toSave": today}, function() { console.log("Today", today); });
			}
		}
	}
);

function addScoreToUI(score, wordCount) {
    var para = document.createElement("p");

    var node = document.createTextNode(score + "_" + wordCount);

    para.appendChild(node);

    var element = document.getElementById("daScore");

    if(element.firstChild) element.removeChild(element.firstChild);
    element.appendChild(para)
}

function wait(ms){
	var start = new Date().getTime();
	var end = start;
	
	while(end < start + ms) {
		end = new Date().getTime();
	}
 }
