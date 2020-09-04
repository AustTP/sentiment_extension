var toSave = {};
var calendar = {};
var today = [];
var temp = [];
var full = [];
var merged = [];
var d = new Date();
var startPatterns = [d.getMonth() + 1, d.getMonth()];
var formatted = "as of " + d.toDateString() + " " + d.toLocaleTimeString();
var color = ["#E3E2E7", "#6772CD"];
var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("modal").classList.add("loading");
	
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
	// full.pop();
	
	console.log(full);
	console.log(today);
	
	setTimeout(function(){
		// this gives an object with dates as keys
		const groups = [...full, ...today].reduce((groups, game) => {
			const data = new Date(game.date);
			const name = data.getMonth() + 1;

			if (!groups[name]) {
				groups[name] = [];
			}
			
			groups[name].push({date: data.getDate(), score: game.score * 100});
			
			return groups;
		}, {});

		// Edit: to add it in the array format instead
		const groupArrays = Object.keys(groups).map((name) => {
			return {
				name,
				values: groups[name]
			};
		});

		console.log(groupArrays);
		
		document.getElementById("modal").classList.remove("loading");
		
		d3js(groupArrays, color);
		addSummaryToUI(formatted, months[d.getMonth()], getMonthName(d.getMonth() - 1));
	}, 500);
});

function addSummaryToUI(summary, month, last) {
    var element = document.getElementById("daSummary");
	element.innerHTML += '<span id="left">' + summary + '</span><span id="right"><span class="month" id="this">' + month + '</span>&nbsp;&nbsp;<span class="month" id="last">' + last + '</span></span>';
}

function getMonthName(monthNumber) {
	monthNumber = monthNumber < 0 ? 11 : monthNumber;
	return months[monthNumber];
}

function d3js(data, color) {
    var width = 550;
	var height = 300;
	var margin = 25;

	var lineOpacity = "1";
	var lineStroke = "2px";

	var circleOpacity = '1';
	var circleRadius = 3;

	data.forEach(function(d) { 
		d.values.forEach(function(d) {
			d.date = +d.date;
			d.score = +d.score;    
		});
	});

	/* Scale */
	var xScale = d3.scaleLinear()
		.domain([1, 31])
		.range([1, width - margin]);

	var yScale = d3.scaleLinear()
		.domain([0, 100])
		.range([height - margin, 0]);

	/* Add SVG */
	var svg = d3.select("#chart").append("svg")
		.attr("width", (width+margin) + "px")
		.attr("height", (height+margin) + "px")
		.append('g')
		.attr("transform", `translate(${margin}, ${margin})`);

	/* Add line into SVG */
	var line = d3.line()
		.x(d => xScale(d.date))
		.y(d => yScale(d.score));

	let lines = svg.append('g')
		.attr('class', 'lines');

	lines.selectAll('.line-group')
		.data(data).enter()
		.append('g')
		.attr('class', 'line-group')  
		
		.append('path')
		.attr('class', 'line')  
		.attr('d', d => line(d.values))
		.style('stroke', (d, i) => color[i])
		.style('opacity', lineOpacity);

	/* Add circles in the line */
	lines.selectAll("circle-group")
		.data(data).enter()
		.append("g")
		.style("fill", (d, i) => color[i])
		.selectAll("circle")
		.data(d => d.values).enter()
		.append("g")
		.attr("class", "circle")  
		
		.append("circle")
		.attr("cx", d => xScale(d.date))
		.attr("cy", d => yScale(d.score))
		.attr("r", circleRadius)
		.style('opacity', circleOpacity);

	/* Add Axis into SVG */
	var xAxis = d3.axisBottom(xScale).ticks(20);
	var yAxis = d3.axisLeft(yScale).ticks(6);

	// Create axes.
	svg.append("g")
		.attr("class", "xaxis")
		.attr("transform", `translate(0, ${height-margin})`)
		.call(xAxis);

	svg.append("g")
		.attr("class", "yaxis")
		.call(yAxis)
	
	d3.selectAll("g.yaxis g") 
        .append("line") 
            .attr("class", "gridline")
            .attr("x1", 0) 
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0);
}
