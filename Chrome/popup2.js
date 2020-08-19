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
			array2 = array2.concat(logs[key]);
		}
	});
});

chrome.runtime.onMessage.addListener (
	function (request, sender, sendResponse) {		
		if (request.message === "returnScore") {
			array2.push({"date": request.date, "wordCount": request.wordCount, "score": request.score});
			
			const res = Object.values(array2.reduce((acc, {wordCount, score, ...r}) => {
				const key = JSON.stringify(r);
				acc[key] = (acc[key]  || {...r, wordCount: 0, score:0});
				return (acc[key].score += score, acc[key].wordCount += wordCount, acc);
			}, {}));
			
			chrome.storage.sync.set({"toSave": res}, function() { console.log("Saved", res); });
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
