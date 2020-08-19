var time = new Date().getTime();
var count = 0;
var score = 0;
var toSave = {};
var toBe = {};
var array2 = [];
var date = new Date();

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get(["toSave"], function(logs) {
		for (var key in logs) {
			// var splits = logs[key].split("_");
			
			count += parseInt(logs["wordCount"]);
			score += parseInt(logs["score"]);
			
			// console.log(key + "_" + logs[key]);
			
			// let car = logs[key].find(car => car.date === date.toLocaleDateString());
			// console.log(car);
			// for (var i = 0; i < logs[key].length; i++) { 
				// if (logs[key][i]["date"] === date.toLocaleDateString()) { 
					// array2.push(logs[key][i]);
					// i--; 
				// }
			// }
				
			// if (logs != null) {
				array2.push(logs[key]);
			// }
		}
	});
});

chrome.runtime.onMessage.addListener (
	function (request, sender, sendResponse) {		
		if (request.message === "returnScore") {
			// toSave[time] = {"date": request.date, "wordCount": request.wordCount, "score": request.score};
			array2.push({"date": request.date, "wordCount": request.wordCount, "score": request.score});
			
			chrome.storage.sync.set({"toSave": array2}, function() { console.log("Saved", array2); });
			
			// chrome.storage.sync.get(function(logs) {
				// var toDelete = [];
				
				// for (var key in logs) {
					// // if (key < endDate || isNaN(key) || key < 10000) { // Restrict by time and remove invalid chars 
						// toDelete.push(key);
					// // }
				// }
				// chrome.storage.sync.remove(toDelete, function() {
					// console.log(toDelete.length + " entries deleted");
				// });
			// });
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