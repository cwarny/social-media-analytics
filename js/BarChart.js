function BarChart() {
	function chart(selection) {
		selection.each(function (data) {
			var w = width-margin.left-margin.right;
            var h = height-margin.top-margin.bottom;
            var barPadding = 1;
			
			// Create the svg variable that we will act upon
			var svg = d3.select(this)
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			// Draw the bars
			svg.selectAll("rect")
				.data(data)
				.enter()
				.append("rect")
				.attr({ // You can bundle multiple attributes into an object {property1:value1,property2:value2,...}; then pass that object into attr()
					"x": function(d,i) { return i * (w/data.length); }, // Tying the x value to the width of the SVG, so our visualization scales with no problem
					"y": function(d) { return h - d * 4; }, // In SVG, y axis goes from top to bottom
					"width": w / data.length - barPadding,
					"height": function(d) { return d * 4; },
					"fill": function(d) { return "rgb(0,0," + (d * 10) + ")";} 
				}); // The *4 is just to scale things up a little bit

			// Add data labels
			svg.selectAll("text")
				.data(data)
				.enter()
				.append("text")
				.text(function(d) {return d;})
				.attr({
					"x": function(d,i) { return i * (w/data.length) + (w/data.length - barPadding) / 2; }, // Sets the x position of the text at the middle of the bar
					"y": function(d) { return h - d * 4 + 14; },
					"font-family":"sans-serif",
					"font-size":"11px",
					"fill":"white",
					"text-anchor":"middle" // This is to ensure the label text is centered at the x position
				});
		});
	}

	chart.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
    };

    chart.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return chart;
    };

    chart.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return chart;
    };

	return chart;
}