var toSave = {};
var calendar = {};
var today = [];
var full = [];
var date = new Date();

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get(["toSave"], function(logs) {
		console.log(logs);
		
		for (var key in logs) {
			today = today.concat(logs[key]);
		}
	});
	
	chrome.storage.sync.get(["calendar"], function(logs) {
		for (var key in logs) {
			full = full.concat(logs[key]);
		}
	});
	
	// let filtered = full.filter(filtered => filtered.date.startsWith(date.getMonth() + 1) || filtered.date.startsWith(date.getMonth()));
	// console.log(filtered);

	addScoreToUI(0, 0);
});

chrome.runtime.onMessage.addListener (
	function (request, sender, sendResponse) {		
		if (request.message === "returnScore") {
			today.push({"date": request.date, "wordCount": request.wordCount, "score": request.score});
			
			const res = Object.values(today.reduce((acc, {wordCount, score, ...r}) => {
				const key = JSON.stringify(r);
				acc[key] = (acc[key]  || {...r, wordCount: 0, score: 0});

				const maths = (acc[key].wordCount / (wordCount + acc[key].wordCount) * acc[key].score) + (wordCount / (wordCount + acc[key].wordCount) * score);
				
				return (acc[key].wordCount += wordCount, acc[key].score = maths.toFixed(2), acc);
			}, {}));

			let redCars = res.filter(redCars => redCars.date != date.toLocaleDateString());
			let notRed = res.find(notRed => notRed.date == date.toLocaleDateString());

			if (redCars.length > 0) {
				today = [];
				today.push(notRed);
				
				full = full.concat(redCars);

				chrome.storage.sync.set({"calendar": full}, function() { console.log("Calendar", full); });
				
				// res.shift();
				chrome.storage.sync.set({"toSave": today}, function() { console.log("Today", today); });
				
				addScoreToUI(2, 2);
			} else {
				chrome.storage.sync.set({"toSave": res}, function() { console.log("Today", res); });
				addScoreToUI(1, 1);
			}
		}		
	}
);

function addScoreToUI(score, wordCount) {
    console.log("Adding to ui");
    var para = document.createElement("p");

    var node = document.createTextNode(score + "_" + wordCount);

    para.appendChild(node);

    var element = document.getElementById("daScore");

    // First remove any existing score before adding new one
    if(element.firstChild) element.removeChild(element.firstChild);
    element.appendChild(para)
    // element.style.display = "block";
}

function wait(ms){
	var start = new Date().getTime();
	var end = start;
	
	while(end < start + ms) {
		end = new Date().getTime();
	}
 }
