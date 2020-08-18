chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {   
		if (request.message === "returnScore") {
			// document.getElementById("modal").classList.remove("loading");
			var score = request.score;
			var wordCount = request.wordCount;
			
			addScoreToUI(score, wordCount);
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