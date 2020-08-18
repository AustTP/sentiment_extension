// This block listens for a message from content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {		
		if(request.message === "getScore") {
			var url = "http://localhost:8000";
			var body = request.text;
			var count = request.count;

			postToServer(url, JSON.stringify(request))
			.then(data => sendResponse(data)) // JSON-string from `response.json()` call
			.catch(error => console.error(error));
			
			return true; // return true to indicate you wish to send a response asynchronously
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