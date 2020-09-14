var today = [];
var full = [];
var temp = [];
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
			if (logs.hasOwnProperty(key) && (logs[key].toString().indexOf(startPatterns[0]) || logs[key].toString().indexOf(startPatterns[1]))) {
				full.push(...logs[key]);
			}
		}
	});
});

// This block listens for a message from content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {		
		if (request.message === "getScore") {
			var url = "http://localhost:8000";
			var body = request.text;
			var count = request.count;

			postToServer(url, JSON.stringify(request))
			.then(data => sendResponse(data)) // JSON-string from `response.json()` call
			.catch(error => console.error(error));
			
			return true; // return true to indicate you wish to send a response asynchronously
		} else if (request.message === "returnScore") {
			today.push({"date": request.date, "wordCount": request.wordCount, "score": request.score});

			var res = Object.values(today.reduce((acc, {wordCount, score, ...r}) => {
				const key = JSON.stringify(r);
				acc[key] = (acc[key]  || {...r, wordCount: 0, score: 0});

				const maths = (acc[key].wordCount / (wordCount + acc[key].wordCount) * acc[key].score) + (wordCount / (wordCount + acc[key].wordCount) * score);

				return (acc[key].wordCount += wordCount, acc[key].score = maths.toFixed(2), acc);
			}, {}));
			
			let redCars = res.filter(redCars => redCars.date != d.toLocaleDateString());
			let notRed = res.find(notRed => notRed.date == d.toLocaleDateString());

			if (redCars.length > 0) {
				temp.push(notRed);

				full.concat(redCars);
				let blueCars = full.filter(blueCars => blueCars.date != d.toLocaleDateString());

				chrome.storage.sync.set({"calendar": blueCars}, function() { console.log("Calendar", blueCars); });
				chrome.storage.sync.set({"toSave": temp}, function() { console.log("Today", temp); });

				temp = [];
			} else {
				chrome.storage.sync.set({"toSave": res}, function() { console.log("Today", res); });
			}
		}
	}
);

function postToServer(url, body) {
	// Default options are marked with *
	return fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, cors, *same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrer: 'no-referrer', // no-referrer, *client
		body: body, // body data type must match "Content-Type" header
	})
	
	.then(response => response.json()); // parses JSON response into native Javascript objects 
}
