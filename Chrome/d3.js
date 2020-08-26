var data = [
	{
		name: "USA",
			values: [
				{date: "1", price: "100"},
				{date: "2", price: "10"},
				{date: "3", price: "45"},
				{date: "4", price: "41"},
				{date: "5", price: "60"},
				{date: "6", price: "90"},
				{date: "7", price: "10"},
				{date: "8", price: "35"},
				{date: "9", price: "21"},
				{date: "10", price: "60"},
				{date: "11", price: "100"},
				{date: "12", price: "10"},
				{date: "13", price: "45"},
				{date: "14", price: "41"},
				{date: "15", price: "60"},
				{date: "16", price: "90"},
				{date: "17", price: "10"},
				{date: "18", price: "35"},
				{date: "19", price: "21"},
				{date: "20", price: "100"},
				{date: "21", price: "100"},
				{date: "22", price: "10"},
				{date: "23", price: "45"},
				{date: "24", price: "41"},
				{date: "25", price: "60"},
				{date: "26", price: "90"},
				{date: "27", price: "10"},
				{date: "28", price: "35"},
				{date: "29", price: "21"},
				{date: "30", price: "40"},
				{date: "31", price: "30"}
			]
	},
	{
		name: "Canada",
			values: [
				{date: "1", price: "30"},
				{date: "2", price: "40"},
				{date: "3", price: "75"},
				{date: "4", price: "21"},
				{date: "5", price: "80"},
				{date: "6", price: "60"},
				{date: "7", price: "20"},
				{date: "8", price: "95"}
			]
	}
];

var width = 500;
var height = 300;
var margin = 50;
var duration = 250;

var lineOpacity = "1";
var lineStroke = "2px";

var circleOpacity = '1';
var circleRadius = 3;

/* Format Data */
// var parseDate = d3.timeParse("%Y");

data.forEach(function(d) { 
	d.values.forEach(function(d) {
		d.date = +d.date;
		d.price = +d.price;    
	});
});

/* Scale */
var xScale = d3.scaleLinear()
	.domain([1, 31])
	.range([1, width - margin]);

var yScale = d3.scaleLinear()
	.domain([0, d3.max(data[0].values, d => d.price)])
	.range([height - margin, 0]);

var color = ["#E3E2E7", "#6772CD"];

/* Add SVG */
var svg = d3.select("#chart").append("svg")
	.attr("width", (width+margin) + "px")
	.attr("height", (height+margin) + "px")
	.append('g')
	.attr("transform", `translate(${margin}, ${margin})`);

/* Add line into SVG */
var line = d3.line()
	.x(d => xScale(d.date))
	.y(d => yScale(d.price));

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
	.attr("cy", d => yScale(d.price))
	.attr("r", circleRadius)
	.style('opacity', circleOpacity);

/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale).ticks(20);
// var yAxis = d3.axisLeft(yScale).ticks(5);

svg.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${height-margin})`)
	.call(xAxis);

// svg.append("g")
	// .attr("class", "y axis")
	// .call(yAxis)
	// .append('text')
	// .attr("y", 15)
	// .attr("transform", "rotate(-90)")
	// .attr("fill", "#000");
